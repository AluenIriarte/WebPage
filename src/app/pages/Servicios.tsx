import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ServicesShowcase } from "../components/services/ServicesShowcase";
import { trackDiagnosisClick } from "../lib/analytics";
import { ROOT_DIAGNOSTIC_SECTION_HREF } from "../lib/contact";

const guidance = [
  {
    title: "Si necesitás visibilidad y seguimiento",
    description: "Empezá por Dashboard a medida. Es la puerta natural cuando el problema es lectura, foco o decisión.",
  },
  {
    title: "Si el cuello está en tareas repetitivas",
    description: "Automatización de procesos entra cuando el costo oculto está en lo manual, el seguimiento o el error operativo.",
  },
  {
    title: "Si el problema es cómo presentás la oferta",
    description: "Páginas web y landings ordenan la propuesta, mejoran claridad y empujan contacto o conversión.",
  },
  {
    title: "Si ya vendés bien pero comunicás disperso",
    description: "Branding kits te da sistema visual y comercial para contenido, entregables y experiencia de marca.",
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
            <div className="absolute left-0 right-0 top-0 h-[520px] bg-gradient-to-b from-accent/[0.05] via-transparent to-transparent" />
            <div
              className="absolute right-0 top-8 h-[420px] w-[420px] rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-7"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-semibold tracking-wide text-accent">
                    Cuatro líneas de servicio
                  </span>
                </div>

                <div className="space-y-5">
                  <h1 className="text-4xl font-semibold leading-[1.06] tracking-tight text-foreground md:text-5xl lg:text-[3.2rem]">
                    Servicios B2B para ordenar decisión, eficiencia y activos comerciales.
                  </h1>
                  <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                    No es una oferta de agencia genérica. Son cuatro líneas concretas para resolver visibilidad,
                    operación, conversión y sistema de marca con criterio de negocio.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={ROOT_DIAGNOSTIC_SECTION_HREF}
                    onClick={() => trackDiagnosisClick("services_overview_hero")}
                    className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                  >
                    Iniciar diagnóstico
                  </a>
                  <Link
                    to="/#recurso"
                    className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                  >
                    Ver un recurso antes
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[2rem] border border-border/55 bg-white p-7 shadow-[0_24px_60px_rgba(15,23,42,0.05)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                  Cómo leer esta página
                </p>
                <div className="mt-5 space-y-4">
                  {guidance.map((item) => (
                    <div key={item.title} className="rounded-[1.35rem] border border-border/45 bg-[#FBFBF9] px-4 py-4">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <ServicesShowcase
          eyebrow="Oferta principal"
          title="Cuatro servicios, cada uno con entidad propia."
          description="Cada línea tiene su problema, su entregable y su camino de diagnóstico/cotización. Podés entrar por la que más se parezca a tu necesidad actual."
        />

        <section className="py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
              className="rounded-[2rem] bg-foreground p-8 text-background lg:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                    Diagnóstico guiado
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-white">
                    Si no estás seguro de cuál conviene, empezamos por el problema y elegimos la línea correcta.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    El flujo de diagnóstico sirve justo para eso: bajar contexto, preseleccionar el servicio correcto
                    y no forzar una solución antes de entender el caso.
                  </p>
                </div>

                <a
                  href={ROOT_DIAGNOSTIC_SECTION_HREF}
                  onClick={() => trackDiagnosisClick("services_overview_footer")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-white"
                >
                  Iniciar diagnóstico
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
