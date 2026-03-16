import { motion } from "motion/react";
import { Users, TrendingUp, ShoppingCart, BarChart2, Layers, Clock, ArrowRight } from "lucide-react";

const opportunities = [
  {
    icon: Users,
    title: "Clientes inactivos",
    example: "12 cuentas de alto valor sin compras en los ultimos 90 dias",
    metric: "12 cuentas",
    metricLabel: "recuperables",
    metricColor: "text-violet-600",
  },
  {
    icon: BarChart2,
    title: "Mix volumen / margen",
    example: "Productos con margen superior al 40% sin priorizacion activa",
    metric: "40%+",
    metricLabel: "margen potencial",
    metricColor: "text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Up-sell y cross-sell",
    example: "Clientes comprando categoria A sin exposicion a categoria B",
    metric: "+34%",
    metricLabel: "en margen",
    metricColor: "text-blue-600",
  },
  {
    icon: ShoppingCart,
    title: "Productos subpenetrados",
    example: "Linea nueva con solo 15% de penetracion en clientes top",
    metric: "15%",
    metricLabel: "penetracion actual",
    metricColor: "text-amber-600",
  },
  {
    icon: Layers,
    title: "Afinidad por categoria",
    example: "Segmento X tiene 3x mas afinidad con categoria premium",
    metric: "3x",
    metricLabel: "mayor afinidad",
    metricColor: "text-fuchsia-600",
  },
  {
    icon: Clock,
    title: "Automatizacion operativa",
    example: "8 horas semanales de reporting manual que pueden eliminarse",
    metric: "-8h",
    metricLabel: "por semana",
    metricColor: "text-cyan-600",
  },
];

export function OpportunitiesSection() {
  return (
    <section id="oportunidades" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Que <span className="text-accent">oportunidades reales</span> puede detectar el analisis
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Cada negocio tiene patrones con valor sin explotar. El sistema los vuelve visibles y los
            convierte en prioridades accionables para el equipo comercial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="group relative bg-white rounded-2xl border border-border/50 p-5 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/[0.03] group-hover:to-transparent rounded-2xl transition-all duration-400 pointer-events-none" />

              <div className="relative flex flex-col h-full gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/8 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/15 group-hover:scale-105 transition-all duration-300">
                    <opportunity.icon className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{opportunity.title}</h3>
                </div>

                <div className="pt-3 border-t border-border/30 flex items-end justify-between gap-3 mt-auto">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wide mb-1">
                      Ejemplo detectado
                    </p>
                    <p className="text-xs text-foreground/70 leading-relaxed">{opportunity.example}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xl font-bold ${opportunity.metricColor}`}>{opportunity.metric}</p>
                    <p className="text-[9px] text-muted-foreground font-medium leading-tight">
                      {opportunity.metricLabel}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-border/40"
        >
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Cada una de estas senales puede estar activa en tu negocio hoy, sin que sea visible en los
            reportes habituales.
          </p>
          <a
            href="#proceso"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/75 transition-colors duration-200 group flex-shrink-0"
          >
            Ver como se trabaja
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
