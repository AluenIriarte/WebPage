import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Copy, Mail, ShieldCheck } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  CONTACT_EMAIL,
  PRODUCT_OPTIONS,
  buildQuoteEmailBody,
  type QuoteBriefFields,
} from "../lib/contact";
import { trackFormSubmit, trackQuoteClick } from "../lib/analytics";
import { submitQuoteRequest } from "../lib/forms-api";

const fieldConfig: {
  id: keyof QuoteBriefFields;
  label: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  { id: "nombre", label: "Nombre", placeholder: "Tu nombre" },
  { id: "email", label: "Email", placeholder: "nombre@empresa.com" },
  { id: "producto", label: "Producto / servicio", placeholder: "Selecciona una opcion" },
  { id: "empresa", label: "Empresa", placeholder: "Nombre de tu empresa" },
  { id: "rol", label: "Rol", placeholder: "Tu rol o area" },
  {
    id: "objetivo",
    label: "Que necesitas ver",
    placeholder: "Que tipo de solucion, tablero o activo queres tener",
    multiline: true,
  },
  {
    id: "fuentes",
    label: "Fuentes o herramientas actuales",
    placeholder: "Excel, CRM, ERP, SQL, Power BI, etc.",
  },
  {
    id: "destinatarios",
    label: "Quienes lo van a usar",
    placeholder: "Direccion, gerencia comercial, vendedores, etc.",
  },
  {
    id: "plazo",
    label: "Plazo estimado",
    placeholder: "Este mes, proximo trimestre, sin fecha cerrada...",
  },
  {
    id: "desafio",
    label: "Contexto o desafio principal",
    placeholder: "Que duele hoy o que queres resolver primero",
    multiline: true,
  },
];

const projectTypes = [
  "Dashboard de ventas a medida para direccion o gerencia comercial",
  "Tablero comercial operativo con pipeline, cartera y seguimiento por vendedor",
  "Landing o pagina para ordenar oferta, conversion y contacto",
  "Activos de marca, publishing o delivery kit para comunicar mejor",
];

const priceDrivers = [
  "Cantidad de fuentes de datos y nivel de consolidacion requerido",
  "Limpieza, modelado o criterios de negocio que haya que ordenar",
  "Cantidad de vistas, entregables, activos o piezas necesarias",
  "Integraciones, automatizaciones o entregables adicionales",
];

const emptyFields: QuoteBriefFields = {
  nombre: "",
  email: "",
  producto: "Dashboard de ventas / BI comercial a medida",
  empresa: "",
  rol: "",
  objetivo: "",
  fuentes: "",
  destinatarios: "",
  plazo: "",
  desafio: "",
};

export function PresupuestoDashboard() {
  const [searchParams] = useSearchParams();
  const [fields, setFields] = useState<QuoteBriefFields>(emptyFields);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const product = searchParams.get("producto");
    if (!product) {
      return;
    }

    setFields((previous) => ({ ...previous, producto: product }));
  }, [searchParams]);

  const emailBody = buildQuoteEmailBody(fields);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      await submitQuoteRequest(fields);
      trackFormSubmit("quote_request", fields.producto);
      trackQuoteClick("quote_page_form", fields.producto);
      setSubmitSuccess(
        "Solicitud enviada. Te confirmamos por email y revisamos el caso dentro de las proximas 24 horas.",
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No pudimos enviar la solicitud. Proba de nuevo en unos segundos.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(emailBody);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

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
                    Pedi cotizacion para tu servicio o producto digital
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    Si ya tenes relativamente claro lo que necesitas, este es el camino mas directo:
                    completas el brief y te respondemos por email con una primera lectura de alcance.
                  </p>
                  <p className="max-w-3xl text-base leading-relaxed text-foreground/70">
                    Si todavia estas explorando que conviene construir o por donde empezar, te conviene pasar primero por servicios o diagnostico.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {projectTypes.map((item) => (
                    <div key={item} className="rounded-2xl border border-border/50 bg-white p-5">
                      <p className="text-sm leading-relaxed text-foreground/78">{item}</p>
                    </div>
                  ))}
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
                    <p className="text-sm font-semibold text-foreground">Brief rapido para cotizar</p>
                    <p className="text-xs text-muted-foreground">
                      Cuanto mas claro el contexto, mas util y precisa puede ser la respuesta.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    {fieldConfig.slice(0, 2).map((field) => (
                      <label key={field.id} className="space-y-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/55">
                          {field.label}
                        </span>
                        <input
                          type={field.id === "email" ? "email" : "text"}
                          required
                          value={fields[field.id]}
                          onChange={(event) =>
                            setFields((previous) => ({
                              ...previous,
                              [field.id]: event.target.value,
                            }))
                          }
                          placeholder={field.placeholder}
                          className="w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-accent/35"
                        />
                      </label>
                    ))}
                  </div>

                  {fieldConfig.slice(2).map((field) => (
                    <label key={field.id} className="space-y-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/55">
                        {field.label}
                      </span>
                      {field.id === "producto" ? (
                        <select
                          value={fields.producto}
                          onChange={(event) =>
                            setFields((previous) => ({ ...previous, producto: event.target.value }))
                          }
                          className="w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent/35"
                        >
                          {PRODUCT_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : field.multiline ? (
                        <textarea
                          value={fields[field.id]}
                          onChange={(event) =>
                            setFields((previous) => ({
                              ...previous,
                              [field.id]: event.target.value,
                            }))
                          }
                          rows={4}
                          placeholder={field.placeholder}
                          className="min-h-[104px] w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-accent/35"
                        />
                      ) : (
                        <input
                          value={fields[field.id]}
                          onChange={(event) =>
                            setFields((previous) => ({
                              ...previous,
                              [field.id]: event.target.value,
                            }))
                          }
                          placeholder={field.placeholder}
                          className="w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-accent/35"
                        />
                      )}
                    </label>
                  ))}

                  {submitSuccess ? (
                    <p className="rounded-[1rem] border border-[#CBE9D7] bg-[#F2FFF7] px-4 py-3 text-sm text-[#1F6B3C]">
                      {submitSuccess}
                    </p>
                  ) : null}

                  {submitError ? (
                    <p className="rounded-[1rem] border border-[#F1C5C5] bg-[#FFF6F6] px-4 py-3 text-sm text-[#9B2C2C]">
                      {submitError}
                    </p>
                  ) : null}

                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? "Enviando..." : "Enviar solicitud"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                    >
                      <Copy className="h-4 w-4" />
                      {copied ? "Brief copiado" : "Copiar brief"}
                    </button>
                  </div>
                </form>

                <div className="mt-6 rounded-2xl border border-accent/15 bg-accent/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <p className="text-sm font-semibold text-foreground">Como funciona</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Enviamos confirmacion al email cargado y tambien una notificacion interna. Si algo falla, siempre podes copiar el brief y enviarlo manualmente a{" "}
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
                  Que mueve el precio
                </p>
                <h2 className="mb-6 text-3xl font-semibold tracking-tight text-foreground">
                  No cotizo por pantalla. Cotizo por alcance real.
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
                  Que conviene tener claro para pedir presupuesto
                </h2>
                <div className="space-y-3 text-sm leading-relaxed text-foreground/75">
                  <p>Que decision o resultado queres habilitar con el proyecto.</p>
                  <p>Que fuentes, procesos o materiales existen hoy y cuanto estan ordenados.</p>
                  <p>Quienes lo van a mirar, usar o ejecutar.</p>
                  <p>Si necesitas algo puntual o una solucion mas amplia.</p>
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
