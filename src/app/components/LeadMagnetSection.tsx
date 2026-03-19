import { FormEvent, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AUTO_DIAGNOSTIC_THANKYOU_HREF,
  DIAGNOSTIC_SECTION_HREF,
} from "../lib/contact";
import { trackFormSubmit } from "../lib/analytics";
import { freeResources } from "../lib/free-resources";

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
    <section id="recurso" className="bg-[#F8F8F6] py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-3xl font-semibold leading-[1.04] tracking-tight text-foreground md:text-4xl lg:text-[3.25rem]">
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
          className="mt-12 flex justify-center"
        >
          {freeResources.map((resource) => {
            const isSelected = resource.id === selectedResourceId;

            return (
              <div key={resource.id} className="w-full max-w-xl" style={{ perspective: "1200px" }}>
                <motion.div
                  animate={{ rotateY: isSelected ? 180 : 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="relative min-h-[420px]"
                >
                  <div
                    className="absolute inset-0 rounded-[2rem] border border-border/60 bg-white p-6 shadow-2xl shadow-black/[0.05] lg:p-7"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-accent/10">
                      <FileText className="h-6 w-6 text-accent" />
                    </div>

                    <div className="mt-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/70">
                        {resource.type}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                        {resource.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {resource.description}
                      </p>
                    </div>

                    <div className="mt-8 rounded-[1.6rem] bg-[#0F172A] p-6 text-white">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300/80">
                        Qué incluye
                      </p>
                      <p className="mt-3 text-lg font-semibold leading-snug">
                        Un checklist ejecutivo para detectar clientes en riesgo, margen erosionado y focos comerciales invisibles.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedResourceId(resource.id)}
                      className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                    >
                      Solicitar archivo
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div
                    className="absolute inset-0 rounded-[2rem] border border-accent/20 bg-white p-6 shadow-2xl shadow-black/[0.05] lg:p-7"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <div className="mb-6 flex flex-col gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/70">
                        {resource.type}
                      </p>
                      <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                        {resource.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Completá tus datos y te lo enviamos por email.
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

                      <button
                        type="button"
                        onClick={() => setSelectedResourceId(null)}
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                      >
                        Volver al recurso
                      </button>
                    </form>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        <div className="mt-10 text-center">
          <a
            href={DIAGNOSTIC_SECTION_HREF.replace("contacto", "problema")}
            className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            ¿Qué problemas pueden estar ocultos en mis datos?
          </a>
        </div>
      </div>
    </section>
  );
}
