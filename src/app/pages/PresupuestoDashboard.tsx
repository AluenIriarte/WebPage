import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Copy, Mail, ShieldCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  CALENDLY_URL,
  CONTACT_EMAIL,
  PRODUCT_OPTIONS,
  QUOTE_THANKYOU_HREF,
  buildQuoteEmailBody,
  type QuoteBriefFields,
} from "../lib/contact";
import { trackCalendlyClick, trackDiagnosisClick, trackFormSubmit, trackQuoteClick } from "../lib/analytics";
import { submitQuoteRequest } from "../lib/forms-api";

type QuoteFieldConfig = {
  id: keyof QuoteBriefFields;
  label: string;
  placeholder: string;
  required?: boolean;
  multiline?: boolean;
};

const fieldConfig: QuoteFieldConfig[] = [
  { id: "nombre", label: "Nombre", placeholder: "Tu nombre", required: true },
  { id: "email", label: "Email", placeholder: "nombre@empresa.com", required: true },
  {
    id: "producto",
    label: "Producto / servicio",
    placeholder: "Seleccioná una opción",
    required: true,
  },
  { id: "empresa", label: "Empresa", placeholder: "Nombre de tu empresa", required: true },
  { id: "rol", label: "Rol", placeholder: "Tu rol o área" },
  {
    id: "objetivo",
    label: "Qué necesitás ver",
    placeholder: "Qué tipo de solución, tablero o activo querés tener",
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
    id: "destinatarios", label: "Quiénes lo van a usar", placeholder: "Dirección, gerencia comercial, vendedores, etc."
  },
  {
    id: "plazo",
    label: "Plazo estimado", placeholder: "Este mes, próximo trimestre, sin fecha cerrada...",
  },
  {
    id: "desafio",
    label: "Contexto o desafío principal",
    placeholder: "Qué duele hoy o qué querés resolver primero",
    multiline: true,
  },
];

const STEP_ONE_FIELD_IDS: Array<keyof QuoteBriefFields> = [
  "nombre",
  "email",
  "producto",
  "empresa",
  "objetivo",
  "fuentes",
];
const STEP_TWO_FIELD_IDS: Array<keyof QuoteBriefFields> = [
  "rol",
  "destinatarios",
  "plazo",
  "desafio",
];

function requiresSources(product: string) {
  return product.toLowerCase().includes("dashboard");
}

const fieldConfigById = fieldConfig.reduce(
  (accumulator, field) => ({ ...accumulator, [field.id]: field }),
  {} as Record<keyof QuoteBriefFields, QuoteFieldConfig>,
);

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
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const [fields, setFields] = useState<QuoteBriefFields>(emptyFields);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
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
  const stepOneFields = STEP_ONE_FIELD_IDS.map((fieldId) => fieldConfigById[fieldId]);
  const stepTwoFields = STEP_TWO_FIELD_IDS.map((fieldId) => fieldConfigById[fieldId]);

  function focusField(fieldId: keyof QuoteBriefFields) {
    if (typeof document === "undefined") {
      return;
    }

    const fieldElement = document.getElementById(`quote-${fieldId}`);
    if (fieldElement instanceof HTMLElement) {
      fieldElement.focus();
    }
  }

  function moveToStep(step: 1 | 2) {
    setCurrentStep(step);
    setStepError(null);
    window.requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleNextStep() {
    setSubmitError(null);
    setStepError(null);

    const missingField = stepOneFields.find(
      (field) => isFieldRequired(field.id) && !fields[field.id].trim(),
    );

    if (missingField) {
      const sourceText = requiresSources(fields.producto) ? " y fuentes" : "";
      setStepError(`Completá nombre, email, producto, empresa, qué necesitás ver${sourceText} para seguir.`);
      focusField(missingField.id);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(fields.email.trim())) {
      setStepError("Ingresá un email válido para seguir.");
      focusField("email");
      return;
    }

    moveToStep(2);
  }

  function isFieldRequired(fieldId: keyof QuoteBriefFields) {
    if (fieldId === "fuentes") {
      return requiresSources(fields.producto);
    }

    return Boolean(fieldConfigById[fieldId].required);
  }

  function renderField(field: QuoteFieldConfig) {
    const commonClassName =
      "w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-accent/35";
    const fieldRequired = isFieldRequired(field.id);

    return (
      <label key={field.id} className="space-y-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/55">
          {field.label}
          <span className="ml-2 normal-case tracking-normal text-muted-foreground/45">
            {fieldRequired ? "Requerido" : "Opcional"}
          </span>
        </span>
        {field.id === "producto" ? (
          <select
            id={`quote-${field.id}`}
            name={field.id}
            required={fieldRequired}
            value={fields.producto}
            onChange={(event) =>
              setFields((previous) => ({ ...previous, producto: event.target.value }))
            }
            className={commonClassName}
          >
            {PRODUCT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.multiline ? (
          <textarea
            id={`quote-${field.id}`}
            name={field.id}
            required={fieldRequired}
            value={fields[field.id]}
            onChange={(event) =>
              setFields((previous) => ({
                ...previous,
                [field.id]: event.target.value,
              }))
            }
            rows={4}
            placeholder={field.placeholder}
            className={`min-h-[104px] ${commonClassName}`}
          />
        ) : (
          <input
            id={`quote-${field.id}`}
            name={field.id}
            type={field.id === "email" ? "email" : "text"}
            required={fieldRequired}
            value={fields[field.id]}
            onChange={(event) =>
              setFields((previous) => ({
                ...previous,
                [field.id]: event.target.value,
              }))
            }
            placeholder={field.placeholder}
            className={commonClassName}
          />
        )}
      </label>
    );
  }

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
          : "No pudimos enviar la solicitud. Probá de nuevo en unos segundos.",
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
                    Pedí una primera estimación de alcance
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    Si ya tenés claro qué necesitás, completá el brief y te respondo por email con
                    una primera lectura de alcance.
                  </p>
                  <p className="max-w-3xl text-base leading-relaxed text-foreground/70">
                    Si todavía lo estás definiendo, primero conviene un diagnóstico.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] border border-border/55 bg-white/85 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                      Todavía lo estoy definiendo
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Si te falta ordenar el problema, conviene una conversación breve antes de cotizar.
                    </p>
                    <a
                      href={CALENDLY_URL}
                      onClick={() => {
                        trackDiagnosisClick("quote_page_intro");
                        trackCalendlyClick("quote_page_intro");
                      }}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
                    >
                      Agendar diagnóstico
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="rounded-[1.75rem] border border-accent/20 bg-accent/[0.04] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                      Ya tengo claro lo que necesito
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Si ya definiste servicio, contexto y fuentes, este brief es el camino
                      directo.
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
              </motion.div>

              <motion.div
                id="brief-cotizacion"
                ref={formCardRef}
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
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">
                      {currentStep === 1 ? "Paso 1 de 2" : "Paso 2 de 2"}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      Brief para pedir una primera estimación
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentStep === 1
                        ? "Arrancá con los datos clave para poder estimar bien."
                        : "Este paso es opcional y suma contexto para afinar la lectura."}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4">
                  {currentStep === 1 ? (
                    <>
                      <div className="grid gap-4 lg:grid-cols-2">
                        {stepOneFields.slice(0, 4).map((field) => renderField(field))}
                      </div>
                      {stepOneFields.slice(4).map((field) => renderField(field))}
                    </>
                  ) : (
                    <>
                      {stepTwoFields.map((field) => renderField(field))}
                    </>
                  )}

                  {stepError ? (
                    <p className="rounded-[1rem] border border-[#F1D7B5] bg-[#FFF8EF] px-4 py-3 text-sm text-[#8A5A12]">
                      {stepError}
                    </p>
                  ) : null}

                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    {currentStep === 1 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                      >
                        Siguiente
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => moveToStep(1)}
                          className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                        >
                          Volver
                        </button>
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
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                        >
                          <Copy className="h-4 w-4" />
                          {copied ? "Brief copiado" : "Copiar brief"}
                        </button>
                      </>
                    )}
                  </div>
                </form>

                <div className="mt-6 rounded-2xl border border-accent/15 bg-accent/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <p className="text-sm font-semibold text-foreground">Respaldo y salida manual</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Te confirmo el envío por email y guardo el brief en el registro interno. Si algo
                    falla, siempre podés copiarlo y enviarlo manualmente a{" "}
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
