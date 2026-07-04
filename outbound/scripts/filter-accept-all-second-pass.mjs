import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_OUTPUT_DIR = "outbound/data/validation/borderline-second-pass";

const FREE_DOMAINS = new Set([
  "gmail.com",
  "hotmail.com",
  "hotmail.com.ar",
  "hotmail.es",
  "live.com",
  "live.com.ar",
  "outlook.com",
  "outlook.com.ar",
  "yahoo.com",
  "yahoo.com.ar",
  "yahoo.es",
  "ymail.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "msn.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "mail.com",
  "t-online.de",
  "cs.com",
  "netscape.net",
]);

const DIRECT_TYPES = new Set(["nominal_public", "role_based_commercial"]);
const CONTACT_TYPE_SCORES = {
  nominal_public: 20,
  role_based_commercial: 18,
  generic_routing: 10,
  admin_ops: 5,
};

function parseArgs(argv) {
  const args = {
    input: "",
    outputDir: DEFAULT_OUTPUT_DIR,
    tag: new Date().toISOString().slice(0, 10),
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--input") args.input = argv[++index];
    else if (arg === "--outputDir") args.outputDir = argv[++index];
    else if (arg === "--tag") args.tag = argv[++index];
  }
  if (!args.input) throw new Error("--input is required");
  return args;
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) return [];
  const headers = parseCsvLine(lines.shift()).map((item) => item.trim());
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows, columns) {
  return [columns.join(","), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))].join("\n");
}

function sql(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  if (typeof value === "number") return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}

function toBool(value) {
  const text = String(value ?? "").trim().toLowerCase();
  return ["1", "true", "yes"].includes(text);
}

function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeTier(value) {
  return String(value ?? "").trim().toUpperCase() || "unknown";
}

function normalizeText(value, fallback = "unknown") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function isFreeDomain(row) {
  const domain = normalizeText(row.email_domain || row.domain, "").toLowerCase();
  if (!domain) return false;
  if (toBool(row.is_free_domain)) return true;
  return FREE_DOMAINS.has(domain);
}

function isNonTargetInbox(row) {
  if (toBool(row.is_non_target_inbox)) return true;
  const email = normalizeText(row.email, "").toLowerCase();
  const localPart = email.includes("@") ? email.split("@")[0] : email;
  return /^(privacy|abuse|noreply|no-reply|webmaster|soporte|support)([+._-].*)?$/i.test(localPart);
}

function isCorporateAligned(row) {
  if (toBool(row.is_corporate_domain_aligned)) return true;
  const emailDomain = normalizeText(row.email_domain, "").toLowerCase();
  const accountDomain = normalizeText(row.account_domain, "").toLowerCase();
  if (!emailDomain || !accountDomain || FREE_DOMAINS.has(emailDomain)) return false;
  return emailDomain === accountDomain
    || emailDomain.endsWith(`.${accountDomain}`)
    || accountDomain.endsWith(`.${emailDomain}`);
}

function isWeakVerticalFit(row) {
  if (toBool(row.weak_vertical_fit)) return true;
  const vertical = normalizeText(row.vertical, "").toLowerCase();
  if (!vertical) return false;
  return !/(cosmet|perfum|skincare|cabell|limpieza|higiene|maquill|unas)/i.test(vertical);
}

function buildReason(decisionDriver, flags) {
  const detail = flags.filter(Boolean).join("+");
  return detail ? `${decisionDriver}:${detail}` : decisionDriver;
}

function evaluateRow(row) {
  const original = normalizeText(row.verification_status_original || row.verification_status, "unknown");
  const priorityTier = normalizeTier(row.priority_tier);
  const contactType = normalizeText(row.contact_type);
  const sourceConfidence = toInt(row.source_confidence, 0);
  const accountContactRank = toInt(row.account_contact_rank, 9999);
  const accountValidSendCount = toInt(row.account_valid_send_count, 0);
  const freeDomain = isFreeDomain(row);
  const nonTargetInbox = isNonTargetInbox(row);
  const corporateAligned = isCorporateAligned(row);
  const weakVerticalFit = isWeakVerticalFit(row);
  const hasOtherValidSend = toBool(row.has_other_valid_send_in_account) || accountValidSendCount > 0;
  const hasBetterValidSend = toBool(row.has_better_valid_send_in_account);

  let score = 0;
  const scoringFlags = [];

  if (original === "accept_all_review") {
    score += 5;
    scoringFlags.push("accept_all");
  } else if (original === "risky_review") {
    score -= 10;
    scoringFlags.push("risky");
  }

  if (priorityTier === "A") {
    score += 35;
    scoringFlags.push("tier_a");
  } else if (priorityTier === "B") {
    score += 20;
    scoringFlags.push("tier_b");
  } else if (priorityTier === "C") {
    score -= 15;
    scoringFlags.push("tier_c");
  }

  score += CONTACT_TYPE_SCORES[contactType] || 0;
  if (CONTACT_TYPE_SCORES[contactType]) {
    scoringFlags.push(`contact_${contactType}`);
  }

  if (sourceConfidence >= 80) {
    score += 15;
    scoringFlags.push("source_80_plus");
  }
  if (accountContactRank === 1) {
    score += 10;
    scoringFlags.push("rank_1");
  }
  if (!hasOtherValidSend) {
    score += 10;
    scoringFlags.push("no_other_valid_send");
  }
  if (freeDomain) {
    score -= 25;
    scoringFlags.push("free_domain");
  }
  if (nonTargetInbox) {
    score -= 20;
    scoringFlags.push("non_target_inbox");
  }
  if (sourceConfidence < 60) {
    score -= 20;
    scoringFlags.push("low_source_confidence");
  }
  if (hasBetterValidSend) {
    score -= 15;
    scoringFlags.push("better_valid_send_exists");
  }

  const riskyGenericGuard = original === "risky_review"
    && contactType === "generic_routing"
    && (priorityTier !== "A" || hasOtherValidSend || hasBetterValidSend);

  const hardRejectFlags = [];
  if (freeDomain) hardRejectFlags.push("free_domain");
  if (nonTargetInbox) hardRejectFlags.push("non_target_inbox");
  if (sourceConfidence < 60) hardRejectFlags.push("low_source_confidence");
  if (priorityTier === "C") hardRejectFlags.push("tier_c");
  if (weakVerticalFit) hardRejectFlags.push("weak_vertical_fit");
  if (hasBetterValidSend) hardRejectFlags.push("better_valid_send_exists");
  if (riskyGenericGuard) hardRejectFlags.push("risky_generic_non_tier_a");

  const hardApprove = priorityTier === "A"
    && DIRECT_TYPES.has(contactType)
    && sourceConfidence >= 75
    && corporateAligned
    && !hasBetterValidSend;

  const threshold = original === "accept_all_review" ? 70 : 80;

  let decision = "borderline_discarded";
  let finalSendEligibility = "no";
  let operationalVerificationStatus = "invalid_discard";
  let reason = "";

  if (hardRejectFlags.length > 0) {
    reason = buildReason("hard_reject", hardRejectFlags);
  } else if (hardApprove) {
    decision = "borderline_promoted";
    finalSendEligibility = "yes";
    operationalVerificationStatus = "valid_send";
    reason = buildReason("hard_approve", [
      "tier_a",
      contactType,
      "corporate_domain_aligned",
      "no_better_valid_send",
    ]);
  } else if (score >= threshold) {
    decision = "borderline_promoted";
    finalSendEligibility = "yes";
    operationalVerificationStatus = "valid_send";
    reason = buildReason("score_promote", [`score_${score}`, `threshold_${threshold}`]);
  } else {
    reason = buildReason("score_discard", [`score_${score}`, `threshold_${threshold}`]);
  }

  return {
    ...row,
    verification_status_original: original,
    second_filter_score: score,
    second_filter_decision: decision,
    second_filter_reason: reason,
    final_send_eligibility: finalSendEligibility,
    final_operational_verification_status: operationalVerificationStatus,
    is_free_domain: freeDomain ? "1" : "0",
    is_non_target_inbox: nonTargetInbox ? "1" : "0",
    is_corporate_domain_aligned: corporateAligned ? "1" : "0",
    weak_vertical_fit: weakVerticalFit ? "1" : "0",
    has_other_valid_send_in_account: hasOtherValidSend ? "1" : "0",
    has_better_valid_send_in_account: hasBetterValidSend ? "1" : "0",
    second_filter_threshold: threshold,
    second_filter_flags: scoringFlags.join("|"),
  };
}

function buildSql(rows, filteredAt) {
  return `${rows.map((row) => {
    const auditNote = `second_filter=${row.second_filter_decision}|from=${row.verification_status_original}|score=${row.second_filter_score}|reason=${row.second_filter_reason}`;
    return `UPDATE outbound_prospect_contacts
SET second_filter_original_status = ${sql(row.verification_status_original)},
    second_filter_status = ${sql(row.second_filter_decision)},
    second_filter_score = ${Number(row.second_filter_score) || 0},
    second_filter_reason = ${sql(row.second_filter_reason)},
    second_filter_at = ${sql(filteredAt)},
    verification_status = ${sql(row.final_operational_verification_status)},
    notes = CASE
      WHEN COALESCE(notes, '') = '' THEN ${sql(auditNote)}
      WHEN notes LIKE '%second_filter=%' THEN notes
      ELSE notes || ' | ' || ${sql(auditNote)}
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE contact_id = ${sql(row.contact_id)}
  AND verification_status = ${sql(row.verification_status_original)};`;
  }).join("\n")}\n`;
}

function groupCountBy(rows, field, extraField = "") {
  const counts = new Map();
  for (const row of rows) {
    const value = normalizeText(row[field], "unknown");
    const decision = extraField ? normalizeText(row[extraField], "unknown") : "";
    const key = `${value}|||${decision}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].map(([key, count]) => {
    const [value, decision] = key.split("|||");
    return {
      value,
      decision,
      count,
    };
  }).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rows = parseCsv(await readFile(args.input, "utf8"))
    .filter((row) => ["accept_all_review", "risky_review"].includes(normalizeText(row.verification_status_original || row.verification_status, "")));

  if (!rows.length) {
    throw new Error("No borderline rows found in input");
  }

  const filteredAt = new Date().toISOString();
  const evaluated = rows.map(evaluateRow);
  const outputRows = evaluated.map((row) => ({
    contact_id: row.contact_id,
    cohort_id: row.cohort_id,
    account_id: row.account_id,
    company_name: row.company_name,
    email: row.email,
    contact_type: row.contact_type,
    priority_tier: row.priority_tier,
    source_confidence: row.source_confidence,
    vertical: row.vertical,
    country: row.country,
    verification_provider: row.verification_provider,
    verification_status_original: row.verification_status_original,
    second_filter_score: row.second_filter_score,
    second_filter_threshold: row.second_filter_threshold,
    second_filter_decision: row.second_filter_decision,
    second_filter_reason: row.second_filter_reason,
    second_filter_flags: row.second_filter_flags,
    final_send_eligibility: row.final_send_eligibility,
    final_operational_verification_status: row.final_operational_verification_status,
    is_free_domain: row.is_free_domain,
    is_non_target_inbox: row.is_non_target_inbox,
    is_corporate_domain_aligned: row.is_corporate_domain_aligned,
    weak_vertical_fit: row.weak_vertical_fit,
    has_other_valid_send_in_account: row.has_other_valid_send_in_account,
    has_better_valid_send_in_account: row.has_better_valid_send_in_account,
    account_valid_send_count: row.account_valid_send_count,
  }));

  const breakdownRows = [
    ...groupCountBy(outputRows, "verification_status_original", "second_filter_decision").map((row) => ({ dimension: "verification_status_original", ...row })),
    ...groupCountBy(outputRows, "cohort_id", "second_filter_decision").map((row) => ({ dimension: "cohort_id", ...row })),
    ...groupCountBy(outputRows, "priority_tier", "second_filter_decision").map((row) => ({ dimension: "priority_tier", ...row })),
    ...groupCountBy(outputRows, "contact_type", "second_filter_decision").map((row) => ({ dimension: "contact_type", ...row })),
    ...groupCountBy(outputRows, "vertical", "second_filter_decision").map((row) => ({ dimension: "vertical", ...row })),
    ...groupCountBy(outputRows, "country", "second_filter_decision").map((row) => ({ dimension: "country", ...row })),
  ];

  const summary = {
    input_count: outputRows.length,
    filtered_at: filteredAt,
    initial_split: Object.fromEntries(groupCountBy(outputRows, "verification_status_original").map((row) => [row.value, row.count])),
    decisions: Object.fromEntries(groupCountBy(outputRows, "second_filter_decision").map((row) => [row.value, row.count])),
    promoted_from_accept_all_review: outputRows.filter((row) => row.verification_status_original === "accept_all_review" && row.second_filter_decision === "borderline_promoted").length,
    promoted_from_risky_review: outputRows.filter((row) => row.verification_status_original === "risky_review" && row.second_filter_decision === "borderline_promoted").length,
    discarded_from_accept_all_review: outputRows.filter((row) => row.verification_status_original === "accept_all_review" && row.second_filter_decision === "borderline_discarded").length,
    discarded_from_risky_review: outputRows.filter((row) => row.verification_status_original === "risky_review" && row.second_filter_decision === "borderline_discarded").length,
  };

  await mkdir(args.outputDir, { recursive: true });
  await writeFile(path.join(args.outputDir, `results-${args.tag}.csv`), `${toCsv(outputRows, [
    "contact_id",
    "cohort_id",
    "account_id",
    "company_name",
    "email",
    "contact_type",
    "priority_tier",
    "source_confidence",
    "vertical",
    "country",
    "verification_provider",
    "verification_status_original",
    "second_filter_score",
    "second_filter_threshold",
    "second_filter_decision",
    "second_filter_reason",
    "second_filter_flags",
    "final_send_eligibility",
    "final_operational_verification_status",
    "is_free_domain",
    "is_non_target_inbox",
    "is_corporate_domain_aligned",
    "weak_vertical_fit",
    "has_other_valid_send_in_account",
    "has_better_valid_send_in_account",
    "account_valid_send_count",
  ])}\n`);
  await writeFile(path.join(args.outputDir, `breakdown-${args.tag}.csv`), `${toCsv(breakdownRows, [
    "dimension",
    "value",
    "decision",
    "count",
  ])}\n`);
  await writeFile(path.join(args.outputDir, `summary-${args.tag}.json`), `${JSON.stringify(summary, null, 2)}\n`);
  await writeFile(path.join(args.outputDir, `d1-apply-second-filter-${args.tag}.sql`), buildSql(outputRows, filteredAt));

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
