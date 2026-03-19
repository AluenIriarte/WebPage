import { FormEvent, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AUTO_DIAGNOSTIC_THANKYOU_HREF,
  ROOT_DIAGNOSTIC_SECTION_HREF,
} from "../lib/contact";
import { trackFormSubmit } from "../lib/analytics";

const previewBlocks = [
  {
    label: "Cartera y riesgo",
    note: "Detectá si hoy hay cuentas que se están enfriando antes de que eso aparezca en facturación.",
  },
  {
    label: "Margen y mix",
    note: "Entendé dónde se erosiona rentabilidad aunque el volumen todavía siga sosteniéndose.",
  },
  {
    label: "Foco comercial",
    note: "Identificá si hoy el problema es falta de señales, exceso de reportes o mala priorización.",
  },
];

const highlights = [
  "Te ayuda a entender qué te falta ver antes de pedir un dashboard",
  "Ordena si el problema hoy es cartera, margen, mix o foco comercial",
  "Te deja mejor parado para avanzar a demo, caso aplicado o diagnóstico",
];

const initialForm = {
  nombre: "",
  email: "",
  empresa: "",
  desafio: "",
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
                    Autoevaluación ejecutiva
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                  Una guía corta para detectar si hoy te faltan señales críticas para decidir mejor.
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  Resuelve el problema previo al dashboard: entender qué no estás viendo hoy en
                  cartera, margen, mix y foco comercial.
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
                    Claridad inicial para saber si hoy necesitás foco, lectura o un sistema de visibilidad real.
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
                Si todavía no querés hablar, empezá por una{" "}
                <span className="text-accent">autoevaluación ejecutiva</span>
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Dejame tus datos y te llevo al siguiente paso con una guía breve para entender si hoy
                tu operación comercial está trabajando con visibilidad incompleta.
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

            <form onSubmit={handleSubmit} className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-xl shadow-black/[0.04]">
              <div className="grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">Nombre</span>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
                    className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
                    placeholder="Tu nombre"
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

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">Qué te preocupa hoy</span>
                  <textarea
                    rows={3}
                    value={form.desafio}
                    onChange={(event) => setForm((current) => ({ ...current, desafio: event.target.value }))}
                    className="resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/35"
                    placeholder="Clientes, margen, mix, foco comercial..."
                  />
                </label>

                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Quiero la autoevaluación
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>

            <a
              href={ROOT_DIAGNOSTIC_SECTION_HREF}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
            >
              Prefiero ir directo a diagnóstico
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
