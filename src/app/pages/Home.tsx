import { startTransition, useEffect, useState } from "react";
import { HomeBelowFold } from "../components/HomeBelowFold";
import { CredibilityBand } from "../components/CredibilityBand";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";

export function Home() {
  const [showBelowFold, setShowBelowFold] = useState(false);

  useEffect(() => {
    const revealBelowFold = () => {
      startTransition(() => setShowBelowFold(true));
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(revealBelowFold, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(revealBelowFold, 300);
    return () => window.clearTimeout(timeoutId);
  }, []);

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
