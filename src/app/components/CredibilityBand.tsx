import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

const stats = [
  { value: "+3 años", label: "de experiencia aplicada" },
  { value: "Global", label: "clientes en múltiples mercados" },
  { value: "B2B", label: "foco en ventas y margen" },
];

export function CredibilityBand() {
  return (
    <section className="relative overflow-hidden bg-white py-8">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-5"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {stats.map((stat, index) => (
              <div key={stat.value} className="flex items-center gap-3">
                {index > 0 && <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />}
                <span className="text-sm font-semibold text-foreground/70">{stat.value}</span>
                <span className="text-sm text-muted-foreground/50">{stat.label}</span>
              </div>
            ))}
          </div>

          <a href="#problema" className="group inline-flex flex-col items-center gap-3 text-center">
            <span className="text-sm font-medium tracking-wide text-muted-foreground/60">
              Ver qué podrías estar perdiendo hoy
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 transition-colors duration-200 group-hover:border-accent/40 group-hover:bg-accent/5"
            >
              <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/50 transition-colors duration-200 group-hover:text-accent" />
            </motion.div>
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
