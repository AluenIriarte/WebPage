import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_INPUT = "outbound/data/accounts/icp_cosmetica_2026_04.tsv";
const DEFAULT_COHORT = "icp_cosmetica_2026_04";
const DEFAULT_OUTPUT_DIR = "outbound/data/discovery/icp_cosmetica_2026_04";
const DEFAULT_MAX_PAGES = 18;
const REQUEST_TIMEOUT_MS = 6000;
const REQUEST_DELAY_MS = 150;
const DEFAULT_MODE = "broad";

const FREEMAIL_DOMAINS = new Set([
  "gmail.com",
  "hotmail.com",
  "hotmail.com.ar",
  "outlook.com",
  "yahoo.com",
  "yahoo.com.ar",
  "live.com",
  "icloud.com",
]);

const PLACEHOLDER_DOMAINS = new Set([
  "doe.com",
  "email.com",
  "example.com",
  "example.com.ar",
  "domain.com",
  "dominio.com",
  "test.com",
]);

const THIRD_PARTY_DOMAINS = new Set([
  "anthropic.com",
  "correoargentino.com.ar",
  "sendbox.com.ar",
  "cruzdelsur.com",
  "andreani.com",
  "oca.com.ar",
  "mercadopago.com",
  "mercadolibre.com",
]);

const PLACEHOLDER_LOCALS = new Set([
  "john",
  "jane",
  "john.doe",
  "jane.doe",
  "tuemail",
  "tunombre",
  "nombre",
  "email",
  "test",
  "prueba",
  "example",
]);

const PRIORITY_PATHS = [
  "/",
  "/contacto",
  "/contactenos",
  "/contactanos",
  "/contact",
  "/nosotros",
  "/quienes-somos",
  "/about",
  "/equipo",
  "/staff",
  "/sucursales",
  "/locales",
  "/marcas",
  "/distribuidores",
  "/mayorista",
  "/mayoristas",
  "/venta-mayorista",
  "/contacto-mayorista",
  "/atencion-al-cliente",
  "/servicio-al-cliente",
  "/clientes",
  "/empresa",
  "/distribucion",
  "/como-comprar",
  "/trabaja-con-nosotros",
  "/compras",
  "/legales",
  "/legal",
  "/politica-de-privacidad",
];

const LINK_KEYWORDS = [
  "contact",
  "contacto",
  "contactenos",
  "contactanos",
  "nosotros",
  "quienes",
  "equipo",
  "staff",
  "sucursal",
  "local",
  "marcas",
  "distribuidor",
  "mayorista",
  "ventas",
  "comercial",
  "privacidad",
  "legal",
  "clientes",
  "empresa",
  "trabaja",
  "compras",
  "atencion",
];

const SITEMAP_PATHS = [
  "/sitemap.xml",
  "/wp-sitemap.xml",
];

const DISCARD_CONTEXT_KEYWORDS = [
  "correo argentino",
  "andreani",
  "cruz del sur",
  "mercado pago",
  "mercadopago",
  "transportista",
  "transporte",
  "envios",
  "envíos",
  "logistica",
  "logística",
  "desarrollado por",
  "desarrollo web",
  "hosting",
];

const NON_TARGET_LOCALS = new Set([
  "abuse",
  "privacy",
  "privacidad",
  "legal",
  "legales",
  "webmaster",
  "postmaster",
  "hostmaster",
  "noreply",
  "no-reply",
  "no.reply",
  "donotreply",
  "do-not-reply",
  "soporte",
  "support",
  "sistemas",
  "sistema",
  "it",
]);

const ROLE_COMMERCIAL_LOCALS = [
  "ventas",
  "venta",
  "comercial",
  "comerciales",
  "sales",
  "mayorista",
  "mayoristas",
  "gerencia",
  "gerente",
  "distribucion",
  "distribuidora",
  "clientes",
  "cliente",
  "atencionalcliente",
  "atencioncliente",
  "atencion",
  "asesor",
  "asesores",
  "pedidos",
  "ecommerce",
  "tienda",
  "online",
  "marketing",
];

const GENERIC_LOCALS = [
  "info",
  "contacto",
  "consulta",
  "consultas",
  "hola",
  "mail",
  "correo",
  "recepcion",
  "salon",
];

const ADMIN_OPS_LOCALS = [
  "administracion",
  "admin",
  "compras",
  "facturacion",
  "factura",
  "cobranzas",
  "rrhh",
  "recursoshumanos",
  "empleos",
  "trabajo",
];

const DEPARTMENT_KEYWORDS = [
  ["ventas", "ventas"],
  ["comercial", "comercial"],
  ["mayorista", "comercial mayorista"],
  ["distribuidor", "distribucion"],
  ["administracion", "administracion"],
  ["compras", "compras"],
  ["facturacion", "facturacion"],
  ["atencion", "atencion al cliente"],
  ["clientes", "atencion al cliente"],
];

function getArg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }
  return fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function hashId(...parts) {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}

function sql(value) {
  if (value === null || value === undefined || value === "") {
    return "NULL";
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "NULL";
  }
  return `'${String(value).replaceAll("'", "''")}'`;
}

function csvValue(value) {
  if (value === null || value === undefined) {
    return "";
  }
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function toCsv(rows, columns) {
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvValue(row[column])).join(",")),
  ].join("\n");
}

function parseTsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const headers = lines.shift().split("\t");
  return lines.map((line) => {
    const values = line.split("\t");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function normalizeDomain(domain) {
  return String(domain || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

function normalizeEmail(email) {
  return decodeHtml(String(email || ""))
    .trim()
    .toLowerCase()
    .replace(/^mailto:/, "")
    .replace(/\?.*$/, "")
    .replace(/[),.;:\]}]+$/g, "")
    .replace(/^["'<({\[]+/g, "");
}

function isValidEmail(email) {
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    return false;
  }
  if (email.includes("..")) {
    return false;
  }
  if (/\.(png|jpg|jpeg|gif|webp|svg|css|js|pdf)$/i.test(email)) {
    return false;
  }
  const local = email.split("@")[0];
  const domain = email.split("@")[1];
  if (local.length < 2 || local.length > 64) {
    return false;
  }
  if (!/^[a-z0-9]/.test(local) || !/[a-z0-9]$/.test(local)) {
    return false;
  }
  if (PLACEHOLDER_LOCALS.has(local) || PLACEHOLDER_DOMAINS.has(domain)) {
    return false;
  }
  return true;
}

function decodeHtml(value) {
  return String(value || "")
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

function pageTitle(html) {
  const match = String(html || "").match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripHtml(match[1]).slice(0, 160) : "";
}

function sourceTypeForUrl(url) {
  const pathname = new URL(url).pathname.toLowerCase();
  if (pathname === "/" || pathname === "") return "homepage";
  if (/contact|contacto|contactenos|contactanos/.test(pathname)) return "contact";
  if (/nosotros|quienes|about/.test(pathname)) return "about";
  if (/equipo|staff/.test(pathname)) return "team";
  if (/sucursal|local/.test(pathname)) return "branches";
  if (/marca|distribuidor|mayorista/.test(pathname)) return "commercial";
  if (/legal|privacidad/.test(pathname)) return "legal";
  return "secondary_page";
}

function confidenceForSource(sourceType) {
  if (sourceType === "contact" || sourceType === "team") return 95;
  if (sourceType === "commercial") return 88;
  if (sourceType === "about" || sourceType === "branches") return 80;
  if (sourceType === "homepage") return 65;
  if (sourceType === "secondary_page") return 60;
  if (sourceType === "legal") return 45;
  return 50;
}

function includesAny(value, candidates) {
  return candidates.some((candidate) => value === candidate || value.includes(candidate));
}

function companySlug(account) {
  return String(account.company_name || account.account_id || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(srl|sa|s\.a\.|s\.r\.l\.|distribuidora|distribucion|mayorista|perfumeria)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "");
}

function isSameOrOwnedDomain(emailDomain, accountDomain) {
  return emailDomain === accountDomain || emailDomain.endsWith(`.${accountDomain}`);
}

function isCompanyFreemail(email, account) {
  const [local, domain] = email.split("@");
  if (!FREEMAIL_DOMAINS.has(domain)) {
    return false;
  }
  const compactLocal = local.replace(/[^a-z0-9]/g, "");
  const slug = companySlug(account);
  if (!slug) {
    return false;
  }
  return compactLocal.includes(slug) || slug.includes(compactLocal);
}

function emailDiscoveryStatus(email, account, context = "") {
  const emailDomain = email.split("@")[1] || "";
  const accountDomain = normalizeDomain(account.domain);
  const lowerContext = stripHtml(context).toLowerCase();
  if (THIRD_PARTY_DOMAINS.has(emailDomain)) {
    return "discard";
  }
  if (DISCARD_CONTEXT_KEYWORDS.some((keyword) => lowerContext.includes(keyword))) {
    return "discard";
  }
  if (isSameOrOwnedDomain(emailDomain, accountDomain)) {
    return "active";
  }
  const compactCompany = companySlug(account).replace(/-/g, "");
  const compactEmailDomain = emailDomain.split(".")[0].replace(/[^a-z0-9]/g, "");
  if (compactCompany && compactEmailDomain.includes(compactCompany)) {
    return "active";
  }
  if (FREEMAIL_DOMAINS.has(emailDomain)) {
    return isCompanyFreemail(email, account) || includesAny(email.split("@")[0], ROLE_COMMERCIAL_LOCALS)
      ? "active"
      : "review";
  }
  return "review";
}

function classifyContact(email, account) {
  const local = email.split("@")[0].replace(/[^a-z0-9._-]/g, "");
  const domain = email.split("@")[1] || "";
  const compact = local.replace(/[^a-z0-9]/g, "");

  if (NON_TARGET_LOCALS.has(local) || NON_TARGET_LOCALS.has(compact)) {
    return "non_target";
  }
  if (includesAny(compact, ROLE_COMMERCIAL_LOCALS)) {
    return "role_based_commercial";
  }
  if (includesAny(compact, GENERIC_LOCALS)) {
    return "generic_routing";
  }
  if (includesAny(compact, ADMIN_OPS_LOCALS)) {
    return "admin_ops";
  }
  if (FREEMAIL_DOMAINS.has(domain) && isCompanyFreemail(email, account)) {
    return "generic_routing";
  }
  return "nominal_public";
}

function departmentFromContext(context, contactType) {
  const lower = stripHtml(context).toLowerCase();
  for (const [keyword, department] of DEPARTMENT_KEYWORDS) {
    if (lower.includes(keyword)) {
      return department;
    }
  }
  if (contactType === "role_based_commercial") return "comercial";
  if (contactType === "generic_routing") return "contacto general";
  if (contactType === "admin_ops") return "administracion";
  return "";
}

function roleFromContext(context, contactType) {
  const text = stripHtml(context);
  const patterns = [
    /gerente\s+(?:comercial|de ventas|general)/i,
    /jefe\s+(?:comercial|de ventas|de compras)/i,
    /responsable\s+(?:comercial|de ventas|de compras)/i,
    /asesor(?:a)?\s+comercial/i,
    /ventas/i,
    /comercial/i,
    /administraci[oó]n/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].toLowerCase();
    }
  }
  if (contactType === "role_based_commercial") return "comercial";
  if (contactType === "admin_ops") return "administracion";
  return "";
}

function relevanceScore(contactType, account, context) {
  let score = 0;
  if (contactType === "nominal_public") score = 78;
  if (contactType === "role_based_commercial") score = 82;
  if (contactType === "generic_routing") score = 58;
  if (contactType === "admin_ops") score = 46;
  if (contactType === "non_target") score = 5;

  const lower = stripHtml(context).toLowerCase();
  if (/ventas|comercial|mayorista|distribuidor|asesor|clientes/.test(lower)) score += 10;
  if (/legal|privacidad|soporte|webmaster/.test(lower)) score -= 20;
  if (account.priority_tier === "A") score += 6;
  if (account.priority_tier === "B") score += 3;
  score += Math.round((Number(account.icp_fit_score) || 0) / 20);

  return Math.max(0, Math.min(score, 100));
}

function finalStatus(contactType, relevance, discoveryStatus) {
  if (discoveryStatus === "review") return "review_pre_validation";
  if (discoveryStatus === "discard") return "discard_pre_validation";
  if (contactType === "non_target" || relevance < 25) return "discard_pre_validation";
  if (contactType === "generic_routing" || contactType === "admin_ops") return "routing_only_pre_validation";
  return "candidate_validation";
}

function prospectingScore(account, sourceConfidence, relevance) {
  const icp = Number(account.icp_fit_score) || 0;
  return Math.max(0, Math.min(100, Math.round(relevance * 0.65 + icp * 0.25 + sourceConfidence * 0.1)));
}

function contextForEmail(html, email) {
  const decoded = decodeHtml(html);
  const lower = decoded.toLowerCase();
  const index = lower.indexOf(email.toLowerCase());
  if (index === -1) return "";
  const start = Math.max(0, index - 260);
  const end = Math.min(decoded.length, index + email.length + 260);
  return stripHtml(decoded.slice(start, end)).slice(0, 500);
}

function extractEmails(html) {
  const found = new Set();
  const decoded = decodeHtml(html);
  const mailtoRegex = /mailto:([^"'\s?<>]+)/gi;
  let mailtoMatch;
  while ((mailtoMatch = mailtoRegex.exec(decoded))) {
    const email = normalizeEmail(mailtoMatch[1]);
    if (isValidEmail(email)) found.add(email);
  }

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  let match;
  while ((match = emailRegex.exec(decoded))) {
    const email = normalizeEmail(match[0]);
    if (isValidEmail(email)) found.add(email);
  }
  return [...found];
}

function extractCandidateLinks(html, baseUrl) {
  const links = [];
  const regex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html))) {
    const href = decodeHtml(match[1]).trim();
    const text = stripHtml(match[2]).toLowerCase();
    const haystack = `${href} ${text}`.toLowerCase();
    if (!LINK_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
      continue;
    }
    try {
      const url = new URL(href, baseUrl);
      if (url.origin !== new URL(baseUrl).origin) {
        continue;
      }
      if (/\.(jpg|jpeg|png|gif|webp|svg|css|js|zip|rar)$/i.test(url.pathname)) {
        continue;
      }
      links.push(url.href.replace(/#.*$/, ""));
    } catch {
      // ignore invalid links
    }
  }
  return links;
}

function extractSitemapUrls(xml, baseUrl) {
  const urls = [];
  const regex = /<loc>\s*([^<]+)\s*<\/loc>/gi;
  let match;
  while ((match = regex.exec(xml))) {
    const raw = decodeHtml(match[1]).trim();
    try {
      const url = new URL(raw, baseUrl);
      if (url.origin !== new URL(baseUrl).origin) {
        continue;
      }
      const haystack = url.href.toLowerCase();
      if (!LINK_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
        continue;
      }
      if (/\.(jpg|jpeg|png|gif|webp|svg|css|js|zip|rar)$/i.test(url.pathname)) {
        continue;
      }
      urls.push(url.href.replace(/#.*$/, ""));
    } catch {
      // ignore invalid sitemap entries
    }
  }
  return urls;
}

async function discoverSitemapUrls(origin) {
  const urls = [];
  for (const path of SITEMAP_PATHS) {
    const sitemapUrl = new URL(path, origin).href;
    const result = await fetchText(sitemapUrl);
    await sleep(REQUEST_DELAY_MS);
    if (!result.ok) {
      continue;
    }
    urls.push(...extractSitemapUrls(result.text, result.url || sitemapUrl).slice(0, 12));
  }
  return [...new Set(urls)];
}

async function sleep(ms) {
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
        "User-Agent": "AlanLPerez-OutboundOps/1.0 public-contact-discovery",
        Accept: "text/html,text/plain,application/xhtml+xml;q=0.9,*/*;q=0.2",
      },
    });
    if (!response.ok) {
      return { ok: false, status: response.status, error: `http_${response.status}` };
    }
    const contentType = response.headers.get("content-type") || "";
    if (!/text|html|xml|json|javascript/i.test(contentType)) {
      return { ok: false, status: response.status, error: `unsupported_${contentType}` };
    }
    const text = await response.text();
    return { ok: true, url: response.url, text, status: response.status, contentType };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : "fetch_error",
    };
  } finally {
    clearTimeout(timer);
  }
}

async function resolveOrigin(domain) {
  const clean = normalizeDomain(domain);
  const candidates = [
    `https://${clean}`,
    `https://www.${clean}`,
    `http://${clean}`,
    `http://www.${clean}`,
  ];
  const results = await Promise.all(candidates.map(async (origin) => [origin, await fetchText(origin)]));
  for (const [origin, result] of results) {
    if (result.ok) {
      return { origin: new URL(result.url || origin).origin, homepage: result };
    }
  }
  return { origin: `https://${clean}`, homepage: null };
}

async function discoverAccount(account, options) {
  const now = new Date().toISOString();
  const crawlJobId = `crawl:${options.cohortId}:${account.account_id}:${now.slice(0, 10)}`;
  const { origin, homepage } = await resolveOrigin(account.domain);
  const urls = new Set(PRIORITY_PATHS.map((item) => new URL(item, origin).href));
  const pages = [];
  const rawHits = [];
  let errorMessage = "";

  if (homepage?.ok) {
    pages.push({ url: homepage.url, result: homepage });
    for (const link of extractCandidateLinks(homepage.text, homepage.url)) {
      urls.add(link);
    }
  } else {
    errorMessage = homepage?.error || "homepage_unreachable";
  }

  if (options.useSitemap) {
    for (const link of await discoverSitemapUrls(origin)) {
      urls.add(link);
    }
  }

  let cursor = 0;
  while (cursor < urls.size) {
    const url = [...urls][cursor];
    cursor += 1;
    if (pages.some((page) => page.url === url || page.result?.url === url)) {
      continue;
    }
    if (pages.length >= options.maxPages) {
      break;
    }
    const result = await fetchText(url);
    await sleep(REQUEST_DELAY_MS);
    if (result.ok) {
      pages.push({ url: result.url || url, result });
      for (const link of extractCandidateLinks(result.text, result.url || url)) {
        urls.add(link);
      }
    }
  }

  for (const page of pages) {
    const html = page.result.text || "";
    const sourceUrl = page.url;
    const sourceType = sourceTypeForUrl(sourceUrl);
    const sourceTitle = pageTitle(html);
    for (const email of extractEmails(html)) {
      const contextSnippet = contextForEmail(html, email);
      const discoveryStatus = emailDiscoveryStatus(email, account, contextSnippet);
      rawHits.push({
        hit_id: `hit:${hashId(options.cohortId, account.account_id, email, sourceUrl)}`,
        cohort_id: options.cohortId,
        account_id: account.account_id,
        email,
        source_url: sourceUrl,
        source_type: sourceType,
        source_title: sourceTitle,
        context_snippet: contextSnippet,
        discovered_at: now,
        crawl_job_id: crawlJobId,
        status: discoveryStatus,
      });
    }
  }

  const consolidatedByEmail = new Map();
  for (const hit of rawHits.filter((item) => item.status !== "discard")) {
    const emailDomain = hit.email.split("@")[1] || "";
    const contactType = classifyContact(hit.email, account);
    const sourceConfidence = confidenceForSource(hit.source_type);
    const relevance = relevanceScore(contactType, account, hit.context_snippet);
    const score = prospectingScore(account, sourceConfidence, relevance);
    const current = consolidatedByEmail.get(hit.email);
    if (current && current.prospecting_score > score) {
      continue;
    }
    consolidatedByEmail.set(hit.email, {
      contact_id: `contact:${hashId(options.cohortId, account.account_id, hit.email)}`,
      email_id: `email:${hashId(options.cohortId, account.account_id, hit.email)}`,
      cohort_id: options.cohortId,
      account_id: account.account_id,
      email: hit.email,
      email_domain: emailDomain,
      full_name: "",
      role_guess: roleFromContext(hit.context_snippet, contactType),
      department_guess: departmentFromContext(hit.context_snippet, contactType),
      contact_type: contactType,
      source_url: hit.source_url,
      source_confidence: sourceConfidence,
      relevance_score: relevance,
      deliverability_score: 0,
      prospecting_score: score,
      verification_status: "pending",
      verification_provider: "",
      last_verified_at: "",
      final_status: finalStatus(contactType, relevance, hit.status),
      notes:
        hit.status === "review"
          ? "Public email discovery. Needs manual review before validation."
          : "Public email discovery. No validation API run yet.",
      created_at: now,
      updated_at: now,
    });
  }

  const contacts = [...consolidatedByEmail.values()].sort(
    (a, b) => b.prospecting_score - a.prospecting_score || a.email.localeCompare(b.email),
  );

  return {
    account,
    crawlJob: {
      crawl_job_id: crawlJobId,
      cohort_id: options.cohortId,
      account_id: account.account_id,
      job_type: "public_email_discovery",
      status: errorMessage && pages.length === 0 ? "failed" : "completed",
      started_at: now,
      finished_at: new Date().toISOString(),
      pages_scanned: pages.length,
      emails_found: rawHits.length,
      error_message: errorMessage,
    },
    rawHits,
    contacts,
  };
}

function accountInsertSql(account, cohortId) {
  return `INSERT INTO outbound_accounts (
  account_id, cohort_id, company_name, domain, website, vertical, geo, size_hint,
  icp_fit_score, priority_tier, status, source, updated_at
) VALUES (
  ${sql(account.account_id)}, ${sql(cohortId)}, ${sql(account.company_name)}, ${sql(normalizeDomain(account.domain))},
  ${sql(`https://${normalizeDomain(account.domain)}`)}, ${sql(account.vertical)}, ${sql(account.geo)}, ${sql(account.size_hint)},
  ${sql(Number(account.icp_fit_score) || 0)}, ${sql(account.priority_tier)}, ${sql(account.status || "candidate")},
  'ai_account_research', CURRENT_TIMESTAMP
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
  updated_at = CURRENT_TIMESTAMP;`;
}

function crawlJobSql(job) {
  return `INSERT OR REPLACE INTO outbound_crawl_jobs (
  crawl_job_id, cohort_id, account_id, job_type, status, started_at, finished_at,
  pages_scanned, emails_found, error_message, updated_at
) VALUES (
  ${sql(job.crawl_job_id)}, ${sql(job.cohort_id)}, ${sql(job.account_id)}, ${sql(job.job_type)},
  ${sql(job.status)}, ${sql(job.started_at)}, ${sql(job.finished_at)}, ${sql(job.pages_scanned)},
  ${sql(job.emails_found)}, ${sql(job.error_message)}, CURRENT_TIMESTAMP
);`;
}

function rawHitSql(hit) {
  return `INSERT OR REPLACE INTO outbound_raw_email_hits (
  hit_id, cohort_id, account_id, email, source_url, source_type, source_title,
  context_snippet, discovered_at, crawl_job_id, status
) VALUES (
  ${sql(hit.hit_id)}, ${sql(hit.cohort_id)}, ${sql(hit.account_id)}, ${sql(hit.email)},
  ${sql(hit.source_url)}, ${sql(hit.source_type)}, ${sql(hit.source_title)}, ${sql(hit.context_snippet)},
  ${sql(hit.discovered_at)}, ${sql(hit.crawl_job_id)}, ${sql(hit.status)}
);`;
}

function normalizedSql(contact) {
  const [local, domain] = contact.email.split("@");
  return `INSERT INTO outbound_emails_normalized (
  email_id, cohort_id, account_id, email, email_domain, email_local, normalized_from_hits,
  syntax_valid, contact_type, person_name, role_guess, department_guess, source_url,
  evidence_score, relevance_score, status, notes, updated_at
) VALUES (
  ${sql(contact.email_id)}, ${sql(contact.cohort_id)}, ${sql(contact.account_id)}, ${sql(contact.email)},
  ${sql(domain)}, ${sql(local)}, ${sql(contact.source_url)}, 1, ${sql(contact.contact_type)},
  ${sql(contact.full_name)}, ${sql(contact.role_guess)}, ${sql(contact.department_guess)}, ${sql(contact.source_url)},
  ${sql(contact.source_confidence)}, ${sql(contact.relevance_score)}, ${sql(contact.final_status)}, ${sql(contact.notes)}, CURRENT_TIMESTAMP
) ON CONFLICT(account_id, email) DO UPDATE SET
  cohort_id = excluded.cohort_id,
  email_domain = excluded.email_domain,
  email_local = excluded.email_local,
  normalized_from_hits = excluded.normalized_from_hits,
  syntax_valid = excluded.syntax_valid,
  contact_type = excluded.contact_type,
  person_name = excluded.person_name,
  role_guess = excluded.role_guess,
  department_guess = excluded.department_guess,
  source_url = excluded.source_url,
  evidence_score = excluded.evidence_score,
  relevance_score = excluded.relevance_score,
  status = excluded.status,
  notes = excluded.notes,
  updated_at = CURRENT_TIMESTAMP;`;
}

function prospectContactSql(contact) {
  return `INSERT INTO outbound_prospect_contacts (
  contact_id, cohort_id, account_id, email_id, email, email_domain, full_name, role_guess,
  department_guess, contact_type, source_url, source_confidence, relevance_score,
  verification_status, verification_provider, deliverability_score, prospecting_score,
  pipeline_status, final_status, last_verified_at, notes, updated_at
) VALUES (
  ${sql(contact.contact_id)}, ${sql(contact.cohort_id)}, ${sql(contact.account_id)}, ${sql(contact.email_id)},
  ${sql(contact.email)}, ${sql(contact.email_domain)}, ${sql(contact.full_name)}, ${sql(contact.role_guess)},
  ${sql(contact.department_guess)}, ${sql(contact.contact_type)}, ${sql(contact.source_url)},
  ${sql(contact.source_confidence)}, ${sql(contact.relevance_score)}, ${sql(contact.verification_status)},
  ${sql(contact.verification_provider)}, ${sql(contact.deliverability_score)}, ${sql(contact.prospecting_score)},
  ${sql(contact.final_status)}, ${sql(contact.final_status)}, ${sql(contact.last_verified_at)}, ${sql(contact.notes)}, CURRENT_TIMESTAMP
) ON CONFLICT(account_id, email) DO UPDATE SET
  cohort_id = excluded.cohort_id,
  email_id = excluded.email_id,
  email_domain = excluded.email_domain,
  full_name = excluded.full_name,
  role_guess = excluded.role_guess,
  department_guess = excluded.department_guess,
  contact_type = excluded.contact_type,
  source_url = excluded.source_url,
  source_confidence = excluded.source_confidence,
  relevance_score = excluded.relevance_score,
  verification_status = excluded.verification_status,
  verification_provider = excluded.verification_provider,
  deliverability_score = excluded.deliverability_score,
  prospecting_score = excluded.prospecting_score,
  pipeline_status = excluded.pipeline_status,
  final_status = excluded.final_status,
  last_verified_at = excluded.last_verified_at,
  notes = excluded.notes,
  updated_at = CURRENT_TIMESTAMP;`;
}

function generateSql(results, cohortId, options = {}) {
  const lines = [
    `INSERT OR IGNORE INTO outbound_cohorts (cohort_id, name, description, source, status) VALUES (${sql(cohortId)}, 'ICP cosmetica mayorista abril 2026', 'Empresas ICP propias de perfumeria, cosmetica, belleza y cuidado personal.', 'ai_account_research', 'active');`,
  ];

  if (options.rebuild) {
    lines.push(`DELETE FROM outbound_raw_email_hits WHERE cohort_id = ${sql(cohortId)};`);
    lines.push(`DELETE FROM outbound_emails_normalized WHERE cohort_id = ${sql(cohortId)};`);
    lines.push(`DELETE FROM outbound_prospect_contacts WHERE cohort_id = ${sql(cohortId)};`);
    lines.push(`DELETE FROM outbound_crawl_jobs WHERE cohort_id = ${sql(cohortId)};`);
  }

  for (const result of results) {
    lines.push(accountInsertSql(result.account, cohortId));
    lines.push(crawlJobSql(result.crawlJob));
    for (const hit of result.rawHits) {
      lines.push(rawHitSql(hit));
    }
    for (const contact of result.contacts) {
      lines.push(normalizedSql(contact));
      lines.push(prospectContactSql(contact));
    }
    lines.push(
      `UPDATE outbound_accounts SET last_public_discovery_at = ${sql(result.crawlJob.finished_at)}, updated_at = CURRENT_TIMESTAMP WHERE account_id = ${sql(result.account.account_id)};`,
    );
  }

  return lines.join("\n");
}

function summaryRows(results) {
  return results.map((result) => {
    const counts = result.contacts.reduce((acc, contact) => {
      acc[contact.contact_type] = (acc[contact.contact_type] || 0) + 1;
      acc[contact.final_status] = (acc[contact.final_status] || 0) + 1;
      return acc;
    }, {});
    return {
      account_id: result.account.account_id,
      company_name: result.account.company_name,
      domain: result.account.domain,
      priority_tier: result.account.priority_tier,
      icp_fit_score: result.account.icp_fit_score,
      pages_scanned: result.crawlJob.pages_scanned,
      raw_hits: result.rawHits.length,
      contacts: result.contacts.length,
      candidate_validation: counts.candidate_validation || 0,
      review_pre_validation: counts.review_pre_validation || 0,
      routing_only_pre_validation: counts.routing_only_pre_validation || 0,
      discard_pre_validation: counts.discard_pre_validation || 0,
      nominal_public: counts.nominal_public || 0,
      role_based_commercial: counts.role_based_commercial || 0,
      generic_routing: counts.generic_routing || 0,
      admin_ops: counts.admin_ops || 0,
      non_target: counts.non_target || 0,
      crawl_status: result.crawlJob.status,
      error_message: result.crawlJob.error_message,
    };
  });
}

function allRawHits(results) {
  return results.flatMap((result) =>
    result.rawHits.map((hit) => ({
      ...hit,
      company_name: result.account.company_name,
      domain: result.account.domain,
      priority_tier: result.account.priority_tier,
    })),
  );
}

function allContacts(results) {
  return results.flatMap((result) =>
    result.contacts.map((contact) => ({
      ...contact,
      company_name: result.account.company_name,
      domain: result.account.domain,
      vertical: result.account.vertical,
      geo: result.account.geo,
      priority_tier: result.account.priority_tier,
      icp_fit_score: result.account.icp_fit_score,
    })),
  );
}

async function main() {
  const input = getArg("input", DEFAULT_INPUT);
  const cohortId = getArg("cohort", DEFAULT_COHORT);
  const outputDir = getArg("outDir", getArg("outputDir", `outbound/data/discovery/${cohortId}`));
  const maxPages = Number(getArg("maxPages", DEFAULT_MAX_PAGES)) || DEFAULT_MAX_PAGES;
  const onlyAccount = getArg("account", "");
  const maxAccounts = Number(getArg("maxAccounts", 0)) || 0;
  const offsetAccounts = Number(getArg("offsetAccounts", 0)) || 0;
  const dryRun = hasFlag("dryRun");
  const rebuild = hasFlag("rebuild");
  const useSitemap = hasFlag("sitemap");

  let accounts = parseTsv(await readFile(input, "utf8"))
    .map((account) => ({ ...account, domain: normalizeDomain(account.domain) }))
    .filter((account) => account.domain && ["candidate", "approved", "active"].includes(account.status))
    .filter((account) => !onlyAccount || account.account_id === onlyAccount);
  if (!onlyAccount && (offsetAccounts || maxAccounts)) {
    accounts = accounts.slice(offsetAccounts, maxAccounts ? offsetAccounts + maxAccounts : undefined);
  }

  await mkdir(outputDir, { recursive: true });
  const results = [];

  for (const [index, account] of accounts.entries()) {
    console.log(`[${index + 1}/${accounts.length}] ${account.company_name} <${account.domain}>`);
    const result = dryRun
      ? {
          account,
          crawlJob: {
            crawl_job_id: `crawl:${cohortId}:${account.account_id}:dry-run`,
            cohort_id: cohortId,
            account_id: account.account_id,
            job_type: "public_email_discovery",
            status: "dry_run",
            started_at: new Date().toISOString(),
            finished_at: new Date().toISOString(),
            pages_scanned: 0,
            emails_found: 0,
            error_message: "",
          },
          rawHits: [],
          contacts: [],
        }
      : await discoverAccount(account, { cohortId, maxPages, useSitemap });
    results.push(result);
    console.log(
      `  pages=${result.crawlJob.pages_scanned} raw=${result.rawHits.length} contacts=${result.contacts.length} status=${result.crawlJob.status}`,
    );
  }

  const rawHits = allRawHits(results);
  const contacts = allContacts(results);
  const summary = summaryRows(results);
  const sqlText = generateSql(results, cohortId, { rebuild });
  const report = {
    cohort_id: cohortId,
    generated_at: new Date().toISOString(),
    accounts: results.length,
    raw_hits: rawHits.length,
    contacts: contacts.length,
    candidate_validation: contacts.filter((item) => item.final_status === "candidate_validation").length,
    review_pre_validation: contacts.filter((item) => item.final_status === "review_pre_validation").length,
    routing_only_pre_validation: contacts.filter((item) => item.final_status === "routing_only_pre_validation").length,
    discard_pre_validation: contacts.filter((item) => item.final_status === "discard_pre_validation").length,
    by_contact_type: contacts.reduce((acc, item) => {
      acc[item.contact_type] = (acc[item.contact_type] || 0) + 1;
      return acc;
    }, {}),
  };

  await writeFile(path.join(outputDir, "accounts_discovery_summary.csv"), toCsv(summary, [
    "account_id",
    "company_name",
    "domain",
    "priority_tier",
    "icp_fit_score",
    "pages_scanned",
    "raw_hits",
    "contacts",
    "candidate_validation",
    "review_pre_validation",
    "routing_only_pre_validation",
    "discard_pre_validation",
    "nominal_public",
    "role_based_commercial",
    "generic_routing",
    "admin_ops",
    "non_target",
    "crawl_status",
    "error_message",
  ]));
  await writeFile(path.join(outputDir, "raw_email_hits.csv"), toCsv(rawHits, [
    "hit_id",
    "cohort_id",
    "account_id",
    "company_name",
    "domain",
    "email",
    "source_url",
    "source_type",
    "source_title",
    "context_snippet",
    "crawl_job_id",
    "status",
    "discovered_at",
  ]));
  await writeFile(path.join(outputDir, "prospect_contacts_pre_validation.csv"), toCsv(contacts, [
    "contact_id",
    "cohort_id",
    "account_id",
    "company_name",
    "domain",
    "email",
    "email_domain",
    "full_name",
    "role_guess",
    "department_guess",
    "contact_type",
    "source_url",
    "source_confidence",
    "relevance_score",
    "deliverability_score",
    "prospecting_score",
    "verification_status",
    "verification_provider",
    "last_verified_at",
    "final_status",
    "priority_tier",
    "icp_fit_score",
    "vertical",
    "geo",
    "notes",
  ]));
  await writeFile(path.join(outputDir, "discovery_report.json"), JSON.stringify(report, null, 2));
  await writeFile(path.join(outputDir, "d1-upsert-discovery.sql"), sqlText);

  console.log(JSON.stringify(report, null, 2));
  console.log(`Wrote ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
