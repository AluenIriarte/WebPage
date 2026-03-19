import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Download, FileText, LineChart, Radar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ResourceLayout } from "./ResourceLayout";
import { DEMO_PAGE_HREF, ROOT_DIAGNOSTIC_SECTION_HREF } from "../../lib/contact";

const signals = [
  {
    icon: Users,
    title: "Clientes en riesgo",
    description:
      "Señales para detectar cuentas que se enfrían antes de que la pérdida quede consolidada en la facturación.",
  },
  {
    icon: LineChart,
    title: "Margen y mix",
    description:
      "Qué mirar para entender si el volumen se sostiene, pero la rentabilidad ya empezó a deteriorarse.",
  },
  {
    icon: Radar,
    title: "Foco comercial",
    description:
      "Cómo distinguir si hoy faltan señales útiles, criterio de lectura o una capa real de visibilidad comercial.",
  },
];

const levels = [
  {
    title: "Visibilidad baja",
    description: "Todavía decidís más por intuición que por una lectura consistente del negocio.",
  },
  {
    title: "Visibilidad parcial",
    description: "Hay datos y reportes, pero todavía no están traducidos a prioridades claras.",
  },
  {
    title: "Visibilidad sólida",
    description: "Ya existe una base útil y el siguiente salto es refinar foco, alertas y decisiones.",
  },
];

export function AutoevaluacionEjecutiva() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <ResourceLayout>
      <section className="bg-[#F8F8F6] pb-20 pt-20 lg:pb-28 lg:pt-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] border border-border/60 bg-white p-8 shadow-2xl shadow-black/[0.04] lg:p-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
              <FileText className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-semibold tracking-wide text-accent">
                Recurso gratuito
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-5xl">
              Autoevaluación ejecutiva para detectar si hoy te faltan señales críticas para decidir mejor.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Esta lectura corta resuelve el problema previo al dashboard: entender si hoy te falta
              claridad sobre clientes, margen, mix y foco comercial.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
              >
                Descargar como PDF
                <Download className="h-4 w-4" />
              </button>
              <Link
                to={DEMO_PAGE_HREF}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
              >
                Ver demo completa
              </Link>
            </div>
          </motion.div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {signals.map((signal, index) => (
              <motion.article
                key={signal.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-[1.8rem] border border-border/60 bg-white p-6 shadow-xl shadow-black/[0.03]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                  <signal.icon className="h-5 w-5 text-accent" />
                </div>
                <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                  {signal.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{signal.description}</p>
              </motion.article>
            ))}
          </div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="mt-10 rounded-[2rem] border border-border/60 bg-white p-8 shadow-2xl shadow-black/[0.03] lg:p-10"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/70">
              Cómo leer el resultado
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {levels.map((level) => (
                <div key={level.title} className="rounded-[1.6rem] border border-border/50 bg-[#F8F8F6] p-5">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">{level.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{level.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="mt-10 rounded-[2rem] bg-foreground p-8 text-background lg:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                  Siguiente paso
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  Si esto te resonó, el paso siguiente no es mirar más datos.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
                  El paso siguiente es construir una capa de visibilidad útil para decidir mejor:
                  demo si querés ver algo tangible, o diagnóstico si querés revisar tu caso real.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  to={DEMO_PAGE_HREF}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-white"
                >
                  Ver demo completa
                </Link>
                <a
                  href={ROOT_DIAGNOSTIC_SECTION_HREF}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
                >
                  Solicitar diagnóstico
                </a>
              </div>
            </div>
          </motion.section>
        </div>
      </section>
    </ResourceLayout>
  );
}
