import { motion } from "motion/react";
import { Clock, ArrowRight, FileText } from "lucide-react";
import { CALENDLY_URL } from "../lib/contact";

const items = [
  "Dónde puede estar yéndose dinero hoy sin que esté visible",
  "Qué señal conviene mirar primero",
  "Si el problema es de datos, de foco o de lectura comercial",
  "Si tiene sentido construir algo ahora o no",
];

export function EntryOffer() {
  return (
    <section id="contacto" className="relative py-24 lg:py-36 bg-white overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] -z-10 opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-accent/40 rounded-full" />
              <span className="text-[11px] font-semibold text-accent/70 uppercase tracking-[0.14em]">
                Primer paso
              </span>
            </div>

            <div className="space-y-5">
              <h2 className="text-[2rem] md:text-[2.4rem] lg:text-[2.6rem] font-semibold leading-[1.13] tracking-tight text-foreground">
                En 30 minutos podemos saber si tiene sentido trabajar juntos
              </h2>
              <p className="text-[1.05rem] text-muted-foreground leading-[1.75] max-w-md">
                No es una llamada comercial genérica. Es una revisión inicial para ver si hoy hay una
                pérdida visible en cartera, margen o expansión.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-[0.8rem] font-semibold text-foreground/40 uppercase tracking-[0.12em]">
                En esa llamada revisamos
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
                    <div className="w-1 h-1 rounded-full bg-accent/50 flex-shrink-0 mt-2" />
                    <span className="text-[0.9rem] text-foreground/70 leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-muted-foreground/60 border-t border-border/30 pt-6">
              Sin compromiso. Sin necesidad de tener todo resuelto de antemano.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pt-4"
          >
            <div className="relative rounded-3xl border border-border/50 bg-white shadow-2xl shadow-black/[0.06] overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-accent/60 via-accent to-accent/60" />

              <div className="p-8 lg:p-10 space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/8 rounded-full border border-accent/12">
                      <Clock className="w-3 h-3 text-accent" />
                      <span className="text-[11px] font-semibold text-accent">30 min</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground/50 font-medium">Sin costo</span>
                  </div>

                  <h3 className="text-[1.5rem] font-semibold tracking-tight text-foreground leading-tight">
                    Diagnóstico inicial de 30 minutos
                  </h3>

                  <p className="text-[0.9rem] text-muted-foreground leading-relaxed">
                    Salís con una lectura inicial y con un sí o no honesto sobre si vale la pena avanzar.
                  </p>
                </div>

                <div className="h-px bg-border/40" />

                <div className="space-y-3">
                  {[
                    "Entiendo tu contexto y tus datos disponibles",
                    "Te marco la primera señal que conviene mirar",
                    "Te digo si tiene sentido avanzar o no",
                  ].map((step, index) => (
                    <div key={step} className="flex items-start gap-3">
                      <span className="text-[10px] font-bold text-accent/40 mt-0.5 w-4 flex-shrink-0 tabular-nums">
                        0{index + 1}
                      </span>
                      <span className="text-[0.85rem] text-foreground/65 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground/55 border-t border-border/30 pt-4">
                  Ideal para: quien hoy decide o lidera lo comercial.
                </p>

                <div className="space-y-3 pt-1">
                  <a
                    href={CALENDLY_URL}
                    className="group inline-flex items-center justify-center w-full gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium text-base hover:bg-foreground/90 transition-all duration-300 hover:shadow-xl"
                  >
                    Agendar diagnóstico
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>

                  <a
                    href="#recurso"
                    className="inline-flex items-center justify-center w-full gap-1.5 px-8 py-3 text-sm text-muted-foreground hover:text-accent border border-transparent hover:border-accent/15 rounded-full transition-all duration-200"
                  >
                    <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                    Preferís revisar primero por tu cuenta? Descargá la guía →
                  </a>
                </div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center text-[11px] text-muted-foreground/45 mt-5 font-medium"
            >
              Sin presentación comercial. Sin vueltas.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
