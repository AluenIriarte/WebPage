import { ContactClose } from "./ContactClose";
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
      <ValueProposition />
      <CredibilitySection />
      <EntryOffer />
      <FAQSection />
      <ContactClose />
      <Footer />
    </>
  );
}
