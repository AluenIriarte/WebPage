import { startTransition, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HomeBelowFold } from "../components/HomeBelowFold";
import { CredibilityBand } from "../components/CredibilityBand";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";

export function Home() {
  const location = useLocation();
  const [showBelowFold, setShowBelowFold] = useState(() =>
    typeof window !== "undefined" ? Boolean(window.location.hash) : false,
  );

  useEffect(() => {
    if (location.hash) {
      startTransition(() => setShowBelowFold(true));
      return;
    }

    if (showBelowFold) {
      return;
    }

    const revealBelowFold = () => {
      startTransition(() => setShowBelowFold(true));
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(revealBelowFold, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(revealBelowFold, 300);
    return () => window.clearTimeout(timeoutId);
  }, [location.hash, showBelowFold]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <CredibilityBand />
        {showBelowFold ? <HomeBelowFold /> : null}
      </main>
    </div>
  );
}
