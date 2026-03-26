import { motion } from "motion/react";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CALENDLY_URL, QUOTE_PAGE_HREF } from "../lib/contact";
import { trackCalendlyClick, trackDiagnosisClick, trackQuoteClick } from "../lib/analytics";

const LINKEDIN_URL = "https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true";

const items = [
  "Dónde puede estar yéndose dinero hoy sin que esté visible",
  "Qué señal conviene mirar primero",
  "Si el problema es de datos, de foco o de lectura comercial",
  "Si tiene sentido construir algo ahora o no",
];

export function EntryOffer() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-white py-24 lg:py-36">
      <div
        className="absolute top-0 left-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 opacity-25 blur-3xl pointer-events-none"
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
              <h2 className="text-[2rem] font-semibold leading-[1.13] tracking-tight text-foreground md:text-[2.4rem] lg:text-[2.6rem]">
                {"En 15 minutos podemos saber si tiene sentido trabajar juntos"}
              </h2>
              <p className="max-w-md text-[1.05rem] leading-[1.75] text-muted-foreground">
                {
                  "No es una llamada comercial genérica. Es una revisión inicial para ver si hoy hay una pérdida visible en cartera, margen o expansión."
                }
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-foreground/40">
                {"En esa llamada revisamos"}
              </p>
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-accent/50" />
                    <span className="text-[0.9rem] leading-relaxed text-foreground/70">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <p className="border-t border-border/30 pt-6 text-sm text-muted-foreground/60">
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

              <div className="space-y-8 p-8 lg:p-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/12 bg-accent/8 px-3 py-1.5">
                      <Clock className="h-3 w-3 text-accent" />
                      <span className="text-[11px] font-semibold text-accent">15 min</span>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground/50">Sin costo</span>
                  </div>

                  <h3 className="text-[1.5rem] font-semibold leading-tight tracking-tight text-foreground">
                    {"Elegí cómo querés avanzar"}
                  </h3>

                  <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                    {
                      "Si necesitás una lectura inicial, el camino natural es diagnóstico. Si ya tenés el alcance bastante claro, podés pasar directo a cotización."
                    }
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-accent/18 bg-accent/[0.05] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent/70">
                      Principal
                    </p>
                    <p className="mt-2 text-base font-semibold text-foreground">
                      {"Solicitar diagnóstico"}
                    </p>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
                      {
                        "Ideal si todavía necesitás ordenar el problema, validar prioridad o entender si hoy conviene construir algo."
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
                      {"Solicitar diagnóstico"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                  </div>

                  <div className="rounded-[1.5rem] border border-border/60 bg-white p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/55">
                      Secundario
                    </p>
                    <p className="mt-2 text-base font-semibold text-foreground">
                      {"Solicitar cotización"}
                    </p>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
                      {
                        "Mejor si ya definiste objetivo, fuentes, usuarios y el tipo de solución que querés evaluar."
                      }
                    </p>
                    <Link
                      to={QUOTE_PAGE_HREF}
                      onClick={() => trackQuoteClick("entry_offer_secondary")}
                      className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white px-8 py-4 text-base font-medium text-foreground transition-all duration-300 hover:border-accent/35 hover:bg-accent/5 hover:text-accent"
                    >
                      {"Solicitar cotización"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                <p className="border-t border-border/30 pt-4 text-[11px] text-muted-foreground/55">
                  {"Si preferís un contacto más simple primero, también podés "}
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
              {"Sin presentación comercial. Sin vueltas."}
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
