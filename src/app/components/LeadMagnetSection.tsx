import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AUTO_DIAGNOSTIC_THANKYOU_HREF,
  ROOT_DIAGNOSTIC_SECTION_HREF,
} from "../lib/contact";
import { trackFormSubmit } from "../lib/analytics";

const resources = [
  {
    id: "autoevaluacion-ejecutiva",
    type: "PDF",
    title: "Autoevaluación ejecutiva",
    description: "Señales clave para detectar oportunidades ocultas en tus ventas.",
  },
] as const;

const initialForm = {
  nombre: "",
  email: "",
  empresa: "",
};

export function LeadMagnetSection() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement | null>(null);
  const [form, setForm] = useState(initialForm);
  const [selectedResourceId, setSelectedResourceId] = useState<(typeof resources)[number]["id"] | null>(null);

  const selectedResource = resources.find((resource) => resource.id === selectedResourceId) ?? null;

  useEffect(() => {
    if (!selectedResourceId || !formRef.current) {
      return;
    }

    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedResourceId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      ...form,
      recurso: selectedResource?.title ?? "",
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
    <section id="recurso" className="bg-[#F8F8F6] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
            <Mail className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold tracking-wide text-accent">
              Recurso gratuito
            </span>
          </div>

          <h2 className="mt-6 text-3xl font-semibold leading-[1.04] tracking-tight text-foreground md:text-4xl lg:text-[3.25rem]">
            Recurso <span className="text-accent">GRATUITO</span> para convertir datos en decisiones comerciales.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Herramientas prácticas para detectar oportunidades ocultas en tus ventas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {resources.map((resource) => {
            const isSelected = resource.id === selectedResourceId;

            return (
              <article
                key={resource.id}
                className={`rounded-[2rem] border bg-white p-6 shadow-xl shadow-black/[0.04] transition-colors ${
                  isSelected ? "border-accent/30" : "border-border/60"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-accent/10">
                  <FileText className="h-6 w-6 text-accent" />
                </div>

                <div className="mt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/70">
                    {resource.type}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                    {resource.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {resource.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedResourceId(resource.id)}
                  className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Solicitar archivo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </article>
            );
          })}
        </motion.div>

        <AnimatePresence initial={false}>
          {selectedResource && (
            <motion.div
              key={selectedResource.id}
              ref={formRef}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mx-auto mt-8 max-w-3xl rounded-[2rem] border border-border/60 bg-white p-6 shadow-2xl shadow-black/[0.05] lg:p-7"
            >
              <div className="mb-6 flex flex-col gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/70">
                  {selectedResource.type}
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                  {selectedResource.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Completá tus datos para enviarte el archivo por email.
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
                    className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
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
                    className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
                    placeholder="nombre@empresa.com"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">Empresa</span>
                  <input
                    type="text"
                    value={form.empresa}
                    onChange={(event) => setForm((current) => ({ ...current, empresa: event.target.value }))}
                    className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
                    placeholder="Opcional"
                  />
                </label>

                <button
                  type="submit"
                  className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Solicitar archivo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <a
            href={ROOT_DIAGNOSTIC_SECTION_HREF}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            Prefiero ir directo a diagnóstico
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
