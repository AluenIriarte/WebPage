import { CredibilitySection } from "./CredibilitySection";
import { EntryOffer } from "./EntryOffer";
import { FAQSection } from "./FAQSection";
import { Footer } from "./Footer";
import { UnifiedProblem } from "./UnifiedProblem";
import { ValueProposition } from "./ValueProposition";

export function HomeBelowFold() {
  return (
    <>
      <UnifiedProblem />
      {/* Seccion 2 reservada para Recurso gratuito */}
      <ValueProposition />
      <CredibilitySection />
      <FAQSection />
      <EntryOffer />
      <Footer />
    </>
  );
}
