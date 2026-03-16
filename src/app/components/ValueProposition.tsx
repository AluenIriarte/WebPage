import { motion } from "motion/react";
import { Lock, Lightbulb } from "lucide-react";
import { CALENDLY_URL } from "../lib/contact";

const steps = [
  {
    n: "1",
    title: "Definimos el foco",
    body: "Alineamos qué decisiones comerciales tienen más impacto: cartera en riesgo, margen, expansión o mix.",
    outcome: "Salida: prioridades claras",
  },
  {
    n: "2",
    title: "Construimos la visibilidad",
    body: "Diseño dashboards, alertas y vistas ejecutivas orientadas a esas decisiones, no a acumular gráficos.",
    outcome: "Salida: sistema visible y accionable",
  },
  {
    n: "3",
    title: "Lo llevamos a la operación",
    body: "Dejo la herramienta integrada a reuniones, seguimiento y priorización comercial.",
    outcome: "Salida: uso real, no reporte decorativo",
  },
];

export function ValueProposition() {
  return (
    <section id="proceso" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16 lg:mb-24"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent/40 rounded-full" />
            <span className="text-[11px] font-semibold text-accent/70 uppercase tracking-[0.14em]">
              Cómo funciona
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-5 leading-tight">
            No empiezo por dashboards. <span className="text-accent">Empiezo por decisiones.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Primero definimos qué conviene ver. Después construimos la capa de visibilidad. Por
            último, la integramos a la rutina comercial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-border/30 rounded-3xl overflow-hidden border border-border/30">
          {steps.map((step, index) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 lg:p-12 flex flex-col gap-6 group hover:bg-accent/[0.02] transition-colors duration-300"
            >
              <span
                className="text-[4.5rem] font-bold leading-none tracking-tight select-none"
                style={{ color: "rgba(139,92,246,0.18)" }}
                aria-hidden="true"
              >
                {step.n}
              </span>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{step.body}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/70">
                  {step.outcome}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-muted/50 border border-border/50">
              <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground">Manejo confidencial de la información</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-muted/50 border border-border/50">
              <Lightbulb className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground">
                Implementación pensada para facilitar adopción
              </span>
            </div>
          </div>

          <a
            href={CALENDLY_URL}
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/75 transition-colors duration-200 group flex-shrink-0"
          >
            Agendar diagnóstico
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
