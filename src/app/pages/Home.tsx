import { ContactClose } from "../components/ContactClose";
import { CredibilityBand } from "../components/CredibilityBand";
import { CredibilitySection } from "../components/CredibilitySection";
import { EntryOffer } from "../components/EntryOffer";
import { FAQSection } from "../components/FAQSection";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { UnifiedProblem } from "../components/UnifiedProblem";
import { ValueProposition } from "../components/ValueProposition";

export function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <CredibilityBand />
        <UnifiedProblem />
        <ValueProposition />
        <CredibilitySection />
        <EntryOffer />
        <FAQSection />
        <ContactClose />
      </main>
      <Footer />
    </div>
  );
}
