import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, BarChart3, ClipboardCheck, FileSearch, MessageSquareMore } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  DEMO_PAGE_HREF,
  QUOTE_PAGE_HREF,
  ROOT_DIAGNOSTIC_SECTION_HREF,
  SERVICES_PAGE_HREF,
} from "../lib/contact";

const nextSteps = [
  {
    icon: FileSearch,
    title: "Ver servicios",
    description: "Si todavía estás comparando opciones, esta es la mejor forma de ordenar qué hago y cuándo conviene cada cosa.",
    href: SERVICES_PAGE_HREF,
    internal: true,
  },
  {
    icon: BarChart3,
    title: "Ver demo completa",
    description: "Si querés algo tangible antes de hablar, la demo te muestra cómo se traduce esto en vistas y señales concretas.",
    href: DEMO_PAGE_HREF,
    internal: true,
  },
  {
    icon: MessageSquareMore,
    title: "Ir al diagnóstico",
    description: "Si ya sabés que querés revisar tu caso, esta es la salida más directa para el lead tibio o avanzado.",
    href: ROOT_DIAGNOSTIC_SECTION_HREF,
    internal: false,
  },
];

export function GraciasAutoDiagnostico() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden pb-20 pt-32 lg:pb-28 lg:pt-40">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-0 right-0 top-0 h-[460px] bg-gradient-to-b from-accent/[0.05] via-transparent to-transparent" />
          </div>

          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[2rem] border border-border/50 bg-white p-8 shadow-2xl shadow-black/[0.04] lg:p-10"
            >
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                  <ClipboardCheck className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-semibold tracking-wide text-accent">
                    Siguiente paso sugerido
                  </span>
                </div>
                <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
                  Listo. Ya tenés una primera lectura.
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Ahora la pregunta ya no es si mirar esto o no, sino cuál de estos caminos te sirve
                  más según tu temperatura actual.
                </p>
              </div>
            </motion.div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {nextSteps.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="flex h-full flex-col rounded-3xl border border-border/50 bg-white p-7 shadow-sm shadow-black/[0.03]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
                    <item.icon className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">{item.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

                  {item.internal ? (
                    <Link
                      to={item.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/75"
                    >
                      Ir ahora
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/75"
                    >
                      Ir ahora
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="mt-10 flex flex-col gap-4 rounded-3xl bg-foreground p-8 text-background lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                  Intención alta
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/72">
                  Si ya sabés que querés avanzar con un dashboard a medida y no necesitás tanta
                  exploración previa, podés ir directo al flujo de presupuesto.
                </p>
              </div>
              <Link
                to={QUOTE_PAGE_HREF}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-white"
              >
                Pedir presupuesto
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
