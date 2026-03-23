import { Suspense, lazy, startTransition, useEffect, useState } from "react";
import { CredibilityBand } from "../components/CredibilityBand";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";

const HomeBelowFold = lazy(() =>
  import("../components/HomeBelowFold").then((module) => ({ default: module.HomeBelowFold })),
);

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
        {showBelowFold ? (
          <Suspense fallback={null}>
            <HomeBelowFold />
          </Suspense>
        ) : null}
      </main>
    </div>
  );
}
