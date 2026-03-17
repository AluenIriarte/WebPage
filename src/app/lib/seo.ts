import seoConfig from "./seo-routes.json";

type SeoSchema = Record<string, unknown>;

interface SeoRoute {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  robots?: string;
  twitterCard?: string;
  schema?: SeoSchema[];
}

interface SeoConfig {
  siteUrl: string;
  defaults: {
    title: string;
    description: string;
    robots: string;
    ogType: string;
    twitterCard: string;
  };
  routes: SeoRoute[];
}

const config = seoConfig as SeoConfig;

export const SEO_SITE_URL = config.siteUrl;
export const SEO_DEFAULTS = config.defaults;
export const SEO_ROUTES = config.routes;

function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function getSeoRoute(pathname: string) {
  const normalizedPath = normalizePath(pathname);
  return SEO_ROUTES.find((route) => route.path === normalizedPath) ?? null;
}
