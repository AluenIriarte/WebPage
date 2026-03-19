import { FormEvent, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AUTO_DIAGNOSTIC_THANKYOU_HREF } from "../lib/contact";
import { trackFormSubmit } from "../lib/analytics";
import { freeResources } from "../lib/free-resources";

const initialForm = {
  nombre: "",
  email: "",
  empresa: "",
};

function ResourceCover({ title, type }: { title: string; type: string }) {
  return (
    <div className="relative overflow-hidden rounded-[1.9rem] bg-[#12192D] p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.34),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_28%)]" />
      <div className="absolute right-4 top-4 h-12 w-12 rounded-full border border-white/10" />
      <div className="relative flex min-h-[220px] flex-col justify-between">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
          <FileText className="h-3.5 w-3.5 text-cyan-300" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/72">
            {type}
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300/78">
            Recurso
          </p>
          <h3 className="mt-3 text-[1.85rem] font-semibold leading-[1.02] tracking-tight">{title}</h3>
        </div>
      </div>
    </div>
  );
}

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
    <section id="recurso" className="relative overflow-hidden bg-[#F8F8F6] py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-8 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-3xl font-semibold leading-[0.98] tracking-tight text-foreground md:text-4xl lg:text-[3rem]">
            Recurso <span className="text-accent">GRATUITO</span> para convertir datos en decisiones comerciales.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Herramientas prácticas para detectar oportunidades ocultas en tus ventas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.62, delay: 0.08 }}
          className="mx-auto mt-12 max-w-5xl"
          style={{ perspective: "1400px" }}
        >
          {freeResources.map((resource) => {
            const isSelected = selectedResourceId === resource.id;

            return (
              <motion.div
                key={resource.id}
                animate={{ rotateY: isSelected ? 180 : 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative min-h-[520px] sm:min-h-[420px]"
              >
                <div
                  className="absolute inset-0 overflow-hidden rounded-[2.4rem] border border-white/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="relative h-full px-5 pb-6 pt-[18.5rem] sm:px-6 sm:pb-7 sm:pt-7 lg:px-8 lg:py-8">
                    <div className="absolute left-5 right-5 top-5 sm:left-6 sm:right-auto sm:w-[248px] lg:left-8">
                      <ResourceCover title={resource.title} type={resource.type} />
                    </div>

                    <div className="h-full rounded-[1.9rem] border border-border/50 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfa_100%)] p-6 sm:pl-[18.5rem] lg:pl-[19.5rem]">
                      <div className="flex h-full flex-col justify-between gap-6">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-accent/12 bg-accent/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/80">
                            <Mail className="h-3.5 w-3.5" />
                            Se envía por email
                          </div>

                          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                            Una autoevaluación breve para revisar por tu cuenta si hoy hay señales comerciales que no estás viendo con claridad.
                          </p>
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={() => setSelectedResourceId(resource.id)}
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
                          >
                            Solicitar archivo
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute inset-0 overflow-hidden rounded-[2.4rem] border border-white/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="relative h-full px-5 pb-6 pt-[18.5rem] sm:px-6 sm:pb-7 sm:pt-7 lg:px-8 lg:py-8">
                    <div className="absolute left-5 right-5 top-5 sm:left-6 sm:right-auto sm:w-[248px] lg:left-8">
                      <ResourceCover title={resource.title} type={resource.type} />
                    </div>

                    <div className="h-full rounded-[1.9rem] border border-border/50 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfa_100%)] p-6 sm:pl-[18.5rem] lg:pl-[19.5rem]">
                      <div className="flex h-full flex-col justify-between gap-5">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-accent/12 bg-accent/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/80">
                            <Mail className="h-3.5 w-3.5" />
                            Completar datos
                          </div>

                          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                            Dejá nombre, email y empresa para recibir el recurso.
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid gap-3">
                          <div className="grid gap-3 lg:grid-cols-2">
                            <label className="grid gap-2">
                              <span className="text-sm font-medium text-foreground">Nombre</span>
                              <input
                                type="text"
                                required
                                value={form.nombre}
                                onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
                                className="rounded-[1.2rem] border border-border bg-[#FAFAF8] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
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
                                className="rounded-[1.2rem] border border-border bg-[#FAFAF8] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
                                placeholder="nombre@empresa.com"
                              />
                            </label>
                          </div>

                          <label className="grid gap-2">
                            <span className="text-sm font-medium text-foreground">Empresa</span>
                            <input
                              type="text"
                              value={form.empresa}
                              onChange={(event) => setForm((current) => ({ ...current, empresa: event.target.value }))}
                              className="rounded-[1.2rem] border border-border bg-[#FAFAF8] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
                              placeholder="Opcional"
                            />
                          </label>

                          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <button
                              type="submit"
                              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
                            >
                              Solicitar archivo
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedResourceId(null)}
                              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/68 transition-colors hover:text-accent"
                            >
                              Volver
                              <ArrowRight className="h-4 w-4 rotate-180" />
                            </button>
                          </div>
                        </form>
                      </div>
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
