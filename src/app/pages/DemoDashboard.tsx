import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, ArrowRight, Layers3, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { InteractiveDashboard } from "../components/HeroDashboard";
import {
  QUOTE_PAGE_HREF,
  ROOT_DIAGNOSTIC_SECTION_HREF,
  SERVICES_PAGE_HREF,
} from "../lib/contact";

const customerViews = {
  top: [
    { name: "Cuenta Delta", status: "Riesgo alto", value: "-28%", tone: "text-rose-600" },
    { name: "Grupo Sur", status: "Frecuencia en baja", value: "-14%", tone: "text-amber-600" },
    { name: "Canal Norte", status: "Reactivable", value: "+3 señales", tone: "text-accent" },
  ],
  dormant: [
    { name: "Distribuidora Uno", status: "+97 días sin compra", value: "$84K", tone: "text-rose-600" },
    { name: "Retail Central", status: "+83 días sin compra", value: "$49K", tone: "text-amber-600" },
    { name: "Mayorista Dos", status: "Ticket histórico alto", value: "$61K", tone: "text-accent" },
  ],
  expansion: [
    { name: "Cuenta Prisma", status: "Cross-sell detectado", value: "+22%", tone: "text-emerald-600" },
    { name: "Cadena Uno", status: "Mix incompleto", value: "4 categorías", tone: "text-accent" },
    { name: "Canal Federal", status: "Potencial up-sell", value: "+17%", tone: "text-cyan-600" },
  ],
} as const;

const marginViews = {
  producto: [
    { label: "Línea premium", fill: "78%", note: "alto margen, baja penetración" },
    { label: "Producto A", fill: "52%", note: "mucho volumen, margen comprimido" },
    { label: "Producto B", fill: "34%", note: "descuento frecuente" },
  ],
  categoria: [
    { label: "Categoría estratégica", fill: "74%", note: "rentable, subpriorizada" },
    { label: "Categoría base", fill: "58%", note: "se sostiene por volumen" },
    { label: "Categoría táctica", fill: "29%", note: "erosiona rentabilidad" },
  ],
  canal: [
    { label: "Canal directo", fill: "81%", note: "mejor captura de margen" },
    { label: "Distribución", fill: "47%", note: "ticket alto, descuento variable" },
    { label: "Marketplace", fill: "24%", note: "presión fuerte sobre precio" },
  ],
} as const;

function CustomerSignalBoard() {
  const [view, setView] = useState<keyof typeof customerViews>("top");

  return (
    <div className="rounded-3xl border border-border/50 bg-white p-7 shadow-xl shadow-black/[0.03]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
            Vista clientes
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Riesgo, dormancia y expansión
          </h3>
        </div>
        <Users className="h-5 w-5 text-accent" />
      </div>

      <div className="mb-5 flex gap-2 rounded-full bg-muted/60 p-1">
        {[
          { key: "top", label: "Top cuentas" },
          { key: "dormant", label: "Dormancia" },
          { key: "expansion", label: "Expansión" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key as keyof typeof customerViews)}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-medium transition-colors ${
              view === tab.key ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {customerViews[view].map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/20 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.status}</p>
            </div>
            <span className={`text-sm font-semibold ${item.tone}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarginMixBoard() {
  const [view, setView] = useState<keyof typeof marginViews>("producto");

  return (
    <div className="rounded-3xl border border-border/50 bg-white p-7 shadow-xl shadow-black/[0.03]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
            Vista margen
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Mix, rentabilidad y destructores
          </h3>
        </div>
        <Layers3 className="h-5 w-5 text-accent" />
      </div>

      <div className="mb-6 flex gap-2 rounded-full bg-muted/60 p-1">
        {[
          { key: "producto", label: "Producto" },
          { key: "categoria", label: "Categoría" },
          { key: "canal", label: "Canal" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key as keyof typeof marginViews)}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-medium transition-colors ${
              view === tab.key ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {marginViews[view].map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <span className="text-xs text-muted-foreground">{item.fill}</span>
            </div>
            <div className="h-2 rounded-full bg-muted/60">
              <motion.div
                className="h-2 rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: item.fill }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{item.note}</p>
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
      <Header />
      <main>
        <section className="relative overflow-hidden pb-16 pt-32 lg:pb-20 lg:pt-40">
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
                    No es un dashboard gigante ni un catálogo de gráficos. Es una muestra curada de
                    cómo se traduce cartera, margen y expansión en vistas que sí orientan decisiones.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    "Dirección comercial",
                    "Clientes y riesgo",
                    "Margen y mix",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-border/50 bg-white px-4 py-3 text-sm font-medium text-foreground/80">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={SERVICES_PAGE_HREF}
                    className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                  >
                    Ver servicios
                  </Link>
                  <Link
                    to={QUOTE_PAGE_HREF}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                  >
                    Pedir presupuesto
                  </Link>
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
          </div>
        </section>

        <section className="pb-20 lg:pb-28">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45 }}
            >
              <CustomerSignalBoard />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <MarginMixBoard />
            </motion.div>
          </div>
        </section>

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
                    Lectura rápida
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight text-white">
                    Si esto se parece a tu contexto, ya no hace falta seguir adivinando.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    Podés ir por servicios si todavía estás comparando, o bajar directo al
                    diagnóstico si querés revisar tu caso con criterio.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a
                    href={ROOT_DIAGNOSTIC_SECTION_HREF}
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-white"
                  >
                    Solicitar diagnóstico
                  </a>
                  <Link
                    to={QUOTE_PAGE_HREF}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
                  >
                    Pedir presupuesto
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
