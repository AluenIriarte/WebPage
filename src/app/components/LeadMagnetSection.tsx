import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackFormSubmit } from "../lib/analytics";
import { AUTO_DIAGNOSTIC_THANKYOU_HREF } from "../lib/contact";
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
    <div className="relative mx-auto w-full max-w-[198px] overflow-hidden rounded-none border border-[#D9DCE8] bg-white shadow-[0_28px_60px_rgba(15,23,42,0.16)]">
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
              <div key={resource.id} className="mx-auto max-w-4xl">
                <div className="mx-auto [perspective:1600px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {!isSelected ? (
                      <motion.div
                        key={`${resource.id}-front`}
                        initial={{ opacity: 0, rotateY: 8, y: 18 }}
                        animate={{ opacity: 1, rotateY: 0, y: 0 }}
                        exit={{ opacity: 0, rotateY: -8, y: -12 }}
                        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-[2rem] border border-border/60 bg-white px-6 py-7 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:px-7 lg:px-8 lg:py-8"
                      >
                        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,210px)_minmax(0,1fr)] lg:items-center lg:gap-10">
                          <div className="flex justify-center lg:justify-start">
                            <div className="translate-y-1 lg:-translate-y-3">
                              <ResourceCover title={resource.title} type={resource.type} coverSrc={resource.coverSrc} />
                            </div>
                          </div>

                          <div className="flex flex-col items-start">
                            <div className="inline-flex items-center gap-2 rounded-full border border-accent/12 bg-accent/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/80">
                              <Mail className="h-3.5 w-3.5" />
                              Se envía por email
                            </div>

                            <p className="mt-4 max-w-2xl text-lg font-medium leading-snug text-foreground sm:text-[1.45rem]">
                              Una guía breve para detectar señales comerciales que hoy podrían estar ocultas en tus datos.
                            </p>

                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[0.98rem]">
                              Un primer filtro ejecutivo para entender si el problema está en clientes, mix, margen o foco comercial antes de pedir un tablero.
                            </p>

                            <ul className="mt-5 grid gap-3 text-sm text-foreground/82 sm:grid-cols-2 sm:text-[0.95rem]">
                              <li className="flex items-start gap-3">
                                <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                                Clientes perdidos o inactivos
                              </li>
                              <li className="flex items-start gap-3">
                                <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                                Mix de productos desaprovechado
                              </li>
                              <li className="flex items-start gap-3 sm:col-span-2">
                                <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                                Foco comercial mal distribuido
                              </li>
                            </ul>

                            <button
                              type="button"
                              onClick={() => setSelectedResourceId(resource.id)}
                              className="group mt-7 inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/92 hover:shadow-[0_20px_35px_rgba(122,92,255,0.28)] sm:h-[52px] sm:px-8"
                            >
                              Solicitar recurso
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`${resource.id}-back`}
                        initial={{ opacity: 0, rotateY: 8, y: 18 }}
                        animate={{ opacity: 1, rotateY: 0, y: 0 }}
                        exit={{ opacity: 0, rotateY: -8, y: -12 }}
                        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-[2rem] border border-border/60 bg-white px-6 py-7 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:px-7 lg:px-8 lg:py-8"
                      >
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/12 bg-accent/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/80">
                          <Mail className="h-3.5 w-3.5" />
                          Completar datos
                        </div>

                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.98rem]">
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
                              className="group inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/92 hover:shadow-[0_20px_35px_rgba(122,92,255,0.28)] sm:h-[52px] sm:px-8"
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
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
