import { motion } from "motion/react";
import { ArrowRight, Layers3, TrendingDown, Users } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DEMO_PAGE_HREF,
  QUOTE_PAGE_HREF,
  SERVICES_PAGE_HREF,
} from "../lib/contact";

const miniCases = [
  {
    icon: Users,
    title: "Cartera que se enfría",
    situation:
      "La facturación todavía no alarmó, pero una parte de la base ya compra menos o dejó de activarse.",
    visibility:
      "Se vuelve visible qué cuentas entraron en riesgo, cuánto representan y a quién conviene activar primero.",
    action: "Priorizar recuperación y seguimiento antes de que la caída se consolide.",
  },
  {
    icon: TrendingDown,
    title: "Margen que cede sin ruido",
    situation:
      "El volumen se sostiene, pero ciertas líneas, categorías o descuentos empiezan a erosionar rentabilidad.",
    visibility:
      "Aparece dónde se está perdiendo valor y qué mix o canal está empujando el deterioro.",
    action: "Corregir foco comercial, precio o mix antes de seguir escalando lo menos rentable.",
  },
  {
    icon: Layers3,
    title: "Expansión que no se captura",
    situation:
      "Hay clientes, segmentos o combinaciones de productos con espacio para crecer, pero hoy nadie los prioriza.",
    visibility:
      "Se detecta qué cruces tienen potencial real y qué cuentas conviene trabajar primero.",
    action: "Activar oportunidades de cross-sell o up-sell con criterio, no por intuición.",
  },
];

export function MiniCasesSection() {
  return (
    <section id="mini-casos" className="bg-[#FAFAF8] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent/60">
            Mini-casos
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Cómo se traduce esto cuando <span className="text-accent">aterriza en decisiones reales</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Estos no son casos completos ni una propuesta. Son tres lecturas cortas para que veas
            cómo aparece el problema, qué vuelve visible el sistema y qué decisión habilita.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {miniCases.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="flex h-full flex-col rounded-3xl border border-border/50 bg-white p-7 shadow-sm shadow-black/[0.03]"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                  <item.icon className="h-4.5 w-4.5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{item.title}</h3>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-foreground/72">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                    Lo que suele pasar
                  </p>
                  <p>{item.situation}</p>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                    Lo que empieza a verse
                  </p>
                  <p>{item.visibility}</p>
                </div>
                <div className="rounded-2xl bg-accent/5 p-4">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/70">
                    La decisión que habilita
                  </p>
                  <p className="text-foreground/80">{item.action}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row sm:items-center"
        >
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Si querés verlo más claro, el siguiente paso lógico es una demo curada o la página de
            servicios. Si ya venís con intención alta, podés pedir presupuesto directo.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={DEMO_PAGE_HREF}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent"
            >
              Ver demo completa
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={QUOTE_PAGE_HREF}
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
            >
              Pedir presupuesto
            </Link>
          </div>
        </motion.div>

        <div className="mt-5">
          <Link
            to={SERVICES_PAGE_HREF}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            Prefiero ver servicios primero
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
