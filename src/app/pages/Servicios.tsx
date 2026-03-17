import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Database,
  LayoutDashboard,
  Layers3,
  Settings2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  QUOTE_PAGE_HREF,
  ROOT_DIAGNOSTIC_SECTION_HREF,
  SERVICES_PAGE_HREF,
} from "../lib/contact";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const deliverables = [
  {
    icon: LayoutDashboard,
    title: "Dashboard ejecutivo de ventas",
    description:
      "Una vista clara para dirección o gerencia comercial con KPIs, variaciones, alertas y foco de lectura.",
  },
  {
    icon: Layers3,
    title: "Tablero comercial operativo",
    description:
      "Pipeline, actividad, oportunidades, cartera en riesgo y seguimiento por vendedor o región.",
  },
  {
    icon: Database,
    title: "Modelo y estructura de datos",
    description:
      "Ordeno fuentes, criterios y definiciones para que el tablero no dependa de Excel suelto o reportes manuales.",
  },
  {
    icon: ShieldCheck,
    title: "Adopción y uso real",
    description:
      "El trabajo no termina en el diseño: dejo la lógica lista para que el equipo la use en reuniones y decisiones.",
  },
];

const dashboardTypes = [
  {
    title: "Dashboard de ventas a medida",
    description:
      "Para seguimiento de revenue, metas, pipeline, conversión, cartera, mix y crecimiento comercial.",
  },
  {
    title: "Tablero comercial para dirección",
    description:
      "Pensado para lectura ejecutiva: variación vs meta, alertas de cartera, margen y oportunidades de expansión.",
  },
  {
    title: "Dashboards de cartera y clientes",
    description:
      "Clientes activos, en riesgo, perdidos, frecuencia de compra, ticket y segmentación por valor.",
  },
  {
    title: "BI comercial y reporting automatizado",
    description:
      "Dashboards + actualización automática + reportes recurrentes para que el equipo no dependa de armado manual.",
  },
];

const pricingFactors = [
  "Cantidad y calidad de las fuentes de datos disponibles",
  "Necesidad de limpieza, modelado y consolidación previa",
  "Cantidad de vistas, usuarios y nivel de detalle requerido",
  "Automatizaciones, alertas o integraciones que haga falta sumar",
];

const needFromYou = [
  "Objetivo del tablero: qué decisión tiene que ayudar a tomar",
  "Fuentes disponibles hoy: ERP, CRM, Excel, SQL, APIs o reportes internos",
  "Quién lo va a usar: dirección, gerencia comercial, analistas o equipo operativo",
  "Plazo o urgencia del proyecto",
];

const tools = [
  "Power BI",
  "Looker Studio",
  "Tableau",
  "Excel / Google Sheets",
  "SQL",
  "CRM / ERP",
  "Automatización de reportes",
  "Alertas comerciales",
];

const complementaryServices = [
  {
    icon: Zap,
    title: "Automatización de reportes",
    description:
      "Cuando un equipo pierde horas consolidando archivos o armando reportes periódicos que podrían salir solos.",
  },
  {
    icon: Sparkles,
    title: "IA aplicada a decisiones comerciales",
    description:
      "Scoring, predicción, alertas y modelos solo cuando agregan claridad real al proceso comercial.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Dashboards para otras áreas",
    description:
      "La misma lógica aplicada a finanzas, operaciones o marketing si el caso lo necesita.",
  },
];

export function Servicios() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden pb-20 pt-36 lg:pb-24 lg:pt-44">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-0 right-0 top-0 h-[500px] bg-gradient-to-b from-accent/[0.04] via-transparent to-transparent" />
            <div
              className="absolute right-0 top-10 h-[420px] w-[420px] rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="max-w-3xl space-y-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                <Settings2 className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold tracking-wide text-accent">
                  Servicio principal
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-[3.2rem]">
                  Dashboards de ventas y BI comercial a medida
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Diseño dashboards comerciales, tableros de ventas y sistemas de Business
                  Intelligence personalizados para dirección y equipos comerciales.
                </p>
                <p className="max-w-3xl text-base leading-relaxed text-foreground/70">
                  Si necesitás ver con claridad cartera, margen, mix, oportunidades, metas o
                  rendimiento comercial, este es el servicio central. Automatización e IA entran
                  después, cuando ayudan a sostener esa lectura y acelerar decisiones.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={ROOT_DIAGNOSTIC_SECTION_HREF}
                  className="group inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/25"
                >
                  Solicitar diagnóstico
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <Link
                  to={QUOTE_PAGE_HREF}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-accent/35 hover:bg-accent/5 hover:text-accent"
                >
                  Pedir presupuesto
                </Link>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {[
                  "Dashboard de ventas a medida",
                  "Tablero comercial",
                  "BI para equipos de ventas",
                  "Reporting automatizado",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex rounded-full border border-border/60 bg-white px-3 py-1.5 text-xs font-medium text-foreground/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="pb-16 lg:pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="mb-10 max-w-2xl"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/50">
                Qué entrego
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                El servicio no es un gráfico lindo. Es una capa real de visibilidad comercial.
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {deliverables.map((item, index) => (
                <motion.div
                  key={item.title}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className="rounded-3xl border border-border/50 bg-white p-8"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="mb-10 max-w-2xl"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/50">
                Qué tipo de dashboard hago
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Distintos formatos, mismo objetivo: volver visible lo que hoy decide el negocio.
              </h2>
            </motion.div>

            <div className="grid gap-px overflow-hidden rounded-3xl bg-border/40 md:grid-cols-2">
              {dashboardTypes.map((item, index) => (
                <motion.div
                  key={item.title}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white px-8 py-10"
                >
                  <h3 className="mb-3 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="rounded-3xl border border-border/50 bg-white p-8 lg:p-10"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/50">
                  Cómo se cotiza
                </p>
                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-foreground">
                  El presupuesto depende del problema y de la estructura actual de datos.
                </h2>
                <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  No hay un precio único porque no es el mismo trabajo conectar un CRM ordenado que
                  consolidar varias fuentes, limpiar datos y dejar automatizaciones listas.
                </p>
                <div className="space-y-4">
                  {pricingFactors.map((factor, index) => (
                    <div key={factor} className="flex gap-4 rounded-2xl border border-border/40 bg-muted/20 p-4">
                      <div className="w-5 flex-shrink-0 pt-0.5 text-[11px] font-bold tabular-nums text-accent/40">
                        0{index + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/75">{factor}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={QUOTE_PAGE_HREF}
                    className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent"
                  >
                    Pedir presupuesto
                  </Link>
                  <a
                    href={ROOT_DIAGNOSTIC_SECTION_HREF}
                    className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                  >
                    Prefiero empezar por diagnóstico
                  </a>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="rounded-3xl border border-border/50 bg-white p-8 lg:p-10"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/50">
                  Qué necesito de tu lado
                </p>
                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-foreground">
                  No necesitás tenerlo todo resuelto para avanzar.
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                  Lo mínimo para evaluar un caso es entender qué querés ver, desde dónde salen los
                  datos y qué decisión tiene que soportar el sistema.
                </p>
                <div className="space-y-3">
                  {needFromYou.map((item) => (
                    <div key={item} className="flex gap-3">
                      <div className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/50" />
                      <p className="text-sm leading-relaxed text-foreground/75">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-2xl border border-accent/15 bg-accent/5 p-5">
                  <p className="text-sm font-semibold text-foreground">¿No sabés por dónde empezar?</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    En ese caso conviene arrancar por diagnóstico y después bajar a alcance y
                    presupuesto con más claridad.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="rounded-3xl border border-border/50 bg-white p-8 lg:p-10"
            >
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/50">
                    Tecnologías y herramientas
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                    La herramienta importa menos que el criterio, pero también tiene que encajar.
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  {tools.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex rounded-full border border-border/60 bg-muted/20 px-4 py-2 text-sm text-foreground/70"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="mb-10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/50">
                Complementos cuando el caso lo pide
              </p>
            </motion.div>

            <div className="grid gap-px overflow-hidden rounded-3xl bg-border/40 md:grid-cols-3">
              {complementaryServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className="bg-white px-8 py-10"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
                    <service.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-foreground">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="relative overflow-hidden rounded-3xl bg-foreground"
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.18) 0%, transparent 60%)" }}
              />

              <div className="relative z-10 grid items-center gap-10 px-8 py-14 lg:grid-cols-2 lg:px-16 lg:py-20">
                <div className="space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    Dashboards a medida
                  </p>
                  <h2 className="text-3xl font-semibold leading-[1.15] tracking-tight text-white md:text-[2.25rem]">
                    Si ya sabés lo que necesitás, pedí presupuesto. Si todavía no, empezamos por
                    diagnóstico.
                  </h2>
                  <p className="max-w-md text-base leading-relaxed text-white/60">
                    Las dos rutas sirven. La diferencia es si hoy ya tenés claro el alcance o si
                    primero conviene ordenar el problema y la información disponible.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Link
                    to={QUOTE_PAGE_HREF}
                    className="group inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-medium text-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-accent hover:text-white hover:shadow-xl hover:shadow-accent/30"
                  >
                    Pedir presupuesto
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href={ROOT_DIAGNOSTIC_SECTION_HREF}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-4 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
                  >
                    Solicitar diagnóstico
                  </a>
                  <Link
                    to={SERVICES_PAGE_HREF}
                    className="text-center text-sm text-white/45 transition-colors hover:text-white/70"
                  >
                    Seguir revisando servicios
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
