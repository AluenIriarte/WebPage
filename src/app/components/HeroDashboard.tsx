import { useCallback, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Period = "weekly" | "monthly" | "quarterly";

const dashboardData: Record<
  Period,
  {
    metrics: { label: string; value: string | number; change: string }[];
    chart: { name: string; ventas: number; margen: number }[];
  }
> = {
  weekly: {
    metrics: [
      { label: "Expansi\u00f3n", value: "$127K", change: "potencial cross-sell" },
      { label: "Rentabilidad", value: "+18%", change: "mejora de margen" },
    ],
    chart: [
      { name: "L", ventas: 42, margen: 28 },
      { name: "M", ventas: 58, margen: 41 },
      { name: "X", ventas: 35, margen: 22 },
      { name: "J", ventas: 71, margen: 55 },
      { name: "V", ventas: 63, margen: 48 },
      { name: "S", ventas: 28, margen: 18 },
      { name: "D", ventas: 19, margen: 12 },
    ],
  },
  monthly: {
    metrics: [
      { label: "Expansi\u00f3n", value: "$348K", change: "potencial cross-sell" },
      { label: "Rentabilidad", value: "+22%", change: "mejora de margen" },
    ],
    chart: [
      { name: "S1", ventas: 180, margen: 125 },
      { name: "S2", ventas: 220, margen: 158 },
      { name: "S3", ventas: 195, margen: 140 },
      { name: "S4", ventas: 260, margen: 190 },
    ],
  },
  quarterly: {
    metrics: [
      { label: "Expansi\u00f3n", value: "$890K", change: "potencial cross-sell" },
      { label: "Rentabilidad", value: "+31%", change: "mejora de margen" },
    ],
    chart: [
      { name: "Ene", ventas: 520, margen: 380 },
      { name: "Feb", ventas: 680, margen: 490 },
      { name: "Mar", ventas: 740, margen: 560 },
    ],
  },
};

function AnimatedValue({ value }: { value: string | number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={String(value)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[120px] rounded-xl border border-border bg-white p-3 text-xs shadow-xl">
      <p className="mb-2 font-semibold text-foreground">{label}</p>
      {payload.map((entry, index) => (
        <div key={`${entry.name}-${index}`} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
            <span className="capitalize text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-semibold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

interface InteractiveDashboardProps {
  variant?: "mini" | "full";
}

export function InteractiveDashboard({ variant = "full" }: InteractiveDashboardProps) {
  const [period, setPeriod] = useState<Period>("monthly");
  const data = dashboardData[period];
  const uid = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const isMini = variant === "mini";

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [2.5, -2.5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-3, 3]);
  const glowX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(springY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const periods: Period[] = ["weekly", "monthly", "quarterly"];
  const periodLabels: Record<Period, string> = {
    weekly: "Semana",
    monthly: "Mes",
    quarterly: "Q1 2026",
  };

  const gradientVentas = `${uid}-ventas`;
  const gradientMargen = `${uid}-margen`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1200px" }}
      className="relative"
    >
      <motion.div
        className="absolute inset-0 -z-10 rounded-3xl opacity-40"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(139,92,246,0.35) 0%, transparent 65%)`,
          filter: "blur(20px)",
          transform: "translateY(12px) scale(0.95)",
        }}
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-2xl"
      >
        <div className="border-b border-border/40 px-5 pb-4 pt-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              {isMini ? (
                <>
                  <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent/70">
                    Dashboard interactivo
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">Mini demo</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">Se\u00f1ales comerciales activas</p>
                </>
              ) : (
                <>
                  <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Demo ejecutiva
                  </p>
                  <h3 className="text-sm font-semibold text-foreground">Visibilidad comercial activa</h3>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                className="h-2 w-2 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              />
              <span className="text-[10px] font-medium text-muted-foreground">En vivo</span>
            </div>
          </div>

          <div className="flex gap-1 rounded-lg bg-muted/70 p-1">
            {periods.map((currentPeriod) => (
              <button
                key={currentPeriod}
                onClick={() => setPeriod(currentPeriod)}
                className={`relative flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors duration-150 ${
                  period === currentPeriod
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {period === currentPeriod && (
                  <motion.div
                    layoutId="period-pill"
                    className="absolute inset-0 rounded-md bg-white shadow-sm"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{periodLabels[currentPeriod]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-2 pb-1 pt-4">
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={data.chart} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientVentas} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id={gradientMargen} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9, fill: "#9ca3af", fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#8B5CF6",
                    strokeWidth: 1,
                    strokeDasharray: "4 2",
                    strokeOpacity: 0.5,
                  }}
                />
                <Area
                  key="area-ventas"
                  type="monotone"
                  dataKey="ventas"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fill={`url(#${gradientVentas})`}
                  dot={false}
                  activeDot={{ r: 3.5, fill: "#8B5CF6", strokeWidth: 2, stroke: "#fff" }}
                  animationDuration={700}
                  animationEasing="ease-out"
                />
                <Area
                  key="area-margen"
                  type="monotone"
                  dataKey="margen"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill={`url(#${gradientMargen})`}
                  dot={false}
                  activeDot={{ r: 3.5, fill: "#06b6d4", strokeWidth: 2, stroke: "#fff" }}
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-4 px-3 pb-2">
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-4 rounded-full bg-[#8B5CF6]" />
              <span className="text-[9px] font-medium text-muted-foreground">Ventas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-4 rounded-full bg-cyan-500" />
              <span className="text-[9px] font-medium text-muted-foreground">Margen</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4 pb-5">
          {data.metrics.map((metric, index) => (
            <motion.div
              key={`${period}-kpi-${index}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.06, duration: 0.3, ease: "easeOut" }}
              className="rounded-xl border border-border/30 bg-muted/50 p-3.5"
            >
              <p className="mb-1.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                {metric.label}
              </p>
              <div className="mb-0.5 text-base font-bold text-foreground">
                <AnimatedValue value={metric.value} />
              </div>
              <span className="text-[9px] font-semibold text-emerald-600">{metric.change}</span>
            </motion.div>
          ))}
        </div>

        {isMini && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.35, ease: "easeOut" }}
            className="px-4 pb-5"
          >
            <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <span className="text-xs font-semibold text-amber-700">Riesgo detectado</span>
                </div>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                  Urgente
                </span>
              </div>
              <p className="text-3xl font-semibold tracking-tight text-foreground">12 cuentas</p>
              <p className="mt-1 text-[11px] text-muted-foreground">sin actividad en +90 d\u00edas</p>
              <div className="mt-3 flex gap-1">
                {[1, 1, 1, 1, 1, 0, 0].map((filled, index) => (
                  <motion.div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full ${filled ? "bg-amber-400" : "bg-muted"}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.35 + index * 0.06, duration: 0.2 }}
                    style={{ transformOrigin: "left" }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {!isMini && (
        <motion.div
          initial={{ opacity: 0, x: 20, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -bottom-6 -right-8 hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-52 rounded-2xl border border-amber-100 bg-white p-3.5 shadow-xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <span className="text-[11px] font-semibold text-amber-700">Riesgo detectado</span>
              </div>
              <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-500">
                Urgente
              </span>
            </div>
            <p className="text-xl font-bold text-foreground">12 cuentas</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">sin actividad en +90 d\u00edas</p>
            <div className="mt-2.5 flex gap-1">
              {[1, 1, 1, 1, 1, 0, 0].map((filled, index) => (
                <motion.div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${filled ? "bg-amber-400" : "bg-muted"}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.3 + index * 0.08, duration: 0.25 }}
                  style={{ transformOrigin: "left" }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
