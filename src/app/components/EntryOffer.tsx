import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CALENDLY_URL, QUOTE_PAGE_HREF } from "../lib/contact";
import { trackCalendlyClick, trackDiagnosisClick, trackQuoteClick } from "../lib/analytics";

const LINKEDIN_URL = "https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true";

export function EntryOffer() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[360px] w-[680px] -translate-x-1/2 opacity-20 blur-3xl"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 72%)" }}
      />

      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[40rem] text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 rounded-full bg-accent/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/70">CONTACTO</span>
          </div>

          <h2 className="mt-6 text-[2rem] font-semibold leading-[1.08] tracking-tight text-foreground md:text-[2.35rem] lg:text-[2.6rem]">
            Opciones de contacto
          </h2>

          <p className="mt-5 text-[1rem] leading-[1.72] text-muted-foreground">Elegi la via mas util para tu caso.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 max-w-[36rem] space-y-3"
        >
          <a
            href={CALENDLY_URL}
            onClick={() => {
              trackDiagnosisClick("entry_offer_primary");
              trackCalendlyClick("entry_offer_primary");
            }}
            className="group flex w-full items-center justify-between rounded-[1.5rem] bg-accent px-6 py-5 text-left text-accent-foreground transition-colors duration-300 hover:bg-accent/90"
          >
            <div className="min-w-0">
              <div className="text-base font-semibold tracking-tight">Agendar diagnostico</div>
              <div className="mt-1 text-sm text-accent-foreground/78">Diagnostico inicial - Reunion de 15 minutos</div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          </a>

          <Link
            to={QUOTE_PAGE_HREF}
            onClick={() => trackQuoteClick("entry_offer_secondary")}
            className="group flex w-full items-center justify-between rounded-[1.5rem] border border-border/70 bg-white px-6 py-5 text-left transition-colors duration-300 hover:border-accent/35 hover:text-accent"
          >
            <div className="min-w-0">
              <div className="text-base font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent">
                Solicitar cotizacion
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Cotizacion directa si ya tenes mejor definido el alcance</div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent" />
          </Link>

          <div className="pt-2 text-center">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
            >
              Preferis escribir primero? Hablemos por LinkedIn.
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
