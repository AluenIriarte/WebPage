import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Copy, Mail, ShieldCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  CONTACT_EMAIL,
  PRODUCT_OPTIONS,
  QUOTE_THANKYOU_HREF,
  ROOT_DIAGNOSTIC_SECTION_HREF,
  buildQuoteEmailBody,
  type QuoteBriefFields,
} from "../lib/contact";
import { trackDiagnosisClick, trackFormSubmit, trackQuoteClick } from "../lib/analytics";
import { submitQuoteRequest } from "../lib/forms-api";

const fieldConfig: {
  id: keyof QuoteBriefFields;
  label: string;
  placeholder: string;
  required?: boolean;
  multiline?: boolean;
}[] = [
  { id: "nombre", label: "Nombre", placeholder: "Tu nombre", required: true },
  { id: "email", label: "Email", placeholder: "nombre@empresa.com", required: true },
  {
    id: "producto",
    label: "Producto / servicio",
    placeholder: "Selecciona una opcion",
    required: true,
  },
  { id: "empresa", label: "Empresa", placeholder: "Nombre de tu empresa", required: true },
  { id: "rol", label: "Rol", placeholder: "Tu rol o area" },
  {
    id: "objetivo",
    label: "Que necesitas ver",
    placeholder: "Que tipo de solucion, tablero o activo queres tener",
    required: true,
    multiline: true,
  },
  {
    id: "fuentes",
    label: "Fuentes o herramientas actuales",
    placeholder: "Excel, CRM, ERP, SQL, Power BI, etc.",
    required: true,
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
  const navigate = useNavigate();
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
      const requestState = {
        nombre: fields.nombre,
        email: fields.email,
        empresa: fields.empresa,
        producto: fields.producto,
      };
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("quote_request", JSON.stringify(requestState));
      }
      setSubmitSuccess("Solicitud enviada. Redirigiendo...");
      window.setTimeout(() => {
        navigate(QUOTE_THANKYOU_HREF, { state: requestState });
      }, 700);
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
      {submitSuccess ? (
        <div className="fixed inset-x-0 top-24 z-50 flex justify-center px-6">
          <div className="rounded-full border border-[#CBE9D7] bg-[#F2FFF7] px-5 py-3 text-sm font-medium text-[#1F6B3C] shadow-lg shadow-black/[0.05]">
            {submitSuccess}
          </div>
        </div>
      ) : null}

      {submitError ? (
        <div className="fixed inset-x-0 top-24 z-50 flex justify-center px-6">
          <div className="rounded-full border border-[#F1C5C5] bg-[#FFF6F6] px-5 py-3 text-sm font-medium text-[#9B2C2C] shadow-lg shadow-black/[0.05]">
            {submitError}
          </div>
        </div>
      ) : null}

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
                    Pedi una primera estimacion de alcance
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    Este paso es para casos con necesidad bastante definida. Completas el brief,
                    reviso el contexto y te respondo por email con una primera lectura comercial y
                    de alcance.
                  </p>
                  <p className="max-w-3xl text-base leading-relaxed text-foreground/70">
                    Si todavia estas ordenando el problema o no tenes claro que conviene construir,
                    el camino correcto es pasar primero por diagnostico.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] border border-border/55 bg-white/85 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                      Todavia lo estoy definiendo
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Si necesitas bajar el problema, ordenar prioridades o definir alcance, conviene
                      arrancar por una conversacion corta.
                    </p>
                    <a
                      href={ROOT_DIAGNOSTIC_SECTION_HREF}
                      onClick={() => trackDiagnosisClick("quote_page_intro")}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
                    >
                      Agendar diagnostico
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="rounded-[1.75rem] border border-accent/20 bg-accent/[0.04] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                      Ya tengo claro lo que necesito
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Entonces este brief es el camino directo: servicio, contexto, fuentes y
                      usuarios para poder responderte con criterio.
                    </p>
                    <a
                      href="#brief-cotizacion"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
                    >
                      Completar brief
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-border/55 bg-white/75 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                    Que pasa despues
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Confirmacion inmediata</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        Te confirmo por email que el brief entro correctamente.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Revision en 24 horas</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        Revisamos el caso y respondemos con una primera lectura de alcance.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Si falta definicion</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        El siguiente paso natural es llevarlo a diagnostico.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                id="brief-cotizacion"
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
                    <p className="text-sm font-semibold text-foreground">
                      Brief para pedir una primera estimacion
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Los campos clave son servicio, empresa, objetivo y fuentes. El resto suma
                      contexto, pero no bloquea el envio.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    {fieldConfig.slice(0, 2).map((field) => (
                      <label key={field.id} className="space-y-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/55">
                          {field.label}
                          <span className="ml-2 normal-case tracking-normal text-muted-foreground/45">
                            {field.required ? "Requerido" : "Opcional"}
                          </span>
                        </span>
                        <input
                          type={field.id === "email" ? "email" : "text"}
                          required={field.required}
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
                        <span className="ml-2 normal-case tracking-normal text-muted-foreground/45">
                          {field.required ? "Requerido" : "Opcional"}
                        </span>
                      </span>
                      {field.id === "producto" ? (
                        <select
                          required={field.required}
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
                          required={field.required}
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
                          required={field.required}
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
                    <p className="text-sm font-semibold text-foreground">Respaldo y salida manual</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Enviamos confirmacion al email cargado y tambien una notificacion interna. Si
                    algo falla, siempre podes copiar el brief y enviarlo manualmente a{" "}
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

      </main>
      <Footer />
    </div>
  );
}
