import { motion } from "motion/react";
import { ArrowRight, Download, FileBadge2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import publishingKitPdf from "../../../assets/docs/Publishing Kit - PDF (17).pdf";
import { ROOT_DIAGNOSTIC_SECTION_HREF, SERVICES_PAGE_HREF } from "../lib/contact";
import { trackGuideClick } from "../lib/analytics";

const highlights = [
  "Formato visual y ejecutivo",
  "Útil para explicar el enfoque internamente",
  "Sirve como test mientras definimos el asset final",
];

export function LeadMagnetSection() {
  return (
    <section id="recurso" className="bg-[#F8F8F6] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div
              className="absolute inset-0 -z-10 rounded-[2rem] opacity-60 blur-3xl"
              style={{ background: "radial-gradient(circle at 35% 35%, rgba(139,92,246,0.2), transparent 68%)" }}
            />

            <div className="relative mx-auto max-w-[580px] rounded-[2rem] border border-border/60 bg-white p-7 shadow-2xl shadow-black/[0.06]">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
                    <FileBadge2 className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/70">
                      Recurso de prueba
                    </p>
                    <p className="text-sm font-semibold text-foreground">Publishing Kit</p>
                  </div>
                </div>
                <span className="rounded-full border border-accent/15 bg-accent/6 px-3 py-1 text-[11px] font-semibold text-accent">
                  PDF
                </span>
              </div>

              <div className="rounded-[1.6rem] border border-border/50 bg-[#101d31] p-6 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Preview
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                  Asset de contenido y publicación
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                  Una muestra del tipo de activo visual y estratégico que también puedo desarrollar
                  para ventas, marca y sistemas editoriales.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    "Portada y narrativa",
                    "Sistema visual reusable",
                    "Bloques editoriales",
                    "Formato listo para entregar",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="space-y-7"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                <Mail className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold tracking-wide text-accent">
                  Recurso para revisar por tu cuenta
                </span>
              </div>
              <h2 className="text-3xl font-semibold leading-[1.06] tracking-tight text-foreground md:text-4xl lg:text-5xl">
                Si todavía no querés hablar, podés llevarte un{" "}
                <span className="text-accent">activo de muestra</span>
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Mientras definimos el lead magnet final por email, dejo este recurso de prueba para
                validar interés y mostrar el nivel de acabado de los activos que puedo construir.
              </p>
            </div>

            <div className="space-y-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-border/50 bg-white px-5 py-4">
                  <div className="h-2 w-2 rounded-full bg-accent/70" />
                  <p className="text-sm text-foreground/78">{item}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={publishingKitPdf}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGuideClick("home_lead_magnet", "publishing_kit_pdf")}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
              >
                Descargar recurso de prueba
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href={ROOT_DIAGNOSTIC_SECTION_HREF}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
              >
                Prefiero diagnóstico
              </a>
            </div>

            <Link
              to={SERVICES_PAGE_HREF}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
            >
              Ver servicios / productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
