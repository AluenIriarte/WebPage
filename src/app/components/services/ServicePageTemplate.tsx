import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { trackDiagnosisClick, trackQuoteClick } from "../../lib/analytics";
import { SERVICES_PAGE_HREF } from "../../lib/contact";
import { buildServiceFlowHref, type ServiceDefinition } from "../../lib/services";

interface ServicePageTemplateProps {
  service: ServiceDefinition;
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function ServicePageTemplate({ service }: ServicePageTemplateProps) {
  const diagnosticHref = buildServiceFlowHref(service.slug, "diagnostico");
  const quoteHref = buildServiceFlowHref(service.slug, "cotizacion");

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
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="space-y-7">
                <Link
                  to={SERVICES_PAGE_HREF}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground/65 transition-colors hover:text-accent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a servicios
                </Link>

                <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                  <service.icon className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-semibold tracking-wide text-accent">{service.eyebrow}</span>
                </div>

                <div className="space-y-5">
                  <h1 className="text-4xl font-semibold leading-[1.06] tracking-tight text-foreground md:text-5xl lg:text-[3.2rem]">
                    {service.title}
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-foreground/78">{service.tagline}</p>
                  <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">{service.summary}</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={diagnosticHref}
                    onClick={() => trackDiagnosisClick(`service_detail_${service.slug}`)}
                    className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                  >
                    Iniciar diagnóstico
                  </Link>
                  <Link
                    to={quoteHref}
                    onClick={() => trackQuoteClick(`service_detail_${service.slug}`, service.title)}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                  >
                    Pedir cotización
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 self-start">
                <div className="rounded-[2rem] border border-border/55 bg-white p-7 shadow-[0_24px_60px_rgba(15,23,42,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                    Qué obtiene el cliente
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-foreground/78">{service.deliverable}</p>
                </div>

                <div className="rounded-[2rem] border border-border/55 bg-[#FCFCFA] p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                    Ideal para
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-foreground/78">{service.audience}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="mb-10 max-w-2xl"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                Qué incluye
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Alcance claro, sin humo ni piezas sueltas.
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {service.includes.map((item, index) => (
                <motion.article
                  key={item.title}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={fadeUp}
                  className="rounded-[2rem] border border-border/55 bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.04)]"
                >
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
              <motion.div
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                className="rounded-[2rem] border border-border/55 bg-white p-8"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                  Problemas que resuelve
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Lo que suele estar frenando la decisión o la ejecución.
                </h2>
                <div className="mt-8 space-y-3">
                  {service.pains.map((item) => (
                    <div key={item} className="flex gap-3 rounded-[1.35rem] border border-border/50 bg-[#FBFBF9] px-4 py-4">
                      <div className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/55" />
                      <p className="text-sm leading-relaxed text-foreground/75">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                className="rounded-[2rem] border border-border/55 bg-[#FCFCFA] p-8"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                  Resultado esperado
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Impacto tangible en claridad, velocidad o conversión.
                </h2>

                <div className="mt-8 grid gap-4">
                  {service.outcomes.map((item) => (
                    <div key={item.title} className="rounded-[1.5rem] border border-border/50 bg-white p-5">
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="mb-10 max-w-2xl"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                Casos de uso
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Ideal para contextos donde ya hay una necesidad concreta.
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {service.useCases.map((item, index) => (
                <motion.article
                  key={item.title}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={fadeUp}
                  className="rounded-[2rem] border border-border/55 bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.04)]"
                >
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="rounded-[2rem] bg-foreground p-8 text-background lg:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                    Siguiente paso
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-white">
                    Si este servicio encaja con tu contexto, seguimos con el alcance ya preseleccionado.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    Entrás al mismo flujo de diagnóstico/cotización, pero con este servicio ya cargado para no volver a empezar desde cero.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    to={diagnosticHref}
                    onClick={() => trackDiagnosisClick(`service_detail_footer_${service.slug}`)}
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-white"
                  >
                    Iniciar diagnóstico
                  </Link>
                  <Link
                    to={quoteHref}
                    onClick={() => trackQuoteClick(`service_detail_footer_${service.slug}`, service.title)}
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
