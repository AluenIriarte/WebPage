import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SeoHead } from "../components/SeoHead";

export function Root() {
  const location = useLocation();

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

  return (
    <>
      <SeoHead />
      <Outlet />
    </>
  );
}
