export const GA_MEASUREMENT_ID = "G-X4KNGK27XS";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

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
