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
            Elegí el próximo paso según tu situación
          </h2>

          <p className="mt-5 text-[1rem] leading-[1.72] text-muted-foreground">
            Si querés entender qué podrías estar perdiendo, empezá por un diagnóstico. Si ya tenés
            definido el alcance, pedí una cotización directa.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 max-w-5xl"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div
              id="diagnostico"
              className="rounded-[2rem] border border-accent/15 bg-accent/[0.05] p-7 shadow-[0_24px_70px_rgba(20,19,26,0.05)] lg:p-8"
            >
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">Agendar diagnóstico</h3>
              <p className="mt-2 text-sm font-medium text-accent/80">
                Diagnóstico comercial · reunión de 15 minutos
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Ideal si querés revisar ventas, vendedores, cartera, margen y oportunidades antes de
                definir una solución.
              </p>

              <a
                href={CALENDLY_URL}
                onClick={() => {
                  trackDiagnosisClick("entry_offer_primary");
                  trackCalendlyClick("entry_offer_primary");
                }}
                className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90"
              >
                Agendar diagnóstico
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <p className="mt-4 text-sm text-foreground/58">
                Para quienes quieren entender primero qué priorizar.
              </p>
            </div>

            <div className="rounded-[2rem] border border-border/70 bg-white p-7 shadow-[0_24px_70px_rgba(20,19,26,0.05)] lg:p-8">
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">Solicitar cotización</h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground/75">Cotización directa</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Ideal si ya tenés más claro el alcance y querés estimar una implementación o mejora puntual.
              </p>

              <Link
                to={QUOTE_PAGE_HREF}
                onClick={() => trackQuoteClick("entry_offer_secondary")}
                className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
              >
                Solicitar cotización
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <p className="mt-4 text-sm text-foreground/58">
                Para quienes ya saben qué necesitan construir o mejorar.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-[1.5rem] border border-border/60 bg-[#FCFBFE] px-6 py-5 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-muted-foreground">¿Preferís escribir primero? Hablemos por LinkedIn.</p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
            >
              Escribir por LinkedIn
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
