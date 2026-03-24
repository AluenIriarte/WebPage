import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Clock3,
  Layers3,
  Linkedin,
  ShoppingCart,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Header } from "../components/Header";
import { trackDiagnosisClick } from "../lib/analytics";
import { ROOT_DIAGNOSTIC_SECTION_HREF } from "../lib/contact";

const LINKEDIN_URL = "https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true";

const boardSurfaceClass =
  "overflow-hidden rounded-[2rem] border border-[#E8E1EF] bg-white shadow-[0_24px_70px_rgba(20,19,26,0.05)]";
const softCardClass = "rounded-[1.35rem] border border-[#ECE5F2] bg-[#FCFBFE]";

const demoViewOrder = ["global", "ranking", "vendedores"] as const;
type DemoViewId = (typeof demoViewOrder)[number];
type SellerAvatarVariant = "wave" | "short" | "bun";

const demoViews: Record<
  DemoViewId,
  {
    label: string;
    description: string;
  }
> = {
  global: {
    label: "Global",
    description:
      "Lectura ejecutiva de volumen, margen, segmentos y una alerta de negocio para decidir donde intervenir primero.",
  },
  ranking: {
    label: "Ranking comercial",
    description:
      "La misma solucion baja del resultado general al equipo para mostrar quien llega, con que cartera y donde esta la brecha recuperable.",
  },
  vendedores: {
    label: "Vendedores",
    description:
      "Vista pensada para priorizar cartera, detectar faltantes y encontrar oportunidades por cliente.",
  },
};

const avatarStyles = {
  violetWave: {
    background: "#F2EDFF",
    skin: "#EFC5AE",
    hair: "#5B416F",
    jacket: "#7111DF",
    shirt: "#F8F6FF",
    variant: "wave" as SellerAvatarVariant,
  },
  slateShort: {
    background: "#ECF3FF",
    skin: "#DEB18F",
    hair: "#2B2A31",
    jacket: "#315FBE",
    shirt: "#EEF4FF",
    variant: "short" as SellerAvatarVariant,
  },
  clayBun: {
    background: "#FFF1EA",
    skin: "#EDBDA2",
    hair: "#734738",
    jacket: "#D96D4D",
    shirt: "#FFF7F2",
    variant: "bun" as SellerAvatarVariant,
  },
  mossWave: {
    background: "#EEF6EC",
    skin: "#E6B89A",
    hair: "#4A5A36",
    jacket: "#3E8C52",
    shirt: "#F8FCF8",
    variant: "wave" as SellerAvatarVariant,
  },
} as const;

const globalKpis = [
  { label: "Ventas netas", value: "$1.38M", detail: "Q1 2026", tone: "text-foreground" },
  { label: "Margen bruto", value: "24.8%", detail: "-2.8 pts en distribuidores", tone: "text-foreground" },
  { label: "Alerta principal", value: "12 cuentas", detail: "sin recompra en 90 dias", tone: "text-amber-700" },
] as const;

const globalTrendData = [
  { name: "S1", ventas: 146, margen: 101 },
  { name: "S2", ventas: 171, margen: 112 },
  { name: "S3", ventas: 164, margen: 105 },
  { name: "S4", ventas: 184, margen: 118 },
] as const;

const globalSegments = [
  {
    name: "Grandes cuentas",
    share: "42% del ingreso",
    margin: "28% margen",
    note: "Sostiene expansion y compensa la desaceleracion del resto.",
  },
  {
    name: "Distribuidores",
    share: "34% del ingreso",
    margin: "21% margen",
    note: "Aca aparece la perdida: volumen sano, mezcla y precio desordenados.",
  },
  {
    name: "Canal interior",
    share: "24% del ingreso",
    margin: "25% margen",
    note: "No cae todavia, pero desacelera frecuencia y necesita seguimiento.",
  },
];

const rankingPrimarySummary = [
  { label: "Total vendido", value: "$1.18M", detail: "periodo actual" },
  { label: "Vs objetivo", value: "100%", detail: "$1.18M sobre $1.18M objetivo" },
];

const rankingSecondarySummary = [
  { label: "Total cartera", value: "$3.15M" },
  { label: "Total clientes", value: "61" },
  { label: "Clientes nuevos en el periodo", value: "11" },
];

const rankingRows = [
  {
    seller: "Sofia Gomez",
    focus: "Grandes cuentas",
    totalPortfolio: "$1.26M",
    totalClients: "18 clientes",
    actual: "$448K",
    target: "$420K",
    attainment: 107,
    gap: "+$28K",
    tone: "text-emerald-600",
    avatar: avatarStyles.violetWave,
    stats: [
      { label: "Clientes nuevos en el periodo", value: "4" },
      { label: "Margen aportado", value: "29%" },
    ],
  },
  {
    seller: "Martin Rivas",
    focus: "Cartera corporativa",
    totalPortfolio: "$980K",
    totalClients: "22 clientes",
    actual: "$391K",
    target: "$405K",
    attainment: 97,
    gap: "-$14K",
    tone: "text-amber-600",
    avatar: avatarStyles.slateShort,
    stats: [
      { label: "Clientes nuevos en el periodo", value: "3" },
      { label: "Margen aportado", value: "22%" },
    ],
  },
  {
    seller: "Lucia Perez",
    focus: "Cuentas estrategicas",
    totalPortfolio: "$910K",
    totalClients: "21 clientes",
    actual: "$336K",
    target: "$350K",
    attainment: 96,
    gap: "-$14K",
    tone: "text-amber-600",
    avatar: avatarStyles.clayBun,
    stats: [
      { label: "Clientes nuevos en el periodo", value: "4" },
      { label: "Margen aportado", value: "24%" },
    ],
  },
];

type CoverageState = "active" | "opportunity" | "inactive" | "constrained";

const clientCoverageSummary = [
  { label: "Su cartera", value: "22 clientes", detail: "activos en el periodo" },
  { label: "Volumen del periodo", value: "$391K", detail: "sobre su cartera actual" },
  { label: "Oportunidades hoy", value: "4", detail: "cuentas a priorizar" },
];

const portfolioLines = ["Linea A", "Linea B", "Linea C", "Linea D", "Linea E"] as const;

const selectedSeller = {
  seller: "Martin Rivas",
  area: "Cartera corporativa",
  avatar: avatarStyles.slateShort,
  brief:
    "Su cartera ya tiene volumen y oportunidades claras. La prioridad no es abrir mas frente nuevo, sino completar mezcla donde hoy hay hueco rentable y stock disponible.",
};

const clientActionRows = [
  {
    client: "Grupo Solaris",
    seller: selectedSeller.seller,
    avatar: avatarStyles.slateShort,
    volume: "$118K",
    share: "30% de su volumen",
    buys: "Lineas A y C",
    misses: "Linea B y D",
    opportunity: "Completar Linea D industrial antes de seguir empujando descuento.",
    stock: "Linea B con stock bajo. Conviene ofrecer sustituto y no priorizar esa categoria.",
    stockTone: "bg-amber-50 text-amber-700 border-amber-100",
    coverage: ["active", "constrained", "active", "opportunity", "inactive"] as CoverageState[],
  },
  {
    client: "Logistica Central",
    seller: selectedSeller.seller,
    avatar: avatarStyles.mossWave,
    volume: "$96K",
    share: "25% de su volumen",
    buys: "Lineas A y D",
    misses: "Linea B y E",
    opportunity: "Abrir Linea E con bundle de reposicion y evitar depender de una sola familia.",
    stock: "Linea B sigue corta. La expansion conveniente hoy esta en Linea E.",
    stockTone: "bg-amber-50 text-amber-700 border-amber-100",
    coverage: ["active", "constrained", "inactive", "active", "opportunity"] as CoverageState[],
  },
  {
    client: "Comercial Andes",
    seller: selectedSeller.seller,
    avatar: avatarStyles.violetWave,
    volume: "$94K",
    share: "24% de su volumen",
    buys: "Lineas A, C y D",
    misses: "Linea E",
    opportunity: "Abrir Linea E con propuesta de reposicion rapida sobre una cuenta ya activa.",
    stock: "Stock estable. La oportunidad depende mas de foco que de disponibilidad.",
    stockTone: "bg-emerald-50 text-emerald-700 border-emerald-100",
    coverage: ["active", "inactive", "active", "active", "opportunity"] as CoverageState[],
  },
  {
    client: "TechParts SRL",
    seller: selectedSeller.seller,
    avatar: avatarStyles.clayBun,
    volume: "$83K",
    share: "21% de su volumen",
    buys: "Linea A y E",
    misses: "Linea C",
    opportunity: "Completar Linea C para subir ticket sin depender de mas frecuencia.",
    stock: "Sin restriccion operativa. La prioridad es mover una cuenta con compra ya consolidada.",
    stockTone: "bg-violet-50 text-violet-700 border-violet-100",
    coverage: ["active", "inactive", "opportunity", "inactive", "active"] as CoverageState[],
  },
];

const signalOpportunityCards = [
  {
    icon: Users,
    title: "Clientes inactivos",
    description: "Cuentas de valor que frenaron compra y conviene recuperar antes de abrir mas frente nuevo.",
    metric: "12 cuentas",
    detail: "recuperables",
    tone: "text-violet-600",
  },
  {
    icon: BarChart2,
    title: "Mix volumen / margen",
    description: "Productos que sostienen volumen, pero esconden una brecha de rentabilidad que hoy no se esta priorizando.",
    metric: "40%+",
    detail: "margen potencial",
    tone: "text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Up-sell y cross-sell",
    description: "Clientes que ya compran una linea y tienen expansion natural sobre otra categoria cercana.",
    metric: "+34%",
    detail: "potencial incremental",
    tone: "text-sky-600",
  },
  {
    icon: ShoppingCart,
    title: "Productos subpenetrados",
    description: "Lineas con baja adopcion dentro de la cartera mas valiosa, donde la oportunidad depende mas de foco que de demanda nueva.",
    metric: "15%",
    detail: "penetracion actual",
    tone: "text-amber-600",
  },
  {
    icon: Layers3,
    title: "Afinidad por categoria",
    description: "Segmentos que responden mejor a familias premium y ordenan mejor que categoria conviene empujar primero.",
    metric: "3x",
    detail: "mayor afinidad",
    tone: "text-fuchsia-600",
  },
  {
    icon: Clock3,
    title: "Automatizacion operativa",
    description: "Horas de reporte manual que pueden volver al equipo como tiempo de seguimiento, analisis y accion comercial.",
    metric: "-8h",
    detail: "por semana",
    tone: "text-cyan-600",
  },
];

function DemoTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { color?: string; name?: string; value?: number | string }[];
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[132px] rounded-2xl border border-border/60 bg-white px-3 py-2.5 shadow-[0_18px_36px_rgba(20,19,26,0.08)]">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <div className="mt-2 space-y-1.5">
        {payload.map((entry, index) => (
          <div key={`${entry.name}-${index}`} className="flex items-center justify-between gap-4 text-[11px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}</span>
            </div>
            <span className="font-semibold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/55">{children}</p>;
}

function SellerAvatar({
  rank,
  avatar,
}: {
  rank?: number;
  avatar: (typeof avatarStyles)[keyof typeof avatarStyles];
}) {
  return (
    <div className="relative shrink-0">
      <div
        className="flex h-11 w-11 items-end justify-center overflow-hidden rounded-full ring-1 ring-black/5"
        style={{ background: avatar.background }}
      >
        <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
          <path d="M14 64c2-10 9-17 18-17s16 7 18 17H14Z" fill={avatar.jacket} />
          <path d="M27 45h10l4 7H23l4-7Z" fill={avatar.shirt} />
          <path d="M28 39h8v8h-8z" fill={avatar.skin} />
          <circle cx="32" cy="26" r="11.5" fill={avatar.skin} />

          {avatar.variant === "wave" && (
            <>
              <path
                d="M20 24c0-9 5.2-15 12-15 8 0 14 6 14 14 0 2-.4 4-1.2 6-2.2-3.3-6.1-5.6-12.3-5.6-5 0-9.2 1.9-11.5 5.1-.7-1.7-1-3.1-1-4.5Z"
                fill={avatar.hair}
              />
              <path d="M18.5 29c.8-3.1 2.1-5.5 4-7l.8 10.8c-2.5-.4-4.3-1.6-4.8-3.8Z" fill={avatar.hair} opacity="0.92" />
              <path d="M45.5 22c1.7 1.9 2.8 4.3 3.1 7.2-.4 2.2-2.3 3.4-4.8 3.8L45.5 22Z" fill={avatar.hair} opacity="0.92" />
            </>
          )}

          {avatar.variant === "short" && (
            <>
              <path
                d="M20 24c0-9 5.3-15 12.1-15 7.7 0 13.9 6.1 13.9 14.6 0 1.9-.4 4-1.1 5.8-2.4-2.9-6.5-4.8-12.3-4.8-4.8 0-8.9 1.5-11.6 4.5-.7-1.5-1-3.1-1-5.1Z"
                fill={avatar.hair}
              />
              <path
                d="M21 23.5c2.3-4.5 6.2-6.9 11.5-6.9 5.1 0 8.9 2.2 11.3 6.6-3.1-1.8-6.8-2.8-11.3-2.8-4.4 0-8.3 1-11.5 3.1Z"
                fill={avatar.hair}
                opacity="0.88"
              />
            </>
          )}

          {avatar.variant === "bun" && (
            <>
              <circle cx="44.5" cy="16.5" r="4.5" fill={avatar.hair} />
              <path
                d="M20 24c0-9 5.1-15 12-15 8 0 14 6 14 15 0 1.8-.3 3.7-1.1 5.7-2.4-3.4-6.4-5.5-12.2-5.5-4.8 0-8.8 1.7-11.5 4.9-.8-1.6-1.2-3.4-1.2-5.1Z"
                fill={avatar.hair}
              />
              <path d="M19.5 29.4c.8-2.8 2-4.9 3.6-6.5l.6 10.1c-2.1-.4-3.8-1.5-4.2-3.6Z" fill={avatar.hair} opacity="0.92" />
            </>
          )}

          <circle cx="28.2" cy="27.4" r="1.1" fill="#14131A" opacity="0.16" />
          <circle cx="35.8" cy="27.4" r="1.1" fill="#14131A" opacity="0.16" />
          <path
            d="M28.8 31.2c1.3 1.3 5.1 1.3 6.4 0"
            stroke="#14131A"
            strokeOpacity="0.16"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {typeof rank === "number" && (
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-foreground text-[10px] font-semibold text-white shadow-sm">
          {rank}
        </div>
      )}
    </div>
  );
}

function DemoTabs({
  active,
  onChange,
}: {
  active: DemoViewId;
  onChange: (view: DemoViewId) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl rounded-full border border-[#E8E1F0] bg-[#F6F3FA] p-1.5">
      <div className="grid grid-cols-3 gap-1.5">
        {demoViewOrder.map((view) => {
          const isActive = active === view;

          return (
            <button
              key={view}
              type="button"
              onClick={() => onChange(view)}
              className={`relative rounded-full px-5 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive ? "text-foreground" : "text-foreground/62 hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="demo-shell-tab"
                  className="absolute inset-0 rounded-full border border-white/90 bg-white shadow-[0_10px_26px_rgba(20,19,26,0.08)]"
                  transition={{ type: "spring", bounce: 0.22, duration: 0.38 }}
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-2">
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                {demoViews[view].label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GlobalBoard() {
  return (
    <div className={boardSurfaceClass}>
      <div className="border-b border-border/45 px-6 pb-5 pt-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <SectionEyebrow>Global</SectionEyebrow>
            <h3 className="mt-2 text-[1.75rem] font-semibold tracking-tight text-foreground">
              Panorama comercial y alerta de negocio
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              La vista sintetiza volumen, rentabilidad, segmentos que sostienen el trimestre y la senal que hoy
              merece seguimiento ejecutivo.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            En vivo
          </span>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid gap-3 md:grid-cols-3">
          {globalKpis.map((kpi) => (
            <div key={kpi.label} className={`${softCardClass} px-4 py-4`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                {kpi.label}
              </p>
              <p className={`mt-2 text-[1.85rem] font-semibold tracking-tight ${kpi.tone}`}>{kpi.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{kpi.detail}</p>
            </div>
          ))}
        </div>

        <div className={`${softCardClass} mt-6 p-5`}>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionEyebrow>Lectura del trimestre</SectionEyebrow>
              <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">Ventas y margen por periodo</p>
            </div>
            <p className="text-xs font-medium text-muted-foreground">Q1 2026</p>
          </div>

          <div className="h-[17rem]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={globalTrendData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="demo-global-ventas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="demo-global-margen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#EEE8F5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#7C7888" }} axisLine={false} tickLine={false} />
                <YAxis width={34} tick={{ fontSize: 11, fill: "#7C7888" }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={<DemoTooltip />}
                  cursor={{ stroke: "#8B5CF6", strokeWidth: 1, strokeDasharray: "4 4", strokeOpacity: 0.28 }}
                />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#7E4CF4"
                  strokeWidth={2.2}
                  fill="url(#demo-global-ventas)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#7E4CF4", stroke: "#fff", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="margen"
                  stroke="#0EA5E9"
                  strokeWidth={2.2}
                  fill="url(#demo-global-margen)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#0EA5E9", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-0.5 w-5 rounded-full bg-[#7E4CF4]" />
              Ventas
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-0.5 w-5 rounded-full bg-[#0EA5E9]" />
              Margen
            </span>
          </div>
        </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className={`${softCardClass} p-5`}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <SectionEyebrow>Segmentos</SectionEyebrow>
                  <p className="mt-2 text-base font-semibold text-foreground">Que frente sostiene el trimestre</p>
              </div>
              <Target className="h-4 w-4 text-accent" />
            </div>

              <div className="divide-y divide-[#EEE8F5]">
                {globalSegments.map((segment) => (
                  <div key={segment.name} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-foreground">{segment.name}</p>
                      <div className="text-right">
                        <span className="block text-[11px] font-medium text-muted-foreground">{segment.share}</span>
                        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-accent/70">
                          {segment.margin}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{segment.note}</p>
                  </div>
                ))}
              </div>
            </div>

          <div className="rounded-[1.6rem] border border-amber-100 bg-amber-50/60 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <SectionEyebrow>Alerta ejecutiva</SectionEyebrow>
                <p className="mt-2 text-base font-semibold text-foreground">La senal clave no esta en vender mas. Esta en mezcla, margen y recompra.</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/76">
                  El trimestre sigue de pie por grandes cuentas, pero la erosion ya aparece donde se sostiene volumen con peor rentabilidad o baja recompra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RankingBoard() {
  return (
    <div className={boardSurfaceClass}>
      <div className="border-b border-border/45 px-6 pb-5 pt-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <SectionEyebrow>Ranking comercial</SectionEyebrow>
            <h3 className="mt-2 text-[1.75rem] font-semibold tracking-tight text-foreground">
              Quien llega a objetivo y como se construye ese resultado
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              No solo ordena cumplimiento. Tambien deja ver cartera activa, clientes nuevos y el margen que cada ejecutivo esta sosteniendo.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full border border-[#E7E0EF] bg-[#FBFAFD] px-3.5 py-2 text-xs font-medium text-foreground/70">
            Equipo comercial
          </span>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid gap-3 lg:grid-cols-2">
          {rankingPrimarySummary.map((stat) => (
            <div key={stat.label} className={`${softCardClass} px-5 py-5`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">{stat.label}</p>
              <p className="mt-3 text-[2.05rem] font-semibold tracking-tight text-foreground">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {rankingSecondarySummary.map((stat) => (
            <div key={stat.label} className={`${softCardClass} px-4 py-4`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">{stat.label}</p>
              <p className="mt-2 text-[1.6rem] font-semibold tracking-tight text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {rankingRows.map((seller, index) => (
            <div key={seller.seller} className={`${softCardClass} px-4 py-4`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                  <SellerAvatar rank={index + 1} avatar={seller.avatar} />
                  <div>
                    <p className="text-base font-semibold text-foreground">{seller.seller}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{seller.focus}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full border border-[#E7E0EF] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/72">
                        Total cartera {seller.totalPortfolio}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-[#E7E0EF] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/72">
                        {seller.totalClients}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left lg:text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">Total vendido</p>
                  <p className="mt-2 text-[1.7rem] font-semibold tracking-tight text-foreground">{seller.actual}</p>
                  <p className={`mt-1 text-sm font-medium ${seller.tone}`}>{seller.attainment}% vs objetivo</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{seller.gap} de brecha</span>
                  <span>{seller.target} objetivo</span>
                </div>
                <div className="h-2 rounded-full bg-muted/70">
                  <motion.div
                    className="h-2 rounded-full bg-[linear-gradient(90deg,#8A5CF6,#7111DF)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(seller.attainment, 110) / 1.1}%` }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {seller.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-[#ECE5F2] bg-white px-3 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioCoverageBar({ state }: { state: CoverageState }) {
  if (state === "active") {
    return <div className="h-2.5 rounded-full bg-[linear-gradient(90deg,#8A5CF6,#7111DF)]" />;
  }

  if (state === "opportunity") {
    return <div className="h-2.5 rounded-full border border-accent/25 bg-accent/12" />;
  }

  if (state === "constrained") {
    return <div className="h-2.5 rounded-full border border-amber-200 bg-amber-100" />;
  }

  return <div className="h-2.5 rounded-full bg-[#ECE7E1]" />;
}

function SellersActionBoard() {
  return (
    <div className={boardSurfaceClass}>
      <div className="border-b border-border/45 px-6 pb-5 pt-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <SectionEyebrow>Vista operativa</SectionEyebrow>
            <h3 className="mt-2 text-[1.75rem] font-semibold tracking-tight text-foreground">
              Cartera, foco y oportunidades por cliente
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Pensada para el vendedor: muestra cartera aperturada, categorias activas, huecos de linea y una senal operativa que cambia la prioridad comercial.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full border border-[#E7E0EF] bg-[#FBFAFD] px-3.5 py-2 text-xs font-medium text-foreground/70">
            Gestion de cartera
          </span>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid gap-3 md:grid-cols-3">
          {clientCoverageSummary.map((stat) => (
            <div key={stat.label} className={`${softCardClass} px-4 py-4`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">{stat.label}</p>
              <p className="mt-2 text-[1.6rem] font-semibold tracking-tight text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className={`${softCardClass} mt-5 px-5 py-5`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-3">
              <SellerAvatar avatar={selectedSeller.avatar} />
              <div className="max-w-2xl">
                <SectionEyebrow>Vendedor seleccionado</SectionEyebrow>
                <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{selectedSeller.seller}</p>
                <p className="mt-1 text-sm text-muted-foreground">{selectedSeller.area} / 22 clientes activos</p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/78">{selectedSeller.brief}</p>
              </div>
            </div>
            <div className="rounded-full border border-amber-100 bg-amber-50/70 px-4 py-2.5 text-[11px] font-medium text-amber-700 md:max-w-[19rem]">
              Stock sensible en Linea B para 2 cuentas prioritarias
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-6 rounded-full bg-[linear-gradient(90deg,#8A5CF6,#7111DF)]" />
            Compra activa
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-6 rounded-full border border-accent/25 bg-accent/12" />
            Baja penetracion
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-6 rounded-full border border-amber-200 bg-amber-100" />
            Restriccion por stock
          </span>
        </div>

        <div className="mt-6">
          <SectionEyebrow>Cartera de clientes</SectionEyebrow>
          <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">Donde conviene actuar primero</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Clientes donde hoy conviene actuar primero porque combinan volumen, categorias con baja penetracion y una prioridad operativa concreta.
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[#ECE5F2] bg-[#FCFBFE]">
          <div className="hidden grid-cols-[minmax(0,1.1fr)_120px_minmax(0,0.95fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.9fr)] gap-4 border-b border-[#ECE5F2] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60 lg:grid">
            <span>Cliente</span>
            <span>Volumen</span>
            <span>Compra hoy</span>
            <span>Categorias con baja penetracion</span>
            <span>Oportunidad sugerida</span>
            <span>Stock</span>
          </div>

          <div className="divide-y divide-[#ECE5F2]">
          {clientActionRows.map((client) => (
            <div key={client.client} className="bg-white px-4 py-4 lg:px-5">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_120px_minmax(0,0.95fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full border border-[#ECE5F2] bg-white p-1">
                      <SellerAvatar avatar={client.avatar} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{client.client}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Cuenta priorizada de su cartera</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">Cobertura de categorias</p>
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {portfolioLines.map((line, index) => (
                        <div key={line} className="space-y-2 text-center">
                          <PortfolioCoverageBar state={client.coverage[index]} />
                          <p className="text-[10px] font-medium text-muted-foreground">{line.replace("Linea ", "")}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#ECE5F2] bg-[#FCFBFE] px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">Volumen</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{client.volume}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{client.share}</p>
                </div>

                <div className="rounded-2xl border border-[#ECE5F2] bg-[#FCFBFE] px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">Compra hoy</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/82">{client.buys}</p>
                </div>

                <div className="rounded-2xl border border-[#ECE5F2] bg-[#FCFBFE] px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                    Categorias con baja penetracion
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/82">{client.misses}</p>
                </div>

                <div className="rounded-2xl border border-[#ECE5F2] bg-[#FCFBFE] px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                    Oportunidad sugerida
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/82">{client.opportunity}</p>
                </div>

                <div className={`rounded-2xl border px-4 py-3.5 ${client.stockTone}`}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-75">Stock</p>
                  <p className="mt-2 text-sm leading-relaxed">{client.stock}</p>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OpportunitiesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {signalOpportunityCards.map((card, index) => (
        <motion.article
          key={card.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: index * 0.04 }}
          className="flex h-full flex-col rounded-[1.7rem] border border-[#ECE5F2] bg-white p-6 shadow-[0_12px_28px_rgba(20,19,26,0.03)]"
        >
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
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/55">
                {card.detail}
              </p>
            </div>
            <span className="rounded-full border border-border/50 bg-[#FCFBFE] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/65">
              Visible
            </span>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export function DemoDashboard() {
  const [activeView, setActiveView] = useState<DemoViewId>("global");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  const renderBoard = () => {
    if (activeView === "global") {
      return <GlobalBoard />;
    }

    if (activeView === "ranking") {
      return <RankingBoard />;
    }

    return <SellersActionBoard />;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header />

      <main>
        <section
          id="demo-dashboard"
          className="relative overflow-hidden border-b border-border/30 pb-20 pt-32 lg:pb-24 lg:pt-36"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 bg-white" />
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[34rem]"
            style={{
              background: "radial-gradient(ellipse at top, rgba(113,17,223,0.08) 0%, rgba(113,17,223,0.02) 35%, transparent 68%)",
            }}
          />

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-white/90 px-4 py-2 shadow-[0_10px_26px_rgba(20,19,26,0.04)]">
                <TrendingUp className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold tracking-[0.16em] text-accent">DEMO GUIADA</span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[0.96] tracking-tight text-foreground md:text-[3.7rem]">
                Demo interactiva de dashboard de ventas
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Tres vistas para entender volumen, desempeno del equipo y focos de accion sin que la experiencia se sienta como un reporte tecnico partido en bloques.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-12 max-w-[72rem] rounded-[2.5rem] border border-[#ECE5F2] bg-[#FFFEFC] shadow-[0_30px_90px_rgba(20,19,26,0.06)]"
            >
              <div className="px-6 pb-0 pt-8 sm:px-8 sm:pt-10 lg:px-10">
                <SectionEyebrow>Lente de analisis</SectionEyebrow>
                <div className="mt-6">
                  <DemoTabs active={activeView} onChange={setActiveView} />
                </div>
                <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground md:text-[0.98rem]">
                  {demoViews[activeView].description}
                </p>
              </div>

              <div className="px-4 pb-0 pt-8 sm:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {renderBoard()}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="border-t border-[#ECE5F2] px-6 py-7 sm:px-8 lg:px-10">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div className="max-w-2xl">
                    <SectionEyebrow>Cierre de demo</SectionEyebrow>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground lg:text-[2rem]">
                      Que mas puede incluir un dashboard como este
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                      Ademas de estas tres vistas, la misma solucion puede abrir alertas sobre cartera dormida, mix, penetracion, pricing y tiempo operativo. Si queres aterrizarlo a tu caso real, el siguiente paso es ordenar prioridades reales.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                    <a
                      href="#oportunidades"
                      onClick={(event) => handleAnchorClick(event, "oportunidades")}
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#DED5EA] bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/25 hover:text-accent"
                    >
                      Ver otros indicadores posibles
                    </a>
                    <a
                      href={ROOT_DIAGNOSTIC_SECTION_HREF}
                      onClick={() => trackDiagnosisClick("demo_final_cta")}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#7E4CF4,#7111DF)] px-6 py-3 text-sm font-medium text-white shadow-[0_18px_40px_rgba(113,17,223,0.18)] transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      Agendar diagnostico
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="oportunidades" className="scroll-mt-32 border-b border-border/30 bg-white py-16 lg:scroll-mt-36 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <SectionEyebrow>Otros indicadores posibles</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground lg:text-[2.7rem]">
                Otras alertas y focos de accion que tambien puede volver visibles.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Esta demo muestra tres lentes principales, pero la misma arquitectura puede abrir lecturas sobre recuperacion de cartera, rentabilidad, penetracion y automatizacion operativa.
              </p>
            </motion.div>

            <div className="mt-10">
              <OpportunitiesGrid />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="mt-10 rounded-[1.9rem] border border-[#ECE5F2] bg-[#FCFBFE] px-6 py-6"
            >
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                El valor no esta en acumular pantallas. Esta en elegir que senales conviene volver visibles primero segun tu cartera, tu oferta y la forma en que hoy se toman decisiones comerciales.
              </p>
            </motion.div>
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
    </div>
  );
}
