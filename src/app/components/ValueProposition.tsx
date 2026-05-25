import { motion } from "motion/react";
import { Lock, Lightbulb } from "lucide-react";

const steps = [
  {
    n: "1",
    title: "Diagnóstico comercial",
    body: "Revisamos cómo seguís hoy ventas, vendedores, cartera, margen y oportunidades.",
    outcome: "Salida: mapa de prioridades y problemas visibles.",
  },
  {
    n: "2",
    title: "Tablero accionable",
    body: "Diseñamos vistas ejecutivas y operativas para detectar desvíos, riesgos y oportunidades.",
    outcome: "Salida: dashboard comercial usable, no reporte decorativo.",
  },
  {
    n: "3",
    title: "Adopción en la operación",
    body: "Integramos el tablero a reuniones, seguimiento y decisiones comerciales.",
    outcome: "Salida: rutina de gestión con foco claro.",
  },
];

export function ValueProposition() {
  return (
    <section id="como-funciona" className="relative scroll-mt-28 bg-white py-24 lg:py-32">
      <div id="proceso" aria-hidden="true" className="absolute -top-28" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl lg:mb-24"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-8 rounded-full bg-accent/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/70">
              Cómo funciona
            </span>
          </div>
          <h2 className="mb-5 text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
            No empiezo por dashboards. <span className="text-accent">Empiezo por decisiones.</span>
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Primero entendemos qué decisiones comerciales necesitás mejorar. Después ordenamos los datos
            disponibles y construimos una capa de visibilidad que pueda usarse en reuniones, seguimiento
            y gestión real.
          </p>
        </motion.div>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-border/30 bg-border/30 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col gap-6 bg-white p-8 transition-colors duration-300 hover:bg-accent/[0.02] lg:p-12"
            >
              <span
                className="select-none text-[4.5rem] font-bold leading-none tracking-tight"
                style={{ color: "rgba(139,92,246,0.18)" }}
                aria-hidden="true"
              >
                {step.n}
              </span>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">{step.body}</p>
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
          className="mt-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-3.5 py-2">
              <Lock className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Manejo confidencial de la información</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-3.5 py-2">
              <Lightbulb className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Implementación pensada para facilitar adopción</span>
            </div>
          </div>

          <a
            href="#contacto"
            className="group inline-flex flex-shrink-0 items-center gap-2 text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent/75"
          >
            Conocer el proceso completo
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
