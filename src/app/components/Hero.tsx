import { useCallback, useId, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { ArrowRight, BarChart3, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

type Period = "weekly" | "monthly" | "quarterly";

const dashboardData: Record<
  Period,
  {
    label: string;
    metrics: { label: string; value: string | number; change: string; up: boolean }[];
    chart: { name: string; ventas: number; margen: number }[];
  }
> = {
  weekly: {
    label: "Esta semana",
    metrics: [
      { label: "Expansion", value: "$127K", change: "potencial cross-sell", up: true },
      { label: "Rentabilidad", value: "+18%", change: "mejora de margen", up: true },
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
    label: "Este mes",
    metrics: [
      { label: "Expansion", value: "$348K", change: "potencial cross-sell", up: true },
      { label: "Rentabilidad", value: "+22%", change: "mejora de margen", up: true },
    ],
    chart: [
      { name: "S1", ventas: 180, margen: 125 },
      { name: "S2", ventas: 220, margen: 158 },
      { name: "S3", ventas: 195, margen: 140 },
      { name: "S4", ventas: 260, margen: 190 },
    ],
  },
  quarterly: {
    label: "Q1 2026",
    metrics: [
      { label: "Expansion", value: "$890K", change: "potencial cross-sell", up: true },
      { label: "Rentabilidad", value: "+31%", change: "mejora de margen", up: true },
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
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-border shadow-xl rounded-xl p-3 text-xs min-w-[120px]">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
              <span className="text-muted-foreground capitalize">{entry.name}</span>
            </div>
            <span className="font-semibold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

function InteractiveDashboard() {
  const [period, setPeriod] = useState<Period>("monthly");
  const data = dashboardData[period];
  const uid = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);

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
        className="bg-white rounded-2xl shadow-2xl border border-border/60 overflow-hidden"
      >
        <div className="px-5 pt-5 pb-4 border-b border-border/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">
                Sistema de decision
              </p>
              <h3 className="text-sm font-semibold text-foreground">Diagnostico comercial activo</h3>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              />
              <span className="text-[10px] text-muted-foreground font-medium">En vivo</span>
            </div>
          </div>

          <div className="flex gap-1 bg-muted/70 rounded-lg p-1">
            {periods.map((currentPeriod) => (
              <button
                key={currentPeriod}
                onClick={() => setPeriod(currentPeriod)}
                className={`relative flex-1 text-[11px] py-1.5 px-2 rounded-md font-medium transition-colors duration-150 ${
                  period === currentPeriod
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {period === currentPeriod && (
                  <motion.div
                    layoutId="period-pill"
                    className="absolute inset-0 bg-white rounded-md shadow-sm"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{periodLabels[currentPeriod]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-2 pt-4 pb-1">
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
              <div className="w-4 h-0.5 bg-[#8B5CF6] rounded-full" />
              <span className="text-[9px] font-medium text-muted-foreground">Ventas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-cyan-500 rounded-full" />
              <span className="text-[9px] font-medium text-muted-foreground">Margen</span>
            </div>
          </div>
        </div>

        <div className="px-4 pb-5 grid grid-cols-2 gap-3">
          {data.metrics.map((metric, index) => (
            <motion.div
              key={`${period}-kpi-${index}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.06, duration: 0.3, ease: "easeOut" }}
              className="bg-muted/50 rounded-xl p-3.5 border border-border/30"
            >
              <p className="text-[9px] font-medium text-muted-foreground mb-1.5 leading-tight uppercase tracking-wide">
                {metric.label}
              </p>
              <div className="text-base font-bold text-foreground mb-0.5">
                <AnimatedValue value={metric.value} />
              </div>
              <span className="text-[9px] font-semibold text-emerald-600">{metric.change}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-6 -right-8 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="bg-white rounded-2xl shadow-xl border border-amber-100 p-3.5 w-52"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <span className="text-[11px] font-semibold text-amber-700">Riesgo detectado</span>
            </div>
            <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full">
              Urgente
            </span>
          </div>
          <p className="text-xl font-bold text-foreground">12 cuentas</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">sin actividad en +90 dias</p>
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
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-24 lg:pt-40 lg:pb-36 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-l from-accent/[0.04] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/8 rounded-full border border-accent/15"
            >
              <BarChart3 className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent tracking-wide">
                Business Intelligence · Decision Comercial
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="space-y-5"
            >
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-semibold leading-[1.1] tracking-tight text-foreground">
                Converti tus datos de ventas <span className="text-accent">en ingresos</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Diseno sistemas de decision comercial y dashboards ejecutivos para detectar clientes
                perdidos, oportunidades de cross-sell, potencial de up-sell y focos de margen que hoy
                estan quedando ocultos en tus datos.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#contacto"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground rounded-full font-medium text-base hover:bg-accent/90 transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 hover:scale-[1.02] group"
              >
                Solicitar diagnostico
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#proceso"
                className="inline-flex items-center justify-center px-8 py-4 bg-white border border-border rounded-full font-medium text-base hover:border-accent/40 hover:bg-accent/5 transition-all duration-300"
              >
                Ver como trabajo
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap gap-5 pt-6 border-t border-border/50"
            >
              {[
                { icon: Users, text: "Primera conversacion sin costo" },
                { icon: BarChart3, text: "Resultados en semanas" },
                { icon: TrendingUp, text: "Informacion tratada con confidencialidad" },
              ].map((item) => (
                <div key={item.text} className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4 text-accent/60" />
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative px-4 lg:px-0 mt-4 lg:mt-0"
          >
            <div className="flex gap-2 flex-wrap mb-5 lg:hidden">
              {[
                { color: "bg-violet-50 border-violet-100 text-violet-700", text: "12 clientes inactivos +90d" },
                { color: "bg-emerald-50 border-emerald-100 text-emerald-700", text: "+34% potencial cross-sell" },
                { color: "bg-amber-50 border-amber-100 text-amber-700", text: "Margen erosionado detectado" },
              ].map((pill, index) => (
                <motion.span
                  key={pill.text}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[11px] font-semibold ${pill.color}`}
                >
                  {pill.text}
                </motion.span>
              ))}
            </div>

            <InteractiveDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
