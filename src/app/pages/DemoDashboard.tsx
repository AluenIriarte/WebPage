import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertCircle, BarChart2, Clock3, Layers3, Linkedin, Package, TrendingUp, Users } from "lucide-react";
import { Header } from "../components/Header";
import { trackDiagnosisClick, trackQuoteClick } from "../lib/analytics";
import { buildQuotePageHref, CALENDLY_URL } from "../lib/contact";

const LINKEDIN_URL = "https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true";
const DEMO_QUOTE_HREF = buildQuotePageHref("Dashboard de ventas / BI comercial a medida");

type ViewType = "global" | "ranking" | "vendedores";

const viewDescriptions: Record<ViewType, string> = {
  global: "Salud comercial general: volumen, margen, segmentación y alertas de negocio",
  ranking: "Desempeño del equipo comercial: resultados vs objetivo y composición de cartera",
  vendedores: "Vista de cartera: clientes prioritarios, oportunidades de venta y foco comercial inmediato",
};

const views: { key: ViewType; label: string; mobileLabel: string }[] = [
  { key: "global", label: "Global", mobileLabel: "Global" },
  { key: "ranking", label: "Ranking comercial", mobileLabel: "Equipo" },
  { key: "vendedores", label: "Cartera de clientes", mobileLabel: "Cartera" },
];

const trendData = [
  { month: "Ene", value: 2840000 },
  { month: "Feb", value: 3120000 },
  { month: "Mar", value: 2980000 },
  { month: "Abr", value: 3250000 },
  { month: "May", value: 3180000 },
  { month: "Jun", value: 3420000 },
];

const regionData = [
  { region: "Centro", ventas: 1150000, margen: 24.1 },
  { region: "Norte", ventas: 820000, margen: 26.4 },
  { region: "Sur", ventas: 680000, margen: 28.7 },
  { region: "Litoral", ventas: 520000, margen: 22.3 },
  { region: "NOA", ventas: 250000, margen: 19.8 },
];

const sellersData = [
  { name: "Maria Gonzalez", sales: 610000, target: 500000, clients: 42, newClients: 6, margin: 28.4 },
  { name: "Carlos Mendez", sales: 470000, target: 520000, clients: 38, newClients: 4, margin: 24.8 },
  { name: "Ana Rodriguez", sales: 405000, target: 470000, clients: 35, newClients: 7, margin: 23.6 },
  { name: "Jorge Silva", sales: 285000, target: 560000, clients: 32, newClients: 2, margin: 19.4 },
  { name: "Laura Perez", sales: 168000, target: 520000, clients: 29, newClients: 1, margin: 15.2 },
];

function getAchievementStyles(achievement: number) {
  if (achievement >= 90) {
    return {
      textClassName: "text-emerald-600",
      barClassName: "bg-emerald-500",
    };
  }

  if (achievement >= 50) {
    return {
      textClassName: "text-amber-600",
      barClassName: "bg-amber-500",
    };
  }

  return {
    textClassName: "text-rose-600",
    barClassName: "bg-rose-500",
  };
}

type SellerWithAchievement = (typeof sellersData)[number] & { achievement: number; rank: number };

function getRankedSellers(): SellerWithAchievement[] {
  return sellersData
    .map((seller) => ({ ...seller, achievement: (seller.sales / seller.target) * 100 }))
    .sort((left, right) => right.achievement - left.achievement)
    .map((seller, index) => ({ ...seller, rank: index + 1 }));
}

function getRankingShowcaseSellers(rankedSellers: SellerWithAchievement[]) {
  const greenSeller = rankedSellers.find((seller) => seller.achievement >= 90);
  const yellowSeller = rankedSellers.find((seller) => seller.achievement >= 50 && seller.achievement < 90);
  const redSeller = rankedSellers.find((seller) => seller.achievement < 50);
  const fallbackSellers = rankedSellers.filter(
    (seller) =>
      seller.name !== greenSeller?.name && seller.name !== yellowSeller?.name && seller.name !== redSeller?.name,
  );

  return [greenSeller, yellowSeller, redSeller, ...fallbackSellers]
    .filter((seller): seller is SellerWithAchievement => Boolean(seller))
    .slice(0, 3);
}

const clientsData = [
  {
    name: "Industrias del Sur S.A.",
    revenue: 85000,
    buys: ["Línea A", "Línea B"],
    doesntBuy: ["Línea C", "Línea D"],
    opportunity: "Ampliar a Línea C",
    coverage: 50,
    priority: "high" as const,
  },
  {
    name: "Comercial Norte Ltda.",
    revenue: 72000,
    buys: ["Línea A", "Línea C"],
    doesntBuy: ["Línea B", "Línea D"],
    opportunity: "Cross-sell Línea B",
    coverage: 50,
    priority: "high" as const,
  },
  {
    name: "Grupo Tecnico Este",
    revenue: 58000,
    buys: ["Línea B", "Línea C", "Línea D"],
    doesntBuy: ["Línea A"],
    opportunity: "Completar portafolio",
    coverage: 75,
    priority: "medium" as const,
  },
];

function getClientPortfolioSummary(client: (typeof clientsData)[number]) {
  const totalLines = client.buys.length + client.doesntBuy.length;
  const [primaryGap, ...remainingGaps] = client.doesntBuy;

  return {
    coverageLabel: `${client.buys.length}/${totalLines} líneas`,
    primaryGapLabel: primaryGap ? (remainingGaps.length ? `${primaryGap} +${remainingGaps.length}` : primaryGap) : "Portafolio completo",
  };
}

type PortfolioMobileView = "products" | "clients";
type PortfolioProductTone = "focus" | "warning" | "neutral";

const portfolioProductsData = [
  {
    name: "Línea D",
    penetration: 29,
    openAccounts: 18,
    revenueGap: "$94k",
    note: "Mayor brecha sobre cartera activa",
    tone: "focus" as PortfolioProductTone,
  },
  {
    name: "Línea C",
    penetration: 34,
    openAccounts: 15,
    revenueGap: "$76k",
    note: "Demanda real, pero con stock bajo",
    tone: "warning" as PortfolioProductTone,
  },
  {
    name: "Línea B",
    penetration: 48,
    openAccounts: 11,
    revenueGap: "$51k",
    note: "Mejor margen para empujar este mes",
    tone: "neutral" as PortfolioProductTone,
  },
];

function getPortfolioCoverageAverage() {
  return Math.round(clientsData.reduce((total, client) => total + client.coverage, 0) / clientsData.length);
}

function getPriorityClients() {
  return clientsData.slice(0, 2);
}

function getPortfolioProductStyles(tone: PortfolioProductTone) {
  switch (tone) {
    case "focus":
      return {
        surfaceClassName: "border-[#7111DF]/16 bg-[#FCFBFE]",
        accentClassName: "bg-[#7111DF]",
        metricClassName: "text-[#7111DF]",
        noteClassName: "text-[#7111DF]",
      };
    case "warning":
      return {
        surfaceClassName: "border-amber-200 bg-amber-50/70",
        accentClassName: "bg-amber-500",
        metricClassName: "text-amber-700",
        noteClassName: "text-amber-700",
      };
    default:
      return {
        surfaceClassName: "border-[#ECE5F2] bg-white",
        accentClassName: "bg-[#14131A]",
        metricClassName: "text-[#14131A]",
        noteClassName: "text-[#6E6A7A]",
      };
  }
}

const signalOpportunityCards = [
  {
    icon: Users,
    title: "Clientes inactivos",
    description: "Cuentas de valor que frenaron compra y conviene recuperar antes de abrir más frente nuevo.",
    metric: "12 cuentas",
    detail: "recuperables",
    tone: "text-violet-600",
  },
  {
    icon: BarChart2,
    title: "Mix volumen / margen",
    description: "Productos que sostienen volumen, pero esconden una brecha de rentabilidad que hoy no se está priorizando.",
    metric: "40%+",
    detail: "margen potencial",
    tone: "text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Up-sell y cross-sell",
    description: "Clientes que ya compran una línea y tienen expansión natural sobre otra categoría cercana.",
    metric: "+34%",
    detail: "potencial incremental",
    tone: "text-sky-600",
  },
  {
    icon: Package,
    title: "Productos subpenetrados",
    description: "Líneas con baja adopción dentro de la cartera más valiosa, donde la oportunidad depende más de foco que de demanda nueva.",
    metric: "15%",
    detail: "penetración actual",
    tone: "text-amber-600",
  },
  {
    icon: Layers3,
    title: "Afinidad por categoría",
    description: "Segmentos que responden mejor a familias premium y ordenan mejor qué categoría conviene empujar primero.",
    metric: "3x",
    detail: "mayor afinidad",
    tone: "text-fuchsia-600",
  },
  {
    icon: Clock3,
    title: "Automatización operativa",
    description: "Horas de reporte manual que pueden volver al equipo como tiempo de seguimiento, análisis y acción comercial.",
    metric: "-8h",
    detail: "por semana",
    tone: "text-cyan-600",
  },
];

function SectionEyebrow({ children }: { children: string }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/55">{children}</p>;
}

function KPICard({
  label,
  value,
  change,
  changeType = "neutral",
}: {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}) {
  return (
    <div className="rounded-lg bg-white p-4">
      <div className="text-xs text-[#6E6A7A]">{label}</div>
      <div className="mb-0.5 mt-1 text-2xl tracking-tight text-[#14131A]">{value}</div>
      {change ? (
        <div
          className={`text-xs ${
            changeType === "positive"
              ? "text-emerald-600"
              : changeType === "negative"
                ? "text-rose-600"
                : "text-[#6E6A7A]"
          }`}
        >
          {change}
        </div>
      ) : null}
    </div>
  );
}

function ExecutiveReading({ insights }: { insights: string[] }) {
  return (
    <div className="rounded-lg border border-[#7111DF]/10 bg-white p-4">
      <div className="mb-3 text-sm tracking-tight text-[#14131A]">Lectura ejecutiva</div>
      <ul className="space-y-2">
        {insights.map((insight) => (
          <li key={insight} className="flex items-start gap-2 text-xs leading-relaxed text-[#6E6A7A]">
            <span className="mt-1.5 h-1 w-1 rounded-full bg-[#7111DF] shrink-0" />
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobilePanel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-[#ECE5F2] bg-white p-4 shadow-[0_10px_24px_rgba(20,19,26,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">{eyebrow}</p>
      <h3 className="mt-2 text-base font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CustomTooltipRegion({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color?: string; dataKey?: string; name?: string; value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[#E5E5E5] bg-white px-3 py-2">
      <div className="mb-1 text-sm font-medium text-[#14131A]">{label}</div>
      {payload.map((entry) => (
        <div key={`${entry.dataKey}-${entry.name}`} className="text-[13px]" style={{ color: entry.color }}>
          {entry.name}: {entry.dataKey === "ventas" ? `$${((entry.value ?? 0) / 1000).toFixed(0)}k` : `${entry.value}%`}
        </div>
      ))}
    </div>
  );
}

function GlobalView() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid shrink-0 grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard label="Ventas totales" value="$3.42M" change="+8.2% vs mes anterior" changeType="positive" />
        <KPICard label="Margen operativo" value="24.8%" change="-1.2 pp" changeType="negative" />
        <KPICard label="Cartera activa" value="284 clientes" change="+12 nuevos" changeType="positive" />
        <KPICard label="Ticket promedio" value="$12,042" change="+3.8%" changeType="positive" />
      </div>

      <div className="grid grid-cols-1 gap-3 md:min-h-0 md:flex-1 md:grid-cols-2">
        <div className="flex h-[18rem] flex-col rounded-lg bg-white p-4 md:min-h-0 md:h-auto md:flex-1">
          <div className="mb-2 shrink-0">
            <h3 className="text-sm tracking-tight text-[#14131A]">Evolución de ventas</h3>
            <p className="text-xs text-[#6E6A7A]">Últimos 6 meses</p>
          </div>
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7111DF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7111DF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                <XAxis dataKey="month" stroke="#6E6A7A" tick={{ fontSize: 12 }} />
                <YAxis
                  stroke="#6E6A7A"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  width={52}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: 8 }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7111DF"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex h-[18rem] flex-col rounded-lg bg-white p-4 md:min-h-0 md:h-auto md:flex-1">
          <div className="mb-2 shrink-0">
            <h3 className="text-sm tracking-tight text-[#14131A]">Volumen por región</h3>
            <p className="text-xs text-[#6E6A7A]">Ventas ($) y margen (%) por región</p>
          </div>
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={regionData} margin={{ top: 4, right: 36, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                <XAxis dataKey="region" stroke="#6E6A7A" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  stroke="#7111DF"
                  tick={{ fontSize: 12, fill: "#7111DF" }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  width={52}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#655F7F"
                  tick={{ fontSize: 12, fill: "#655F7F" }}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 40]}
                  width={36}
                />
                <Tooltip content={<CustomTooltipRegion />} />
                <Legend
                  iconSize={10}
                  formatter={(value) => (
                    <span style={{ fontSize: 12, color: "#6E6A7A" }}>{value === "ventas" ? "Ventas" : "Margen %"}</span>
                  )}
                />
                <Bar
                  yAxisId="left"
                  dataKey="ventas"
                  name="ventas"
                  fill="#7111DF"
                  fillOpacity={0.85}
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="margen"
                  name="margen"
                  stroke="#655F7F"
                  strokeWidth={2}
                  dot={{ fill: "#655F7F", r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlobalViewMobile() {
  const maxSales = Math.max(...regionData.map((region) => region.ventas));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <KPICard label="Ventas totales" value="$3.42M" change="+8.2% mensual" changeType="positive" />
        <KPICard label="Cartera activa" value="284" change="12 altas nuevas" changeType="positive" />
      </div>

      <MobilePanel
        eyebrow="Pulso general"
        title="Lo importante sin abrir todo el tablero"
        description="En celular conviene priorizar una lectura rápida y después bajar al detalle."
      >
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValueMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7111DF" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#7111DF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
              <XAxis dataKey="month" stroke="#6E6A7A" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#6E6A7A"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                width={48}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: 8 }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#7111DF"
                strokeWidth={2}
                fill="url(#colorValueMobile)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </MobilePanel>

      <MobilePanel
        eyebrow="Foco comercial"
        title="Regiones para mirar primero"
        description="Una vista corta para decidir dónde conviene empujar volumen y dónde cuidar margen."
      >
        <div className="space-y-4">
          {regionData.slice(0, 3).map((region) => (
            <div key={region.region} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{region.region}</p>
                  <p className="text-xs text-muted-foreground">{region.margen}% de margen</p>
                </div>
                <p className="text-sm font-semibold tracking-tight text-foreground">${(region.ventas / 1000).toFixed(0)}k</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#F3F1EE]">
                <div
                  className="h-full rounded-full bg-[#7111DF]"
                  style={{ width: `${(region.ventas / maxSales) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </MobilePanel>

      <ExecutiveReading
        insights={[
          "La venta crece, pero la mezcla de margen pide más foco comercial",
          "Centro y Norte concentran el volumen más valioso de la cartera",
          "La conversación comercial debería arrancar por señales, no por más pantallas",
        ]}
      />
    </div>
  );
}

function RankingView() {
  const rankedSellers = getRankedSellers();
  const displaySellers = getRankingShowcaseSellers(rankedSellers);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-col rounded-lg bg-white p-5 md:min-h-0 md:flex-1">
        <div className="mb-4 shrink-0">
          <h3 className="text-sm tracking-tight text-[#14131A]">Desempeño por vendedor</h3>
          <p className="text-xs text-[#6E6A7A]">Mes actual vs objetivo</p>
        </div>

        <div className="space-y-4 md:min-h-0 md:flex-1 md:overflow-auto md:pr-1">
          {displaySellers.map((seller, index) => {
            const achievementStyles = getAchievementStyles(seller.achievement);

            return (
              <div key={seller.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7111DF]/10">
                      <span className="text-sm text-[#7111DF]">{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm text-[#14131A]">{seller.name}</div>
                      <div className="text-xs text-[#6E6A7A]">{seller.clients} clientes activos</div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="tracking-tight text-[#14131A]">${(seller.sales / 1000).toFixed(0)}k</div>
                    <div className={`text-xs ${achievementStyles.textClassName}`}>
                      {seller.achievement.toFixed(0)}% del objetivo
                    </div>
                  </div>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-[#F3F1EE]">
                  <div
                    className={`h-full rounded-full ${achievementStyles.barClassName}`}
                    style={{ width: `${Math.min(seller.achievement, 100)}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#6E6A7A]">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{seller.newClients} nuevos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{seller.margin}% margen</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4">
          <div className="mb-1 text-xs text-[#6E6A7A]">Total cartera del equipo</div>
          <div className="text-2xl tracking-tight text-[#14131A]">$2.49M</div>
          <p className="mt-1 text-xs text-[#6E6A7A]">176 clientes activos en total</p>
        </div>
        <ExecutiveReading
          insights={[
            "La muestra deja un caso verde, uno amarillo y uno rojo para leer rapido al equipo",
            "Con el color de la barra alcanza para ver quien esta sano, quien pide seguimiento y quien esta en riesgo",
            "Tres nombres bien elegidos explican el panorama sin cargar la vista con ruido",
          ]}
        />
      </div>
    </div>
  );
}

function RankingViewMobile() {
  const rankedSellers = getRankedSellers();
  const displaySellers = getRankingShowcaseSellers(rankedSellers);
  const topSeller = displaySellers[0] ?? rankedSellers[0];
  const underTargetCount = displaySellers.filter((seller) => seller.achievement < 100).length;

  if (!topSeller) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <KPICard
          label="Top performer"
          value={topSeller.name.split(" ")[0]}
          change={`${topSeller.achievement.toFixed(0)}% del objetivo`}
          changeType="positive"
        />
        <KPICard label="Bajo objetivo" value={`${underTargetCount}`} change="vendedores a reforzar" changeType="neutral" />
      </div>

      <MobilePanel
        eyebrow="Equipo comercial"
        title="Ranking resumido para celular"
        description="La muestra deja un caso por color para leer rapido quien esta sano, quien requiere seguimiento y quien esta en rojo."
      >
        <div className="space-y-4">
          {displaySellers.map((seller, index) => {
            const achievementStyles = getAchievementStyles(seller.achievement);

            return (
              <div key={seller.name} className="rounded-[1.15rem] border border-border/50 bg-[#FCFBFE] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7111DF]/10 text-sm text-[#7111DF]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{seller.name}</p>
                      <p className="text-xs text-muted-foreground">{seller.clients} clientes activos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tracking-tight text-foreground">${(seller.sales / 1000).toFixed(0)}k</p>
                    <p className={`text-xs ${achievementStyles.textClassName}`}>
                      {seller.achievement.toFixed(0)}% del objetivo
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F3F1EE]">
                  <div
                    className={`h-full rounded-full ${achievementStyles.barClassName}`}
                    style={{ width: `${Math.min(seller.achievement, 100)}%` }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{seller.newClients} nuevos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{seller.margin}% margen</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </MobilePanel>

      <ExecutiveReading
        insights={[
          "Un caso por color alcanza para leer la salud del equipo sin perder tiempo",
          "Si la barra amarilla o roja domina, la conversacion pasa a seguimiento e intervencion",
          "La vista movil tiene que ayudar a decidir rapido, no a leer una planilla larga",
        ]}
      />
    </div>
  );
}

function VendedoresView() {
  const priorityClients = getPriorityClients();
  const averageCoverage = getPortfolioCoverageAverage();

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
      <div className="flex min-h-0 flex-col gap-4">
        <section className="relative overflow-hidden rounded-[1.85rem] bg-[linear-gradient(140deg,#14131A_0%,#241B3C_55%,#3A1F78_100%)] p-5 text-white shadow-[0_22px_48px_rgba(20,19,26,0.18)]">
          <div className="absolute right-[-4rem] top-[-3rem] h-32 w-32 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute bottom-[-4rem] left-[-2rem] h-24 w-24 rounded-full bg-[#9E6BFF]/20 blur-3xl" />
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/58">Cobertura cartera</p>
            <div className="mt-4 flex items-end justify-between gap-6">
              <div>
                <div className="text-4xl font-semibold tracking-[-0.04em]">{averageCoverage}%</div>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/72">
                  Cobertura promedio sobre líneas estratégicas dentro de la cartera más valiosa.
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-white/12 bg-white/8 px-3 py-2.5 backdrop-blur">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Pulso comercial</div>
                <div className="mt-1.5 text-sm font-semibold text-white">18 oportunidades listas</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/62">
              <span>2 clientes con acción inmediata</span>
              <span>3 productos subpenetrados</span>
              <span>1 restricción operativa activa</span>
            </div>
          </div>
        </section>

        <section className="flex min-h-0 flex-1 flex-col rounded-[1.7rem] border border-[#ECE5F2] bg-white p-5 shadow-[0_12px_28px_rgba(20,19,26,0.04)]">
          <div className="shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#7111DF]/10 text-[#7111DF]">
                <Layers3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-[#14131A]">Productos subpenetrados</h3>
                <p className="mt-1 text-sm text-[#6E6A7A]">Brecha por línea antes de decidir en qué cuentas entrar.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3 md:min-h-0 md:flex-1 md:overflow-auto md:pr-1">
            {portfolioProductsData.map((product) => {
              const styles = getPortfolioProductStyles(product.tone);

              return (
                <article key={product.name} className={`rounded-[1.25rem] border p-3.5 ${styles.surfaceClassName}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${styles.accentClassName}`} />
                        <h4 className="text-base tracking-tight text-[#14131A]">{product.name}</h4>
                      </div>
                      <p className="mt-1 text-sm text-[#6E6A7A]">{product.openAccounts} cuentas todavía sin cobertura</p>
                    </div>
                    <div className={`text-right text-2xl font-semibold tracking-tight ${styles.metricClassName}`}>
                      {product.penetration}%
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ECE5F2]">
                    <div className={`h-full rounded-full ${styles.accentClassName}`} style={{ width: `${product.penetration}%` }} />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                    <p className={`font-medium ${styles.noteClassName}`}>{product.note}</p>
                    <span className="shrink-0 text-[#6E6A7A]">{product.revenueGap} potencial</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <div className="flex min-h-0 flex-col gap-4">
        <section className="rounded-[1.85rem] border border-amber-300 bg-[linear-gradient(145deg,#FFF7E8_0%,#FFF2D8_100%)] p-5 shadow-[0_18px_38px_rgba(245,158,11,0.14)]">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-[0_12px_24px_rgba(245,158,11,0.24)]">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">Stock bajo</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-[#14131A]">Línea C limitada</h3>
              <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
                Conviene empujar líneas A y B mientras se normaliza stock, para no frenar expansión comercial.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-0 flex-1 flex-col rounded-[1.7rem] border border-[#ECE5F2] bg-white p-5 shadow-[0_12px_28px_rgba(20,19,26,0.04)]">
          <div className="shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#14131A]/6 text-[#14131A]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-[#14131A]">Clientes para accionar</h3>
                <p className="mt-1 text-sm text-[#6E6A7A]">Pocas cuentas y una próxima acción explícita.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3 md:min-h-0 md:flex-1 md:overflow-auto md:pr-1">
            {priorityClients.map((client) => {
              const portfolioSummary = getClientPortfolioSummary(client);

              return (
                <article key={client.name} className="rounded-[1.25rem] border border-[#ECE5F2] bg-[#FCFBFE] p-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base tracking-tight text-[#14131A]">{client.name}</h4>
                      <p className="mt-1 text-sm text-[#6E6A7A]">Aporte mensual: ${(client.revenue / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="rounded-full bg-[#14131A] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                      {client.coverage}% cobertura
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    <div className="rounded-[0.9rem] border border-[#ECE5F2] bg-white px-3 py-2.5">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6E6A7A]">Brecha principal</div>
                      <div className="mt-1.5 text-sm font-semibold text-amber-700">{portfolioSummary.primaryGapLabel}</div>
                    </div>
                    <div className="rounded-[0.9rem] border border-[#ECE5F2] bg-white px-3 py-2.5">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6E6A7A]">Compra actual</div>
                      <div className="mt-1.5 text-sm font-semibold text-[#14131A]">{portfolioSummary.coverageLabel}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-start gap-3 rounded-[0.9rem] border border-[#7111DF]/12 bg-[#7111DF]/6 px-3.5 py-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#7111DF]" />
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7111DF]">Siguiente movimiento</div>
                      <p className="mt-1 text-sm font-medium text-[#14131A]">{client.opportunity}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function VendedoresViewMobile() {
  const highlightedClients = getPriorityClients();
  const averageCoverage = getPortfolioCoverageAverage();
  const [activePortfolioView, setActivePortfolioView] = useState<PortfolioMobileView>("products");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-3">
        <section className="relative overflow-hidden rounded-[1.6rem] bg-[linear-gradient(140deg,#14131A_0%,#241B3C_55%,#3A1F78_100%)] px-4 py-4 text-white shadow-[0_18px_34px_rgba(20,19,26,0.2)]">
          <div className="absolute right-[-2rem] top-[-2rem] h-20 w-20 rounded-full bg-white/8 blur-2xl" />
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/58">Cobertura</p>
            <div className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{averageCoverage}%</div>
            <p className="mt-2 text-xs leading-relaxed text-white/68">Promedio sobre líneas estratégicas en la cartera foco.</p>
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-amber-300 bg-[linear-gradient(145deg,#FFF7E8_0%,#FFF2D8_100%)] px-4 py-4 shadow-[0_16px_30px_rgba(245,158,11,0.14)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800">Stock bajo</p>
          <div className="mt-2 text-sm font-semibold tracking-tight text-[#14131A]">Línea C</div>
          <p className="mt-2 text-xs leading-relaxed text-amber-900/78">Empujar A y B mientras normaliza stock.</p>
        </section>
      </div>

      <MobilePanel
        eyebrow="Cartera guiada"
        title="Producto primero, cuenta después"
        description="En mobile conviene cambiar entre dos vistas cortas: dónde está la brecha y en qué cuentas entrar."
      >
        <div className="rounded-full bg-[#F4F1F8] p-1">
          <div className="grid grid-cols-2 gap-1">
            {[
              { key: "products" as const, label: "Productos" },
              { key: "clients" as const, label: "Clientes" },
            ].map((viewOption) => (
              <button
                key={viewOption.key}
                type="button"
                onClick={() => setActivePortfolioView(viewOption.key)}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  activePortfolioView === viewOption.key
                    ? "bg-[#14131A] text-white shadow-[0_10px_20px_rgba(20,19,26,0.12)]"
                    : "text-[#6E6A7A]"
                }`}
              >
                {viewOption.label}
              </button>
            ))}
          </div>
        </div>

        {activePortfolioView === "products" ? (
          <div className="mt-4 space-y-3">
            {portfolioProductsData.map((product) => {
              const styles = getPortfolioProductStyles(product.tone);

              return (
                <article key={product.name} className={`rounded-[1.15rem] border p-4 ${styles.surfaceClassName}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${styles.accentClassName}`} />
                        <h4 className="text-sm font-medium tracking-tight text-foreground">{product.name}</h4>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{product.openAccounts} cuentas sin cobertura</p>
                    </div>
                    <div className={`text-right text-xl font-semibold tracking-tight ${styles.metricClassName}`}>
                      {product.penetration}%
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ECE5F2]">
                    <div className={`h-full rounded-full ${styles.accentClassName}`} style={{ width: `${product.penetration}%` }} />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                    <p className={styles.noteClassName}>{product.note}</p>
                    <span className="shrink-0 text-muted-foreground">{product.revenueGap}</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {highlightedClients.map((client) => {
              const portfolioSummary = getClientPortfolioSummary(client);

              return (
                <article key={client.name} className="rounded-[1.15rem] border border-border/50 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium tracking-tight text-foreground">{client.name}</h4>
                      <p className="mt-1 text-xs text-muted-foreground">Aporte mensual: ${(client.revenue / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="rounded-full bg-[#14131A] px-2.5 py-1 text-[11px] font-semibold text-white">
                      {client.coverage}%
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#ECE5F2] bg-[#FCFBFE] px-3 py-2.5">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Brecha</div>
                      <div className="mt-1 text-xs font-semibold text-amber-700">{portfolioSummary.primaryGapLabel}</div>
                    </div>
                    <div className="rounded-xl border border-[#ECE5F2] bg-[#FCFBFE] px-3 py-2.5">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Compra</div>
                      <div className="mt-1 text-xs font-semibold text-foreground">{portfolioSummary.coverageLabel}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#7111DF]/12 bg-[#7111DF]/6 px-3 py-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#7111DF]" />
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7111DF]">Siguiente movimiento</div>
                      <p className="mt-1 text-xs font-medium leading-relaxed text-foreground">{client.opportunity}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </MobilePanel>

      <ExecutiveReading
        insights={[
          "La lectura arranca por producto, porque ahí se ve primero la brecha comercial real",
          "La alerta de stock queda aislada para que no compita con el resto de la historia",
          "En mobile conviene alternar entre productos y cuentas, no apilar dos paneles largos",
        ]}
      />
    </div>
  );
}

function OpportunitiesGrid({ limit }: { limit?: number }) {
  const cards = typeof limit === "number" ? signalOpportunityCards.slice(0, limit) : signalOpportunityCards;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <article key={card.title} className="flex h-full flex-col rounded-[1.7rem] border border-[#ECE5F2] bg-white p-6 shadow-[0_12px_28px_rgba(20,19,26,0.03)]">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/[0.08] text-accent">
              <card.icon className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between gap-4 border-t border-border/40 pt-5">
            <div>
              <p className={`text-2xl font-semibold tracking-tight ${card.tone}`}>{card.metric}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/55">{card.detail}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function DemoDashboard() {
  const [activeView, setActiveView] = useState<ViewType>("global");
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));
  const [showAllMobileOpportunities, setShowAllMobileOpportunities] = useState(false);
  const demoIntroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsMobile(mediaQuery.matches);

    syncViewport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewport);
      return () => mediaQuery.removeEventListener("change", syncViewport);
    }

    mediaQuery.addListener(syncViewport);
    return () => mediaQuery.removeListener(syncViewport);
  }, []);

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  const handleViewChange = (view: ViewType) => {
    if (isMobile) {
      demoIntroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setActiveView(view);
  };

  const renderActiveView = () => {
    if (isMobile) {
      if (activeView === "global") return <GlobalViewMobile />;
      if (activeView === "ranking") return <RankingViewMobile />;
      return <VendedoresViewMobile />;
    }

    if (activeView === "global") return <GlobalView />;
    if (activeView === "ranking") return <RankingView />;
    return <VendedoresView />;
  };

  return (
    <div className="min-h-screen bg-[#F3F1EE]">
      <Header />

      <div className="fixed inset-x-0 top-20 z-40 border-b border-border/50 bg-[rgba(243,241,238,0.94)] backdrop-blur-xl">
        <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-8">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">
              Vistas:
            </span>
            <div className="grid grid-cols-3 gap-1 rounded-full bg-white/80 p-1 shadow-[0_8px_18px_rgba(20,19,26,0.04)]">
              {views.map(({ key, mobileLabel }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleViewChange(key)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors duration-150 sm:text-sm ${
                    activeView === key
                      ? "bg-[#7111DF] text-white shadow-sm"
                      : "text-[#655F7F] hover:bg-[#7111DF]/5 hover:text-[#14131A]"
                  }`}
                >
                  {mobileLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="pb-28 md:pb-0">
        <section id="demo-dashboard" className="bg-[#F3F1EE] pt-36 md:pt-40">
          <div className="flex flex-col bg-[#F3F1EE] md:h-[calc(100dvh-9rem)] md:overflow-hidden">
            <div className="mx-auto flex w-full max-w-[1280px] flex-col px-4 py-4 md:min-h-0 md:flex-1 md:px-8 md:py-5">
              <div ref={demoIntroRef} className="mb-4 shrink-0 text-center scroll-mt-36 md:scroll-mt-40">
                <div className="mb-1 text-[10px] uppercase tracking-widest text-[#7111DF]">DEMO GUIADA</div>
                <h1 className="text-xl tracking-tight text-[#14131A] md:text-2xl">Demo interactiva de tablero comercial</h1>
                <p className="mt-1 text-xs text-[#655F7F] md:text-sm">
                  {isMobile
                    ? "Tres vistas, una lectura corta y acciones siempre a mano."
                    : "Tres vistas para entender volumen, desempeño y oportunidades de acción"}
                </p>
                <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-[#6E6A7A] md:text-sm">
                  {viewDescriptions[activeView]}
                </p>
              </div>

              <div className="relative md:flex-1 md:min-h-0">
                {isMobile ? (
                  renderActiveView()
                ) : (
                  <>
                    <div
                      aria-hidden={activeView !== "global"}
                      className={activeView === "global" ? "h-full" : "pointer-events-none absolute inset-0 h-full opacity-0"}
                    >
                      <GlobalView />
                    </div>
                    <div
                      aria-hidden={activeView !== "ranking"}
                      className={activeView === "ranking" ? "h-full" : "pointer-events-none absolute inset-0 h-full opacity-0"}
                    >
                      <RankingView />
                    </div>
                    <div
                      aria-hidden={activeView !== "vendedores"}
                      className={activeView === "vendedores" ? "h-full" : "pointer-events-none absolute inset-0 h-full opacity-0"}
                    >
                      <VendedoresView />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 shrink-0 rounded-[1.5rem] bg-[#FFFFFF] px-4 py-4 shadow-[0_10px_24px_rgba(20,19,26,0.04)] md:mt-3 md:rounded-lg md:px-5 md:py-3 md:shadow-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <div className="text-sm tracking-tight text-[#14131A]">¿Querés implementar estas vistas en tu negocio?</div>
                    <div className="mt-1 text-xs text-[#6E6A7A]">
                      Cada solución se diseña según tu estructura comercial y necesidades.
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
                    <a
                      href={CALENDLY_URL}
                      onClick={() => trackDiagnosisClick("demo_primary_cta")}
                      className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-[14px] bg-[#7111DF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5c0ec0]"
                    >
                      Agendar diagnóstico
                    </a>
                    <a
                      href={DEMO_QUOTE_HREF}
                      onClick={() =>
                        trackQuoteClick("demo_secondary_cta", "Dashboard de ventas / BI comercial a medida")
                      }
                      className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-[14px] bg-[#F3F1EE] px-4 py-2 text-sm font-semibold text-[#14131A] transition-colors hover:bg-[#e8e5e0]"
                    >
                      Pedir cotización
                    </a>
                  </div>
                </div>
                <div className="mt-3 flex justify-start sm:justify-end">
                  <a
                    href="#oportunidades"
                    onClick={(event) => handleAnchorClick(event, "oportunidades")}
                    className="text-xs text-[#6E6A7A] transition-colors hover:text-[#14131A]"
                  >
                    Ver otros indicadores
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="oportunidades" className="scroll-mt-32 border-b border-border/30 bg-white py-16 lg:scroll-mt-36 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <SectionEyebrow>Otros indicadores posibles</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground lg:text-[2.7rem]">
                Otras alertas y focos de acción que también puede volver visibles.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Esta demo muestra tres lentes principales, pero la misma arquitectura puede abrir lecturas sobre recuperación de cartera, rentabilidad, penetración y automatización operativa.
              </p>
            </div>

            <div className="mt-10">
              <OpportunitiesGrid limit={isMobile && !showAllMobileOpportunities ? 3 : undefined} />
            </div>

            {isMobile && !showAllMobileOpportunities ? (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setShowAllMobileOpportunities(true)}
                  className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/25 hover:text-accent"
                >
                  Ver el resto de indicadores
                </button>
              </div>
            ) : null}

            <div className="mt-10 rounded-[1.9rem] border border-[#ECE5F2] bg-[#FCFBFE] px-6 py-6">
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                El valor no está en acumular pantallas. Está en elegir qué señales conviene volver visibles primero según tu cartera, tu oferta y la forma en que hoy se toman decisiones comerciales.
              </p>
              <div className="mt-6 flex flex-col items-start gap-3">
                <a
                  href={CALENDLY_URL}
                  onClick={() => trackDiagnosisClick("opportunities_section_cta")}
                  className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[#7111DF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5c0ec0]"
                >
                  Solicitar diagnóstico
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Escribime por LinkedIn
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="border-t border-border/30 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <a href="/#home" className="font-medium text-foreground transition-colors hover:text-accent">
            Alan L. Perez
          </a>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <a href="/#home" className="transition-colors hover:text-foreground">
              Volver al inicio
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
              LinkedIn
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(20,19,26,0.08)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <a
            href={CALENDLY_URL}
            onClick={() => trackDiagnosisClick("demo_sticky_mobile_cta")}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[14px] bg-[#7111DF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5c0ec0]"
          >
            Agendar diagnóstico
          </a>
          <a
            href={DEMO_QUOTE_HREF}
            onClick={() => trackQuoteClick("demo_sticky_mobile_quote", "Dashboard de ventas / BI comercial a medida")}
            className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[#F3F1EE] px-4 py-2 text-sm font-semibold text-[#14131A] transition-colors hover:bg-[#e8e5e0]"
          >
            Cotizar
          </a>
        </div>
      </div>
    </div>
  );
}
