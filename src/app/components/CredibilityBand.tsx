import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

const tools = [
  { label: "Power BI" },
  { label: "Python" },
  { label: "SQL" },
  { label: "Looker Studio" },
  { label: "Excel / VBA" },
  { label: "dbt" },
  { label: "Tableau" },
  { label: "Pandas" },
];

const stats = [
  { value: "+3 anos", label: "de experiencia aplicada" },
  { value: "Global", label: "clientes en multiples mercados" },
  { value: "B2B", label: "foco en ventas y margen" },
];

export function CredibilityBand() {
  return (
    <section className="relative py-10 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-7"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {stats.map((stat, index) => (
              <div key={stat.value} className="flex items-center gap-3">
                {index > 0 && <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />}
                <span className="text-sm font-semibold text-foreground/70">{stat.value}</span>
                <span className="text-sm text-muted-foreground/50">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {tools.map((tool, index) => (
              <motion.span
                key={tool.label}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-medium bg-muted/60 border border-border/50 text-muted-foreground hover:border-accent/30 hover:text-accent/80 transition-colors duration-200 cursor-default"
              >
                {tool.label}
              </motion.span>
            ))}
          </div>

          <a href="#problema" className="group inline-flex flex-col items-center gap-3 text-center">
            <span className="text-sm font-medium text-muted-foreground/60 tracking-wide">
              Ver que podrias estar perdiendo hoy
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/5 transition-colors duration-200"
            >
              <ArrowDown className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-accent transition-colors duration-200" />
            </motion.div>
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
