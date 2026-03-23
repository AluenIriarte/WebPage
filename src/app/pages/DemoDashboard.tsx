import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Layers3, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { InteractiveDashboard } from "../components/HeroDashboard";
import { OpportunitiesSection } from "../components/OpportunitiesSection";
import { trackDiagnosisClick, trackQuoteClick } from "../lib/analytics";
import { QUOTE_PAGE_HREF, ROOT_DIAGNOSTIC_SECTION_HREF } from "../lib/contact";

const demoAnchors = [
  { label: "Vista ejecutiva", href: "#vista-ejecutiva" },
  { label: "Ranking comercial", href: "#ranking-vendedores" },
  { label: "Mix de producto", href: "#mix-producto" },
  { label: "Señales clave", href: "#oportunidades" },
] as const;

const readingGuides = [
  {
    step: "01",
    title: "Cuentas en riesgo",
    body: "Mirá primero si la base activa se está enfriando antes de que eso ya pegue en facturación.",
  },
  {
    step: "02",
    title: "Brecha comercial",
    body: "Después bajá al ranking para ver qué equipo o segmento necesita intervención concreta.",
  },
  {
    step: "03",
    title: "Mix y margen",
    body: "Por último, revisá producto para detectar dónde crecer y dónde se está erosionando valor.",
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
  },
  {
    seller: "Martín Rivas",
    focus: "Canal interior",
    actual: "$391K",
    target: "$405K",
    attainment: 97,
    gap: "-$14K",
    tone: "text-amber-600",
  },
  {
    seller: "Lucía Pérez",
    focus: "Cartera activa",
    actual: "$336K",
    target: "$350K",
    attainment: 96,
    gap: "-$14K",
    tone: "text-amber-600",
  },
  {
    seller: "Nicolás Vidal",
    focus: "Nuevos negocios",
    actual: "$274K",
    target: "$310K",
    attainment: 88,
    gap: "-$36K",
    tone: "text-rose-600",
  },
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

function SellerRankingBoard() {
  return (
    <div className="rounded-3xl border border-border/50 bg-white p-7 shadow-xl shadow-black/[0.03]">
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
        {[
          { label: "Cumplimiento promedio", value: "97%" },
          { label: "Sobre meta", value: "1 equipo" },
          { label: "Brecha total", value: "$64K" },
        ].map((stat) => (
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                  {index + 1}
                </div>
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
    <div className="rounded-3xl border border-border/50 bg-white p-7 shadow-xl shadow-black/[0.03]">
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

export function DemoDashboard() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header variant="conversion" />
      <main>
        <section
          id="vista-ejecutiva"
          className="relative overflow-hidden pb-20 pt-32 lg:pb-24 lg:pt-40 scroll-mt-28"
        >
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-0 right-0 top-0 h-[520px] bg-gradient-to-b from-accent/[0.05] via-transparent to-transparent" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-7"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                  <TrendingUp className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-semibold tracking-wide text-accent">
                    Demo interactiva
                  </span>
                </div>

                <div className="space-y-5">
                  <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-[3.2rem]">
                    Así se ve un sistema comercial cuando deja de ser un reporte
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    La demo no está para mostrar una interfaz linda. Está para que veas cómo se vuelve
                    visible lo que hoy suele quedar disperso entre reportes, intuición y seguimiento manual.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                    Qué mirar primero
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {readingGuides.map((item) => (
                      <div key={item.step} className="rounded-2xl border border-border/50 bg-white p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent/55">
                          {item.step}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={ROOT_DIAGNOSTIC_SECTION_HREF}
                    onClick={() => trackDiagnosisClick("demo_hero")}
                    className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                  >
                    Agendar diagnóstico
                  </a>
                  <Link
                    to={QUOTE_PAGE_HREF}
                    onClick={() => trackQuoteClick("demo_hero")}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                  >
                    Pedir cotización
                  </Link>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                    Saltos dentro de la demo
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {demoAnchors.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-sm font-medium text-foreground/78 transition-colors hover:border-accent/35 hover:text-accent"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent/65" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <InteractiveDashboard />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45 }}
              className="mt-14 border-t border-foreground/5 pt-10 lg:mt-16 lg:pt-12"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                    La misma lectura, bajada a operación
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    La alerta ejecutiva sigue en equipo y producto.
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Sin salir de la demo, podés bajar del panorama general al ranking comercial y al
                  mix prioritario para decidir dónde intervenir.
                </p>
              </div>
            </motion.div>
            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                id="ranking-vendedores"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45 }}
                className="scroll-mt-28"
              >
                <SellerRankingBoard />
              </motion.div>
              <motion.div
                id="mix-producto"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="scroll-mt-28"
              >
                <ProductSignalBoard />
              </motion.div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
        </div>

        <OpportunitiesSection
          hideFooter
          eyebrow="Más oportunidades visibles"
          title="Otras oportunidades que se pueden hacer visibles"
          description="Después de la lectura principal, el mismo sistema también puede abrir foco sobre cartera inactiva, margen, mix, expansión y automatización operativa."
        />

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="rounded-[2rem] bg-foreground p-8 text-background lg:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />
                    Siguiente paso
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight text-white">
                    Si esta lectura se parece a tu negocio, ya tenés suficiente contexto para avanzar.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    La demo ya hizo su trabajo: mostrar qué tipo de visibilidad podés tener. Desde acá,
                    el siguiente paso es revisar tu caso o pedir cotización si ya tenés claro el alcance.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a
                    href={ROOT_DIAGNOSTIC_SECTION_HREF}
                    onClick={() => trackDiagnosisClick("demo_final")}
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-white"
                  >
                    Agendar diagnóstico
                  </a>
                  <Link
                    to={QUOTE_PAGE_HREF}
                    onClick={() => trackQuoteClick("demo_final")}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
                  >
                    Pedir cotización
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
