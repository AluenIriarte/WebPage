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
      { label: "Expansión", value: "$127K", change: "potencial cross-sell" },
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
      { label: "Expansión", value: "$348K", change: "potencial cross-sell" },
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
      { label: "Expansión", value: "$890K", change: "potencial cross-sell" },
      { label: "Rentabilidad", value: "+31%", change: "mejora de margen" },
    ],
    chart: [
      { name: "Ene", ventas: 520, margen: 380 },
      { name: "Feb", ventas: 680, margen: 490 },
      { name: "Mar", ventas: 740, margen: 560 },
    ],
  },
};

function AnimatedValue({ value, animated = true }: { value: string | number; animated?: boolean }) {
  if (!animated) {
    return <span>{value}</span>;
  }

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
  fillHeight?: boolean;
  animated?: boolean;
}

function RiskAlertCard({ compact = false, animated = true }: { compact?: boolean; animated?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-amber-100 bg-white ${
        compact ? "p-4 shadow-sm" : "h-full p-4 shadow-[0_18px_36px_rgba(20,19,26,0.08)]"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center rounded-xl bg-amber-50 ${compact ? "h-8 w-8" : "h-9 w-9"}`}>
            <AlertTriangle className={compact ? "h-4 w-4 text-amber-500" : "h-[18px] w-[18px] text-amber-500"} />
          </div>
          <span className={`font-semibold text-amber-700 ${compact ? "text-xs" : "text-[13px]"}`}>Riesgo detectado</span>
        </div>
        <span
          className={`rounded-full bg-amber-50 font-bold text-amber-500 ${
            compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[10px]"
          }`}
        >
          Urgente
        </span>
      </div>
      <p className={compact ? "text-3xl font-semibold tracking-tight text-foreground" : "text-[1.7rem] font-semibold tracking-tight text-foreground"}>
        12 cuentas
      </p>
      <p className={`mt-1 text-muted-foreground ${compact ? "text-[11px]" : "text-xs"}`}>
        sin actividad por mas de 90 dias
      </p>
      <div className="mt-3 flex gap-1">
        {[1, 1, 1, 1, 1, 0, 0].map((filled, index) => (
          <motion.div
            key={index}
            className={`flex-1 rounded-full ${filled ? "bg-amber-400" : "bg-muted"} ${compact ? "h-1.5" : "h-1.5"}`}
            initial={animated ? { scaleX: 0 } : undefined}
            animate={animated ? { scaleX: 1 } : undefined}
            transition={animated ? { delay: 0.35 + index * 0.06, duration: 0.2 } : undefined}
            style={{ transformOrigin: "left" }}
          />
        ))}
      </div>
    </div>
  );
}

export function InteractiveDashboard({
  variant = "full",
  fillHeight = false,
  animated = true,
}: InteractiveDashboardProps) {
  const [period, setPeriod] = useState<Period>("monthly");
  const data = dashboardData[period];
  const uid = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const isMini = variant === "mini";
  const chartHeight = isMini ? 120 : 188;

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
  const chartBlock = (
    <div className={isMini ? "px-2 pb-1 pt-4" : "px-4 pb-2 pt-5"}>
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
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
              isAnimationActive={animated}
              animationDuration={animated ? 700 : 0}
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
              isAnimationActive={animated}
              animationDuration={animated ? 700 : 0}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={`${isMini ? "px-3 pb-2" : "px-2 pb-3"} flex gap-4`}>
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
  );
  const metricsBlock = (
    <div
      className={`grid gap-3 ${
        isMini ? "grid-cols-2 px-4 pb-4 pt-4" : "px-6 pb-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.95fr)]"
      }`}
    >
      {data.metrics.map((metric, index) => (
        <motion.div
          key={`${period}-kpi-${index}`}
          initial={animated ? { opacity: 0, scale: 0.92 } : undefined}
          animate={animated ? { opacity: 1, scale: 1 } : undefined}
          transition={animated ? { delay: index * 0.06, duration: 0.3, ease: "easeOut" } : undefined}
          className={`rounded-xl p-3.5 ${
            isMini ? "border border-border/30 bg-muted/50" : "border border-[#ECE6F2] bg-[#FCFBFE]"
          }`}
        >
          <p className="mb-1.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
            {metric.label}
          </p>
          <div className="mb-0.5 text-base font-bold text-foreground">
            <AnimatedValue value={metric.value} animated={animated} />
          </div>
          <span className="text-[9px] font-semibold text-emerald-600">{metric.change}</span>
        </motion.div>
      ))}

      {!isMini && (
        <motion.div
          key={`${period}-risk`}
          initial={animated ? { opacity: 0, scale: 0.92 } : undefined}
          animate={animated ? { opacity: 1, scale: 1 } : undefined}
          transition={animated ? { delay: 0.16, duration: 0.3, ease: "easeOut" } : undefined}
        >
          <RiskAlertCard animated={animated} />
        </motion.div>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={isMini ? handleMouseMove : undefined}
      onMouseLeave={isMini ? handleMouseLeave : undefined}
      style={isMini ? { perspective: "1200px" } : undefined}
      className={`relative ${fillHeight ? "h-full" : ""}`}
    >
      {isMini && animated && (
        <motion.div
          className="absolute inset-0 -z-10 rounded-3xl opacity-40"
          style={{
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(139,92,246,0.35) 0%, transparent 65%)`,
            filter: "blur(20px)",
            transform: "translateY(12px) scale(0.95)",
          }}
        />
      )}

      <motion.div
        style={isMini && animated ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className={`overflow-hidden rounded-2xl border border-border/60 bg-white ${
          isMini ? "shadow-2xl" : "shadow-[0_18px_44px_rgba(20,19,26,0.06)]"
        } ${fillHeight ? "flex h-full flex-col" : ""}`}
      >
        <div className={`border-b border-border/40 ${isMini ? "px-5 pb-4 pt-5" : "px-6 pb-5 pt-6"}`}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              {isMini ? (
                <>
                  <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent/70">
                    Dashboard interactivo
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">Mini demo</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">Señales comerciales activas</p>
                </>
              ) : (
                <>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                    Dashboard de ventas
                  </p>
                  <h3 className="text-[1.05rem] font-semibold text-foreground">Lectura comercial activa</h3>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                className="h-2 w-2 rounded-full bg-emerald-500"
                animate={animated ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : undefined}
                transition={animated ? { repeat: Infinity, duration: 2.2, ease: "easeInOut" } : undefined}
              />
              <span className="text-[10px] font-medium text-muted-foreground">En vivo</span>
            </div>
          </div>

          <div className={`flex gap-1 rounded-xl ${isMini ? "bg-muted/70" : "bg-[#F7F4FB]"} p-1 ${isMini ? "" : "max-w-xl"}`}>
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
                {period === currentPeriod &&
                  (animated ? (
                    <motion.div
                      layoutId={`${uid}-period-pill`}
                      className="absolute inset-0 rounded-md bg-white shadow-sm"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                    />
                  ) : (
                    <div className="absolute inset-0 rounded-md bg-white shadow-sm" />
                  ))}
                <span className="relative z-10">{periodLabels[currentPeriod]}</span>
              </button>
            ))}
          </div>
        </div>

        {isMini ? (
          <>
            {metricsBlock}
            {chartBlock}
          </>
        ) : (
          <>
            {chartBlock}
            {metricsBlock}
          </>
        )}

        {isMini && (
          <motion.div
            initial={animated ? { opacity: 0, y: 10 } : undefined}
            animate={animated ? { opacity: 1, y: 0 } : undefined}
            transition={animated ? { delay: 0.28, duration: 0.35, ease: "easeOut" } : undefined}
            className="px-4 pb-5"
          >
            <RiskAlertCard compact animated={animated} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
