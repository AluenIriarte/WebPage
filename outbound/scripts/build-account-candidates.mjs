import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_COHORT = "icp_cosmetica_expansion_2026_04";
const DEFAULT_INPUT = `outbound/data/account-sourcing/${DEFAULT_COHORT}/account_candidates.tsv`;
const DEFAULT_OUTPUT_DIR = `outbound/data/account-sourcing/${DEFAULT_COHORT}`;

const ACCOUNT_TSV_COLUMNS = [
  "account_id",
  "company_name",
  "domain",
  "vertical",
  "geo",
  "size_hint",
  "icp_fit_score",
  "priority_tier",
  "status",
];

const REPORT_COLUMNS = [
  ...ACCOUNT_TSV_COLUMNS,
  "website",
  "source_url",
  "source_type",
  "source_confidence",
  "score_notes",
  "notes",
];

const DIRECT_SOURCE_TYPES = new Set([
  "company_site",
  "company_contact",
  "company_mayorista",
]);

const DIRECTORY_SOURCE_TYPES = new Set([
  "directory",
  "marketplace",
  "search_result",
  "brand_distributor_list",
]);

const STRONG_VERTICAL_KEYWORDS = [
  "distribuidora",
  "distribuidor",
  "distribucion",
  "mayorista",
  "perfumeria",
  "cosmetica",
  "belleza",
  "cuidado personal",
  "higiene",
  "limpieza",
  "farmacia",
];

const PROFESSIONAL_KEYWORDS = [
  "peluqueria",
  "capilar",
  "estetica",
  "skincare",
  "maquillaje",
  "fragancia",
  "perfumes",
  "pestanas",
  "nails",
];

const B2B_KEYWORDS = [
  "mayorista",
  "distribuidor",
  "distribuidora",
  "revendedores",
  "comercios",
  "farmacias",
  "perfumerias",
  "catalogo",
  "venta por mayor",
  "compra minima",
  "b2b",
];

const SCALE_KEYWORDS = [
  "sucursales",
  "localidades",
  "todo el pais",
  "envios a todo",
  "marcas",
  "catalogo",
  "importadora",
  "red de distribuidores",
  "ecommerce",
  "tienda online",
  "clientes mayoristas",
];

const RETAIL_ONLY_KEYWORDS = [
  "turnos",
  "salon",
  "spa",
  "peluqueria unisex",
  "servicio de belleza",
  "manicuria",
];

function parseArgs(argv) {
  const args = {
    cohortId: DEFAULT_COHORT,
    input: DEFAULT_INPUT,
    outputDir: DEFAULT_OUTPUT_DIR,
    minScore: 60,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--cohort" || arg === "--cohortId") args.cohortId = argv[++index];
    else if (arg === "--input") args.input = argv[++index];
    else if (arg === "--outputDir") args.outputDir = argv[++index];
    else if (arg === "--minScore") args.minScore = Number(argv[++index]) || args.minScore;
  }
  return args;
}

function parseDelimited(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) return [];
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = parseLine(lines.shift(), delimiter).map((item) => item.trim());
  return lines.map((line) => {
    const values = parseLine(line, delimiter);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function parseLine(line, delimiter) {
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
    if (char === delimiter && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values.map((item) => item.trim());
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function normalizeDomain(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "";
  const withProtocol = /^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch {
    return raw
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .split("?")[0]
      .trim();
  }
}

function websiteFrom(row, domain) {
  const website = String(row.website || row.source_url || "").trim();
  if (/^https?:\/\//i.test(website) && normalizeDomain(website) === domain) return website;
  return domain ? `https://${domain}` : "";
}

function slug(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/&/g, " y ")
    .replace(/\b(srl|s\.r\.l|sa|s\.a|sas|distribuidora|distribucion|mayorista|perfumeria)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function stableId(companyName, domain) {
  const base = slug(companyName) || slug(domain);
  if (base) return base;
  return createHash("sha1").update(`${companyName}:${domain}`).digest("hex").slice(0, 12);
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function sourceConfidence(row, domain) {
  const sourceType = String(row.source_type || "").toLowerCase();
  const sourceDomain = normalizeDomain(row.source_url || "");
  if (DIRECT_SOURCE_TYPES.has(sourceType)) return 95;
  if (sourceDomain && sourceDomain === domain) return 90;
  if (DIRECTORY_SOURCE_TYPES.has(sourceType)) return 72;
  if (sourceType) return 60;
  return 55;
}

function inferSize(row, evidence) {
  const explicit = normalizeText(row.size_hint || "").toLowerCase();
  if (["grande", "mediana", "pyme", "micro"].includes(explicit)) return explicit;
  if (/(\+?50|mas de 50|150 localidades|todo el pais|nacional|red de distribuidores|sucursales)/.test(evidence)) {
    return "mediana";
  }
  if (/(familia|emprendimiento|local|showroom)/.test(evidence)) return "pyme";
  return "pyme";
}

function scoreCandidate(row, domain) {
  const vertical = normalizeText(row.vertical || row.vertical_raw || row.industry || row.rubro || "").toLowerCase();
  const evidence = normalizeText([
    row.company_name,
    vertical,
    row.evidence,
    row.notes,
    row.segments,
    row.signals,
    row.source_title,
  ].join(" ")).toLowerCase();

  let score = 25;
  const notes = [];

  if (includesAny(evidence, STRONG_VERTICAL_KEYWORDS)) {
    score += 24;
    notes.push("vertical core beauty/perfumeria/distribucion");
  }
  if (includesAny(evidence, PROFESSIONAL_KEYWORDS)) {
    score += 5;
    notes.push("segmento belleza profesional");
  }
  if (includesAny(evidence, B2B_KEYWORDS)) {
    score += 16;
    notes.push("senal B2B/mayorista");
  }
  if (includesAny(evidence, SCALE_KEYWORDS)) {
    score += 8;
    notes.push("senal de escala/catalogo/distribucion");
  }

  const confidence = sourceConfidence(row, domain);
  if (confidence >= 90) {
    score += 7;
    notes.push("fuente propia");
  } else if (confidence >= 70) {
    score += 3;
    notes.push("fuente directorio/search");
  }

  const size = inferSize(row, evidence);
  if (size === "grande") score += 8;
  else if (size === "mediana") score += 6;
  else if (size === "pyme") score += 4;
  else if (size === "micro") score += 1;

  if (!domain) {
    score -= 20;
    notes.push("sin dominio");
  }
  if (includesAny(evidence, RETAIL_ONLY_KEYWORDS) && !includesAny(evidence, B2B_KEYWORDS)) {
    score -= 18;
    notes.push("posible retail/servicio no distribuidor");
  }
  if (/argentina|buenos aires|caba|cordoba|santa fe|mendoza|tucuman|entre rios|misiones|rio negro|la plata|rosario|parana/.test(evidence)) {
    score += 3;
    notes.push("geo argentina");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    confidence,
    size,
    notes: [...new Set(notes)].join("; "),
  };
}

function priorityTier(score) {
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 65) return "C";
  return "D";
}

function accountStatus(score, minScore) {
  if (score >= minScore) return "candidate";
  return "review";
}

function sql(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function toTsv(rows, columns) {
  const escape = (value) => String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
  return [columns.join("\t"), ...rows.map((row) => columns.map((column) => escape(row[column])).join("\t"))].join("\n");
}

function buildAccountSql(row, cohortId) {
  return `INSERT INTO outbound_accounts (
  account_id, cohort_id, company_name, domain, website, vertical, geo, size_hint,
  icp_fit_score, priority_tier, status, source, notes, updated_at
) VALUES (
  ${sql(row.account_id)}, ${sql(cohortId)}, ${sql(row.company_name)}, ${sql(row.domain)},
  ${sql(row.website)}, ${sql(row.vertical)}, ${sql(row.geo)}, ${sql(row.size_hint)},
  ${Number(row.icp_fit_score) || 0}, ${sql(row.priority_tier)}, ${sql(row.status)},
  ${sql(row.source || "account_sourcing")}, ${sql(row.notes)}, CURRENT_TIMESTAMP
) ON CONFLICT(account_id) DO UPDATE SET
  cohort_id = excluded.cohort_id,
  company_name = excluded.company_name,
  domain = excluded.domain,
  website = excluded.website,
  vertical = excluded.vertical,
  geo = excluded.geo,
  size_hint = excluded.size_hint,
  icp_fit_score = excluded.icp_fit_score,
  priority_tier = excluded.priority_tier,
  status = excluded.status,
  source = excluded.source,
  notes = excluded.notes,
  updated_at = CURRENT_TIMESTAMP;`;
}

function buildSql(rows, cohortId) {
  const cohortName = cohortId.replace(/_/g, " ");
  return [
    `INSERT OR REPLACE INTO outbound_cohorts (cohort_id, name, description, source, status, updated_at) VALUES (${sql(cohortId)}, ${sql(cohortName)}, 'ICP account sourcing cohort', 'account_sourcing', 'active', CURRENT_TIMESTAMP);`,
    ...rows.map((row) => buildAccountSql(row, cohortId)),
  ].join("\n");
}

function consolidate(rows, minScore) {
  const byKey = new Map();
  for (const raw of rows) {
    const companyName = normalizeText(raw.company_name || raw.name || raw.empresa);
    const domain = normalizeDomain(raw.domain || raw.website || raw.source_domain);
    if (!companyName && !domain) continue;

    const website = websiteFrom(raw, domain);
    const score = scoreCandidate(raw, domain);
    const account = {
      account_id: raw.account_id || stableId(companyName, domain),
      company_name: companyName || domain,
      domain,
      website,
      vertical: normalizeText(raw.vertical || raw.vertical_raw || raw.industry || raw.rubro || "distribucion mayorista belleza / perfumeria / cosmetica"),
      geo: normalizeText(raw.geo || raw.location || raw.ubicacion || "Argentina"),
      size_hint: score.size,
      icp_fit_score: score.score,
      priority_tier: priorityTier(score.score),
      status: accountStatus(score.score, minScore),
      source: normalizeText(raw.source || "account_sourcing"),
      source_url: String(raw.source_url || "").trim(),
      source_type: normalizeText(raw.source_type || ""),
      source_confidence: score.confidence,
      score_notes: score.notes,
      notes: normalizeText(raw.notes || raw.evidence || raw.signals || ""),
    };

    const key = account.domain || slug(account.company_name);
    const current = byKey.get(key);
    if (!current || account.icp_fit_score > current.icp_fit_score || account.source_confidence > current.source_confidence) {
      byKey.set(key, account);
    }
  }
  return [...byKey.values()].sort((a, b) => b.icp_fit_score - a.icp_fit_score || a.company_name.localeCompare(b.company_name));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = await readFile(args.input, "utf8");
  const rawRows = parseDelimited(input);
  const accounts = consolidate(rawRows, args.minScore);
  await mkdir(args.outputDir, { recursive: true });

  const accountsTsvPath = path.join("outbound", "data", "accounts", `${args.cohortId}.tsv`);
  await mkdir(path.dirname(accountsTsvPath), { recursive: true });
  await writeFile(accountsTsvPath, `${toTsv(accounts, ACCOUNT_TSV_COLUMNS)}\n`);

  await writeFile(path.join(args.outputDir, "account_candidates_scored.csv"), `${toTsv(accounts, REPORT_COLUMNS)}\n`);
  await writeFile(path.join(args.outputDir, "d1-upsert-accounts.sql"), `${buildSql(accounts, args.cohortId)}\n`);
  await writeFile(path.join(args.outputDir, "account_sourcing_report.json"), `${JSON.stringify({
    cohort_id: args.cohortId,
    input: args.input,
    output_accounts_tsv: accountsTsvPath,
    total_input_rows: rawRows.length,
    total_accounts: accounts.length,
    by_status: accounts.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {}),
    by_tier: accounts.reduce((acc, row) => {
      acc[row.priority_tier] = (acc[row.priority_tier] || 0) + 1;
      return acc;
    }, {}),
  }, null, 2)}\n`);

  console.log(`Scored ${accounts.length} accounts from ${rawRows.length} rows.`);
  console.log(`Accounts TSV: ${accountsTsvPath}`);
  console.log(`SQL: ${path.join(args.outputDir, "d1-upsert-accounts.sql")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
