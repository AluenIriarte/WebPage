export const GA_MEASUREMENT_ID = "G-X4KNGK27XS";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

let analyticsBootstrapped = false;
let analyticsScheduled = false;

function createAnalyticsStub() {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== "function") {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }
}

function injectAnalyticsScript() {
  if (typeof window === "undefined" || analyticsBootstrapped) {
    return;
  }

  createAnalyticsStub();
  window.gtag?.("js", new Date());
  window.gtag?.("config", GA_MEASUREMENT_ID, { send_page_view: false });

  if (!document.querySelector(`script[data-ga-id="${GA_MEASUREMENT_ID}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.dataset.gaId = GA_MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  analyticsBootstrapped = true;
}

export function scheduleAnalyticsLoad() {
  if (typeof window === "undefined" || analyticsScheduled) {
    return () => {};
  }

  analyticsScheduled = true;
  createAnalyticsStub();

  const load = () => injectAnalyticsScript();

  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(load, { timeout: 2000 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = window.setTimeout(load, 1200);
  return () => window.clearTimeout(timeoutId);
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}

export function trackPageView(path: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    send_to: GA_MEASUREMENT_ID,
  });
}

export function setupCalendlyTracking() {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (event: MessageEvent) => {
    if (typeof event.data !== "object" || event.data === null) {
      return;
    }

    const payload = event.data as { event?: string; payload?: Record<string, unknown> };
    if (payload.event === "calendly.event_scheduled") {
      trackEvent("calendly_reservation", {
        calendly_event_uri: String(payload.payload?.event || ""),
      });
    }
  };

  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}

export function trackDiagnosisClick(source: string) {
  trackEvent("diagnostic_click", { source });
}

export function trackQuoteClick(source: string, product?: string) {
  trackEvent("quote_click", { source, product });
}

export function trackGuideClick(source: string, asset?: string) {
  trackEvent("guide_click", { source, asset });
}

export function trackFormSubmit(formName: string, product?: string) {
  trackEvent("form_submit", { form_name: formName, product });
}

export function trackCalendlyClick(source: string) {
  trackEvent("calendly_click", { source });
}
