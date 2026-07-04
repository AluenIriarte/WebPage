import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_COHORT = "icp_cosmetica_stock_500_2026_04";
const DEFAULT_OUTPUT_DIR = `outbound/data/account-sourcing/${DEFAULT_COHORT}`;
const BASE_URL = "https://laguiademayoristas.com.ar";
const REQUEST_DELAY_MS = 250;
const REQUEST_TIMEOUT_MS = 10000;

const TARGET_KEYWORDS = [
  "cosmetica",
  "cosmética",
  "perfumeria",
  "perfumería",
  "belleza",
  "maquillaje",
  "facial",
  "manicuria",
  "pestañas",
  "pestanas",
  "cuidado del cabello",
  "capilar",
  "peluqueria",
  "peluquería",
  "barberia",
  "barbería",
  "estetica",
  "estética",
  "limpieza",
  "higiene",
  "pañalera",
  "panalera",
  "farmacia",
  "aromas",
  "aromatizantes",
  "sahumerios",
  "esencias",
];

const STRONG_TARGET_KEYWORDS = [
  "cosmetica",
  "cosmética",
  "perfumeria",
  "perfumería",
  "maquillaje",
  "cuidado del cabello",
  "capilar",
  "peluqueria",
  "peluquería",
  "estetica",
  "estética",
];

const COMMERCIAL_LOCALS = [
  "ventas",
  "venta",
  "comercial",
  "mayorista",
  "mayoristas",
  "pedidos",
  "clientes",
  "atencion",
  "contacto",
];

const GENERIC_LOCALS = [
  "info",
  "contacto",
  "consulta",
  "consultas",
  "hola",
  "mail",
];

const ADMIN_LOCALS = [
  "administracion",
  "admin",
  "compras",
  "facturacion",
  "cobranzas",
  "rrhh",
];

const NON_TARGET_LOCALS = [
  "privacy",
  "privacidad",
  "abuse",
  "webmaster",
  "postmaster",
  "noreply",
  "no-reply",
  "soporte",
  "support",
];

const FREEMAIL_DOMAINS = new Set([
  "gmail.com",
  "hotmail.com",
  "hotmail.com.ar",
  "outlook.com",
  "yahoo.com",
  "yahoo.com.ar",
  "live.com",
]);

function parseArgs(argv) {
  const args = {
    cohortId: DEFAULT_COHORT,
    outputDir: DEFAULT_OUTPUT_DIR,
    maxPages: 80,
    maxDetails: 600,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--cohort" || arg === "--cohortId") args.cohortId = argv[++index];
    else if (arg === "--outputDir") args.outputDir = argv[++index];
    else if (arg === "--maxPages") args.maxPages = Number(argv[++index]) || args.maxPages;
    else if (arg === "--maxDetails") args.maxDetails = Number(argv[++index]) || args.maxDetails;
  }
  return args;
}

function hashId(...parts) {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "AlanLPerez-OutboundOps/1.0 public-directory-sourcing",
        Accept: "text/html,text/plain;q=0.9,*/*;q=0.2",
      },
    });
    if (!response.ok) return "";
    const contentType = response.headers.get("content-type") || "";
    if (!/text|html/i.test(contentType)) return "";
    return await response.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&#64;/g, "@")
    .replace(/&commat;/g, "@")
    .replace(/&#46;/g, ".")
    .replace(/&period;/g, ".")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(html) {
  return decodeHtml(
    String(html || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function normalizeText(value) {
  return decodeHtml(value)
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
    const host = new URL(withProtocol).hostname.replace(/^www\./, "");
    if (["instagram.com", "facebook.com", "wa.link", "whatsapp.com", "linktr.ee", "beacons.ai"].includes(host)) {
      return "";
    }
    return host;
  } catch {
    return "";
  }
}

function slug(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/&/g, " y ")
    .replace(/\b(srl|s\.r\.l|sa|s\.a|sas|mayorista|distribuidora|distribucion|perfumeria)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function sql(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function toDelimited(rows, columns, delimiter) {
  const escape = delimiter === "," ? csvEscape : tsvEscape;
  return [columns.join(delimiter), ...rows.map((row) => columns.map((column) => escape(row[column])).join(delimiter))].join("\n");
}

function extractEmails(html) {
  const text = decodeHtml(html).replace(/\s+/g, " ");
  return [...new Set(
    [...text.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)]
      .map((match) => match[0].toLowerCase().replace(/[),.;:\]}]+$/g, ""))
      .filter((email) => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))
      .filter((email) => !email.includes("example.") && !email.includes("email.com")),
  )];
}

function extractTitle(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return normalizeText(stripHtml(h1[1]));
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return title ? normalizeText(stripHtml(title[1]).split("|")[0]) : "";
}

function extractField(text, label) {
  const pattern = new RegExp(`${label}:\\s*([^#]+?)(?=\\s{2,}|Actividad:|Rubros:|Provincia:|Ciudad:|$)`, "i");
  const match = text.match(pattern);
  return match ? normalizeText(match[1]).replace(/^-$/, "") : "";
}

function externalWebsite(html) {
  const mainHtml = String(html || "").split(/MAYORISTAS SIMILARES/i)[0];
  const anchors = [...mainHtml.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({
      href: decodeHtml(match[1]),
      text: normalizeText(stripHtml(match[2])).toLowerCase(),
    }));
  const candidates = anchors.filter((anchor) =>
    /ir a la web|pagina web|página web/i.test(anchor.text)
    && /^https?:\/\//i.test(anchor.href)
    && !anchor.href.includes("laguiademayoristas.com")
    && !anchor.href.includes("ventasxmayor.com")
    && !anchor.href.includes("instagram.com")
    && !anchor.href.includes("facebook.com")
    && !anchor.href.includes("wa.link")
    && !anchor.href.includes("whatsapp"),
  );
  return candidates[0]?.href || "";
}

function categoryLinks() {
  return [
    "/rubros/cosmetica/perfumeria/",
    "/rubros/cosmetica/facial/",
    "/rubros/cosmetica/manicuria/",
    "/rubros/cosmetica/maquillaje/",
    "/rubros/cosmetica/insumos-de-unas/",
    "/rubros/cosmetica/insumos-de-pestanas/",
    "/rubros/cosmetica/pestanas-y-cejas/",
    "/rubros/articulos-de-peluqueria-y-barberia/capilares/",
    "/rubros/articulos-de-peluqueria-y-barberia/herramientas-de-barberia-y-peluqueria/",
    "/rubros/articulos-de-peluqueria-y-barberia/tinturas/",
    "/rubros/higiene-y-cuidado-personal/cuidado-del-cabello/",
    "/rubros/higiene-y-cuidado-personal/perfumes/",
    "/rubros/limpieza-e-higiene/cuidado-del-cabello/",
    "/rubros/limpieza-e-higiene/aerosoles-aromatizantes/",
    "/rubros/velas-esencias-y-sahumerios/aromatizantes/",
    "/rubros/velas-esencias-y-sahumerios/esencias/",
    "/rubros/velas-esencias-y-sahumerios/sahumerios-y-conos-nacionales/",
    "/mayoristas/",
  ];
}

function listingUrlsForCategory(categoryUrl, maxPages) {
  const urls = [categoryUrl];
  for (let page = 2; page <= maxPages; page += 1) {
    urls.push(`${categoryUrl.replace(/\/$/, "")}/page/${page}/`);
  }
  return urls;
}

function detailLinks(html, baseUrl) {
  return [...new Set(
    [...html.matchAll(/href=["']([^"']*\/mayoristas\/[^"']+\/)["']/gi)]
      .map((match) => new URL(match[1], baseUrl).href)
      .filter((href) => href.startsWith(`${BASE_URL}/mayoristas/`)),
  )];
}

function isRelevant(record) {
  const blob = normalizeText([
    record.company_name,
    record.vertical,
    record.evidence,
    record.notes,
  ].join(" ")).toLowerCase();
  return TARGET_KEYWORDS.some((keyword) => blob.includes(keyword));
}

function scoreAccount(record) {
  const blob = normalizeText([
    record.company_name,
    record.vertical,
    record.evidence,
    record.notes,
  ].join(" ")).toLowerCase();
  let score = 45;
  if (STRONG_TARGET_KEYWORDS.some((keyword) => blob.includes(keyword))) score += 22;
  if (/mayorista|distribuidor|distribuidora|importador|fabricante/.test(blob)) score += 18;
  if (/buenos aires|caba|cordoba|santa fe|mendoza|tucuman|argentina|rosario/.test(blob)) score += 5;
  if (/limpieza|higiene|aromatizantes|sahumerios|esencias/.test(blob)) score += 6;
  if (!record.domain && !record.email) score -= 20;
  return Math.max(0, Math.min(100, score));
}

function priorityTier(score) {
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 65) return "C";
  return "D";
}

function classifyEmail(email) {
  const [rawLocal, domain] = email.split("@");
  const local = rawLocal.replace(/[^a-z0-9._-]/g, "");
  const compact = local.replace(/[^a-z0-9]/g, "");
  if (NON_TARGET_LOCALS.includes(local) || NON_TARGET_LOCALS.includes(compact)) return "non_target";
  if (COMMERCIAL_LOCALS.some((term) => compact.includes(term))) return "role_based_commercial";
  if (GENERIC_LOCALS.some((term) => compact === term || compact.includes(term))) return "generic_routing";
  if (ADMIN_LOCALS.some((term) => compact.includes(term))) return "admin_ops";
  if (FREEMAIL_DOMAINS.has(domain)) return "nominal_public";
  return /[._-]/.test(local) || compact.length > 5 ? "nominal_public" : "generic_routing";
}

function finalStatus(contactType) {
  if (contactType === "non_target") return "discard_pre_validation";
  if (contactType === "role_based_commercial" || contactType === "nominal_public") return "candidate_validation";
  return "routing_only_pre_validation";
}

function relevanceScore(contactType) {
  if (contactType === "role_based_commercial") return 95;
  if (contactType === "nominal_public") return 82;
  if (contactType === "generic_routing") return 68;
  if (contactType === "admin_ops") return 58;
  return 5;
}

function prospectingScore(accountScore, relevance) {
  return Math.max(0, Math.min(100, Math.round(accountScore * 0.55 + relevance * 0.45)));
}

async function collectDetailUrls(maxPages) {
  const detailUrls = new Set();
  const categoryUrls = categoryLinks().map((item) => new URL(item, BASE_URL).href);
  for (const categoryUrl of categoryUrls) {
    const pageLimit = categoryUrl.endsWith("/mayoristas/") ? maxPages : Math.min(6, maxPages);
    for (const url of listingUrlsForCategory(categoryUrl, pageLimit)) {
      const html = await fetchText(url);
      await sleep(REQUEST_DELAY_MS);
      if (!html || /no se encontraron|nothing found/i.test(html)) continue;
      const links = detailLinks(html, url);
      if (!links.length && /page\/2/i.test(url)) break;
      links.forEach((link) => detailUrls.add(link));
    }
  }
  return [...detailUrls];
}

function parseDetail(html, sourceUrl) {
  const text = stripHtml(html);
  const companyName = extractTitle(html);
  const vertical = extractField(text, "Rubros") || "";
  const activity = extractField(text, "Actividad");
  const province = extractField(text, "Provincia");
  const city = extractField(text, "Ciudad");
  const website = externalWebsite(html);
  const domain = normalizeDomain(website);
  const emails = extractEmails(html);
  const evidence = normalizeText([activity, vertical, province, city].filter(Boolean).join(" / "));
  return {
    company_name: companyName,
    domain,
    website,
    vertical: vertical || "mayorista / distribuidor",
    geo: [city, province].filter(Boolean).join(", ") || "Argentina",
    size_hint: "pyme",
    source_url: sourceUrl,
    source_type: "directory",
    evidence,
    notes: text.slice(0, 500),
    emails,
  };
}

function accountRow(record, cohortId) {
  const score = scoreAccount(record);
  const emailDomain = record.emails[0] ? record.emails[0].split("@")[1] : "";
  const fallbackDomain = emailDomain && !FREEMAIL_DOMAINS.has(emailDomain) ? emailDomain : "";
  const accountDomain = record.domain || fallbackDomain;
  const baseId = slug(record.company_name) || hashId(record.company_name, record.source_url);
  return {
    account_id: `lgm-${baseId}`,
    company_name: record.company_name,
    domain: accountDomain,
    website: record.website || (accountDomain ? `https://${accountDomain}` : ""),
    vertical: record.vertical,
    geo: record.geo,
    size_hint: record.size_hint,
    icp_fit_score: score,
    priority_tier: priorityTier(score),
    status: score >= 55 ? "candidate" : "review",
    source: "laguia_mayoristas",
    source_url: record.source_url,
    source_type: record.source_type,
    evidence: record.evidence,
    notes: record.notes,
  };
}

function accountSql(row, cohortId) {
  return `INSERT INTO outbound_accounts (
  account_id, cohort_id, company_name, domain, website, vertical, geo, size_hint,
  icp_fit_score, priority_tier, status, source, notes, updated_at
) VALUES (
  ${sql(row.account_id)}, ${sql(cohortId)}, ${sql(row.company_name)}, ${sql(row.domain)},
  ${sql(row.website)}, ${sql(row.vertical)}, ${sql(row.geo)}, ${sql(row.size_hint)},
  ${Number(row.icp_fit_score) || 0}, ${sql(row.priority_tier)}, ${sql(row.status)},
  'laguia_mayoristas', ${sql(`${row.source_url} | ${row.evidence}`)}, CURRENT_TIMESTAMP
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

function contactSql(row, email, cohortId) {
  const contactType = classifyEmail(email);
  const status = finalStatus(contactType);
  const relevance = relevanceScore(contactType);
  const score = prospectingScore(row.icp_fit_score, relevance);
  const emailId = `email:${hashId(cohortId, row.account_id, email)}`;
  const contactId = `contact:${hashId(cohortId, row.account_id, email)}`;
  const hitId = `hit:${hashId(cohortId, row.account_id, email, row.source_url)}`;
  const [local, emailDomain] = email.split("@");
  return [
    `INSERT OR REPLACE INTO outbound_raw_email_hits (
  hit_id, cohort_id, account_id, email, source_url, source_type, source_title,
  context_snippet, discovered_at, crawl_job_id, status
) VALUES (
  ${sql(hitId)}, ${sql(cohortId)}, ${sql(row.account_id)}, ${sql(email)}, ${sql(row.source_url)},
  'directory', ${sql(row.company_name)}, ${sql(row.evidence)}, CURRENT_TIMESTAMP, NULL,
  ${status === "discard_pre_validation" ? "'discard'" : "'active'"}
);`,
    `INSERT INTO outbound_emails_normalized (
  email_id, cohort_id, account_id, email, email_domain, email_local, normalized_from_hits,
  syntax_valid, contact_type, person_name, role_guess, department_guess, source_url,
  evidence_score, relevance_score, status, notes, updated_at
) VALUES (
  ${sql(emailId)}, ${sql(cohortId)}, ${sql(row.account_id)}, ${sql(email)}, ${sql(emailDomain)}, ${sql(local)},
  ${sql(row.source_url)}, 1, ${sql(contactType)}, NULL, NULL, NULL, ${sql(row.source_url)},
  72, ${relevance}, ${sql(status)}, 'Directory public email. No validation API run yet.', CURRENT_TIMESTAMP
) ON CONFLICT(account_id, email) DO UPDATE SET
  cohort_id = excluded.cohort_id,
  email_domain = excluded.email_domain,
  email_local = excluded.email_local,
  normalized_from_hits = excluded.normalized_from_hits,
  syntax_valid = excluded.syntax_valid,
  contact_type = excluded.contact_type,
  source_url = excluded.source_url,
  evidence_score = excluded.evidence_score,
  relevance_score = excluded.relevance_score,
  status = excluded.status,
  notes = excluded.notes,
  updated_at = CURRENT_TIMESTAMP;`,
    `INSERT INTO outbound_prospect_contacts (
  contact_id, cohort_id, account_id, email_id, email, email_domain, full_name, role_guess,
  department_guess, contact_type, source_url, source_confidence, relevance_score,
  verification_status, verification_provider, deliverability_score, prospecting_score,
  pipeline_status, final_status, last_verified_at, notes, updated_at
) VALUES (
  ${sql(contactId)}, ${sql(cohortId)}, ${sql(row.account_id)}, ${sql(emailId)}, ${sql(email)}, ${sql(emailDomain)},
  NULL, NULL, NULL, ${sql(contactType)}, ${sql(row.source_url)}, 72, ${relevance},
  'pending', NULL, 0, ${score}, ${sql(status)}, ${sql(status)}, NULL, 'Directory public email. No validation API run yet.', CURRENT_TIMESTAMP
) ON CONFLICT(account_id, email) DO UPDATE SET
  cohort_id = excluded.cohort_id,
  email_id = excluded.email_id,
  email_domain = excluded.email_domain,
  contact_type = excluded.contact_type,
  source_url = excluded.source_url,
  source_confidence = excluded.source_confidence,
  relevance_score = excluded.relevance_score,
  verification_status = excluded.verification_status,
  deliverability_score = excluded.deliverability_score,
  prospecting_score = excluded.prospecting_score,
  pipeline_status = excluded.pipeline_status,
  final_status = excluded.final_status,
  notes = excluded.notes,
  updated_at = CURRENT_TIMESTAMP;`,
  ].join("\n");
}

function generateSql(rows, cohortId, rebuild) {
  const lines = [
    `INSERT OR REPLACE INTO outbound_cohorts (cohort_id, name, description, source, status, updated_at) VALUES (${sql(cohortId)}, 'ICP cosmetica stock 500 abril 2026', 'Stock amplio pre-validacion desde fuentes publicas.', 'laguia_mayoristas', 'active', CURRENT_TIMESTAMP);`,
  ];
  if (rebuild) {
    lines.push(`DELETE FROM outbound_raw_email_hits WHERE cohort_id = ${sql(cohortId)};`);
    lines.push(`DELETE FROM outbound_emails_normalized WHERE cohort_id = ${sql(cohortId)};`);
    lines.push(`DELETE FROM outbound_prospect_contacts WHERE cohort_id = ${sql(cohortId)};`);
    lines.push(`DELETE FROM outbound_crawl_jobs WHERE cohort_id = ${sql(cohortId)};`);
    lines.push(`DELETE FROM outbound_accounts WHERE cohort_id = ${sql(cohortId)};`);
  }
  for (const row of rows) {
    lines.push(accountSql(row, cohortId));
    for (const email of row.emails) {
      lines.push(contactSql(row, email, cohortId));
    }
  }
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outputDir = args.outputDir.includes(DEFAULT_COHORT)
    ? args.outputDir.replace(DEFAULT_COHORT, args.cohortId)
    : args.outputDir;

  const detailUrls = await collectDetailUrls(args.maxPages);
  const rows = [];
  const seenAccounts = new Set();
  for (const [index, url] of detailUrls.slice(0, args.maxDetails).entries()) {
    const html = await fetchText(url);
    await sleep(REQUEST_DELAY_MS);
    if (!html) continue;
    const record = parseDetail(html, url);
    if (!record.company_name || !isRelevant(record)) continue;
    const row = { ...accountRow(record, args.cohortId), emails: record.emails };
    if (seenAccounts.has(row.account_id)) continue;
    seenAccounts.add(row.account_id);
    rows.push(row);
    if ((index + 1) % 25 === 0) {
      console.log(`[${index + 1}/${detailUrls.length}] accounts=${rows.length}`);
    }
  }

  await mkdir(outputDir, { recursive: true });
  const accountColumns = [
    "account_id", "company_name", "domain", "vertical", "geo", "size_hint",
    "icp_fit_score", "priority_tier", "status",
  ];
  const reportColumns = [
    ...accountColumns, "website", "source_url", "source_type", "evidence", "notes",
  ];
  const contactRows = rows.flatMap((row) => row.emails.map((email) => ({
    account_id: row.account_id,
    company_name: row.company_name,
    domain: row.domain,
    email,
    contact_type: classifyEmail(email),
    final_status: finalStatus(classifyEmail(email)),
    source_url: row.source_url,
    priority_tier: row.priority_tier,
    icp_fit_score: row.icp_fit_score,
  })));

  const accountsPath = path.join("outbound", "data", "accounts", `${args.cohortId}.tsv`);
  await mkdir(path.dirname(accountsPath), { recursive: true });
  await writeFile(accountsPath, `${toDelimited(rows, accountColumns, "\t")}\n`);
  await writeFile(path.join(outputDir, "account_candidates_scored.csv"), `${toDelimited(rows, reportColumns, ",")}\n`);
  await writeFile(path.join(outputDir, "directory_contacts.csv"), `${toDelimited(contactRows, [
    "account_id", "company_name", "domain", "email", "contact_type", "final_status", "source_url", "priority_tier", "icp_fit_score",
  ], ",")}\n`);
  await writeFile(path.join(outputDir, "d1-upsert-directory-stock.sql"), `${generateSql(rows, args.cohortId, true)}\n`);
  await writeFile(path.join(outputDir, "laguia_sourcing_report.json"), `${JSON.stringify({
    cohort_id: args.cohortId,
    source: "laguiademayoristas.com.ar",
    detail_urls_found: detailUrls.length,
    accounts: rows.length,
    contacts: contactRows.length,
    accounts_tsv: accountsPath,
    output_dir: outputDir,
    by_status: contactRows.reduce((acc, row) => {
      acc[row.final_status] = (acc[row.final_status] || 0) + 1;
      return acc;
    }, {}),
  }, null, 2)}\n`);

  console.log(JSON.stringify({
    cohort_id: args.cohortId,
    detail_urls_found: detailUrls.length,
    accounts: rows.length,
    contacts: contactRows.length,
    output_dir: outputDir,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
