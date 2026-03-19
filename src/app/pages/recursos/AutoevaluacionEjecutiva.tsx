import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Download, FileText, LineChart, Radar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import leadmagnet5PalancasCover from "../../../../assets/leadmagnets/5 palancas/Page01Cover.png";
import leadmagnet5PalancasPage02 from "../../../../assets/leadmagnets/5 palancas/Page02Thesis.png";
import leadmagnet5PalancasPage04 from "../../../../assets/leadmagnets/5 palancas/Page04ClientesPerdidos.png";
import leadmagnet5PalancasPage10 from "../../../../assets/leadmagnets/5 palancas/Page10Checklist.png";
import leadmagnet5PalancasPdf from "../../../../assets/leadmagnets/5 palancas/5 palancas comerciales.pdf";
import { ResourceLayout } from "./ResourceLayout";
import { DEMO_PAGE_HREF, ROOT_DIAGNOSTIC_SECTION_HREF } from "../../lib/contact";

const signals = [
  {
    icon: Users,
    title: "Clientes perdidos o inactivos",
    description:
      "Cómo detectar cuentas que se enfrían antes de que la caída ya impacte en la facturación.",
  },
  {
    icon: LineChart,
    title: "Mix y margen",
    description:
      "Qué mirar para no confundir volumen con rentabilidad y empezar a priorizar mejor.",
  },
  {
    icon: Radar,
    title: "Foco comercial",
    description:
      "Qué señales ayudan a ordenar mejor el esfuerzo del equipo y a detectar oportunidades reales.",
  },
];

const previewPages = [
  {
    title: "Marco inicial",
    image: leadmagnet5PalancasPage02,
  },
  {
    title: "Clientes perdidos",
    image: leadmagnet5PalancasPage04,
  },
  {
    title: "Checklist final",
    image: leadmagnet5PalancasPage10,
  },
];

export function AutoevaluacionEjecutiva() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <ResourceLayout>
      <section className="bg-[#F8F8F6] pb-20 pt-20 lg:pb-28 lg:pt-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-8 rounded-[2rem] border border-border/60 bg-white p-8 shadow-2xl shadow-black/[0.04] lg:grid-cols-[0.34fr_0.66fr] lg:p-10"
          >
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[260px] overflow-hidden rounded-[1.8rem] border border-border/50 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.16)]">
                <img src={leadmagnet5PalancasCover} alt="5 palancas comerciales" className="h-auto w-full object-cover" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                <FileText className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold tracking-wide text-accent">Recurso gratuito</span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-5xl">
                5 palancas comerciales para detectar oportunidades ocultas en tus ventas.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                Una guía ejecutiva para revisar dónde se están perdiendo clientes, margen o foco comercial antes de pedir un dashboard o una capa nueva de visibilidad.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={leadmagnet5PalancasPdf}
                  download="5-palancas-comerciales.pdf"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Descargar PDF
                  <Download className="h-4 w-4" />
                </a>
                <Link
                  to={DEMO_PAGE_HREF}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                >
                  Ver demo completa
                </Link>
              </div>
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
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/70">
                Vista previa del recurso
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                Algunas páginas que vas a encontrar adentro
              </h2>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {previewPages.map((page, index) => (
                <motion.article
                  key={page.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="overflow-hidden rounded-[1.8rem] border border-border/55 bg-[#FAFAF8]"
                >
                  <img src={page.image} alt={page.title} className="h-auto w-full object-cover" />
                  <div className="border-t border-border/50 px-5 py-4">
                    <p className="text-sm font-medium text-foreground/74">{page.title}</p>
                  </div>
                </motion.article>
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
                  El siguiente paso es construir una capa de visibilidad útil para decidir mejor: demo si querés ver algo tangible, o diagnóstico si querés revisar tu caso real.
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
