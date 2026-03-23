import { useEffect, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight, Layers3, Linkedin, TrendingUp, Users } from "lucide-react";
import { Header } from "../components/Header";
import { InteractiveDashboard } from "../components/HeroDashboard";
import { OpportunitiesSection } from "../components/OpportunitiesSection";
import { trackDiagnosisClick } from "../lib/analytics";
import { ROOT_DIAGNOSTIC_SECTION_HREF } from "../lib/contact";

const LINKEDIN_URL = "https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true";

const demoSections = [
  { id: "vista-ejecutiva", label: "Vista ejecutiva" },
  { id: "ranking-vendedores", label: "Ranking comercial" },
  { id: "mix-producto", label: "Mix de producto" },
  { id: "oportunidades", label: "Señales clave" },
] as const;

type DemoSectionId = (typeof demoSections)[number]["id"];
type SellerAvatarVariant = "wave" | "short" | "bun";

const readingGuides = [
  {
    step: "01",
    title: "Leé la señal ejecutiva",
    body: "Primero mirá qué desvío aparece y por qué ya merece atención comercial.",
  },
  {
    step: "02",
    title: "Bajá al equipo",
    body: "Después revisá ranking para entender dónde intervenir y con qué prioridad.",
  },
  {
    step: "03",
    title: "Cerrá con producto",
    body: "Por último, confirmá si el problema o la oportunidad viene del mix y del margen.",
  },
] as const;

const sellerRanking = [
  {
    seller: "Sofía Gómez",
    focus: "Grandes cuentas",
    actual: "$448K",
    target: "$420K",
    attainment: 107,
    gap: "+$28K",
    tone: "text-emerald-600",
    avatar: {
      background: "#F2EDFF",
      skin: "#EFC5AE",
      hair: "#5B416F",
      jacket: "#7111DF",
      shirt: "#F8F6FF",
      variant: "wave" as SellerAvatarVariant,
    },
  },
  {
    seller: "Martín Rivas",
    focus: "Canal interior",
    actual: "$391K",
    target: "$405K",
    attainment: 97,
    gap: "-$14K",
    tone: "text-amber-600",
    avatar: {
      background: "#ECF3FF",
      skin: "#DEB18F",
      hair: "#2B2A31",
      jacket: "#315FBE",
      shirt: "#EEF4FF",
      variant: "short" as SellerAvatarVariant,
    },
  },
  {
    seller: "Lucía Pérez",
    focus: "Cartera activa",
    actual: "$336K",
    target: "$350K",
    attainment: 96,
    gap: "-$14K",
    tone: "text-amber-600",
    avatar: {
      background: "#FFF1EA",
      skin: "#EDBDA2",
      hair: "#734738",
      jacket: "#D96D4D",
      shirt: "#FFF7F2",
      variant: "bun" as SellerAvatarVariant,
    },
  },
] as const;

const rankingStats = [
  { label: "Cumplimiento promedio", value: "100%" },
  { label: "Sobre meta", value: "1 equipo" },
  { label: "Brecha activa", value: "$28K" },
] as const;

const productViews = {
  producto: [
    { item: "Línea Premium", revenue: "$184K", margin: "36%", signal: "Alta rentabilidad, baja penetración" },
    { item: "Producto A", revenue: "$261K", margin: "18%", signal: "Sostiene volumen, comprime margen" },
    { item: "Producto B", revenue: "$143K", margin: "29%", signal: "Buena salida, poca prioridad comercial" },
  ],
  categoria: [
    { item: "Categoría Estrategia", revenue: "$212K", margin: "34%", signal: "Se vende menos de lo que podría" },
    { item: "Categoría Base", revenue: "$307K", margin: "19%", signal: "Alta dependencia, bajo diferencial" },
    { item: "Categoría Táctica", revenue: "$96K", margin: "12%", signal: "Demasiado descuento para sostenerla" },
  ],
  alertas: [
    { item: "Producto C", revenue: "$88K", margin: "11%", signal: "Creció volumen, cayó margen" },
    { item: "Kit Logístico", revenue: "$61K", margin: "9%", signal: "Consume foco, aporta poco retorno" },
    { item: "Addon Premium", revenue: "$45K", margin: "41%", signal: "Alto margen, bajo empuje comercial" },
  ],
} as const;

function SellerAvatar({
  rank,
  avatar,
}: {
  rank: number;
  avatar: (typeof sellerRanking)[number]["avatar"];
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

function SellerRankingBoard() {
  return (
    <div className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-[0_24px_70px_rgba(20,19,26,0.06)] lg:p-7">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
            Vista comercial
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Ranking de vendedores vs objetivo
          </h3>
        </div>
        <Users className="h-5 w-5 text-accent" />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {rankingStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border/50 bg-muted/20 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
              {stat.label}
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {sellerRanking.map((seller, index) => (
          <div key={seller.seller} className="rounded-2xl border border-border/50 bg-muted/20 p-4">
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
                  className="h-2 rounded-full bg-accent"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min(seller.attainment, 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductSignalBoard() {
  const [view, setView] = useState<keyof typeof productViews>("producto");

  return (
    <div className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-[0_24px_70px_rgba(20,19,26,0.06)] lg:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
            Vista producto
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Mix, margen y productos a priorizar
          </h3>
        </div>
        <Layers3 className="h-5 w-5 text-accent" />
      </div>

      <div className="mb-6 flex gap-2 rounded-full bg-muted/60 p-1">
        {[
          { key: "producto", label: "Producto" },
          { key: "categoria", label: "Categoría" },
          { key: "alertas", label: "Alertas" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key as keyof typeof productViews)}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-medium transition-colors ${
              view === tab.key ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/50">
        <div className="grid grid-cols-[1.5fr_0.8fr_0.7fr] gap-3 bg-muted/20 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
          <span>Item</span>
          <span>Ingresos</span>
          <span>Margen</span>
        </div>

        {productViews[view].map((item) => (
          <div
            key={item.item}
            className="grid grid-cols-[1.5fr_0.8fr_0.7fr] gap-3 border-t border-border/50 px-4 py-4"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">{item.item}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.signal}</p>
            </div>
            <div className="text-sm font-medium text-foreground">{item.revenue}</div>
            <div className="text-sm font-semibold text-accent">{item.margin}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoStickyNav({
  activeSection,
  onAnchorClick,
}: {
  activeSection: DemoSectionId;
  onAnchorClick: (event: MouseEvent<HTMLAnchorElement>, id: DemoSectionId) => void;
}) {
  return (
    <div className="sticky top-20 z-40 border-y border-border/45 bg-[rgba(243,241,238,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/65">
            Recorrer demo
          </span>
          <p className="text-sm text-muted-foreground">
            Leé la demo en cuatro capas y ubicá rápido qué parte te interesa validar.
          </p>
        </div>

        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2">
            {demoSections.map((section) => {
              const isActive = activeSection === section.id;

              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(event) => onAnchorClick(event, section.id)}
                  className={`relative rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="demo-nav-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm shadow-black/[0.05]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{section.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemoDashboard() {
  const [activeSection, setActiveSection] = useState<DemoSectionId>("vista-ejecutiva");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const currentHash = window.location.hash.replace("#", "");
    if (demoSections.some((section) => section.id === currentHash)) {
      setActiveSection(currentHash as DemoSectionId);
    }
  }, []);

  useEffect(() => {
    const sections = demoSections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (!visibleEntries.length) {
          return;
        }

        visibleEntries.sort(
          (left, right) =>
            Math.abs(left.boundingClientRect.top - 160) - Math.abs(right.boundingClientRect.top - 160),
        );

        setActiveSection(visibleEntries[0].target.id as DemoSectionId);
      },
      {
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0.18, 0.4, 0.68],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, id: DemoSectionId) => {
    event.preventDefault();
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section
          id="vista-ejecutiva"
          className="scroll-mt-40 relative overflow-hidden border-b border-border/40 bg-[#F3F1EE] pb-16 pt-32 lg:scroll-mt-44 lg:pb-20 lg:pt-36"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(243,241,238,1) 0%, rgba(255,255,255,1) 68%)",
            }}
          />
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[520px] opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(113,17,223,0.14) 0%, transparent 60%)",
            }}
          />

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-white/75 px-4 py-2">
                  <TrendingUp className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-semibold tracking-[0.12em] text-accent">Demo guiada</span>
                </div>

                <div className="space-y-5">
                  <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-[3.45rem]">
                    Esto no es un reporte lindo. Es una demo para validar cómo se ve un sistema de decisión.
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    Vas a recorrer la lectura ejecutiva, bajar al ranking comercial, revisar el mix
                    de producto y cerrar con señales accionables. La idea es simple: entender rápido
                    qué hace visible y por qué importa.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={ROOT_DIAGNOSTIC_SECTION_HREF}
                    onClick={() => trackDiagnosisClick("demo_hero")}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                  >
                    Agendar diagnóstico
                    <ArrowRight className="h-4 w-4" />
                  </a>

                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Prefiero escribir primero por LinkedIn
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>

                <div className="rounded-[1.75rem] border border-border/50 bg-white/78 p-4 shadow-sm shadow-black/[0.03]">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                      Recorrer demo
                    </p>
                    <p className="hidden text-[11px] text-muted-foreground sm:block">
                      Seguí el orden sugerido o saltá directo a la vista que querés validar.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {demoSections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={(event) => handleAnchorClick(event, section.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-sm font-medium text-foreground/78 transition-colors hover:border-accent/35 hover:text-accent"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent/65" />
                        {section.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {readingGuides.map((item) => (
                    <div
                      key={item.step}
                      className="rounded-2xl border border-border/50 bg-white/78 p-4 shadow-sm shadow-black/[0.02]"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent/55">
                        {item.step}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/50 bg-white/78 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                      Qué hace visible
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                      Dónde se enfría la base, dónde se erosiona margen y dónde aparece expansión real.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-white/78 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                      Qué decisión habilita
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                      Elegir rápido qué equipo, qué cartera o qué mix conviene priorizar primero.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="rounded-[2rem] border border-border/60 bg-white/82 p-4 shadow-[0_32px_90px_rgba(20,19,26,0.08)] lg:p-6 lg:pr-6 lg:pb-6">
                  <div className="mb-4 flex items-center justify-between gap-4 px-1">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                        Vista ejecutiva
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Un encuadre inicial para leer el negocio en pocos segundos.
                      </p>
                    </div>
                    <div className="hidden rounded-full border border-accent/15 bg-accent/8 px-3 py-1 text-[11px] font-semibold text-accent lg:inline-flex">
                      Sistema de decisión
                    </div>
                  </div>

                  <InteractiveDashboard />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <DemoStickyNav activeSection={activeSection} onAnchorClick={handleAnchorClick} />

        <section className="bg-[#F7F5F2] py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45 }}
              className="mb-10 max-w-3xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                Continuidad guiada
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                Después del panorama, la demo baja a operación y producto sin cortar la lectura.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Cada bloque responde una pregunta concreta. Primero quién necesita foco comercial.
                Después qué mix conviene empujar o corregir.
              </p>
            </motion.div>

            <div
              id="ranking-vendedores"
              className="scroll-mt-40 grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-10 lg:scroll-mt-44"
            >
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45 }}
                className="space-y-5 lg:sticky lg:top-44"
              >
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent/60">
                    Ranking comercial
                  </p>
                  <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                    Quién está cerca del objetivo y dónde se abre la brecha.
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Esta vista baja la lectura al equipo. No agrega ruido: ordena rápido qué vendedor
                    o cartera necesita intervención concreta.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-white/76 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                    Decisión que habilita
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    Priorizar seguimiento, coaching o reasignación comercial antes de que la brecha se agrande.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: 0.08 }}
              >
                <SellerRankingBoard />
              </motion.div>
            </div>

            <div
              id="mix-producto"
              className="scroll-mt-40 mt-14 grid gap-8 border-t border-foreground/6 pt-14 lg:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-10 lg:pt-16 lg:scroll-mt-44"
            >
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45 }}
                className="order-2 lg:order-1"
              >
                <ProductSignalBoard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="order-1 space-y-5 lg:order-2 lg:sticky lg:top-44"
              >
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent/60">
                    Mix de producto
                  </p>
                  <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                    Qué productos empujan valor y cuáles están frenando margen.
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Acá la demo deja claro si el crecimiento viene bien orientado o si el mix está
                    escondiendo deterioro comercial detrás del volumen.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-white/76 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                    Decisión que habilita
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    Cambiar foco, descuentos o prioridad de producto antes de seguir escalando lo menos rentable.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <OpportunitiesSection
          eyebrow="Señales clave"
          title="Otras oportunidades que también se pueden volver visibles"
          description="Además del panorama principal, el sistema puede abrir focos accionables sobre cartera, margen, expansión y automatización operativa."
          footerText="Si esta lectura se parece a tu negocio, el siguiente paso lógico es revisar tu caso real y ver cuál conviene priorizar primero."
          footerHref={ROOT_DIAGNOSTIC_SECTION_HREF}
          footerLabel="Agendar diagnóstico"
          footerOnClick={() => trackDiagnosisClick("demo_signals")}
        />

        <section className="bg-white pb-24 pt-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="rounded-[2rem] bg-foreground p-8 text-background shadow-[0_28px_90px_rgba(20,19,26,0.16)] lg:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                    Siguiente paso
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight text-white">
                    Si esta demo te resulta familiar, ya tenemos un punto de partida serio para tu caso.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    El diagnóstico sirve para bajar tu situación real a una primera lectura útil y
                    definir si vale la pena avanzar, dónde conviene empezar y qué visibilidad falta hoy.
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <a
                    href={ROOT_DIAGNOSTIC_SECTION_HREF}
                    onClick={() => trackDiagnosisClick("demo_final")}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-white"
                  >
                    Agendar diagnóstico
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white/68 transition-colors hover:text-white"
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
