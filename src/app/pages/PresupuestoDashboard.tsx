import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Copy, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  CONTACT_EMAIL,
  ROOT_DIAGNOSTIC_SECTION_HREF,
  SERVICES_PAGE_HREF,
  buildQuoteEmailBody,
  buildQuoteEmailHref,
  type QuoteBriefFields,
} from "../lib/contact";

const fieldConfig: { id: keyof QuoteBriefFields; label: string; placeholder: string; multiline?: boolean }[] = [
  { id: "empresa", label: "Empresa", placeholder: "Nombre de tu empresa" },
  { id: "rol", label: "Rol", placeholder: "Tu rol o área" },
  { id: "objetivo", label: "Qué necesitás ver", placeholder: "Qué tipo de tablero o lectura querés tener", multiline: true },
  { id: "fuentes", label: "Fuentes o herramientas actuales", placeholder: "Excel, CRM, ERP, SQL, Power BI, etc." },
  { id: "destinatarios", label: "Quiénes lo van a usar", placeholder: "Dirección, gerencia comercial, vendedores, etc." },
  { id: "plazo", label: "Plazo estimado", placeholder: "Este mes, próximo trimestre, sin fecha cerrada..." },
  { id: "desafio", label: "Contexto o desafío principal", placeholder: "Qué duele hoy o qué querés resolver primero", multiline: true },
];

const projectTypes = [
  "Dashboard de ventas a medida para dirección o gerencia comercial",
  "Tablero comercial operativo con pipeline, cartera y seguimiento por vendedor",
  "Dashboard conectado a datos reales desde Excel, CRM, ERP o BI existente",
  "Sistema de reporting automatizado para revisiones semanales o mensuales",
];

const priceDrivers = [
  "Cantidad de fuentes de datos y nivel de consolidación requerido",
  "Limpieza, modelado o criterios de negocio que haya que ordenar",
  "Cantidad de vistas, filtros, usuarios y necesidades de actualización",
  "Automatizaciones, alertas o integraciones adicionales",
];

const emptyFields: QuoteBriefFields = {
  empresa: "",
  rol: "",
  objetivo: "",
  fuentes: "",
  destinatarios: "",
  plazo: "",
  desafio: "",
};

export function PresupuestoDashboard() {
  const [fields, setFields] = useState<QuoteBriefFields>(emptyFields);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const emailHref = useMemo(() => buildQuoteEmailHref(fields), [fields]);
  const emailBody = useMemo(() => buildQuoteEmailBody(fields), [fields]);

  const handleOpenMail = () => {
    window.location.href = emailHref;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(emailBody);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden pb-20 pt-36 lg:pb-24 lg:pt-44">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-0 right-0 top-0 h-[520px] bg-gradient-to-b from-accent/[0.04] via-transparent to-transparent" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.02fr] lg:items-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-7"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                  <Mail className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-semibold tracking-wide text-accent">
                    Presupuesto y alcance
                  </span>
                </div>

                <div className="space-y-5">
                  <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-[3.2rem]">
                    Pedí cotización para tu dashboard de ventas a medida
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    Si ya tenés relativamente claro lo que necesitás, este es el camino más directo:
                    completás el brief y te abre un email estructurado para no arrancar desde cero.
                  </p>
                  <p className="max-w-3xl text-base leading-relaxed text-foreground/70">
                    Si todavía estás explorando qué conviene construir, qué fuentes usar o por dónde
                    empezar, te conviene más pasar primero por servicios o diagnóstico.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {projectTypes.map((item) => (
                    <div key={item} className="rounded-2xl border border-border/50 bg-white p-5">
                      <p className="text-sm leading-relaxed text-foreground/78">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl bg-foreground p-7 text-background">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                    Si todavía estás comparando
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    Primero podés ordenar el panorama y volver con mejor criterio.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    Servicios y diagnóstico te ayudan cuando todavía no tenés claro alcance, fuentes
                    o tipo de tablero.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to={SERVICES_PAGE_HREF}
                      className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-white"
                    >
                      Ver servicios
                    </Link>
                    <a
                      href={ROOT_DIAGNOSTIC_SECTION_HREF}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
                    >
                      Prefiero diagnóstico
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-border/50 bg-white p-8 shadow-2xl shadow-black/[0.05] lg:p-10"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                    <Mail className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Brief rápido para cotizar</p>
                    <p className="text-xs text-muted-foreground">
                      Cuanto más claro el contexto, más útil y precisa puede ser la respuesta.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {fieldConfig.map((field) => (
                    <label key={field.id} className="space-y-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/55">
                        {field.label}
                      </span>
                      {field.multiline ? (
                        <textarea
                          value={fields[field.id]}
                          onChange={(event) =>
                            setFields((previous) => ({ ...previous, [field.id]: event.target.value }))
                          }
                          rows={4}
                          placeholder={field.placeholder}
                          className="min-h-[104px] w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-accent/35"
                        />
                      ) : (
                        <input
                          value={fields[field.id]}
                          onChange={(event) =>
                            setFields((previous) => ({ ...previous, [field.id]: event.target.value }))
                          }
                          placeholder={field.placeholder}
                          className="w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-accent/35"
                        />
                      )}
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleOpenMail}
                    className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                  >
                    Abrir email prearmado
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Brief copiado" : "Copiar brief"}
                  </button>
                </div>

                <div className="mt-6 rounded-2xl border border-accent/15 bg-accent/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <p className="text-sm font-semibold text-foreground">Cómo usarlo</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    El botón abre tu cliente de correo con el brief ya armado. Si no se abre o
                    preferís mandarlo manualmente, copiá el texto y envialo a{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="font-medium text-foreground underline underline-offset-2"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="pb-20 lg:pb-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-border/50 bg-white p-8 lg:p-10"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/50">
                  Qué mueve el precio
                </p>
                <h2 className="mb-6 text-3xl font-semibold tracking-tight text-foreground">
                  No cotizo por “pantalla”. Cotizo por alcance real.
                </h2>
                <div className="space-y-3">
                  {priceDrivers.map((item) => (
                    <div key={item} className="flex gap-3">
                      <div className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/50" />
                      <p className="text-sm leading-relaxed text-foreground/75">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="rounded-3xl border border-border/50 bg-white p-8 lg:p-10"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/50">
                  Antes de escribir
                </p>
                <h2 className="mb-6 text-3xl font-semibold tracking-tight text-foreground">
                  Qué conviene tener claro para pedir presupuesto
                </h2>
                <div className="space-y-3 text-sm leading-relaxed text-foreground/75">
                  <p>Qué decisión querés habilitar con el dashboard.</p>
                  <p>Qué fuentes o herramientas existen hoy y cuánto están ordenadas.</p>
                  <p>Quiénes lo van a mirar y con qué frecuencia.</p>
                  <p>Si necesitás algo puntual o una capa de visibilidad más amplia.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
