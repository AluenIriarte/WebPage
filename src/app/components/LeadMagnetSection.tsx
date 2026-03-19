import { FormEvent, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AUTO_DIAGNOSTIC_THANKYOU_HREF } from "../lib/contact";
import { trackFormSubmit } from "../lib/analytics";
import { freeResources } from "../lib/free-resources";

const initialForm = {
  nombre: "",
  email: "",
  empresa: "",
};

function ResourceCover({
  title,
  type,
  coverSrc,
}: {
  title: string;
  type: string;
  coverSrc: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[240px] overflow-hidden rounded-[1.75rem] border border-[#D9DCE8] bg-white shadow-[0_26px_65px_rgba(15,23,42,0.20)]">
      <img src={coverSrc} alt={title} className="h-auto w-full object-cover" />

      <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center rounded-full bg-[#12192D]/88 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur-sm">
        {type}
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
        <div className="absolute left-1/2 top-8 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-3xl" />
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
          transition={{ duration: 0.56, delay: 0.08 }}
          className="mx-auto mt-14 max-w-5xl"
        >
          {freeResources.map((resource) => {
            const isSelected = selectedResourceId === resource.id;

            return (
              <div key={resource.id} className="mx-auto max-w-2xl">
                <motion.div
                  layout
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    layout
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={isSelected ? "scale-[0.96]" : ""}
                  >
                    <ResourceCover title={resource.title} type={resource.type} coverSrc={resource.coverSrc} />
                  </motion.div>

                  {!isSelected ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="mt-6"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedResourceId(resource.id)}
                        className="group inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-accent px-8 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
                      >
                        Solicitar recurso
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </motion.div>
                  ) : null}

                  {isSelected ? (
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                      className="mt-8 w-full rounded-[2rem] border border-border/55 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] lg:p-7"
                    >
                      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/12 bg-accent/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/80">
                        <Mail className="h-3.5 w-3.5" />
                        Completar datos
                      </div>

                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                        Completá tus datos y te enviamos el recurso para que lo revises con calma.
                      </p>

                      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                        <div className="grid gap-4 lg:grid-cols-2">
                          <label className="grid gap-2">
                            <span className="text-sm font-medium text-foreground">Nombre</span>
                            <input
                              type="text"
                              required
                              value={form.nombre}
                              onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
                              className="rounded-[1.15rem] border border-border bg-[#FAFAF8] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
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
                              className="rounded-[1.15rem] border border-border bg-[#FAFAF8] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
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
                            className="rounded-[1.15rem] border border-border bg-[#FAFAF8] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
                            placeholder="Opcional"
                          />
                        </label>

                        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                          <button
                            type="submit"
                            className="group inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-accent px-8 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
                          >
                            Recibir guía por email
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
                    </motion.div>
                  ) : null}
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
