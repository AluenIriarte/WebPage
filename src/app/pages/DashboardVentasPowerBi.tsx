import { useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Database,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { trackDiagnosisClick, trackQuoteClick } from "../lib/analytics";
import { SERVICES_PAGE_HREF } from "../lib/contact";
import { buildServiceFlowHref } from "../lib/services";

const focusPoints = [
  "Seguimiento comercial ejecutivo",
  "Cartera en riesgo y clientes inactivos",
  "Margen, mix y expansion comercial",
  "Reporting semanal o mensual con foco real",
];

const serviceSteps = [
  {
    icon: TrendingUp,
    title: "Primero defino la lectura",
    body: "No parto de graficos sueltos. Parto de que decisiones comerciales tiene que soportar el dashboard.",
  },
  {
    icon: Database,
    title: "Despues ordeno la capa de datos",
    body: "Conecto fuentes, criterios y estructura para que la lectura no dependa de archivos dispersos o armado manual.",
  },
  {
    icon: BarChart3,
    title: "Y recien ahi diseño la vista",
    body: "El tablero se construye para reuniones, seguimiento y priorizacion, no para decorar una pantalla.",
  },
  {
    icon: ShieldCheck,
    title: "Lo dejo listo para uso real",
    body: "La entrega contempla adopcion, foco de lectura y una logica que pueda sostenerse en el tiempo.",
  },
];

export function DashboardVentasPowerBi() {
  const diagnosticHref = buildServiceFlowHref("dashboard-a-medida", "diagnostico");
  const quoteHref = buildServiceFlowHref("dashboard-a-medida", "cotizacion");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden pb-20 pt-36 lg:pb-24 lg:pt-44">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-0 right-0 top-0 h-[520px] bg-gradient-to-b from-accent/[0.05] via-transparent to-transparent" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.92fr] lg:items-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-7"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                  <BarChart3 className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-semibold tracking-wide text-accent">
                    Pagina especifica de servicio
                  </span>
                </div>

                <div className="space-y-5">
                  <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-[3.2rem]">
                    Dashboard de ventas y Power BI para direccion comercial
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    Si buscas un proveedor para diseñar un dashboard comercial a medida, esta es la pagina concreta del servicio principal.
                  </p>
                  <p className="max-w-3xl text-base leading-relaxed text-foreground/70">
                    El objetivo no es tener un tablero mas. Es dejar visible que pasa con cartera, margen, metas, mix y expansion para poder decidir con mas foco.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {focusPoints.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border/50 bg-white px-5 py-4 text-sm font-medium text-foreground/78"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    to={diagnosticHref}
                    onClick={() => trackDiagnosisClick("primary_service_page")}
                    className="group inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/25"
                  >
                    Solicitar diagnostico
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to={quoteHref}
                    onClick={() => trackQuoteClick("primary_service_page", "Dashboard a medida")}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-accent/35 hover:bg-accent/5 hover:text-accent"
                  >
                    Pedir cotizacion
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-border/50 bg-white p-8 shadow-2xl shadow-black/[0.05] lg:p-10"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
                  Que deberia resolver
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                  Este servicio tiene sentido cuando el problema ya esta en ventas, cartera o margen.
                </h2>
                <div className="mt-8 space-y-4">
                  {serviceSteps.map((step) => (
                    <div
                      key={step.title}
                      className="flex gap-4 rounded-2xl border border-border/40 bg-muted/20 p-4"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/10">
                        <step.icon className="h-4.5 w-4.5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{step.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-[2rem] bg-foreground p-8 text-background lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                    Si queres ver mas
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                    Tambien podes volver a la pagina de servicios para revisar otros productos.
                  </h2>
                </div>
                <Link
                  to={SERVICES_PAGE_HREF}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-white"
                >
                  Ver servicios / productos
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
