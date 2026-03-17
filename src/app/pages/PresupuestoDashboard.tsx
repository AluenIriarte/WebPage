import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Clock3, Mail, ShieldCheck } from "lucide-react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  QUOTE_EMAIL_HREF,
  ROOT_DIAGNOSTIC_SECTION_HREF,
  SERVICES_PAGE_HREF,
} from "../lib/contact";

const budgetInputs = [
  "Qué querés ver en el dashboard o tablero",
  "Qué herramientas o fuentes usás hoy",
  "Quién lo va a mirar y con qué frecuencia",
  "Qué plazo tenés en mente",
];

const projectTypes = [
  "Dashboard de ventas a medida para dirección o gerencia comercial",
  "Tablero comercial operativo con pipeline, cartera y seguimiento por vendedor",
  "Dashboard en Power BI u otra herramienta conectado a tus datos reales",
  "Sistema de reporting automatizado para revisiones semanales o mensuales",
];

const priceDrivers = [
  "Cantidad de fuentes de datos y necesidad de consolidación",
  "Limpieza y modelado previo que haga falta resolver",
  "Cantidad de vistas, filtros y usuarios",
  "Automatizaciones, alertas o integraciones adicionales",
];

export function PresupuestoDashboard() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden pb-20 pt-36 lg:pb-24 lg:pt-44">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-0 right-0 top-0 h-[520px] bg-gradient-to-b from-accent/[0.04] via-transparent to-transparent" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-7"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                  <Mail className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-semibold tracking-wide text-accent">
                    Presupuesto y alcance
                  </span>
                </div>

                <div className="space-y-5">
                  <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-[3.2rem]">
                    Pedí cotización para tu dashboard de ventas a medida
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    Si ya tenés relativamente claro lo que necesitás, este es el camino más directo:
                    me mandás el contexto, reviso alcance y te respondo por email.
                  </p>
                  <p className="max-w-3xl text-base leading-relaxed text-foreground/70">
                    Si todavía no sabés bien qué conviene construir, qué fuentes usar o por dónde
                    empezar, te conviene más arrancar por diagnóstico.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <a
                    href={QUOTE_EMAIL_HREF}
                    className="group inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/25"
                  >
                    Escribir para cotizar
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href={ROOT_DIAGNOSTIC_SECTION_HREF}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                  >
                    Prefiero empezar por diagnóstico
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-border/50 bg-white p-8 shadow-2xl shadow-black/[0.05] lg:p-10"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                    <Clock3 className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Qué incluir en el email</p>
                    <p className="text-xs text-muted-foreground">
                      Cuanto más claro sea el contexto, más precisa puede ser la respuesta.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {budgetInputs.map((item, index) => (
                    <div key={item} className="flex gap-4 rounded-2xl border border-border/40 bg-muted/20 p-4">
                      <div className="w-5 flex-shrink-0 pt-0.5 text-[11px] font-bold tabular-nums text-accent/40">
                        0{index + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/75">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl border border-accent/15 bg-accent/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <p className="text-sm font-semibold text-foreground">Atajo útil</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    El botón ya abre tu mail con asunto y estructura prearmada para que no tengas que
                    pensar desde cero qué escribir.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="mb-10 max-w-2xl"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/50">
                Casos típicos
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Este camino sirve mejor cuando ya estás buscando un proveedor o una cotización.
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {projectTypes.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="rounded-3xl border border-border/50 bg-white p-8"
                >
                  <p className="text-base leading-relaxed text-foreground/80">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-border/50 bg-white p-8 lg:p-10"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/50">
                  Qué mueve el precio
                </p>
                <h2 className="mb-6 text-3xl font-semibold tracking-tight text-foreground">
                  No cotizo por “pantalla”. Cotizo por alcance real.
                </h2>
                <div className="space-y-3">
                  {priceDrivers.map((item) => (
                    <div key={item} className="flex gap-3">
                      <div className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/50" />
                      <p className="text-sm leading-relaxed text-foreground/75">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="rounded-3xl bg-foreground p-8 text-background lg:p-10"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                  Si todavía estás comparando opciones
                </p>
                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-white">
                  Primero podés revisar servicios y después volver con más claridad.
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-white/65">
                  Si querés entender mejor qué hago, qué tipo de dashboards desarrollo y cuándo
                  conviene cada cosa, la página de servicios te va a ordenar el panorama.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={SERVICES_PAGE_HREF}
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-white"
                  >
                    Ver servicios
                  </Link>
                  <a
                    href={ROOT_DIAGNOSTIC_SECTION_HREF}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
                  >
                    Ir al diagnóstico
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
