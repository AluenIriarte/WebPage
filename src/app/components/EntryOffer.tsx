import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CALENDLY_URL, QUOTE_PAGE_HREF } from "../lib/contact";
import { trackCalendlyClick, trackDiagnosisClick, trackQuoteClick } from "../lib/analytics";

const LINKEDIN_URL = "https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true";

const cardLabelClassName = "text-[10px] font-semibold uppercase tracking-[0.16em]";

export function EntryOffer() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[360px] w-[680px] -translate-x-1/2 opacity-20 blur-3xl"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 72%)" }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[33rem]"
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-8 rounded-full bg-accent/40" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/70">CONTACTO</span>
            </div>

            <h2 className="mt-6 text-[2rem] font-semibold leading-[1.08] tracking-tight text-foreground md:text-[2.35rem] lg:text-[2.6rem]">
              Opciones de contacto
            </h2>

            <p className="mt-5 max-w-[31rem] text-[1rem] leading-[1.72] text-muted-foreground">
              Elegí la vía más útil para tu caso. Si necesitás una primera lectura, empezá por diagnóstico. Si ya tenés claro el alcance, pasá directo a cotización.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-[2rem] border border-border/45 bg-[#FCFBFE] p-4 sm:p-5 lg:p-6">
              <div className="rounded-[1.55rem] border border-accent/18 bg-accent/[0.05] p-6">
                <p className={`${cardLabelClassName} text-accent/55`}>PARA EMPEZAR</p>
                <h3 className="mt-3 text-[1.25rem] font-semibold tracking-tight text-foreground">Diagnóstico inicial</h3>
                <p className="mt-3 max-w-[26rem] text-[0.94rem] leading-relaxed text-muted-foreground">
                  Una revisión breve para detectar si hoy hay una pérdida visible en cartera, margen o foco comercial.
                </p>
                <a
                  href={CALENDLY_URL}
                  onClick={() => {
                    trackDiagnosisClick("entry_offer_primary");
                    trackCalendlyClick("entry_offer_primary");
                  }}
                  className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-base font-medium text-accent-foreground transition-colors duration-300 hover:bg-accent/90"
                >
                  Agendar diagnóstico
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>

              <div className="mt-4 rounded-[1.4rem] border border-border/60 bg-white p-5">
                <p className={`${cardLabelClassName} text-foreground/42`}>SI YA ESTÁ DEFINIDO</p>
                <h3 className="mt-3 text-[1.08rem] font-semibold tracking-tight text-foreground">Cotización directa</h3>
                <p className="mt-2.5 max-w-[25rem] text-[0.92rem] leading-relaxed text-muted-foreground">
                  Mejor para proyectos con alcance, fuentes y necesidad más claros.
                </p>
                <Link
                  to={QUOTE_PAGE_HREF}
                  onClick={() => trackQuoteClick("entry_offer_secondary")}
                  className="group mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-white px-5 py-3 text-sm font-medium text-foreground transition-colors duration-300 hover:border-accent/35 hover:text-accent"
                >
                  Completar brief
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="mt-4 border-t border-border/45 pt-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  ¿Preferís escribir primero?{" "}
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent transition-colors hover:text-accent/80"
                  >
                    Hablemos por LinkedIn.
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
