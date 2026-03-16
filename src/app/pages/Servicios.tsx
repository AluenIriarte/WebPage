import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Monitor,
  Zap,
  Sparkles,
  ArrowUpRight,
  Settings2,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

const coreService = {
  eyebrow: "Servicio principal",
  icon: BarChart3,
  title: "BI Comercial & Dashboards Ejecutivos",
  description:
    "Diseno sistemas de decision comercial que convierten datos de ventas en acciones concretas. El trabajo central: visibilidad real sobre donde esta el dinero que hoy no se ve.",
  bullets: [
    "Analisis de cartera: clientes activos, en riesgo y perdidos",
    "Deteccion de margen erosionado y oportunidades de mix",
    "Segmentacion por rentabilidad, volumen y frecuencia de compra",
    "Dashboards ejecutivos con drill-down operativo",
    "Indicadores de alerta para equipos comerciales",
    "Reporteria automatizada para revisiones de negocio",
  ],
  cta: "Este es el diagnostico",
  ctaHref: "/#contacto",
};

const otherServices = [
  {
    icon: Monitor,
    title: "Dashboards para otras areas",
    description:
      "La misma logica de decision aplicada a finanzas, operaciones, marketing o RRHH. Un sistema de reporteria claro para cada area que lo necesite.",
    bullets: [
      "Finanzas: P&L visual, flujo de caja, presupuesto vs real",
      "Operaciones: KPIs de produccion, logistica y eficiencia",
      "Marketing: performance por canal, CAC, ROI de campanas",
      "RRHH: headcount, rotacion, ausentismo",
    ],
  },
  {
    icon: Zap,
    title: "RPA & Automatizacion de reportes",
    description:
      "Elimino el trabajo manual que consume tiempo sin agregar valor: consolidacion de archivos, generacion de reportes periodicos e integracion entre sistemas.",
    bullets: [
      "Automatizacion de reportes Excel/PowerPoint recurrentes",
      "Consolidacion de datos desde multiples fuentes",
      "Flujos de actualizacion y distribucion automatica",
      "Integracion entre ERP, CRM y bases de datos internas",
    ],
  },
  {
    icon: Sparkles,
    title: "IA Aplicada a decisiones comerciales",
    description:
      "Modelos aplicados a problemas concretos de negocio. No tecnologia por si sola, sino inteligencia incorporada al proceso de decision.",
    bullets: [
      "Scoring de clientes y propension de compra",
      "Deteccion de anomalias y alertas automaticas",
      "Prediccion de demanda y riesgo de churn",
      "Segmentacion avanzada para campanas comerciales",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Servicios() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-24 overflow-hidden">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-accent/[0.04] via-transparent to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/8 rounded-full border border-accent/15">
                <Settings2 className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-semibold text-accent tracking-wide">Servicios</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3rem] font-semibold leading-[1.1] tracking-tight text-foreground">
                Lo que puedo construir
                <br className="hidden sm:block" /> para tu operacion
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Business Intelligence como punto de partida. Automatizacion e IA donde tiene sentido
                aplicarlos. Todo orientado a que el negocio tome mejores decisiones con los datos que ya
                tiene.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pb-16 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="relative rounded-3xl border border-accent/20 bg-white overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-[400px] h-[300px] pointer-events-none -z-0"
                style={{ background: "radial-gradient(ellipse at 80% 0%, rgba(139,92,246,0.07) 0%, transparent 65%)" }}
              />

              <div className="relative z-10 p-8 lg:p-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <coreService.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-xs font-semibold text-accent uppercase tracking-widest">
                      {coreService.eyebrow}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-[1.75rem] font-semibold text-foreground leading-[1.2] tracking-tight">
                    {coreService.title}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">{coreService.description}</p>

                  <Link
                    to={coreService.ctaHref}
                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white rounded-full font-medium text-sm hover:bg-accent/90 transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 hover:scale-[1.02]"
                  >
                    {coreService.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                <div className="space-y-3 pt-1">
                  {coreService.bullets.map((bullet, index) => (
                    <motion.div
                      key={bullet}
                      custom={index}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-1 w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      </div>
                      <span className="text-sm text-foreground/80 leading-relaxed">{bullet}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="mb-10"
            >
              <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-[0.14em]">
                Tambien trabajo en
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden">
              {otherServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    custom={index}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="bg-white px-8 py-10 lg:px-10 lg:py-12 flex flex-col gap-6"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground leading-snug">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>

                    <ul className="space-y-2 mt-auto">
                      {service.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5">
                          <div className="mt-[5px] w-1 h-1 rounded-full bg-accent/50 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground/80 leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="relative rounded-3xl bg-foreground overflow-hidden"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.18) 0%, transparent 60%)" }}
              />

              <div className="relative z-10 px-8 py-14 lg:px-16 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                    Automatizacion y mejora de procesos
                  </p>
                  <h2 className="text-3xl md:text-[2.25rem] font-semibold text-white leading-[1.15] tracking-tight">
                    Buscas algo mas especifico?
                  </h2>
                  <p className="text-base text-white/60 leading-relaxed max-w-md">
                    Si tenes un proceso manual, una integracion rota, un reporte que consume horas o una
                    pregunta de negocio que hoy no podes responder con datos, probablemente hay algo concreto
                    que se puede hacer.
                  </p>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Automatizacion de procesos",
                      "Integracion de sistemas",
                      "Reporteria periodica",
                      "ETL y pipelines de datos",
                      "Alertas automaticas",
                      "Modelos predictivos",
                      "Agentes con IA",
                      "Consolidacion de informacion",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full border border-white/15 text-white/60 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/#contacto"
                    className="group inline-flex items-center gap-2 self-start px-7 py-4 bg-white text-foreground rounded-full font-medium text-sm hover:bg-accent hover:text-white transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02]"
                  >
                    Hablemos de tu caso
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
