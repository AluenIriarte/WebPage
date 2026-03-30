import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SeoHead } from "../components/SeoHead";
import { scheduleAnalyticsLoad, setupCalendlyTracking, trackPageView } from "../lib/analytics";

export function Root() {
  const location = useLocation();

  useEffect(() => {
    const cleanupCalendly = setupCalendlyTracking();
    const cleanupAnalytics = scheduleAnalyticsLoad();

    return () => {
      cleanupCalendly();
      cleanupAnalytics();
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace("#", "");
      let attempts = 0;
      let timeoutId: number | undefined;

      const scrollToHashTarget = () => {
        const element = document.getElementById(elementId);

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }

        if (attempts >= 20) {
          return;
        }

        attempts += 1;
        timeoutId = window.setTimeout(scrollToHashTarget, 100);
      };

      requestAnimationFrame(scrollToHashTarget);

      return () => {
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}${location.hash}`);
  }, [location.pathname, location.search, location.hash]);

  return (
    <>
      <SeoHead />
      <Outlet />
    </>
  );
}
