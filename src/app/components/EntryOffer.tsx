import { motion } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { CALENDLY_URL, QUOTE_PAGE_HREF } from "../lib/contact";
import { trackCalendlyClick, trackDiagnosisClick, trackQuoteClick } from "../lib/analytics";

const LINKEDIN_URL = "https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true";

const items = [
  "D\u00f3nde puede estar y\u00e9ndose dinero sin que hoy sea visible",
  "Qu\u00e9 se\u00f1al conviene mirar primero",
  "Si el problema es de datos, de foco o de lectura comercial",
  "Si tiene sentido construir algo ahora o no",
];

export function EntryOffer() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-white py-24 lg:py-36">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 opacity-25 blur-3xl"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-8 rounded-full bg-accent/40" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/70">
                Contacto
              </span>
            </div>

            <div className="space-y-5">
              <h2 className="max-w-[30rem] text-[2rem] font-semibold leading-[1.12] tracking-tight text-foreground md:text-[2.35rem] lg:text-[2.55rem]">
                {"En 15 minutos podemos ver si tiene sentido avanzar"}
              </h2>
              <p className="max-w-[31rem] text-[1.02rem] leading-[1.72] text-muted-foreground">
                {
                  "No es una llamada comercial gen\u00e9rica. Es una revisi\u00f3n inicial para detectar si hoy hay una p\u00e9rdida visible en cartera, margen o expansi\u00f3n."
                }
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-foreground/38">
                {"En esa llamada revisamos"}
              </p>
              <ul className="max-w-[31rem] space-y-3">
                {items.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-accent/45" />
                    <span className="text-[0.92rem] leading-relaxed text-foreground/70">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <p className="max-w-[31rem] border-t border-border/30 pt-6 text-sm text-muted-foreground/60">
              {"Sin compromiso. Sin necesidad de tener todo resuelto de antemano."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pt-4"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-white shadow-2xl shadow-black/[0.06]">
              <div className="h-1 w-full bg-gradient-to-r from-accent/60 via-accent to-accent/60" />

              <div className="space-y-7 p-8 lg:p-10">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-accent/12 bg-accent/8 px-3 py-1.5 text-[11px] font-semibold text-accent">
                    <Clock className="h-3 w-3" />
                    <span>15 min</span>
                    <span className="h-1 w-1 rounded-full bg-accent/55" />
                    <span>Sin costo</span>
                  </div>

                  <h3 className="max-w-[24rem] text-[1.5rem] font-semibold leading-tight tracking-tight text-foreground">
                    {"Eleg\u00ed el camino m\u00e1s \u00fatil para tu caso"}
                  </h3>

                  <p className="max-w-[26rem] text-[0.9rem] leading-relaxed text-muted-foreground">
                    {
                      "Si todav\u00eda necesit\u00e1s una lectura inicial, empez\u00e1 por diagn\u00f3stico. Si ya definiste objetivo, fuentes y alcance, pod\u00e9s pasar directo a cotizaci\u00f3n."
                    }
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.55rem] border border-accent/18 bg-accent/[0.05] p-5 shadow-[0_16px_40px_rgba(122,92,255,0.06)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent/58">
                      Principal
                    </p>
                    <p className="mt-2 text-[1.02rem] font-semibold text-foreground">
                      {"Diagn\u00f3stico inicial"}
                    </p>
                    <p className="mt-2 max-w-[24rem] text-[0.9rem] leading-relaxed text-muted-foreground">
                      {
                        "Ideal si todav\u00eda necesit\u00e1s ordenar el problema, validar prioridad o entender si hoy conviene construir algo."
                      }
                    </p>
                    <a
                      href={CALENDLY_URL}
                      onClick={() => {
                        trackDiagnosisClick("entry_offer_primary");
                        trackCalendlyClick("entry_offer_primary");
                      }}
                      className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20"
                    >
                      {"Agendar diagn\u00f3stico"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                  </div>

                  <div className="rounded-[1.55rem] border border-border/55 bg-[#FBFBFA] p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/38">
                      Secundario
                    </p>
                    <p className="mt-2 text-[1.02rem] font-semibold text-foreground">
                      {"Cotizaci\u00f3n directa"}
                    </p>
                    <p className="mt-2 max-w-[24rem] text-[0.9rem] leading-relaxed text-muted-foreground">
                      {
                        "Mejor si ya definiste objetivo, fuentes, usuarios y el tipo de soluci\u00f3n que quer\u00e9s evaluar."
                      }
                    </p>
                    <Link
                      to={QUOTE_PAGE_HREF}
                      onClick={() => trackQuoteClick("entry_offer_secondary")}
                      className="group mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-white px-6 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-accent/35 hover:bg-accent/5 hover:text-accent"
                    >
                      {"Completar brief"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                <p className="border-t border-border/30 pt-4 text-[11px] text-muted-foreground/55">
                  {"\u00bfPrefer\u00eds un contacto m\u00e1s simple primero? Pod\u00e9s "}
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent transition-colors hover:text-accent/75"
                  >
                    {"escribirme por LinkedIn"}
                  </a>
                  {"."}
                </p>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-5 text-center text-[11px] font-medium text-muted-foreground/45"
            >
              {"Sin presentaci\u00f3n comercial. Sin vueltas."}
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
