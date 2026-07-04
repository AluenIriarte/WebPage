import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://api.quickemailverification.com/v1";
const DEFAULT_OUTPUT_DIR = "outbound/data/validation/quickemailverification";
const DEFAULT_DAILY_LIMIT = 100;

function parseArgs(argv) {
  const args = {
    input: "",
    outputDir: DEFAULT_OUTPUT_DIR,
    tag: new Date().toISOString().slice(0, 10),
    target: "prospect_contacts",
    limit: DEFAULT_DAILY_LIMIT,
    mode: "production",
    delayMs: 250,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--input") args.input = argv[++index];
    else if (arg === "--outputDir") args.outputDir = argv[++index];
    else if (arg === "--tag") args.tag = argv[++index];
    else if (arg === "--target") args.target = argv[++index] || args.target;
    else if (arg === "--limit") args.limit = Number(argv[++index]) || args.limit;
    else if (arg === "--mode") args.mode = argv[++index] || args.mode;
    else if (arg === "--delayMs") args.delayMs = Number(argv[++index]) || args.delayMs;
  }
  if (!args.input) throw new Error("--input is required");
  if (!["prospects", "prospect_contacts"].includes(args.target)) {
    throw new Error("--target must be prospects or prospect_contacts");
  }
  if (!["production", "sandbox"].includes(args.mode)) {
    throw new Error("--mode must be production or sandbox");
  }
  args.limit = Math.max(1, Math.min(args.limit, DEFAULT_DAILY_LIMIT));
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

function hashId(...parts) {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 24);
}

function sql(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  if (typeof value === "number") return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function endpointForMode(mode) {
  return mode === "sandbox" ? "/verify/sandbox" : "/verify";
}

async function quickEmailVerify(apiKey, email, mode) {
  const url = new URL(`${API_BASE}${endpointForMode(mode)}`);
  url.searchParams.set("email", email);
  url.searchParams.set("apikey", apiKey);
  const response = await fetch(url);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`QuickEmailVerification verify failed ${response.status}: ${JSON.stringify(body)}`);
  }
  if (String(body.success) === "false") {
    throw new Error(`QuickEmailVerification verify returned error: ${JSON.stringify(body)}`);
  }
  return body;
}

function classify(result) {
  const resultValue = String(result.result || "").toLowerCase();
  const safeToSend = result.safe_to_send === true || result.safe_to_send === "true";
  const acceptAll = result.accept_all === true || result.accept_all === "true";
  const disposable = result.disposable === true || result.disposable === "true";
  const role = result.role === true || result.role === "true";

  if (disposable) return "invalid_discard";
  if (safeToSend) return "valid_send";
  if (resultValue === "invalid") return "invalid_discard";
  if (acceptAll) return "accept_all_review";
  if (role) return "risky_review";
  if (resultValue === "valid") return "risky_review";
  if (resultValue === "unknown") return "unknown_review";
  return "unknown_review";
}

function qualityScore(result) {
  if (result.safe_to_send === true || result.safe_to_send === "true") return 100;
  if (String(result.result || "").toLowerCase() === "valid") return 70;
  if (String(result.result || "").toLowerCase() === "unknown") return 25;
  return 0;
}

function flags(result) {
  const items = [
    `result=${result.result || ""}`,
    `reason=${result.reason || ""}`,
    `safe_to_send=${result.safe_to_send ?? ""}`,
    `accept_all=${result.accept_all ?? ""}`,
    `role=${result.role ?? ""}`,
    `free=${result.free ?? ""}`,
    `disposable=${result.disposable ?? ""}`,
    `did_you_mean=${result.did_you_mean || ""}`,
    `mx_record=${result.mx_record || ""}`,
  ];
  return items.join("|");
}

function buildProspectsSql(row, verifiedAt) {
  return `UPDATE outbound_prospects
SET verification_status = ${sql(row.policy_status)},
    verification_provider = 'quickemailverification',
    deliverability_score = ${Number(row.quality_score) || 0},
    validation_flags = ${sql(row.validation_flags)},
    last_verified_at = ${sql(verifiedAt)},
    updated_at = CURRENT_TIMESTAMP
WHERE id = ${sql(row.prospect_id)};`;
}

function buildProspectContactsSql(row, verifiedAt) {
  const verificationNote = `quickemailverification=${row.policy_status}|${row.validation_flags}`;
  return `UPDATE outbound_prospect_contacts
SET verification_status = ${sql(row.policy_status)},
    verification_provider = 'quickemailverification',
    deliverability_score = ${Number(row.quality_score) || 0},
    last_verified_at = ${sql(verifiedAt)},
    notes = CASE
      WHEN COALESCE(notes, '') = '' THEN ${sql(verificationNote)}
      WHEN notes LIKE '%quickemailverification=%' THEN notes
      ELSE notes || ' | ' || ${sql(verificationNote)}
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE contact_id = ${sql(row.contact_id)};`;
}

function buildSql(rows, verifiedAt, target) {
  const lines = [];
  for (const row of rows) {
    const raw = JSON.stringify(row.raw);
    const entityId = row.prospect_id || row.contact_id || row.email;
    const verificationId = `quickemailverification:${hashId(entityId, verifiedAt)}`;
    lines.push(`INSERT OR REPLACE INTO outbound_email_verifications (
  verification_id, email_id, email, provider, status, quality_score, is_accept_all,
  is_role_based, is_disposable, is_toxic, reason, verified_at, raw_response_json
) VALUES (
  ${sql(verificationId)}, ${sql(entityId)}, ${sql(row.email)}, 'quickemailverification',
  ${sql(row.qev_result)}, ${Number(row.quality_score) || 0}, ${row.accept_all === "true" ? 1 : 0},
  ${row.role === "true" ? 1 : 0}, ${row.disposable === "true" ? 1 : 0}, 0,
  ${sql(row.reason)}, ${sql(verifiedAt)}, ${sql(raw)}
);`);
    lines.push(target === "prospect_contacts"
      ? buildProspectContactsSql(row, verifiedAt)
      : buildProspectsSql(row, verifiedAt));
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env.QUICKEMAILVERIFICATION_API_KEY;
  if (!apiKey) throw new Error("QUICKEMAILVERIFICATION_API_KEY env var is required");

  const inputRows = parseCsv(await readFile(args.input, "utf8"));
  const byEmail = new Map();
  for (const row of inputRows) {
    const email = String(row.email || "").trim().toLowerCase();
    if (email && !byEmail.has(email)) byEmail.set(email, row);
  }

  const emails = [...byEmail.keys()].slice(0, args.limit);
  if (!emails.length) throw new Error("No emails found in input");

  await mkdir(args.outputDir, { recursive: true });
  const verifiedAt = new Date().toISOString();
  const resultRows = [];

  for (const [index, email] of emails.entries()) {
    const input = byEmail.get(email) || {};
    const result = await quickEmailVerify(apiKey, email, args.mode);
    const policy = classify(result);
    resultRows.push({
      contact_id: input.contact_id || input.source_contact_id || "",
      prospect_id: input.prospect_id || input.id || "",
      cohort_id: input.cohort_id || "",
      account_id: input.account_id || "",
      company_name: input.company_name || "",
      email,
      qev_result: result.result || "",
      quality_score: qualityScore(result),
      reason: result.reason || "",
      safe_to_send: String(Boolean(result.safe_to_send)),
      accept_all: String(Boolean(result.accept_all)),
      role: String(Boolean(result.role)),
      free: String(Boolean(result.free)),
      disposable: String(Boolean(result.disposable)),
      did_you_mean: result.did_you_mean || "",
      mx_record: result.mx_record || "",
      policy_status: policy,
      send_eligible: policy === "valid_send" ? "yes" : "no",
      validation_flags: flags(result),
      raw: result,
    });
    console.log(`[quickemailverification] ${index + 1}/${emails.length} ${email} => ${policy}`);
    if (index < emails.length - 1) {
      await sleep(args.delayMs);
    }
  }

  const columns = [
    "contact_id",
    "prospect_id",
    "cohort_id",
    "account_id",
    "company_name",
    "email",
    "qev_result",
    "quality_score",
    "reason",
    "safe_to_send",
    "accept_all",
    "role",
    "free",
    "disposable",
    "did_you_mean",
    "mx_record",
    "policy_status",
    "send_eligible",
    "validation_flags",
  ];

  await writeFile(path.join(args.outputDir, `results-${args.tag}.csv`), `${toCsv(resultRows, columns)}\n`);
  await writeFile(path.join(args.outputDir, `d1-upsert-validation-${args.tag}.sql`), buildSql(resultRows, verifiedAt, args.target));

  const summary = {
    mode: args.mode,
    input_count: inputRows.length,
    unique_emails: byEmail.size,
    processed_emails: emails.length,
    verified_at: verifiedAt,
    by_policy_status: resultRows.reduce((acc, row) => {
      acc[row.policy_status] = (acc[row.policy_status] || 0) + 1;
      return acc;
    }, {}),
    by_result: resultRows.reduce((acc, row) => {
      acc[row.qev_result] = (acc[row.qev_result] || 0) + 1;
      return acc;
    }, {}),
  };
  await writeFile(path.join(args.outputDir, `summary-${args.tag}.json`), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
