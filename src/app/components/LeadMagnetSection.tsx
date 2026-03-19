import { FormEvent, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, FileText, Mail, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AUTO_DIAGNOSTIC_THANKYOU_HREF,
  ROOT_DIAGNOSTIC_SECTION_HREF,
} from "../lib/contact";
import { trackFormSubmit } from "../lib/analytics";

const resourceChapters = [
  {
    eyebrow: "Señal 01",
    title: "Clientes en riesgo",
    note: "Cómo detectar enfriamiento antes de que impacte fuerte en ventas.",
  },
  {
    eyebrow: "Señal 02",
    title: "Margen y mix",
    note: "Dónde se erosiona rentabilidad aunque el volumen todavía parezca sano.",
  },
  {
    eyebrow: "Señal 03",
    title: "Foco comercial",
    note: "Cómo saber si hoy te faltan señales, criterio o una capa de visibilidad real.",
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("leadmagnet_request", JSON.stringify(form));
    }

    trackFormSubmit("lead_magnet_request");
    navigate(AUTO_DIAGNOSTIC_THANKYOU_HREF, {
      state: form,
    });
  }

  return (
    <section id="recurso" className="bg-[#F8F8F6] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65 }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
              <Mail className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-semibold tracking-wide text-accent">
                Recurso gratuito
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-semibold leading-[1.04] tracking-tight text-foreground md:text-4xl lg:text-[3.1rem]">
                Recibí la <span className="text-accent">autoevaluación ejecutiva</span>
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Un recurso breve para entender si hoy te faltan señales críticas sobre cartera,
                margen, mix y foco comercial.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              Te lo envío por email.
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: 0.08 }}
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-2xl shadow-black/[0.05] lg:p-7"
          >
            <div className="grid gap-4">
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
                Quiero la autoevaluación
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.form>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="mt-10 overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-2xl shadow-black/[0.04]"
        >
          <div className="border-b border-border/40 px-6 py-5 lg:px-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/70">
                  Preview del recurso
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  Autoevaluación ejecutiva de visibilidad comercial
                </h3>
              </div>
              <a
                href={ROOT_DIAGNOSTIC_SECTION_HREF}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              >
                Prefiero ir directo a diagnóstico
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8 lg:py-8">
            <div className="rounded-[1.8rem] bg-[#0F172A] p-6 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FileText className="h-3.5 w-3.5 text-cyan-300" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                  PDF breve
                </span>
              </div>
              <h4 className="mt-5 text-3xl font-semibold leading-tight">
                Cómo saber si hoy te faltan señales críticas para decidir mejor
              </h4>
              <p className="mt-4 text-sm leading-relaxed text-white/68">
                Un recurso corto, claro y ejecutivo para entender si hoy estás viendo lo que importa
                o solo mirando reportes.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {resourceChapters.map((item) => (
                <div key={item.title} className="rounded-[1.6rem] border border-border/50 bg-[#F8F8F6] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/65">
                    {item.eyebrow}
                  </p>
                  <h4 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
