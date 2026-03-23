import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, BarChart2, Clock, Layers3, Linkedin, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { Header } from "../components/Header";
import { InteractiveDashboard } from "../components/HeroDashboard";
import { trackDiagnosisClick } from "../lib/analytics";
import { ROOT_DIAGNOSTIC_SECTION_HREF } from "../lib/contact";

const LINKEDIN_URL = "https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true";

const heroPreviewSections = [
  { id: "vista-ejecutiva", label: "Vista ejecutiva" },
  { id: "ranking-vendedores", label: "Ranking comercial" },
  { id: "mix-producto", label: "Mix de producto" },
] as const;

type HeroPreviewId = (typeof heroPreviewSections)[number]["id"];
type SellerAvatarVariant = "wave" | "short" | "bun";
type MixClientId = "distribuidora-norte" | "grupo-solaris" | "comercial-andes";
type MatrixState = "active" | "gap" | "none";

const heroPreviewDetails: Record<HeroPreviewId, { eyebrow: string; title: string; description: string }> = {
  "vista-ejecutiva": {
    eyebrow: "Vista activa",
    title: "Lectura general para entender si el resultado se sostiene.",
    description:
      "En una sola vista muestra actividad, margen y expansion para responder rapido si el negocio esta sano o si ya hay senales de deterioro.",
  },
  "ranking-vendedores": {
    eyebrow: "Vista activa",
    title: "Ranking comercial para ver quien cumple y donde intervenir primero.",
    description:
      "Ordena seguimiento por ejecutivo, brecha contra objetivo y prioridad inmediata de acompanamiento sin llenar la pantalla de reportes.",
  },
  "mix-producto": {
    eyebrow: "Vista activa",
    title: "Mix por cliente para detectar huecos de linea y expansion.",
    description:
      "Separa compra activa, huecos del catalogo y oportunidad de cross-sell con una lectura simple de que conviene empujar primero.",
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
  midnightShort: {
    background: "#EEF1FF",
    skin: "#D7A887",
    hair: "#1E2237",
    jacket: "#5865F2",
    shirt: "#F7F8FF",
    variant: "short" as SellerAvatarVariant,
  },
  mossWave: {
    background: "#EEF6EC",
    skin: "#E6B89A",
    hair: "#4A5A36",
    jacket: "#3E8C52",
    shirt: "#F8FCF8",
    variant: "wave" as SellerAvatarVariant,
  },
  wineBun: {
    background: "#FFF0F4",
    skin: "#EDC3AE",
    hair: "#6C3650",
    jacket: "#C34D73",
    shirt: "#FFF8FA",
    variant: "bun" as SellerAvatarVariant,
  },
} as const;

const rankingBoardData = {
  eyebrow: "Vista comercial",
  title: "Ranking comercial por ejecutivo",
  subtitle:
    "La lectura baja del resultado general al equipo para ver quien sostiene la meta y donde intervenir primero.",
  summary: [
    { label: "Cumplimiento promedio", value: "100%" },
    { label: "Sobre meta", value: "1 ejecutivo" },
    { label: "Brecha recuperable", value: "$28K" },
  ],
  note: {
    title: "La brecha recuperable esta concentrada en dos ejecutivos, no en todo el equipo.",
    detail:
      "Sofia ya sostiene la meta del frente principal. El foco comercial inmediato esta en Martin y Lucia, que juntos concentran $28K recuperables sin ampliar cobertura ni sumar mas pipeline.",
    metric: "$28K",
    metricLabel: "para volver a meta",
  },
  sellers: [
    {
      seller: "Sofia Gomez",
      focus: "Grandes cuentas",
      actual: "$448K",
      target: "$420K",
      attainment: 107,
      gap: "+$28K",
      tone: "text-emerald-600",
      avatar: avatarStyles.violetWave,
    },
    {
      seller: "Martin Rivas",
      focus: "Cartera corporativa",
      actual: "$391K",
      target: "$405K",
      attainment: 97,
      gap: "-$14K",
      tone: "text-amber-600",
      avatar: avatarStyles.slateShort,
    },
    {
      seller: "Lucia Perez",
      focus: "Cuentas estrategicas",
      actual: "$336K",
      target: "$350K",
      attainment: 96,
      gap: "-$14K",
      tone: "text-amber-600",
      avatar: avatarStyles.clayBun,
    },
  ],
} as const;

const mixColumns = ["Linea A", "Linea B", "Linea C", "Linea D", "Linea E"] as const;

const mixMatrixRows = [
  {
    id: "distribuidora-norte",
    label: "Distribuidora Norte",
    cells: ["active", "active", "gap", "active", "none"] as MatrixState[],
  },
  {
    id: "grupo-solaris",
    label: "Grupo Solaris",
    cells: ["active", "gap", "active", "gap", "none"] as MatrixState[],
  },
  {
    id: "comercial-andes",
    label: "Comercial Andes",
    cells: ["active", "active", "active", "gap", "active"] as MatrixState[],
  },
  {
    id: "industrial-mendez",
    label: "Industrial Mendez",
    cells: ["none", "active", "none", "gap", "none"] as MatrixState[],
  },
  {
    id: "logistica-central",
    label: "Logistica Central",
    cells: ["active", "none", "gap", "active", "active"] as MatrixState[],
  },
  {
    id: "techparts",
    label: "TechParts SRL",
    cells: ["active", "active", "active", "active", "none"] as MatrixState[],
  },
] as const;

const mixClientInsights = {
  "distribuidora-norte": {
    eyebrow: "Mix por cliente",
    title: "Huecos de linea y cross-sell potencial",
    description: "La cuenta compra bien las lineas base, pero todavia deja espacio claro en el catalogo medio.",
    stats: [
      { label: "Mix incompleto", value: "68%", detail: "sobre catalogo vigente" },
      { label: "Huecos detectados", value: "4", detail: "lineas para abrir" },
      { label: "Mayor potencial", value: "Linea C", detail: "cross-sell inmediato" },
    ],
    note: "Aca no falta volumen: falta completar mezcla con una propuesta mas ordenada.",
  },
  "grupo-solaris": {
    eyebrow: "Mix por cliente",
    title: "Cobertura irregular entre lineas",
    description: "Grupo Solaris ya compra volumen, pero deja huecos claros donde todavia hay margen por capturar.",
    stats: [
      { label: "Mix incompleto", value: "61%", detail: "sobre lineas activas" },
      { label: "Huecos detectados", value: "5", detail: "lineas para priorizar" },
      { label: "Mayor potencial", value: "Linea D", detail: "entrada natural" },
    ],
    note: "Conviene ordenar propuesta antes de seguir empujando descuento o frecuencia.",
  },
  "comercial-andes": {
    eyebrow: "Mix por cliente",
    title: "Cuenta madura con una brecha puntual",
    description: "La cuenta ya compra varias lineas, pero todavia queda una pieza concreta con potencial directo.",
    stats: [
      { label: "Mix incompleto", value: "42%", detail: "mas completo que el promedio" },
      { label: "Huecos detectados", value: "2", detail: "faltantes reales" },
      { label: "Mayor potencial", value: "Linea D", detail: "mayor ticket incremental" },
    ],
    note: "Cuando la cuenta ya esta madura, la lectura fina del mix vale mas que sumar mas volumen ciego.",
  },
} as const;

const signalOpportunityCards = [
  {
    icon: Users,
    title: "Clientes inactivos",
    description: "Cuentas con peso comercial que dejaron de comprar y conviene recuperar antes de abrir mas frente nuevo.",
    metric: "12 cuentas",
    detail: "sin actividad reciente",
    tone: "text-violet-600",
  },
  {
    icon: BarChart2,
    title: "Mix volumen / margen",
    description: "Productos que sostienen volumen, pero esconden una brecha clara de margen que hoy no esta siendo priorizada.",
    metric: "40%+",
    detail: "margen subaprovechado",
    tone: "text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Up-sell y cross-sell",
    description: "Clientes que ya compran una linea y tienen expansion directa sobre otra categoria con entrada natural.",
    metric: "+34%",
    detail: "margen incremental",
    tone: "text-sky-600",
  },
  {
    icon: ShoppingCart,
    title: "Productos subpenetrados",
    description: "Lineas con baja penetracion sobre la cartera mas valiosa, donde la oportunidad depende mas de foco que de demanda nueva.",
    metric: "15%",
    detail: "penetracion actual",
    tone: "text-amber-600",
  },
  {
    icon: Layers3,
    title: "Afinidad por categoria",
    description: "Segmentos que responden mejor a familias premium y permiten ordenar mejor el mix sin depender de intuicion.",
    metric: "3x",
    detail: "mayor afinidad detectada",
    tone: "text-fuchsia-600",
  },
  {
    icon: Clock,
    title: "Automatizacion operativa",
    description: "Horas de reporte manual que se pueden devolver al equipo para seguimiento, analisis y accion comercial.",
    metric: "-8h",
    detail: "por semana",
    tone: "text-cyan-600",
  },
] as const;

function SellerAvatar({
  rank,
  avatar,
}: {
  rank: number;
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

      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-foreground text-[10px] font-semibold text-white shadow-sm">
        {rank}
      </div>
    </div>
  );
}

function DemoViewSelector({
  active,
  onChange,
  layoutId,
}: {
  active: HeroPreviewId;
  onChange: (view: HeroPreviewId) => void;
  layoutId: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-[#E6E0EE] bg-[#FCFBFE] p-2 shadow-[0_14px_34px_rgba(20,19,26,0.04)]">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {heroPreviewSections.map((section) => {
          const isActive = active === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onChange(section.id)}
              className={`relative min-h-[4.2rem] rounded-[1.2rem] px-5 py-4 text-sm font-semibold leading-tight transition-colors ${
                isActive ? "text-white" : "text-foreground/78 hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-[1.2rem] bg-[linear-gradient(135deg,#7E4CF4,#7111DF)] shadow-[0_16px_34px_rgba(113,17,223,0.22)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.38 }}
                />
              )}
              <span className="relative z-10">{section.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SellerRankingBoard() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-[1.8rem] border border-border/60 bg-white shadow-[0_24px_70px_rgba(20,19,26,0.06)]">
      <div className="border-b border-border/45 px-5 pb-4 pt-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
              {rankingBoardData.eyebrow}
            </p>
            <h3 className="mt-2 text-[1.75rem] font-semibold tracking-tight text-foreground">
              {rankingBoardData.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {rankingBoardData.subtitle}
            </p>
          </div>
          <Users className="mt-1 h-5 w-5 text-accent" />
        </div>
      </div>

      <div className="flex h-full flex-col px-5 pb-5 pt-5">
        <div className="mb-5 grid gap-3 md:grid-cols-3">
          {rankingBoardData.summary.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#ECE6F2] bg-[#FCFBFE] px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                {stat.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 space-y-3">
          {rankingBoardData.sellers.map((seller, index) => (
            <div key={seller.seller} className="rounded-2xl border border-[#ECE6F2] bg-[#FCFBFE] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <SellerAvatar rank={index + 1} avatar={seller.avatar} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{seller.seller}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{seller.focus}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-semibold ${seller.tone}`}>{seller.attainment}%</p>
                  <p className="text-[11px] text-muted-foreground">{seller.gap}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{seller.actual} actual</span>
                  <span>{seller.target} objetivo</span>
                </div>
                <div className="h-2 rounded-full bg-muted/70">
                  <motion.div
                    className="h-2 rounded-full bg-[linear-gradient(90deg,#8A5CF6,#7111DF)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(seller.attainment, 100)}%` }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 rounded-[1.6rem] border border-[#E4DDF0] bg-[#FAF8FD] px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/65">Lectura ejecutiva</p>
            <p className="mt-2 text-base font-medium tracking-tight text-foreground">{rankingBoardData.note.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/76">{rankingBoardData.note.detail}</p>
          </div>
          <div className="rounded-2xl border border-accent/12 bg-white px-4 py-3 md:min-w-[10rem]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
              Prioridad ahora
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-accent">{rankingBoardData.note.metric}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{rankingBoardData.note.metricLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MixStatusSquare({
  state,
  isHighlighted,
}: {
  state: MatrixState;
  isHighlighted: boolean;
}) {
  const baseClass = "h-5 w-5 rounded-[6px] border transition-all duration-200";

  if (state === "active") {
    return (
      <div
        className={`${baseClass} ${isHighlighted ? "scale-105 shadow-[0_6px_14px_rgba(113,17,223,0.22)]" : ""}`}
        style={{
          background: "linear-gradient(135deg, #8A5CF6 0%, #7111DF 100%)",
          borderColor: "#7A3FF0",
        }}
      />
    );
  }

  if (state === "gap") {
    return (
      <div
        className={`${baseClass} ${isHighlighted ? "scale-105" : ""}`}
        style={{
          background: "#E8E2F5",
          borderColor: "#D8CEE9",
        }}
      />
    );
  }

  return (
    <div
      className={baseClass}
      style={{
        background: "#F2EFEB",
        borderColor: "#E6DFD7",
      }}
    />
  );
}

function ProductSignalBoard() {
  const selectedClient: MixClientId = "distribuidora-norte";
  const currentInsight = mixClientInsights[selectedClient];
  const visibleRows = mixMatrixRows;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-[1.8rem] border border-border/60 bg-white shadow-[0_24px_70px_rgba(20,19,26,0.06)]">
      <div className="border-b border-border/45 px-5 pb-4 pt-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
              {currentInsight.eyebrow}
            </p>
            <h3 className="mt-2 text-[1.75rem] font-semibold tracking-tight text-foreground">
              {currentInsight.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {currentInsight.description}
            </p>
          </div>
          <Layers3 className="mt-1 h-5 w-5 text-accent" />
        </div>

      </div>

      <div className="flex h-full flex-col px-5 pb-5 pt-5">
        <div className="mb-5 grid gap-3 md:grid-cols-3">
          {currentInsight.stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#ECE6F2] bg-[#FCFBFE] px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{stat.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className="mb-4 rounded-[1.6rem] border border-[#E4DDF0] bg-[#FAF8FD] px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/65">Decision sugerida</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">{currentInsight.note}</p>
        </div>

        <div className="flex-1 overflow-hidden rounded-[1.5rem] border border-[#E8E2EE] bg-white">
          <div className="overflow-x-auto">
            <div className="min-w-[42rem]">
              <div className="grid grid-cols-[1.6fr_repeat(5,0.7fr)] gap-2 border-b border-border/45 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                <span>Cliente</span>
                {mixColumns.map((column) => (
                  <span key={column} className="text-center">
                    {column}
                  </span>
                ))}
              </div>

              <div className="divide-y divide-border/45">
                {visibleRows.map((row) => {
                  const isHighlighted = row.id === selectedClient;

                  return (
                    <div
                      key={row.id}
                      className={`grid grid-cols-[1.6fr_repeat(5,0.7fr)] items-center gap-2 px-4 py-3 transition-colors ${
                        isHighlighted ? "bg-accent/[0.05]" : "bg-transparent"
                      }`}
                    >
                      <span className={`text-sm ${isHighlighted ? "font-semibold text-foreground" : "text-foreground/76"}`}>
                        {row.label}
                      </span>
                      {row.cells.map((cell, index) => (
                        <div key={`${row.id}-${index}`} className="flex justify-center">
                          <MixStatusSquare state={cell} isHighlighted={isHighlighted} />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <MixStatusSquare state="active" isHighlighted={false} />
            <span>Compra activa</span>
          </div>
          <div className="flex items-center gap-2">
            <MixStatusSquare state="gap" isHighlighted={false} />
            <span>Hueco con oportunidad</span>
          </div>
          <div className="flex items-center gap-2">
            <MixStatusSquare state="none" isHighlighted={false} />
            <span>Sin senal prioritaria</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemoDashboard() {
  const [heroPreview, setHeroPreview] = useState<HeroPreviewId>("vista-ejecutiva");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  const activeView = heroPreviewDetails[heroPreview];

  const renderBoard = () => {
    if (heroPreview === "vista-ejecutiva") {
      return <InteractiveDashboard />;
    }

    if (heroPreview === "ranking-vendedores") {
      return <SellerRankingBoard />;
    }

    return <ProductSignalBoard />;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header />
      <main>
        <section
          id="demo-dashboard"
          className="relative overflow-hidden border-b border-border/30 bg-white pb-20 pt-32 lg:pb-24 lg:pt-36"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[540px] opacity-60"
            style={{
              background: "radial-gradient(ellipse at top right, rgba(113,17,223,0.08) 0%, transparent 60%)",
            }}
          />

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-white/78 px-4 py-2">
                <TrendingUp className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold tracking-[0.14em] text-accent">Demo guiada</span>
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-[0.96] tracking-tight text-foreground md:text-[3.8rem]">
                Dashboard de ventas para decidir con foco comercial.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Recorre una demo real con tres vistas que ordenan lectura ejecutiva, desempeno del equipo y
                oportunidades de mix dentro de una sola experiencia.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12"
            >
              <div className="mx-auto max-w-3xl">
                <DemoViewSelector active={heroPreview} onChange={setHeroPreview} layoutId="detail-preview-pill" />
              </div>

              <div className="mx-auto mt-8 max-w-3xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                  {activeView.eyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground lg:text-[2.4rem]">
                  {activeView.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[0.98rem]">
                  {activeView.description}
                </p>
              </div>

              <div className="mx-auto mt-8 max-w-[66rem]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`detail-${heroPreview}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {renderBoard()}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mx-auto mt-8 max-w-[66rem]">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a
                      href={ROOT_DIAGNOSTIC_SECTION_HREF}
                      onClick={() => trackDiagnosisClick("demo_primary_cta")}
                      className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#7E4CF4,#7111DF)] px-7 py-3.5 text-sm font-medium text-white shadow-[0_18px_40px_rgba(113,17,223,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(113,17,223,0.24)]"
                    >
                      Agendar diagnostico
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <a
                      href="#oportunidades"
                      onClick={(event) => handleAnchorClick(event, "oportunidades")}
                      className="inline-flex min-h-14 items-center justify-center rounded-full border border-border/65 bg-white px-7 py-3.5 text-sm font-medium text-foreground shadow-[0_10px_24px_rgba(20,19,26,0.04)] transition-all duration-200 hover:border-accent/25 hover:text-accent hover:shadow-[0_16px_30px_rgba(20,19,26,0.07)]"
                    >
                      Ver otras oportunidades
                    </a>
                  </div>

                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Prefiero escribir por LinkedIn
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="oportunidades" className="scroll-mt-32 border-b border-border/30 bg-[#FFFEFC] py-16 lg:scroll-mt-36 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
              className="max-w-3xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                Senales clave
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground lg:text-[2.7rem]">
                Otras senales que este dashboard tambien puede volver visibles.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Ademas de la lectura principal, tambien puede abrir alertas accionables sobre recuperacion
                de cartera, margen, expansion y tiempo operativo.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {signalOpportunityCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="flex h-full flex-col rounded-[1.8rem] border border-border/45 bg-white p-6 shadow-[0_10px_24px_rgba(20,19,26,0.03)]"
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
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground/60">
                        {card.detail}
                      </p>
                    </div>
                    <span className="rounded-full border border-border/50 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/65">
                      Visible
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-10 flex flex-col gap-5 rounded-[2rem] border border-[#E6E0EE] bg-[#FBFAFD] p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8"
            >
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                  Transicion
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  Si esta lectura se parece a tu negocio, el siguiente paso es bajar tu caso real y definir
                  que frente conviene atacar primero.
                </p>
              </div>
              <a
                href={ROOT_DIAGNOSTIC_SECTION_HREF}
                onClick={() => trackDiagnosisClick("demo_signals")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground shadow-[0_10px_24px_rgba(20,19,26,0.05)] transition-colors hover:bg-accent hover:text-white"
              >
                Agendar diagnostico
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </section>

        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55 }}
              className="rounded-[2.25rem] border border-[#E8E2D9] bg-[#FCFBF8] p-8 shadow-[0_14px_32px_rgba(20,19,26,0.04)] lg:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                    Siguiente paso
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground lg:text-[2.55rem]">
                    Si esta forma de leer ventas te hace sentido, ya hay un punto de partida claro.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                    En el diagnostico revisamos que senales conviene abrir primero y que tipo de dashboard
                    de ventas tiene sentido construir para tu caso real.
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <a
                    href={ROOT_DIAGNOSTIC_SECTION_HREF}
                    onClick={() => trackDiagnosisClick("demo_final")}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#7E4CF4,#7111DF)] px-6 py-3 text-sm font-medium text-white shadow-[0_14px_28px_rgba(113,17,223,0.16)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Agendar diagnostico
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Escribirme por LinkedIn
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>
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
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
