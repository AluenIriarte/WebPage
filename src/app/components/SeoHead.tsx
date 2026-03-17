import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SEO_DEFAULTS, SEO_SITE_URL, getSeoRoute } from "../lib/seo";

function upsertMeta({ name, property, content }: { name?: string; property?: string; content: string }) {
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    if (name) {
      element.name = name;
    }
    if (property) {
      element.setAttribute("property", property);
    }
    document.head.appendChild(element);
  }

  element.content = content;
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

export function SeoHead() {
  const location = useLocation();

  useEffect(() => {
    const route = getSeoRoute(location.pathname);
    const title = route?.title ?? SEO_DEFAULTS.title;
    const description = route?.description ?? SEO_DEFAULTS.description;
    const canonical = route?.canonical ?? `${SEO_SITE_URL}${location.pathname === "/" ? "/" : location.pathname}`;
    const ogType = route?.ogType ?? SEO_DEFAULTS.ogType;
    const robots = route?.robots ?? SEO_DEFAULTS.robots;
    const twitterCard = route?.twitterCard ?? SEO_DEFAULTS.twitterCard;
    const schema = route?.schema ?? [];

    document.title = title;

    upsertMeta({ name: "description", content: description });
    upsertMeta({ name: "robots", content: robots });
    upsertMeta({ property: "og:title", content: title });
    upsertMeta({ property: "og:description", content: description });
    upsertMeta({ property: "og:url", content: canonical });
    upsertMeta({ property: "og:type", content: ogType });
    upsertMeta({ property: "og:site_name", content: "Alan L. Perez" });
    upsertMeta({ name: "twitter:card", content: twitterCard });
    upsertMeta({ name: "twitter:title", content: title });
    upsertMeta({ name: "twitter:description", content: description });
    upsertLink("canonical", canonical);

    document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((node) => node.remove());

    schema.forEach((entry) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.textContent = JSON.stringify(entry);
      document.head.appendChild(script);
    });
  }, [location.pathname]);

  return null;
}
