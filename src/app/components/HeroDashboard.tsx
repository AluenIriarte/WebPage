import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, ArrowUpRight, Target, TrendingDown, Users, type LucideIcon } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Period = "weekly" | "monthly" | "quarterly";

type SignalMetric = {
  label: string;
  value: string;
  valueSuffix?: string;
  detail: string;
  tone: "rose" | "violet" | "amber" | "emerald";
  icon: LucideIcon;
};

const dashboardData: Record<
  Period,
  {
    metrics: SignalMetric[];
    chart: { name: string; ventas: number; margen: number; senales: number }[];
  }
> = {
  weekly: {
    metrics: [
      {
        label: "Clientes en riesgo",
        value: "4",
        valueSuffix: "cuentas",
        detail: "sin actividad por más de 90 días",
        tone: "rose",
        icon: Users,
      },
      {
        label: "Vendedores bajo objetivo",
        value: "1",
        valueSuffix: "zona",
        detail: "desvío crítico",
        tone: "violet",
        icon: Target,
      },
      {
        label: "Margen erosionado",
        value: "-1.2",
        valueSuffix: "pts",
        detail: "vs semana anterior",
        tone: "amber",
        icon: TrendingDown,
      },
      {
        label: "Expansión",
        value: "$126K",
        detail: "potencial cross-sell",
        tone: "emerald",
        icon: ArrowUpRight,
      },
    ],
    chart: [
      { name: "L", ventas: 58, margen: 33, senales: 3 },
      { name: "M", ventas: 62, margen: 34, senales: 4 },
      { name: "X", ventas: 56, margen: 31, senales: 4 },
      { name: "J", ventas: 69, margen: 35, senales: 5 },
      { name: "V", ventas: 72, margen: 34, senales: 4 },
      { name: "S", ventas: 61, margen: 30, senales: 3 },
      { name: "D", ventas: 54, margen: 28, senales: 2 },
    ],
  },
  monthly: {
    metrics: [
      {
        label: "Clientes en riesgo",
        value: "9",
        valueSuffix: "cuentas",
        detail: "sin actividad por más de 90 días",
        tone: "rose",
        icon: Users,
      },
      {
        label: "Vendedores bajo objetivo",
        value: "2",
        valueSuffix: "zonas",
        detail: "desvío crítico",
        tone: "violet",
        icon: Target,
      },
      {
        label: "Margen erosionado",
        value: "-2.8",
        valueSuffix: "pts",
        detail: "vs mes anterior",
        tone: "amber",
        icon: TrendingDown,
      },
      {
        label: "Expansión",
        value: "$410K",
        detail: "potencial cross-sell",
        tone: "emerald",
        icon: ArrowUpRight,
      },
    ],
    chart: [
      { name: "S1", ventas: 64, margen: 35, senales: 3 },
      { name: "S2", ventas: 71, margen: 34, senales: 4 },
      { name: "S3", ventas: 68, margen: 32, senales: 5 },
      { name: "S4", ventas: 76, margen: 31, senales: 5 },
    ],
  },
  quarterly: {
    metrics: [
      {
        label: "Clientes en riesgo",
        value: "12",
        valueSuffix: "cuentas",
        detail: "sin actividad por más de 90 días",
        tone: "rose",
        icon: Users,
      },
      {
        label: "Vendedores bajo objetivo",
        value: "3",
        valueSuffix: "zonas",
        detail: "desvío crítico",
        tone: "violet",
        icon: Target,
      },
      {
        label: "Margen erosionado",
        value: "-4",
        valueSuffix: "pts",
        detail: "vs trimestre anterior",
        tone: "amber",
        icon: TrendingDown,
      },
      {
        label: "Expansión",
        value: "$890K",
        detail: "potencial cross-sell",
        tone: "emerald",
        icon: ArrowUpRight,
      },
    ],
    chart: [
      { name: "Ene", ventas: 66, margen: 36, senales: 4 },
      { name: "Feb", ventas: 74, margen: 33, senales: 5 },
      { name: "Mar", ventas: 82, margen: 32, senales: 7 },
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

const toneStyles: Record<SignalMetric["tone"], { icon: string; value: string; detail: string; card: string }> = {
  rose: {
    icon: "bg-rose-50 text-rose-600",
    value: "text-rose-600",
    detail: "text-rose-700/75",
    card: "border-rose-100 bg-rose-50/55",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    value: "text-violet-600",
    detail: "text-violet-700/75",
    card: "border-violet-100 bg-violet-50/55",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    value: "text-amber-600",
    detail: "text-amber-700/75",
    card: "border-amber-100 bg-amber-50/55",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    value: "text-emerald-600",
    detail: "text-emerald-700/75",
    card: "border-emerald-100 bg-emerald-50/55",
  },
};

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
    <div className="min-w-[132px] rounded-xl border border-border bg-white p-3 text-xs shadow-xl">
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

function SignalMetricCard({
  card,
  index,
  animated,
}: {
  card: SignalMetric;
  index: number;
  animated: boolean;
}) {
  const styles = toneStyles[card.tone];
  const Icon = card.icon;

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 14 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={animated ? { delay: index * 0.07, duration: 0.3, ease: "easeOut" } : undefined}
      className={`rounded-2xl border p-3.5 sm:p-4 ${styles.card}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles.icon}`}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <p className="text-[10px] font-semibold uppercase leading-snug tracking-[0.09em] text-foreground/55 sm:text-[11px] sm:tracking-[0.14em]">
          {card.label}
        </p>
      </div>

      <div className={`flex items-end gap-1 ${styles.value}`}>
        <div className="text-[1.95rem] font-semibold leading-none tracking-tight sm:text-[1.55rem]">
          <AnimatedValue value={card.value} animated={animated} />
        </div>
        {card.valueSuffix ? (
          <span className="pb-0.5 text-[0.95rem] font-medium sm:text-[0.88rem]">{card.valueSuffix}</span>
        ) : null}
      </div>

      <p className={`mt-1 text-[11px] leading-relaxed ${styles.detail}`}>{card.detail}</p>
    </motion.div>
  );
}

interface InteractiveDashboardProps {
  variant?: "mini" | "full";
  fillHeight?: boolean;
  animated?: boolean;
}

export function InteractiveDashboard({
  variant = "full",
  fillHeight = false,
  animated = true,
}: InteractiveDashboardProps) {
  const [period, setPeriod] = useState<Period>("quarterly");
  const data = dashboardData[period];
  const uid = useId().replace(/:/g, "");
  const isMini = variant === "mini";
  const chartHeight = isMini ? 172 : 196;

  const periods: Period[] = ["weekly", "monthly", "quarterly"];
  const periodLabels: Record<Period, string> = {
    weekly: "Semana",
    monthly: "Mes",
    quarterly: "Q1 2026",
  };

  const gradientVentas = `${uid}-ventas`;

  return (
    <div className={`relative ${fillHeight ? "h-full" : ""}`}>
      <motion.div
        className={`overflow-hidden rounded-2xl border border-border/60 bg-white ${
          isMini ? "shadow-2xl" : "shadow-[0_18px_44px_rgba(20,19,26,0.06)]"
        } ${fillHeight ? "flex h-full flex-col" : ""}`}
      >
        <div className={`border-b border-border/40 ${isMini ? "px-5 pb-4 pt-5" : "px-6 pb-5 pt-6"}`}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent/70">
                Dashboard interactivo
              </p>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Mini demo</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">Señales comerciales activas</p>
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

        <div className={`grid gap-3 ${isMini ? "grid-cols-2 px-4 pb-4 pt-4" : "px-6 pb-6 pt-5 md:grid-cols-4"}`}>
          {data.metrics.map((card, index) => (
            <SignalMetricCard key={`${period}-${card.label}`} card={card} index={index} animated={animated} />
          ))}
        </div>

        <div className={isMini ? "px-3 pb-4 pt-2" : "px-4 pb-2 pt-5"}>
          <div className={`${isMini ? "px-3 pb-3" : "px-2 pb-3"} flex items-center justify-between`}>
            <p className="text-[11px] font-semibold text-foreground/72">Evolución de ventas y margen</p>
            <span className="rounded-full border border-border/60 bg-white px-3 py-1 text-[10px] font-medium text-muted-foreground">
              {periodLabels[period]}
            </span>
          </div>

          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <ComposedChart data={data.chart} margin={{ top: 8, right: 10, left: -18, bottom: 4 }}>
                <defs>
                  <linearGradient id={gradientVentas} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="rgba(15,23,42,0.06)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9, fill: "#9ca3af", fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  minTickGap={8}
                />
                <YAxis
                  yAxisId="performance"
                  domain={[0, 90]}
                  tick={{ fontSize: 9, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <YAxis yAxisId="signals" orientation="right" hide domain={[0, 8]} />
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
                  yAxisId="performance"
                  stroke="#8B5CF6"
                  strokeWidth={2.25}
                  fill={`url(#${gradientVentas})`}
                  dot={false}
                  activeDot={{ r: 3.5, fill: "#8B5CF6", strokeWidth: 2, stroke: "#fff" }}
                  isAnimationActive={animated}
                  animationDuration={animated ? 700 : 0}
                  animationEasing="ease-out"
                />
                <Line
                  key="line-margen"
                  type="monotone"
                  dataKey="margen"
                  yAxisId="performance"
                  stroke="#F59E0B"
                  strokeWidth={2.35}
                  dot={{ r: 2.75, fill: "#F59E0B", strokeWidth: 0 }}
                  activeDot={{ r: 3.5, fill: "#F59E0B", strokeWidth: 2, stroke: "#fff" }}
                  isAnimationActive={animated}
                  animationDuration={animated ? 700 : 0}
                  animationEasing="ease-out"
                />
                <Line
                  key="line-senales"
                  type="monotone"
                  dataKey="senales"
                  yAxisId="signals"
                  stroke="#FB7185"
                  strokeWidth={2.35}
                  dot={{ r: 2.75, fill: "#FB7185", strokeWidth: 0 }}
                  activeDot={{ r: 4, fill: "#FB7185", strokeWidth: 2, stroke: "#fff" }}
                  isAnimationActive={animated}
                  animationDuration={animated ? 700 : 0}
                  animationEasing="ease-out"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className={`${isMini ? "px-3 pb-1 pt-2" : "px-2 pb-3"} flex flex-wrap gap-x-4 gap-y-2`}>
            <div className="flex items-center gap-1.5">
              <div className="h-[2px] w-4 rounded-full bg-[#8B5CF6]" />
              <span className="text-[9px] font-medium text-muted-foreground">Ventas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-[2px] w-4 rounded-full bg-amber-500" />
              <span className="text-[9px] font-medium text-muted-foreground">Margen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-[2px] w-4 rounded-full bg-rose-400" />
              <span className="text-[9px] font-medium text-muted-foreground">Señales activas</span>
            </div>
          </div>
        </div>

        <div className="px-4 pb-5">
          <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-[#FCFBFE] px-4 py-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-accent/8">
              <AlertTriangle className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55">
                Lectura actual
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                Las ventas sostienen el trimestre, pero suben las alertas y el margen se comprime.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
