import { motion } from "motion/react";
import { ArrowRight, Download, Mail, Sparkles } from "lucide-react";
import publishingKitPdf from "../../../assets/docs/Publishing Kit - PDF (17).pdf";
import { ROOT_DIAGNOSTIC_SECTION_HREF } from "../lib/contact";
import { trackGuideClick } from "../lib/analytics";

const previewBlocks = [
  {
    label: "Cartera y riesgo",
    note: "Qué mirar primero para detectar cuentas en enfriamiento antes de perderlas.",
  },
  {
    label: "Margen y mix",
    note: "Dónde se erosiona rentabilidad y qué combinaciones conviene revisar con más criterio.",
  },
  {
    label: "Expansión y foco",
    note: "Qué señales priorizar antes de sumar más reportes o más reuniones vacías.",
  },
];

const highlights = [
  "Mantiene la presencia visual del auto-diagnóstico original",
  "Sirve para testear interés mientras definimos el asset final",
  "Después lo conectamos a envío automático por email y CRM",
];

export function LeadMagnetSection() {
  return (
    <section id="recurso" className="bg-[#F8F8F6] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
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

            <div className="relative mx-auto max-w-[580px] overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-2xl shadow-black/[0.06]">
              <div className="border-b border-border/40 px-7 py-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-3 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                    Auto-diagnóstico ejecutivo
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                  Un preview claro de qué conviene mirar primero en tu lectura comercial.
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  Recupera la presencia visual del auto-diagnóstico, pero esta sección queda enfocada
                  en el activo que después vas a poder enviar por email.
                </p>
              </div>

              <div className="space-y-4 px-7 py-7">
                {previewBlocks.map((item, index) => (
                  <div key={item.label} className="rounded-2xl border border-border/50 bg-muted/25 p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold leading-relaxed text-foreground">{item.label}</p>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/45">
                        0{index + 1}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                  </div>
                ))}

                <div className="rounded-2xl border border-accent/15 bg-accent/6 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/70">
                    Resultado
                  </p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    Un activo visual para entender rápido por dónde conviene empezar.
                  </p>
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
                Por ahora dejo un PDF de prueba para validar interés y sostener la lógica de regalo.
                El siguiente paso es conectarlo al envío automático por email con el asset final.
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
                Abrir asset de prueba
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href={ROOT_DIAGNOSTIC_SECTION_HREF}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
              >
                Prefiero diagnóstico
              </a>
            </div>

            <p className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ArrowRight className="h-4 w-4 text-accent" />
              Cuando definamos el asset final, este bloque pasa a entrega automática por email.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
