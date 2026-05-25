import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Users, TrendingDown, Layers } from "lucide-react";

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const width = 56;
  const height = 22;
  const step = width / (points.length - 1);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const path = points
    .map((point, index) => {
      const x = index * step;
      const y = height - 2 - ((point - min) / range) * (height - 4);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <path d={path} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface MetricRowProps {
  label: string;
  value: string;
  direction: "up" | "down";
  fill: number;
  barColor: string;
  valueColor: string;
  sparkPoints: number[];
  sparkColor: string;
  delay: number;
  animate: boolean;
}

function MetricRow({
  label,
  value,
  direction,
  fill,
  barColor,
  valueColor,
  sparkPoints,
  sparkColor,
  delay,
  animate,
}: MetricRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={animate ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <Sparkline points={sparkPoints} color={sparkColor} />
          <span className={`text-[13px] font-bold ${valueColor}`}>{value}</span>
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted/60">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          initial={{ width: direction === "up" ? "0%" : "100%" }}
          animate={animate ? { width: `${fill}%` } : { width: direction === "up" ? "0%" : "100%" }}
          transition={{ duration: 1, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

const signals = [
  {
    icon: Users,
    title: "Clientes que se enfrían",
    body: "Cuentas que compraban con frecuencia y pasan semanas sin actividad ni seguimiento.",
  },
  {
    icon: TrendingDown,
    title: "Margen que se erosiona",
    body: "El volumen sigue, pero la rentabilidad cae por mix, descuentos o clientes menos rentables.",
  },
  {
    icon: Layers,
    title: "Foco comercial disperso",
    body: "Hay oportunidades por cliente, producto o zona que nadie está priorizando a tiempo.",
  },
];

export function UnifiedProblem() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="problema" className="relative overflow-hidden bg-white py-20 lg:py-36">
      <div
        className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-8 rounded-full bg-accent/40" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/70">
                El problema real
              </span>
            </div>

            <div className="space-y-5">
              <h2 className="text-[2rem] font-semibold leading-[1.13] tracking-tight text-foreground md:text-[2.4rem] lg:text-[2.6rem]">
                La facturación puede subir mientras el negocio <span className="text-accent">pierde calidad</span>
              </h2>
              <p className="max-w-md text-[1.05rem] leading-[1.75] text-muted-foreground">
                El deterioro comercial no siempre aparece como una caída inmediata en ventas. Muchas veces
                empieza antes: clientes menos activos, margen más chico, vendedores desviados y
                oportunidades que nadie activa a tiempo.
              </p>
              <p className="text-sm font-medium text-foreground/60">Eso no suele explotar de golpe. Se acumula.</p>
            </div>

            <div className="space-y-6 pt-2">
              {signals.map((signal, index) => (
                <motion.div
                  key={signal.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.55, delay: 0.25 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-4"
                >
                  <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent/8">
                    <signal.icon className="h-[18px] w-[18px] text-accent" />
                  </div>
                  <div>
                    <p className="mb-1 text-[0.95rem] font-semibold text-foreground">{signal.title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{signal.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="border-t border-border/40 pt-2"
            >
              <a
                href="#como-funciona"
                className="group inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-200 hover:text-accent/75"
              >
                Ver cómo lo llevamos a la operación
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:pt-4"
          >
            <div
              className="absolute -inset-6 -z-10 rounded-3xl opacity-20 blur-2xl"
              style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.25) 0%, transparent 70%)" }}
            />

            <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-xl shadow-black/[0.05]">
              <div className="border-b border-border/40 px-6 pt-6 pb-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Panorama actual · últimos 6 meses
                </p>
              </div>

              <div className="space-y-6 px-6 py-6">
                <MetricRow
                  label="Ventas totales"
                  value="+6%"
                  direction="up"
                  fill={72}
                  barColor="#8B5CF6"
                  valueColor="text-violet-600"
                  sparkPoints={[55, 58, 60, 62, 66, 68, 72]}
                  sparkColor="#8B5CF6"
                  delay={0.3}
                  animate={isInView}
                />
                <MetricRow
                  label="Base activa de clientes"
                  value="-12%"
                  direction="down"
                  fill={42}
                  barColor="#F43F5E"
                  valueColor="text-rose-500"
                  sparkPoints={[88, 84, 79, 73, 65, 58, 50]}
                  sparkColor="#F43F5E"
                  delay={0.42}
                  animate={isInView}
                />
                <MetricRow
                  label="Margen promedio"
                  value="-4 pts"
                  direction="down"
                  fill={34}
                  barColor="#F59E0B"
                  valueColor="text-amber-600"
                  sparkPoints={[48, 46, 44, 41, 39, 37, 34]}
                  sparkColor="#F59E0B"
                  delay={0.54}
                  animate={isInView}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.55, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="mx-4 mb-4 flex items-start gap-3 rounded-xl border border-amber-200/60 bg-amber-50/80 px-4 py-3"
              >
                <span className="relative mt-[5px] flex-shrink-0">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold leading-tight text-amber-800">Falso positivo comercial</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-amber-700/80">
                    Vendés más, pero con menos clientes activos y menor margen.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
