import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://api.emailable.com/v1";
const DEFAULT_OUTPUT_DIR = "outbound/data/validation/emailable";

function parseArgs(argv) {
  const args = {
    input: "",
    outputDir: DEFAULT_OUTPUT_DIR,
    tag: new Date().toISOString().slice(0, 10),
    pollSeconds: 10,
    maxPolls: 90,
    target: "prospects",
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--input") args.input = argv[++index];
    else if (arg === "--outputDir") args.outputDir = argv[++index];
    else if (arg === "--tag") args.tag = argv[++index];
    else if (arg === "--pollSeconds") args.pollSeconds = Number(argv[++index]) || args.pollSeconds;
    else if (arg === "--maxPolls") args.maxPolls = Number(argv[++index]) || args.maxPolls;
    else if (arg === "--target") args.target = argv[++index] || args.target;
  }
  if (!args.input) throw new Error("--input is required");
  if (!["prospects", "prospect_contacts"].includes(args.target)) {
    throw new Error("--target must be prospects or prospect_contacts");
  }
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

async function emailableGet(pathname, apiKey, params = {}) {
  const url = new URL(`${API_BASE}${pathname}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Emailable ${pathname} failed ${response.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function createBatch(apiKey, emails) {
  const response = await fetch(`${API_BASE}/batch`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emails: emails.join(","),
      response_fields: [
        "accept_all",
        "did_you_mean",
        "disposable",
        "domain",
        "email",
        "free",
        "mailbox_full",
        "mx_record",
        "no_reply",
        "reason",
        "role",
        "score",
        "smtp_provider",
        "state",
        "user",
      ].join(","),
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Emailable batch create failed ${response.status}: ${JSON.stringify(body)}`);
  }
  if (!body.id) throw new Error(`Emailable batch create missing id: ${JSON.stringify(body)}`);
  return body;
}

async function waitForBatch(apiKey, batchId, options) {
  let last = null;
  for (let poll = 0; poll < options.maxPolls; poll += 1) {
    const status = await emailableGet("/batch", apiKey, { id: batchId, partial: true });
    last = status;
    const counts = status.total_counts || {};
    const processed = Number(counts.processed ?? status.processed ?? 0);
    const total = Number(counts.total ?? status.total ?? 0);
    console.log(`[emailable] poll=${poll + 1} processed=${processed}/${total} message="${status.message || ""}"`);
    if (status.emails && total > 0 && processed >= total) return status;
    if (/completed/i.test(status.message || "") && status.emails) return status;
    await sleep(options.pollSeconds * 1000);
  }
  throw new Error(`Emailable batch did not complete. Last status: ${JSON.stringify(last)}`);
}

function classify(result) {
  const score = Number(result.score ?? 0);
  if (result.disposable || result.no_reply || result.mailbox_full) return "invalid_discard";
  if (result.state === "undeliverable") return "invalid_discard";
  if (result.state === "deliverable" && result.accept_all) return "accept_all_review";
  if (result.state === "deliverable" && score >= 70) return "valid_send";
  if (result.state === "deliverable") return "risky_review";
  if (result.state === "risky") return result.accept_all ? "accept_all_review" : "risky_review";
  if (result.state === "unknown") return "unknown_review";
  return "unknown_review";
}

function flags(result) {
  const items = [
    `state=${result.state || ""}`,
    `reason=${result.reason || ""}`,
    `score=${result.score ?? ""}`,
    `accept_all=${result.accept_all ?? ""}`,
    `role=${result.role ?? ""}`,
    `free=${result.free ?? ""}`,
    `disposable=${result.disposable ?? ""}`,
    `no_reply=${result.no_reply ?? ""}`,
    `mailbox_full=${result.mailbox_full ?? ""}`,
    `smtp_provider=${result.smtp_provider || ""}`,
  ];
  return items.join("|");
}

function buildProspectsSql(row, verifiedAt) {
  return `UPDATE outbound_prospects
SET verification_status = ${sql(row.policy_status)},
    verification_provider = 'emailable',
    deliverability_score = ${Number(row.emailable_score) || 0},
    validation_flags = ${sql(row.validation_flags)},
    last_verified_at = ${sql(verifiedAt)},
    updated_at = CURRENT_TIMESTAMP
WHERE id = ${sql(row.prospect_id)};`;
}

function buildProspectContactsSql(row, verifiedAt) {
  const verificationNote = `emailable=${row.policy_status}|${row.validation_flags}`;
  return `UPDATE outbound_prospect_contacts
SET verification_status = ${sql(row.policy_status)},
    verification_provider = 'emailable',
    deliverability_score = ${Number(row.emailable_score) || 0},
    last_verified_at = ${sql(verifiedAt)},
    notes = CASE
      WHEN COALESCE(notes, '') = '' THEN ${sql(verificationNote)}
      WHEN notes LIKE '%emailable=%' THEN notes
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
    const verificationId = `emailable:${hashId(entityId, verifiedAt)}`;
    lines.push(`INSERT OR REPLACE INTO outbound_email_verifications (
  verification_id, email_id, email, provider, status, quality_score, is_accept_all,
  is_role_based, is_disposable, is_toxic, reason, verified_at, raw_response_json
) VALUES (
  ${sql(verificationId)}, ${sql(entityId)}, ${sql(row.email)}, 'emailable',
  ${sql(row.emailable_state)}, ${Number(row.emailable_score) || 0}, ${row.accept_all === "true" ? 1 : 0},
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
  const apiKey = process.env.EMAILABLE_API_KEY;
  if (!apiKey) throw new Error("EMAILABLE_API_KEY env var is required");

  const inputRows = parseCsv(await readFile(args.input, "utf8"));
  const byEmail = new Map();
  for (const row of inputRows) {
    const email = String(row.email || "").trim().toLowerCase();
    if (email && !byEmail.has(email)) byEmail.set(email, row);
  }
  const emails = [...byEmail.keys()];
  if (!emails.length) throw new Error("No emails found in input");

  await mkdir(args.outputDir, { recursive: true });
  const account = await emailableGet("/account", apiKey);
  await writeFile(path.join(args.outputDir, `account-${args.tag}.json`), `${JSON.stringify({
    owner_email: account.owner_email,
    available_credits: account.available_credits,
    checked_at: new Date().toISOString(),
  }, null, 2)}\n`);

  if (Number(account.available_credits) < emails.length) {
    throw new Error(`Insufficient Emailable credits. Need ${emails.length}, available ${account.available_credits}`);
  }

  console.log(`[emailable] credits=${account.available_credits} emails=${emails.length}`);
  const batch = await createBatch(apiKey, emails);
  await writeFile(path.join(args.outputDir, `batch-create-${args.tag}.json`), `${JSON.stringify(batch, null, 2)}\n`);
  console.log(`[emailable] batch=${batch.id}`);
  const status = await waitForBatch(apiKey, batch.id, args);
  await writeFile(path.join(args.outputDir, `batch-result-${args.tag}.json`), `${JSON.stringify(status, null, 2)}\n`);

  const verifiedAt = new Date().toISOString();
  const resultRows = (status.emails || []).map((result) => {
    const email = String(result.email || "").toLowerCase();
    const input = byEmail.get(email) || {};
    const policy = classify(result);
    return {
      contact_id: input.contact_id || input.source_contact_id || "",
      prospect_id: input.prospect_id || input.id || "",
      cohort_id: input.cohort_id || "",
      account_id: input.account_id || "",
      company_name: input.company_name || "",
      email,
      emailable_state: result.state || "",
      emailable_score: result.score ?? "",
      reason: result.reason || "",
      accept_all: String(Boolean(result.accept_all)),
      role: String(Boolean(result.role)),
      free: String(Boolean(result.free)),
      disposable: String(Boolean(result.disposable)),
      no_reply: String(Boolean(result.no_reply)),
      mailbox_full: String(Boolean(result.mailbox_full)),
      smtp_provider: result.smtp_provider || "",
      did_you_mean: result.did_you_mean || "",
      policy_status: policy,
      send_eligible: policy === "valid_send" ? "yes" : "no",
      validation_flags: flags(result),
      raw: result,
    };
  });

  const columns = [
    "contact_id",
    "prospect_id",
    "cohort_id",
    "account_id",
    "company_name",
    "email",
    "emailable_state",
    "emailable_score",
    "reason",
    "accept_all",
    "role",
    "free",
    "disposable",
    "no_reply",
    "mailbox_full",
    "smtp_provider",
    "did_you_mean",
    "policy_status",
    "send_eligible",
    "validation_flags",
  ];
  await writeFile(path.join(args.outputDir, `results-${args.tag}.csv`), `${toCsv(resultRows, columns)}\n`);
  await writeFile(path.join(args.outputDir, `d1-upsert-validation-${args.tag}.sql`), buildSql(resultRows, verifiedAt, args.target));

  const summary = {
    input_count: inputRows.length,
    unique_emails: emails.length,
    batch_id: batch.id,
    verified_at: verifiedAt,
    total_counts: status.total_counts || {},
    reason_counts: status.reason_counts || {},
    by_policy_status: resultRows.reduce((acc, row) => {
      acc[row.policy_status] = (acc[row.policy_status] || 0) + 1;
      return acc;
    }, {}),
    by_state: resultRows.reduce((acc, row) => {
      acc[row.emailable_state] = (acc[row.emailable_state] || 0) + 1;
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
