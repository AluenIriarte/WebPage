import { motion } from "motion/react";

export function StatInterstitial() {
  return (
    <div className="relative bg-[#faf9ff] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/15 to-transparent" />

      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 lg:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block text-8xl leading-none text-accent/10 font-serif -mb-4 select-none" aria-hidden="true">
            "
          </span>

          <p className="text-xl md:text-2xl lg:text-[2rem] font-medium text-foreground leading-[1.35] tracking-tight">
            Una mejora del <span className="text-accent">5% en retencion</span> puede aumentar las
            ganancias <span className="text-accent">entre 25% y 95%.</span>
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-7 flex items-center justify-center gap-3"
          >
            <div className="h-px w-10 bg-accent/20 rounded-full" />
            <span className="text-[0.68rem] font-semibold text-muted-foreground/40 tracking-[0.14em] uppercase">
              Harvard Business Review · Bain & Company
            </span>
            <div className="h-px w-10 bg-accent/20 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
