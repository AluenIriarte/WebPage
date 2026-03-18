import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SeoHead } from "../components/SeoHead";
import { setupCalendlyTracking, trackPageView } from "../lib/analytics";

export function Root() {
  const location = useLocation();

  useEffect(() => setupCalendlyTracking(), []);

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace("#", "");
      requestAnimationFrame(() => {
        document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
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
