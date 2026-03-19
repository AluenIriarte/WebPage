import { FormEvent, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, FileText, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AUTO_DIAGNOSTIC_THANKYOU_HREF,
  DIAGNOSTIC_SECTION_HREF,
} from "../lib/contact";
import { trackFormSubmit } from "../lib/analytics";
import { freeResources } from "../lib/free-resources";

const previewPoints = [
  "Clientes que se enfrían y todavía no aparecen en tu radar",
  "Margen erosionado aunque el volumen siga pareciendo sano",
  "Señales de foco comercial que hoy no están visibles",
];

const resourceSignals = [
  {
    label: "Clientes en riesgo",
    detail: "Detectá señales tempranas antes de que la caída ya sea evidente.",
  },
  {
    label: "Margen erosionado",
    detail: "Separá volumen de rentabilidad para priorizar con más criterio.",
  },
  {
    label: "Foco comercial",
    detail: "Entendé dónde conviene intervenir primero y qué está dispersando al equipo.",
  },
];

const initialForm = {
  nombre: "",
  email: "",
  empresa: "",
};

export function LeadMagnetSection() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  const selectedResource = useMemo(
    () => freeResources.find((resource) => resource.id === selectedResourceId) ?? null,
    [selectedResourceId],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      ...form,
      recursoId: selectedResource?.id ?? "",
      recurso: selectedResource?.title ?? "",
      recursoHref: selectedResource?.pageHref ?? "",
    };

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("leadmagnet_request", JSON.stringify(payload));
    }

    trackFormSubmit("lead_magnet_request", selectedResource?.title);
    navigate(AUTO_DIAGNOSTIC_THANKYOU_HREF, {
      state: payload,
    });
  }

  return (
    <section id="recurso" className="relative overflow-hidden bg-[#F8F8F6] py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-3xl" />
        <div className="absolute right-0 top-24 h-[320px] w-[320px] rounded-full bg-[#11182B]/[0.03] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-3xl font-semibold leading-[0.98] tracking-tight text-foreground md:text-4xl lg:text-[3.2rem]">
            Recurso <span className="text-accent">GRATUITO</span> para convertir datos en decisiones comerciales.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Herramientas prácticas para detectar oportunidades ocultas en tus ventas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="mx-auto mt-14 max-w-6xl"
          style={{ perspective: "1600px" }}
        >
          {freeResources.map((resource) => {
            const isSelected = resource.id === selectedResourceId;

            return (
              <motion.div
                key={resource.id}
                animate={{ rotateY: isSelected ? 180 : 0 }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative min-h-[620px] lg:min-h-[510px]"
              >
                <div
                  className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfa_100%)] shadow-[0_34px_100px_rgba(15,23,42,0.10)]"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-full bg-accent/[0.10] blur-3xl" />
                    <div className="absolute right-12 top-10 h-24 w-24 rounded-full border border-accent/8" />
                    <div className="absolute bottom-8 left-8 h-28 w-28 rounded-full border border-foreground/[0.04]" />
                  </div>

                  <div className="relative grid h-full gap-6 p-5 lg:grid-cols-[0.45fr_0.55fr] lg:gap-7 lg:p-7">
                    <div className="relative overflow-hidden rounded-[2rem] bg-[#12192D] p-6 text-white lg:p-7">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.30),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_28%)]" />
                      <div className="absolute -right-8 top-8 h-28 w-28 rounded-full border border-white/10" />
                      <div className="absolute bottom-8 right-8 h-20 w-20 rounded-[1.5rem] border border-white/10 bg-white/5" />

                      <div className="relative flex h-full flex-col">
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                            <FileText className="h-3.5 w-3.5 text-cyan-300" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                              {resource.type}
                            </span>
                          </div>

                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/60">
                            Lectura breve
                          </span>
                        </div>

                        <div className="mt-10">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
                            Recurso destacado
                          </p>
                          <h3 className="mt-4 max-w-xs text-[2.15rem] font-semibold leading-[1.02] tracking-tight">
                            {resource.title}
                          </h3>
                          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/68">
                            Un primer paso para revisar por tu cuenta donde pueden estar escondidas las señales que hoy no estás viendo con claridad.
                          </p>
                        </div>

                        <div className="mt-auto rounded-[1.7rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/52">
                            Qué incluye
                          </p>
                          <div className="mt-4 space-y-3">
                            {previewPoints.map((point) => (
                              <div key={point} className="flex items-start gap-3 text-sm text-white/82">
                                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-300" />
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-[2rem] border border-border/50 bg-white/90 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm lg:p-7">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-accent/12 bg-accent/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/80">
                          <Sparkles className="h-3.5 w-3.5" />
                          Se envía por email
                        </div>
                        <h4 className="mt-5 max-w-lg text-[2.05rem] font-semibold leading-[1.04] tracking-tight text-foreground">
                          Una lectura rápida para detectar si hoy te faltan señales críticas sobre cartera, margen y foco comercial.
                        </h4>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                          Pensado para alguien que todavía no quiere una llamada, pero sí quiere una referencia clara antes de pedir un dashboard o revisar su operación con más criterio.
                        </p>

                        <div className="mt-7 grid gap-3 sm:grid-cols-3">
                          {resourceSignals.map((signal) => (
                            <div
                              key={signal.label}
                              className="rounded-[1.5rem] border border-border/50 bg-[#FAFAF8] p-4"
                            >
                              <p className="text-sm font-semibold text-foreground">{signal.label}</p>
                              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {signal.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 border-t border-border/50 pt-6">
                        <div className="mb-5 flex flex-wrap gap-2">
                          {["PDF ejecutivo", "Checklist práctico", "Ideal antes del dashboard"].map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-border/50 bg-[#F8F8F6] px-3 py-1.5 text-[11px] font-medium text-foreground/70"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <button
                            type="button"
                            onClick={() => setSelectedResourceId(resource.id)}
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
                          >
                            Solicitar archivo
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </button>
                          <a
                            href={DIAGNOSTIC_SECTION_HREF.replace("contacto", "problema")}
                            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/74 transition-colors hover:text-accent"
                          >
                            ¿Qué problemas pueden estar ocultos en mis datos?
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfa_100%)] shadow-[0_34px_100px_rgba(15,23,42,0.10)]"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-full bg-accent/[0.10] blur-3xl" />
                  </div>

                  <div className="relative grid h-full gap-6 p-5 lg:grid-cols-[0.45fr_0.55fr] lg:gap-7 lg:p-7">
                    <div className="relative overflow-hidden rounded-[2rem] bg-[#12192D] p-6 text-white lg:p-7">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.30),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_28%)]" />

                      <div className="relative flex h-full flex-col justify-between">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                            <Mail className="h-3.5 w-3.5 text-cyan-300" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                              Completar datos
                            </span>
                          </div>
                          <h3 className="mt-6 max-w-xs text-[2rem] font-semibold leading-[1.02] tracking-tight">
                            Te lo enviamos a tu email
                          </h3>
                          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                            Dejás tus datos una sola vez y te llevás el recurso para revisarlo con calma, sin reunión y sin vueltas.
                          </p>
                        </div>

                        <div className="rounded-[1.7rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/52">
                            Después del envío
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-white/82">
                            Te llevamos a una página con demo, diagnóstico y acceso rápido al recurso solicitado.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col rounded-[2rem] border border-border/50 bg-white/90 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm lg:p-7">
                      <div className="mb-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/72">
                          Formulario breve
                        </p>
                        <h4 className="mt-3 text-[1.95rem] font-semibold leading-[1.05] tracking-tight text-foreground">
                          Recibí el archivo ahora
                        </h4>
                        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                          Completá nombre, email y empresa. En el siguiente paso te confirmamos el envío y te dejamos tres caminos para seguir avanzando.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="grid gap-4">
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-foreground">Nombre</span>
                          <input
                            type="text"
                            required
                            value={form.nombre}
                            onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
                            className="rounded-[1.4rem] border border-border bg-[#FAFAF8] px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
                            placeholder="Alan"
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-foreground">Email</span>
                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                            className="rounded-[1.4rem] border border-border bg-[#FAFAF8] px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
                            placeholder="nombre@empresa.com"
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-foreground">Empresa</span>
                          <input
                            type="text"
                            value={form.empresa}
                            onChange={(event) => setForm((current) => ({ ...current, empresa: event.target.value }))}
                            className="rounded-[1.4rem] border border-border bg-[#FAFAF8] px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
                            placeholder="Opcional"
                          />
                        </label>

                        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                          <button
                            type="submit"
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
                          >
                            Solicitar archivo
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedResourceId(null)}
                            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/68 transition-colors hover:text-accent"
                          >
                            Volver al recurso
                            <ArrowRight className="h-4 w-4 rotate-180" />
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
