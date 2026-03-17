import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const seoConfigPath = path.join(rootDir, "src", "app", "lib", "seo-routes.json");

const seoConfig = JSON.parse(await readFile(seoConfigPath, "utf8"));
const baseHtmlPath = path.join(distDir, "index.html");
const baseHtml = await readFile(baseHtmlPath, "utf8");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function renderJsonLd(schema = []) {
  return schema
    .map((entry) => {
      return `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(entry)}</script>`;
    })
    .join("\n    ");
}

function injectSeoTags(html, route, defaults) {
  const title = route.title ?? defaults.title;
  const description = route.description ?? defaults.description;
  const canonical = route.canonical ?? `${seoConfig.siteUrl}${route.path}`;
  const ogType = route.ogType ?? defaults.ogType;
  const robots = route.robots ?? defaults.robots;
  const twitterCard = route.twitterCard ?? defaults.twitterCard;
  const schemaMarkup = renderJsonLd(route.schema);

  let output = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  if (/<meta\s+name=["']description["'][^>]*>/i.test(output)) {
    output = output.replace(
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${escapeAttribute(description)}" />`,
    );
  } else {
    output = output.replace(
      "</head>",
      `    <meta name="description" content="${escapeAttribute(description)}" />\n  </head>`,
    );
  }

  const seoTags = [
    `<meta name="robots" content="${escapeAttribute(robots)}" />`,
    `<link rel="canonical" href="${escapeAttribute(canonical)}" />`,
    `<meta property="og:title" content="${escapeAttribute(title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(description)}" />`,
    `<meta property="og:url" content="${escapeAttribute(canonical)}" />`,
    `<meta property="og:type" content="${escapeAttribute(ogType)}" />`,
    `<meta property="og:site_name" content="Alan L. Perez" />`,
    `<meta name="twitter:card" content="${escapeAttribute(twitterCard)}" />`,
    `<meta name="twitter:title" content="${escapeAttribute(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(description)}" />`,
    schemaMarkup,
  ]
    .filter(Boolean)
    .join("\n    ");

  return output.replace("</head>", `    ${seoTags}\n  </head>`);
}

function routeOutputPath(routePath) {
  if (routePath === "/") {
    return baseHtmlPath;
  }

  const trimmed = routePath.replace(/^\//, "");
  return path.join(distDir, trimmed, "index.html");
}

async function writeRouteHtml(route) {
  const targetPath = routeOutputPath(route.path);
  await mkdir(path.dirname(targetPath), { recursive: true });
  const html = injectSeoTags(baseHtml, route, seoConfig.defaults);
  await writeFile(targetPath, html, "utf8");
}

function buildSitemap(routes) {
  const urls = routes
    .filter((route) => !(route.robots || "").toLowerCase().includes("noindex"))
    .map((route) => {
      const location = route.canonical ?? `${seoConfig.siteUrl}${route.path === "/" ? "/" : route.path}`;
      return `  <url>\n    <loc>${escapeHtml(location)}</loc>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${seoConfig.siteUrl}/sitemap.xml\n`;
}

for (const route of seoConfig.routes) {
  await writeRouteHtml(route);
}

await writeFile(path.join(distDir, "sitemap.xml"), buildSitemap(seoConfig.routes), "utf8");
await writeFile(path.join(distDir, "robots.txt"), buildRobots(), "utf8");
