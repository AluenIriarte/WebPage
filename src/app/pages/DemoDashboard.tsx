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
type RankingTeamId = "grandes-cuentas" | "canal" | "expansion";
type MixMode = "producto" | "categoria";
type MixClientId = "distribuidora-norte" | "grupo-solaris" | "comercial-andes";
type MatrixState = "active" | "gap" | "none";
type BoardPresentation = "preview" | "detail";

const heroPreviewDetails: Record<HeroPreviewId, { eyebrow: string; title: string; description: string }> = {
  "vista-ejecutiva": {
    eyebrow: "Vista activa",
    title: "Respuesta rapida para saber si el negocio flota o se hunde.",
    description: 'Vista general para responder rapido: "Flotamos o nos hundimos?"',
  },
  "ranking-vendedores": {
    eyebrow: "Vista activa",
    title: "Lectura por equipo para ver quien cumple y donde intervenir primero.",
    description: "Compara desempeno, brecha vs objetivo y foco de seguimiento para detectar donde intervenir primero.",
  },
  "mix-producto": {
    eyebrow: "Vista activa",
    title: "Analisis por producto y categoria para separar volumen, margen y foco.",
    description: "Detecta mix incompleto, huecos de linea y oportunidades de cross-sell sin perder contexto comercial.",
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

const rankingTeamViews = {
  "grandes-cuentas": {
    label: "Grandes cuentas",
    eyebrow: "Vista comercial",
    title: "Ranking de vendedores vs objetivo",
    subtitle: "Compara desempeno, brecha y foco de seguimiento dentro del equipo clave.",
    summary: [
      { label: "Cumplimiento promedio", value: "101%" },
      { label: "Sobre meta", value: "1 ejecutivo" },
      { label: "Brecha activa", value: "$18K" },
    ],
    note: "La prioridad es acompanar a quienes estan cerca del objetivo antes de que el desvio se vuelva estructural.",
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
  },
  canal: {
    label: "Canal",
    eyebrow: "Vista comercial",
    title: "Ranking de vendedores vs objetivo",
    subtitle: "Lee rapido que parte del canal sostiene volumen y cual necesita coaching comercial.",
    summary: [
      { label: "Cumplimiento promedio", value: "94%" },
      { label: "Sobre meta", value: "0 equipos" },
      { label: "Brecha activa", value: "$42K" },
    ],
    note: "El canal no esta caido, pero si desalineado: conviene corregir foco antes de empujar mas volumen.",
    sellers: [
      {
        seller: "Diego Ferraro",
        focus: "Distribuidores norte",
        actual: "$284K",
        target: "$310K",
        attainment: 92,
        gap: "-$26K",
        tone: "text-rose-600",
        avatar: avatarStyles.midnightShort,
      },
      {
        seller: "Carla Medina",
        focus: "Mayoristas centro",
        actual: "$302K",
        target: "$315K",
        attainment: 96,
        gap: "-$13K",
        tone: "text-amber-600",
        avatar: avatarStyles.wineBun,
      },
      {
        seller: "Federico Costa",
        focus: "Reventa interior",
        actual: "$328K",
        target: "$335K",
        attainment: 98,
        gap: "-$7K",
        tone: "text-amber-600",
        avatar: avatarStyles.mossWave,
      },
    ],
  },
  expansion: {
    label: "Expansion",
    eyebrow: "Vista comercial",
    title: "Ranking de vendedores vs objetivo",
    subtitle: "Aisla quien esta abriendo cartera nueva y quien necesita respaldo para convertir mejor.",
    summary: [
      { label: "Cumplimiento promedio", value: "103%" },
      { label: "Sobre meta", value: "2 ejecutivos" },
      { label: "Brecha activa", value: "$12K" },
    ],
    note: "El equipo de expansion ya encuentra demanda; ahora la mejora esta en priorizar mejor a quien seguir.",
    sellers: [
      {
        seller: "Ines Duarte",
        focus: "Nuevos negocios",
        actual: "$218K",
        target: "$205K",
        attainment: 106,
        gap: "+$13K",
        tone: "text-emerald-600",
        avatar: avatarStyles.clayBun,
      },
      {
        seller: "Tomas Pardo",
        focus: "Prospeccion outbound",
        actual: "$194K",
        target: "$188K",
        attainment: 103,
        gap: "+$6K",
        tone: "text-emerald-600",
        avatar: avatarStyles.midnightShort,
      },
      {
        seller: "Julia Sosa",
        focus: "Partners y referidos",
        actual: "$171K",
        target: "$177K",
        attainment: 97,
        gap: "-$6K",
        tone: "text-amber-600",
        avatar: avatarStyles.violetWave,
      },
    ],
  },
} as const;

const mixClientFilters = [
  { id: "distribuidora-norte", label: "Distribuidora Norte" },
  { id: "grupo-solaris", label: "Grupo Solaris" },
  { id: "comercial-andes", label: "Comercial Andes" },
] as const;

const mixColumns = {
  producto: ["Linea A", "Linea B", "Linea C", "Linea D", "Linea E"],
  categoria: ["Base", "Premium", "Accesorios", "Servicio", "Reposicion"],
} as const;

const mixMatrixRows = [
  {
    id: "distribuidora-norte",
    label: "Distribuidora Norte",
    producto: ["active", "active", "gap", "active", "none"] as MatrixState[],
    categoria: ["active", "gap", "active", "none", "gap"] as MatrixState[],
  },
  {
    id: "grupo-solaris",
    label: "Grupo Solaris",
    producto: ["active", "gap", "active", "gap", "none"] as MatrixState[],
    categoria: ["active", "none", "active", "gap", "gap"] as MatrixState[],
  },
  {
    id: "comercial-andes",
    label: "Comercial Andes",
    producto: ["active", "active", "active", "gap", "active"] as MatrixState[],
    categoria: ["gap", "active", "active", "active", "none"] as MatrixState[],
  },
  {
    id: "industrial-mendez",
    label: "Industrial Mendez",
    producto: ["none", "active", "none", "gap", "none"] as MatrixState[],
    categoria: ["active", "gap", "none", "none", "active"] as MatrixState[],
  },
  {
    id: "logistica-central",
    label: "Logistica Central",
    producto: ["active", "none", "gap", "active", "active"] as MatrixState[],
    categoria: ["gap", "active", "none", "active", "gap"] as MatrixState[],
  },
  {
    id: "techparts",
    label: "TechParts SRL",
    producto: ["active", "active", "active", "active", "none"] as MatrixState[],
    categoria: ["none", "active", "gap", "active", "none"] as MatrixState[],
  },
] as const;

const mixClientInsights = {
  "distribuidora-norte": {
    producto: {
      eyebrow: "Mix por cliente",
      title: "Huecos de linea y cross-sell potencial",
      description: "El cliente compra bien las lineas base, pero todavia deja espacio claro en el catalogo medio.",
      stats: [
        { label: "Mix incompleto", value: "68%", detail: "sobre catalogo vigente" },
        { label: "Huecos detectados", value: "4", detail: "lineas para abrir" },
        { label: "Mayor potencial", value: "Linea C", detail: "cross-sell inmediato" },
      ],
      note: "Aca no falta volumen: falta completar mezcla.",
    },
    categoria: {
      eyebrow: "Mix por cliente",
      title: "Brechas de categoria relevantes",
      description: "Se sostiene la base, pero Premium y Reposicion todavia estan subpenetradas para este cliente.",
      stats: [
        { label: "Mix incompleto", value: "54%", detail: "por categoria" },
        { label: "Huecos detectados", value: "3", detail: "categorias activables" },
        { label: "Mayor potencial", value: "Premium", detail: "subpenetrada" },
      ],
      note: "La oportunidad esta en subir valor por cliente, no solo frecuencia.",
    },
  },
  "grupo-solaris": {
    producto: {
      eyebrow: "Mix por cliente",
      title: "Cobertura irregular entre lineas",
      description: "Grupo Solaris ya compra volumen, pero deja huecos claros donde mas margen podrias capturar.",
      stats: [
        { label: "Mix incompleto", value: "61%", detail: "sobre lineas activas" },
        { label: "Huecos detectados", value: "5", detail: "lineas para priorizar" },
        { label: "Mayor potencial", value: "Linea D", detail: "entrada natural" },
      ],
      note: "Conviene ordenar propuesta antes de seguir empujando descuentos.",
    },
    categoria: {
      eyebrow: "Mix por cliente",
      title: "Categorias con baja profundidad",
      description: "Hay adopcion inicial, pero todavia no aparece una logica consistente de crecimiento por categoria.",
      stats: [
        { label: "Mix incompleto", value: "58%", detail: "por familia" },
        { label: "Huecos detectados", value: "4", detail: "categorias abiertas" },
        { label: "Mayor potencial", value: "Servicio", detail: "anclaje consultivo" },
      ],
      note: "La mejora esta en expandir valor, no en sumar mas SKUs aislados.",
    },
  },
  "comercial-andes": {
    producto: {
      eyebrow: "Mix por cliente",
      title: "Cuenta madura con una brecha especifica",
      description: "Comercial Andes ya compra varias lineas, pero todavia queda una pieza critica con potencial directo.",
      stats: [
        { label: "Mix incompleto", value: "42%", detail: "mas completo que el promedio" },
        { label: "Huecos detectados", value: "2", detail: "faltantes reales" },
        { label: "Mayor potencial", value: "Linea D", detail: "mayor ticket incremental" },
      ],
      note: "Cuando la cuenta ya esta madura, la lectura fina del mix vale mas que la intuicion.",
    },
    categoria: {
      eyebrow: "Mix por cliente",
      title: "Categorias con espacio de expansion",
      description: "La cuenta ya tiene base solida; el proximo paso es capturar profundidad en categorias de mayor valor.",
      stats: [
        { label: "Mix incompleto", value: "47%", detail: "sobre categorias objetivo" },
        { label: "Huecos detectados", value: "2", detail: "espacios concretos" },
        { label: "Mayor potencial", value: "Reposicion", detail: "recurrencia" },
      ],
      note: "La senal relevante no es vender mas de lo mismo, sino vender mejor.",
    },
  },
} as const;

const signalOpportunityCards = [
  {
    icon: Users,
    title: "Clientes inactivos",
    description: "Cuentas con peso comercial que dejaron de comprar y conviene recuperar antes de seguir abriendo frente nuevo.",
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
    description: "Lineas con baja penetracion sobre la cartera mas valiosa, donde la oportunidad depende mas de foco que de demanda.",
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
  size = "default",
}: {
  active: HeroPreviewId;
  onChange: (view: HeroPreviewId) => void;
  layoutId: string;
  size?: "default" | "compact";
}) {
  const isCompact = size === "compact";

  return (
    <div
      className={`rounded-[1.45rem] border border-[#DED6EC] bg-[linear-gradient(180deg,#FBFAFE_0%,#F4F0FA_100%)] ${
        isCompact ? "p-1" : "p-1.5"
      }`}
    >
      <div className={`grid grid-cols-1 sm:grid-cols-3 ${isCompact ? "gap-1" : "gap-1.5"}`}>
        {heroPreviewSections.map((section) => {
          const isActive = active === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onChange(section.id)}
              className={`relative rounded-full font-medium transition-colors ${
                isCompact ? "px-3 py-2.5 text-xs" : "px-4 py-3 text-sm"
              } ${isActive ? "text-white" : "text-foreground/76 hover:text-foreground"}`}
            >
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#7E4CF4,#7111DF)] shadow-[0_14px_30px_rgba(113,17,223,0.18)]"
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

function SellerRankingBoard({ presentation = "detail" }: { presentation?: BoardPresentation }) {
  const [teamView, setTeamView] = useState<RankingTeamId>("grandes-cuentas");
  const currentTeam = rankingTeamViews[teamView];
  const isPreview = presentation === "preview";
  const visibleSellers = isPreview ? currentTeam.sellers.slice(0, 2) : currentTeam.sellers;
  const layoutId = isPreview ? "ranking-team-pill-preview" : "ranking-team-pill-detail";

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[1.7rem] border border-border/60 bg-white ${
        isPreview ? "h-full shadow-[0_18px_46px_rgba(20,19,26,0.05)]" : "shadow-[0_24px_70px_rgba(20,19,26,0.06)]"
      }`}
    >
      <div className={`border-b border-border/45 ${isPreview ? "px-5 pb-3.5 pt-5" : "px-5 pb-4 pt-5"}`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
              {currentTeam.eyebrow}
            </p>
            <h3 className={`mt-2 font-semibold tracking-tight text-foreground ${isPreview ? "text-[1.45rem]" : "text-[1.75rem]"}`}>
              {currentTeam.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {currentTeam.subtitle}
            </p>
          </div>
          <Users className="mt-1 h-5 w-5 text-accent" />
        </div>

        <div className="rounded-full border border-border/60 bg-[#F7F4FB] p-1">
          <div className="grid grid-cols-3 gap-1">
            {(Object.entries(rankingTeamViews) as [RankingTeamId, (typeof rankingTeamViews)[RankingTeamId]][]).map(
              ([teamId, team]) => {
                const isActive = teamView === teamId;

                return (
                  <button
                    key={teamId}
                    type="button"
                    onClick={() => setTeamView(teamId)}
                    className={`relative rounded-full px-3 py-2.5 text-xs font-medium transition-colors ${
                      isActive ? "text-white" : "text-foreground/72 hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={layoutId}
                        className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#7E4CF4,#7111DF)] shadow-[0_12px_26px_rgba(113,17,223,0.22)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                      />
                    )}
                    <span className="relative z-10">{team.label}</span>
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={teamView}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className={`flex h-full flex-col px-5 ${isPreview ? "pb-4 pt-4" : "pb-5 pt-5"}`}
        >
          <div className={`grid gap-3 md:grid-cols-3 ${isPreview ? "mb-4" : "mb-5"}`}>
            {currentTeam.summary.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/50 bg-muted/15 px-4 py-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                  {stat.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className={`space-y-3 ${isPreview ? "" : "flex-1"}`}>
            {visibleSellers.map((seller, index) => (
              <div key={seller.seller} className="rounded-2xl border border-border/50 bg-muted/15 p-4">
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

          {!isPreview && (
            <div className="mt-4 rounded-2xl border border-accent/12 bg-accent/[0.04] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/65">Lectura ejecutiva</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{currentTeam.note}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {isPreview && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.96) 72%, rgba(255,255,255,1) 100%)" }}
        />
      )}
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

function ProductSignalBoard({ presentation = "detail" }: { presentation?: BoardPresentation }) {
  const [mode, setMode] = useState<MixMode>("producto");
  const [selectedClient, setSelectedClient] = useState<MixClientId>("distribuidora-norte");
  const currentInsight = mixClientInsights[selectedClient][mode];
  const columns = mixColumns[mode];
  const isPreview = presentation === "preview";
  const visibleRows = isPreview ? mixMatrixRows.slice(0, 4) : mixMatrixRows;
  const layoutId = isPreview ? "mix-mode-pill-preview" : "mix-mode-pill-detail";

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[1.7rem] border border-border/60 bg-white ${
        isPreview ? "h-full shadow-[0_18px_46px_rgba(20,19,26,0.05)]" : "shadow-[0_24px_70px_rgba(20,19,26,0.06)]"
      }`}
    >
      <div className={`border-b border-border/45 ${isPreview ? "px-5 pb-3.5 pt-5" : "px-5 pb-4 pt-5"}`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
              {currentInsight.eyebrow}
            </p>
            <h3 className={`mt-2 font-semibold tracking-tight text-foreground ${isPreview ? "text-[1.45rem]" : "text-[1.75rem]"}`}>
              {currentInsight.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {currentInsight.description}
            </p>
          </div>
          <Layers3 className="mt-1 h-5 w-5 text-accent" />
        </div>

        <div className="space-y-3">
          <div className="rounded-full border border-border/60 bg-[#F7F4FB] p-1">
            <div className="grid grid-cols-2 gap-1">
              {(["producto", "categoria"] as MixMode[]).map((currentMode) => {
                const isActive = mode === currentMode;

                return (
                  <button
                    key={currentMode}
                    type="button"
                    onClick={() => setMode(currentMode)}
                    className={`relative rounded-full px-3 py-2.5 text-xs font-medium transition-colors ${
                      isActive ? "text-white" : "text-foreground/72 hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={layoutId}
                        className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#7E4CF4,#7111DF)] shadow-[0_12px_26px_rgba(113,17,223,0.22)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                      />
                    )}
                    <span className="relative z-10">{currentMode === "producto" ? "Producto" : "Categoria"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {mixClientFilters.map((client) => {
              const isActive = selectedClient === client.id;

              return (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => setSelectedClient(client.id)}
                  className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "border-accent/20 bg-accent/[0.08] text-accent"
                      : "border-border/55 bg-white text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {client.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${selectedClient}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className={`flex h-full flex-col px-5 ${isPreview ? "pb-4 pt-4" : "pb-5 pt-5"}`}
        >
          <div className={`grid gap-3 md:grid-cols-3 ${isPreview ? "mb-4" : "mb-5"}`}>
            {currentInsight.stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/50 bg-muted/15 px-4 py-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{stat.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{stat.detail}</p>
              </div>
            ))}
          </div>

          {!isPreview && (
            <div className="mb-4 rounded-2xl border border-accent/12 bg-accent/[0.04] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/65">Senal principal</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{currentInsight.note}</p>
            </div>
          )}

          <div className="flex-1 overflow-hidden rounded-[1.5rem] border border-border/55 bg-[#FCFBFE]">
            <div className="grid grid-cols-[1.6fr_repeat(5,0.7fr)] gap-2 border-b border-border/45 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
              <span>Cliente</span>
              {columns.map((column) => (
                <span key={column} className="text-center">
                  {column}
                </span>
              ))}
            </div>

            <div className="divide-y divide-border/45">
              {visibleRows.map((row) => {
                const cells = row[mode];
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
                    {cells.map((cell, index) => (
                      <div key={`${row.id}-${index}`} className="flex justify-center">
                        <MixStatusSquare state={cell} isHighlighted={isHighlighted} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {!isPreview && (
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
          )}
        </motion.div>
      </AnimatePresence>

      {isPreview && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.96) 72%, rgba(255,255,255,1) 100%)" }}
        />
      )}
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
      return <SellerRankingBoard presentation="detail" />;
    }

    return <ProductSignalBoard presentation="detail" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section
          id="demo-dashboard"
          className="relative overflow-hidden border-b border-border/35 bg-[#F3F1EE] pb-20 pt-32 lg:pb-24 lg:pt-36"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: "linear-gradient(180deg, rgba(243,241,238,1) 0%, rgba(255,255,255,0.98) 68%, rgba(255,255,255,1) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[540px] opacity-60"
            style={{
              background: "radial-gradient(ellipse at top right, rgba(113,17,223,0.14) 0%, transparent 60%)",
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
                Un dashboard comercial para ver foco, margen y oportunidades de verdad.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Cambia entre las tres vistas clave y recorre una lectura completa del negocio sin salir de la
                misma experiencia.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 rounded-[2.4rem] border border-[#E3DCEB] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(248,245,252,0.98)_100%)] p-5 shadow-[0_28px_70px_rgba(20,19,26,0.06)] lg:mt-12 lg:p-8"
            >
              <div className="grid gap-8 border-b border-border/45 pb-8 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)] lg:items-end">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                    {activeView.eyebrow}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground lg:text-[2.5rem]">
                    {activeView.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-[0.96rem]">
                    {activeView.description}
                  </p>
                </div>

                <div className="lg:w-full lg:max-w-[30rem] lg:justify-self-end">
                  <DemoViewSelector
                    active={heroPreview}
                    onChange={setHeroPreview}
                    layoutId="detail-preview-pill"
                  />
                </div>
              </div>

              <div className="pt-8">
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

              <div className="mt-8 flex flex-col gap-5 border-t border-border/45 pt-6 lg:flex-row lg:items-center lg:justify-between">
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
            </motion.div>
          </div>
        </section>

        <section id="oportunidades" className="scroll-mt-32 border-b border-border/35 bg-white py-16 lg:scroll-mt-36 lg:py-24">
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
                Otras oportunidades que tambien conviene volver visibles.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Ademas del tablero principal, el sistema puede abrir focos accionables sobre cartera,
                margen, expansion y tiempo operativo con una lectura mucho mas clara.
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
                  className="flex h-full flex-col rounded-[1.8rem] border border-border/50 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(249,247,252,0.9)_100%)] p-6 shadow-[0_12px_30px_rgba(20,19,26,0.04)]"
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
              className="mt-10 flex flex-col gap-5 rounded-[2rem] border border-[#E3DCEB] bg-[linear-gradient(180deg,rgba(248,245,252,0.92)_0%,rgba(255,255,255,1)_100%)] p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8"
            >
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                  Transicion
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  Si esta lectura se parece a tu negocio, el siguiente paso logico es bajar tu caso real y
                  ordenar cual de estas oportunidades conviene priorizar primero.
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

        <section className="bg-[#F7F4EF] py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55 }}
              className="rounded-[2.25rem] border border-[#E3DDD4] bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(243,241,238,0.98)_100%)] p-8 shadow-[0_18px_44px_rgba(20,19,26,0.05)] lg:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                    Siguiente paso
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground lg:text-[2.55rem]">
                    Si esta demo te resulta familiar, ya hay un punto de partida serio para tu caso.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                    El diagnostico sirve para bajar tu situacion real a una primera lectura util, definir
                    donde conviene empezar y ver que visibilidad falta hoy para decidir mejor.
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

      <section className="border-t border-border/40 bg-[#F3F1EE]">
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
