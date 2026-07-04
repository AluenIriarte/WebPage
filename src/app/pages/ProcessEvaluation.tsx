import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileLock2, LoaderCircle, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import {
  trackEvaluationStart,
  trackEvaluationSubmit,
  trackWorkflowInterest,
} from "../lib/analytics";
import { PROCESS_EVALUATION_THANKYOU_HREF } from "../lib/contact";
import { submitProcessEvaluation } from "../lib/forms-api";

interface EvaluationFields {
  nombre: string;
  email: string;
  estudio: string;
  rol: string;
  proceso: string;
  volumen: string;
  sistemasFormatos: string;
  cuelloBotella: string;
}

type FieldName = keyof EvaluationFields;
type FieldErrors = Partial<Record<FieldName, string>>;

const initialFields: EvaluationFields = {
  nombre: "",
  email: "",
  estudio: "",
  rol: "",
  proceso: "",
  volumen: "",
  sistemasFormatos: "",
  cuelloBotella: "",
};

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-accent focus:ring-4 focus:ring-accent/10";

function validate(fields: EvaluationFields): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.nombre.trim()) errors.nombre = "Ingresá tu nombre.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Ingresá un email válido.";
  }
  if (!fields.estudio.trim()) errors.estudio = "Ingresá el nombre del estudio.";
  if (!fields.rol.trim()) errors.rol = "Contanos cuál es tu rol.";
  if (!fields.proceso) errors.proceso = "Elegí el proceso que querés evaluar.";
  if (!fields.volumen) errors.volumen = "Elegí un rango aproximado.";
  if (!fields.sistemasFormatos.trim()) errors.sistemasFormatos = "Indicá las herramientas o formatos actuales.";
  if (!fields.cuelloBotella.trim()) errors.cuelloBotella = "Describí brevemente el cuello de botella.";
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={id} className="mt-2 text-xs font-medium text-destructive">{message}</p>;
}

export function ProcessEvaluation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trackedStart = useRef(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [fields, setFields] = useState<EvaluationFields>(() => ({
    ...initialFields,
    proceso:
      searchParams.get("proceso") === "balance-asistido"
        ? "Armado asistido de balances"
        : searchParams.get("proceso") === "resumenes-bancarios"
          ? "Resúmenes bancarios"
          : "",
  }));
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const errors = validate(fields);

  const updateField = (field: FieldName, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    if (field === "proceso" && value) {
      trackWorkflowInterest(value);
    }
  };

  const markTouched = (field: FieldName) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const trackStart = () => {
    if (trackedStart.current) return;
    trackedStart.current = true;
    trackEvaluationStart("process_evaluation_page");
  };

  const goToStepTwo = () => {
    const stepFields: FieldName[] = ["nombre", "email", "estudio", "rol"];
    setTouched((current) => ({
      ...current,
      nombre: true,
      email: true,
      estudio: true,
      rol: true,
    }));
    if (stepFields.some((field) => Boolean(errors[field]))) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allTouched = Object.keys(initialFields).reduce(
      (result, field) => ({ ...result, [field]: true }),
      {} as Record<FieldName, boolean>,
    );
    setTouched(allTouched);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await submitProcessEvaluation({
        ...fields,
        source: "website_process_evaluation",
        landingPath: window.location.pathname,
        utmSource: searchParams.get("utm_source") || "",
        utmMedium: searchParams.get("utm_medium") || "",
        utmCampaign: searchParams.get("utm_campaign") || "",
      });
      trackEvaluationSubmit(fields.proceso);
      navigate(`${PROCESS_EVALUATION_THANKYOU_HREF}?rid=${encodeURIComponent(response.requestId)}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No pudimos enviar la evaluación. Probá nuevamente en unos minutos.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="pb-20 pt-28 lg:pb-28 lg:pt-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="mono-label text-[10px] font-semibold uppercase text-accent">
                Evaluación de proceso
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.05em] sm:text-5xl">
                Preparemos una conversación útil.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                Necesitamos contexto operativo, no documentación contable. Con estas respuestas revisamos si
                existe un proceso razonable para mostrar y pilotear.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: FileLock2, text: "No adjuntes balances, extractos ni datos de clientes." },
                  { icon: ShieldCheck, text: "La demo se realiza de forma privada y guiada." },
                  { icon: Check, text: "El envío no implica contratar ni recibir una cotización automática." },
                ].map((item) => (
                  <div key={item.text} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#159A80]" aria-hidden="true" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </aside>

            <section className="rounded-[1.75rem] border border-border bg-white p-6 shadow-[0_24px_80px_rgba(11,18,32,0.06)] sm:p-8 lg:p-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Paso {step} de 2</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {step === 1 ? "Quién sos y desde qué estudio escribís" : "Qué proceso querés revisar"}
                  </p>
                </div>
                <span className="mono-label text-[10px] text-muted-foreground">{step === 1 ? "50%" : "100%"}</span>
              </div>
              <div
                className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label="Progreso de la evaluación"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={step === 1 ? 50 : 100}
              >
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-200"
                  style={{ width: step === 1 ? "50%" : "100%" }}
                />
              </div>

              <form className="mt-8" onSubmit={handleSubmit} onFocus={trackStart} noValidate>
                {step === 1 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-foreground">
                      Nombre y apellido <span className="text-destructive">*</span>
                      <input
                        className={inputClass}
                        type="text"
                        autoComplete="name"
                        value={fields.nombre}
                        onChange={(event) => updateField("nombre", event.target.value)}
                        onBlur={() => markTouched("nombre")}
                        aria-invalid={Boolean(touched.nombre && errors.nombre)}
                        aria-describedby={touched.nombre && errors.nombre ? "nombre-error" : undefined}
                        placeholder="Tu nombre"
                      />
                      <FieldError id="nombre-error" message={touched.nombre ? errors.nombre : undefined} />
                    </label>

                    <label className="text-sm font-semibold text-foreground">
                      Email laboral <span className="text-destructive">*</span>
                      <input
                        className={inputClass}
                        type="email"
                        autoComplete="email"
                        value={fields.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        onBlur={() => markTouched("email")}
                        aria-invalid={Boolean(touched.email && errors.email)}
                        aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                        placeholder="nombre@estudio.com"
                      />
                      <FieldError id="email-error" message={touched.email ? errors.email : undefined} />
                    </label>

                    <label className="text-sm font-semibold text-foreground">
                      Estudio contable <span className="text-destructive">*</span>
                      <input
                        className={inputClass}
                        type="text"
                        autoComplete="organization"
                        value={fields.estudio}
                        onChange={(event) => updateField("estudio", event.target.value)}
                        onBlur={() => markTouched("estudio")}
                        aria-invalid={Boolean(touched.estudio && errors.estudio)}
                        aria-describedby={touched.estudio && errors.estudio ? "estudio-error" : undefined}
                        placeholder="Nombre del estudio"
                      />
                      <FieldError id="estudio-error" message={touched.estudio ? errors.estudio : undefined} />
                    </label>

                    <label className="text-sm font-semibold text-foreground">
                      Tu rol <span className="text-destructive">*</span>
                      <input
                        className={inputClass}
                        type="text"
                        autoComplete="organization-title"
                        value={fields.rol}
                        onChange={(event) => updateField("rol", event.target.value)}
                        onBlur={() => markTouched("rol")}
                        aria-invalid={Boolean(touched.rol && errors.rol)}
                        aria-describedby={touched.rol && errors.rol ? "rol-error" : undefined}
                        placeholder="Socio, titular, responsable..."
                      />
                      <FieldError id="rol-error" message={touched.rol ? errors.rol : undefined} />
                    </label>

                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={goToStepTwo}
                        className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent"
                      >
                        Continuar
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <label className="text-sm font-semibold text-foreground">
                        Proceso a evaluar <span className="text-destructive">*</span>
                        <select
                          className={inputClass}
                          value={fields.proceso}
                          onChange={(event) => updateField("proceso", event.target.value)}
                          onBlur={() => markTouched("proceso")}
                          aria-invalid={Boolean(touched.proceso && errors.proceso)}
                          aria-describedby={touched.proceso && errors.proceso ? "proceso-error" : undefined}
                        >
                          <option value="">Elegí una opción</option>
                          <option>Armado asistido de balances</option>
                          <option>Resúmenes bancarios</option>
                          <option>Otro proceso contable</option>
                        </select>
                        <FieldError id="proceso-error" message={touched.proceso ? errors.proceso : undefined} />
                      </label>

                      <label className="text-sm font-semibold text-foreground">
                        Volumen aproximado <span className="text-destructive">*</span>
                        <select
                          className={inputClass}
                          value={fields.volumen}
                          onChange={(event) => updateField("volumen", event.target.value)}
                          onBlur={() => markTouched("volumen")}
                          aria-invalid={Boolean(touched.volumen && errors.volumen)}
                          aria-describedby={touched.volumen && errors.volumen ? "volumen-error" : undefined}
                        >
                          <option value="">Elegí un rango</option>
                          <option>Hasta 10 casos por mes</option>
                          <option>Entre 11 y 30 casos por mes</option>
                          <option>Entre 31 y 75 casos por mes</option>
                          <option>Más de 75 casos por mes</option>
                          <option>Trabajo estacional o anual</option>
                        </select>
                        <FieldError id="volumen-error" message={touched.volumen ? errors.volumen : undefined} />
                      </label>
                    </div>

                    <label className="text-sm font-semibold text-foreground">
                      Sistemas y formatos actuales <span className="text-destructive">*</span>
                      <input
                        className={inputClass}
                        type="text"
                        value={fields.sistemasFormatos}
                        onChange={(event) => updateField("sistemasFormatos", event.target.value)}
                        onBlur={() => markTouched("sistemasFormatos")}
                        aria-invalid={Boolean(touched.sistemasFormatos && errors.sistemasFormatos)}
                        aria-describedby={
                          touched.sistemasFormatos && errors.sistemasFormatos
                            ? "sistemas-formatos-error"
                            : undefined
                        }
                        placeholder="Ej.: Excel, PDF, CSV y sistema contable..."
                      />
                      <FieldError
                        id="sistemas-formatos-error"
                        message={touched.sistemasFormatos ? errors.sistemasFormatos : undefined}
                      />
                    </label>

                    <label className="text-sm font-semibold text-foreground">
                      Principal cuello de botella <span className="text-destructive">*</span>
                      <textarea
                        className={`${inputClass} min-h-32 resize-y py-3.5`}
                        value={fields.cuelloBotella}
                        onChange={(event) => updateField("cuelloBotella", event.target.value)}
                        onBlur={() => markTouched("cuelloBotella")}
                        aria-invalid={Boolean(touched.cuelloBotella && errors.cuelloBotella)}
                        aria-describedby={
                          touched.cuelloBotella && errors.cuelloBotella
                            ? "cuello-botella-error"
                            : undefined
                        }
                        placeholder="Contanos qué parte requiere más tiempo, retrabajo o controles manuales. No incluyas datos de clientes."
                      />
                      <FieldError
                        id="cuello-botella-error"
                        message={touched.cuelloBotella ? errors.cuelloBotella : undefined}
                      />
                    </label>

                    {submitError ? (
                      <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {submitError}
                      </div>
                    ) : null}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Volver
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                            Enviando evaluación
                          </>
                        ) : (
                          <>
                            Enviar evaluación
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
