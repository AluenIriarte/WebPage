import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BarChart2,
  Clock3,
  Layers3,
  Linkedin,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "../components/Header";
import { trackDiagnosisClick } from "../lib/analytics";
import { ROOT_DIAGNOSTIC_SECTION_HREF } from "../lib/contact";

const LINKEDIN_URL = "https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true";

const shellClass =
  "overflow-hidden rounded-[2.1rem] border border-[#E8E1EF] bg-[#FBFAFD] shadow-[0_28px_84px_rgba(20,19,26,0.06)]";
const moduleClass = "rounded-[1.55rem] border border-[#ECE5F2] bg-white";
const softCardClass = "rounded-[1.1rem] border border-[#ECE5F2] bg-white";

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
      "Lectura general para ver volumen, margen y donde aparece el desvio comercial mas visible.",
  },
  ranking: {
    label: "Ranking comercial",
    description:
      "Resultado por ejecutivo para entender quien llega al objetivo y con que base comercial lo sostiene.",
  },
  vendedores: {
    label: "Vendedores",
    description:
      "Vista accionable para trabajar cartera, cobertura de portafolio y oportunidades por cliente.",
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

const globalSummary = [
  { label: "Ventas del trimestre", value: "$1.48M", detail: "+8% vs trimestre previo" },
  { label: "Margen medio", value: "28.4%", detail: "-0.9 pts en distribuidores" },
  { label: "Segmento dominante", value: "42%", detail: "grandes cuentas del ingreso" },
  { label: "Alerta ejecutiva", value: "Distribuidores", detail: "cae recompra y cede mezcla", tone: "alert" as const },
] as const;

const globalRegionData = [
  { region: "Centro", ventas: 320, margen: 31 },
  { region: "Norte", ventas: 270, margen: 28 },
  { region: "Sur", ventas: 214, margen: 26 },
  { region: "Litoral", ventas: 248, margen: 29 },
  { region: "NOA", ventas: 196, margen: 24 },
];

const rankingSummary = [
  { label: "Total vendido", value: "$1.18M", detail: "periodo actual" },
  { label: "Vs objetivo", value: "100%", detail: "$1.18M sobre $1.18M objetivo" },
  { label: "Total cartera", value: "$3.15M", detail: "base activa del equipo" },
  { label: "Clientes activos", value: "61", detail: "11 nuevos en el periodo" },
] as const;

const rankingRows = [
  {
    seller: "Sofia Gomez",
    focus: "Grandes cuentas",
    soldLabel: "$448K",
    targetLabel: "$420K",
    attainment: 107,
    portfolio: "$1.26M",
    clients: "18",
    newClients: "4",
    margin: "29%",
    avatar: avatarStyles.violetWave,
  },
  {
    seller: "Martin Rivas",
    focus: "Cartera corporativa",
    soldLabel: "$391K",
    targetLabel: "$405K",
    attainment: 97,
    portfolio: "$980K",
    clients: "22",
    newClients: "3",
    margin: "22%",
    avatar: avatarStyles.slateShort,
  },
  {
    seller: "Lucia Perez",
    focus: "Cuentas estrategicas",
    soldLabel: "$336K",
    targetLabel: "$350K",
    attainment: 96,
    portfolio: "$910K",
    clients: "21",
    newClients: "4",
    margin: "24%",
    avatar: avatarStyles.clayBun,
  },
  {
    seller: "Nicolas Vera",
    focus: "Canal interior",
    soldLabel: "$304K",
    targetLabel: "$315K",
    attainment: 97,
    portfolio: "$840K",
    clients: "17",
    newClients: "2",
    margin: "21%",
    avatar: avatarStyles.mossWave,
  },
] as const;

const selectedSeller = {
  seller: "Martin Rivas",
  area: "Cartera corporativa",
  avatar: avatarStyles.slateShort,
};

const sellerSummary = [
  { label: "Clientes activos", value: "42", detail: "5 nuevos este mes" },
  { label: "Cartera total", value: "$580K", detail: "+11.5% vs mes anterior" },
  { label: "Oportunidades", value: "18", detail: "para ampliar categorias" },
] as const;

const clientRows = [
  {
    name: "Grupo Solaris",
    revenue: "$118K",
    coverage: 46,
    buys: ["Linea A", "Linea C"],
    doesntBuy: ["Linea B", "Linea D"],
    opportunity: "Completar Linea D industrial",
    priority: "high" as const,
  },
  {
    name: "Logistica Central",
    revenue: "$96K",
    coverage: 58,
    buys: ["Linea A", "Linea D"],
    doesntBuy: ["Linea B", "Linea E"],
    opportunity: "Abrir Linea E con bundle de reposicion",
    priority: "high" as const,
  },
  {
    name: "Comercial Andes",
    revenue: "$94K",
    coverage: 72,
    buys: ["Linea A", "Linea C", "Linea D"],
    doesntBuy: ["Linea E"],
    opportunity: "Probar Linea E con reposicion rapida",
    priority: "medium" as const,
  },
  {
    name: "TechParts SRL",
    revenue: "$83K",
    coverage: 39,
    buys: ["Linea A", "Linea E"],
    doesntBuy: ["Linea C", "Linea D"],
    opportunity: "Completar Linea C antes de abrir linea nueva",
    priority: "medium" as const,
  },
  {
    name: "Distribuidora Norte",
    revenue: "$71K",
    coverage: 51,
    buys: ["Linea B", "Linea C"],
    doesntBuy: ["Linea A", "Linea E"],
    opportunity: "Mover Linea A si mejora disponibilidad",
    priority: "medium" as const,
  },
] as const;

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
    <div className="mx-auto max-w-2xl rounded-full border border-[#E8E1F0] bg-[#F6F3FA] p-1">
      <div className="grid grid-cols-3 gap-1">
        {demoViewOrder.map((view) => {
          const isActive = active === view;

          return (
            <button
              key={view}
              type="button"
              onClick={() => onChange(view)}
              className={`relative rounded-full px-3 py-2.5 text-sm font-medium transition-colors duration-200 sm:px-5 ${
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

function CompactKpiCard({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "alert";
}) {
  const isAlert = tone === "alert";

  return (
    <div className={`${softCardClass} px-4 py-4 ${isAlert ? "border-amber-200 bg-amber-50/35" : ""}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">{label}</p>
      <p className="mt-2 text-[1.45rem] font-semibold tracking-tight text-foreground">{value}</p>
      <p className={`mt-1 text-xs leading-relaxed ${isAlert ? "text-amber-700" : "text-muted-foreground"}`}>{detail}</p>
    </div>
  );
}

function GlobalTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color?: string; name?: string; value?: number; dataKey?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[132px] rounded-xl border border-[#E8E1EF] bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{label}</p>
      <div className="mt-2 space-y-1.5">
        {payload.map((entry, index) => (
          <div key={`${entry.dataKey}-${index}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
              <span className="text-muted-foreground">{entry.name}</span>
            </div>
            <span className="font-medium text-foreground">
              {entry.dataKey === "ventas" ? `$${entry.value}K` : `${entry.value}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GlobalBoard() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {globalSummary.map((item) => (
          <CompactKpiCard key={item.label} label={item.label} value={item.value} detail={item.detail} tone={item.tone} />
        ))}
      </div>

      <div className={`${moduleClass} flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">Lectura del trimestre</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Volumen y margen por region</h3>
          </div>
          <span className="rounded-full border border-[#E8E1EF] bg-[#FBFAFD] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
            Q1 2026
          </span>
        </div>

        <div className="mt-4 min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={globalRegionData} margin={{ top: 8, right: 6, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1ECF6" vertical={false} />
              <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#9A93A9" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#9A93A9" }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}K`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9A93A9" }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<GlobalTooltip />} cursor={{ fill: "rgba(113,17,223,0.04)" }} />
              <Bar yAxisId="left" dataKey="ventas" name="Ventas" fill="#7E4CF4" radius={[8, 8, 0, 0]} maxBarSize={56} />
              <Line yAxisId="right" type="monotone" dataKey="margen" name="Margen" stroke="#655F7F" strokeWidth={2.5} dot={{ r: 3, fill: "#655F7F" }} activeDot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function RankingBoard() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {rankingSummary.map((item) => (
          <CompactKpiCard key={item.label} label={item.label} value={item.value} detail={item.detail} />
        ))}
      </div>

      <div className={`${moduleClass} flex min-h-0 flex-1 flex-col overflow-hidden`}>
        <div className="flex items-center justify-between gap-4 border-b border-[#ECE5F2] px-4 py-4 sm:px-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">Equipo comercial</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Resultado por ejecutivo</h3>
          </div>
          <span className="rounded-full border border-[#E8E1EF] bg-[#FBFAFD] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
            periodo actual
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <div className="min-w-[52rem]">
            <div className="grid grid-cols-[minmax(0,1.25fr)_0.95fr_1fr_0.95fr_0.72fr_0.72fr_0.72fr] gap-4 border-b border-[#ECE5F2] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60 sm:px-5">
              <span>Vendedor</span>
              <span>Total vendido</span>
              <span>Vs objetivo</span>
              <span>Total cartera</span>
              <span>Clientes</span>
              <span>Nuevos</span>
              <span>Margen</span>
            </div>

            <div className="divide-y divide-[#ECE5F2]">
              {rankingRows.map((seller, index) => (
                <div key={seller.seller} className="grid grid-cols-[minmax(0,1.25fr)_0.95fr_1fr_0.95fr_0.72fr_0.72fr_0.72fr] items-center gap-4 px-4 py-4 sm:px-5">
                  <div className="flex items-start gap-3">
                    <SellerAvatar rank={index + 1} avatar={seller.avatar} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground sm:text-[15px]">{seller.seller}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{seller.focus}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-base font-semibold tracking-tight text-foreground">{seller.soldLabel}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${seller.attainment >= 100 ? "text-emerald-600" : "text-amber-600"}`}>
                        {seller.attainment}%
                      </p>
                      <p className="text-[11px] text-muted-foreground">{seller.targetLabel} obj.</p>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[#EFEAF5]">
                      <div className="h-2 rounded-full bg-[linear-gradient(90deg,#8A5CF6,#7111DF)]" style={{ width: `${Math.min(seller.attainment, 110) / 1.1}%` }} />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">{seller.portfolio}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">{seller.clients}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">{seller.newClients}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">{seller.margin}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SellersActionBoard() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className={`${softCardClass} flex items-center justify-between gap-4 px-4 py-4`}>
        <div className="flex items-center gap-3">
          <SellerAvatar avatar={selectedSeller.avatar} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">Vendedor seleccionado</p>
            <p className="mt-1 text-base font-semibold tracking-tight text-foreground">{selectedSeller.seller}</p>
          </div>
        </div>
        <span className="rounded-full border border-[#E8E1EF] bg-[#FBFAFD] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
          {selectedSeller.area}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {sellerSummary.map((item) => (
          <CompactKpiCard key={item.label} label={item.label} value={item.value} detail={item.detail} />
        ))}
        <div className={`${softCardClass} border-amber-200 bg-amber-50/40 px-4 py-4`}>
          <div className="flex items-center gap-2 text-amber-700">
            <Package className="h-4 w-4" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">Alerta de stock</p>
          </div>
          <p className="mt-2 text-base font-semibold tracking-tight text-foreground">Linea C limitada</p>
          <p className="mt-1 text-xs text-amber-700">Priorizar Lineas A y B en las cuentas de mayor volumen.</p>
        </div>
      </div>

      <div className={`${moduleClass} flex min-h-0 flex-1 flex-col p-4 sm:p-5`}>
        <div className="shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">Cartera por cliente</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Oportunidades de ampliacion</h3>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-auto pr-1">
          <div className="space-y-4">
            {clientRows.map((client, index) => (
              <div key={client.name} className={`${index < clientRows.length - 1 ? "border-b border-[#F1ECF6] pb-4" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold tracking-tight text-foreground">{client.name}</p>
                      {client.priority === "high" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                          <TrendingUp className="h-3 w-3" />
                          Alta oportunidad
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Aporte mensual: {client.revenue}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Cobertura de portafolio</span>
                    <span className="font-medium text-foreground">{client.coverage}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#EFE9F6]">
                    <div className="h-full rounded-full bg-[#7111DF]" style={{ width: `${client.coverage}%` }} />
                  </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[11px] font-medium text-muted-foreground">Compra</p>
                    <div className="flex flex-wrap gap-1.5">
                      {client.buys.map((item) => (
                        <span key={item} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-[11px] font-medium text-muted-foreground">No compra aun</p>
                    <div className="flex flex-wrap gap-1.5">
                      {client.doesntBuy.map((item) => (
                        <span key={item} className="rounded-full bg-[#F3F1EE] px-2 py-0.5 text-[11px] text-muted-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#7111DF]/10 bg-[#7111DF]/5 px-3 py-2">
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-accent" />
                  <p className="text-xs text-muted-foreground">{client.opportunity}</p>
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
                Demo interactiva de tablero comercial
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Tres vistas para entender volumen, desempeno y oportunidades de accion dentro de una misma experiencia de producto.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`mx-auto mt-12 flex h-[min(54rem,calc(100dvh-8rem))] min-h-[34rem] max-w-[76rem] flex-col ${shellClass}`}
            >
              <div className="border-b border-[#ECE5F2] px-5 py-5 sm:px-8">
                <DemoTabs active={activeView} onChange={setActiveView} />
                <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
                  {demoViews[activeView].description}
                </p>
              </div>

              <div className="min-h-0 flex-1 px-4 py-4 sm:px-6 sm:py-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full"
                  >
                    {renderBoard()}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="border-t border-[#ECE5F2] bg-white px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <SectionEyebrow>Cierre de demo</SectionEyebrow>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Que mas puede incluir un tablero como este.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href="#oportunidades"
                      onClick={(event) => handleAnchorClick(event, "oportunidades")}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#DED5EA] bg-white px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/25 hover:text-accent"
                    >
                      Ver otros indicadores posibles
                    </a>
                    <a
                      href={ROOT_DIAGNOSTIC_SECTION_HREF}
                      onClick={() => trackDiagnosisClick("demo_final_cta")}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#7E4CF4,#7111DF)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_18px_40px_rgba(113,17,223,0.18)] transition-transform duration-200 hover:-translate-y-0.5"
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
