import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Copy, Mail, ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  trackDiagnosisClick,
  trackFormSubmit,
  trackQuoteClick,
} from "../lib/analytics";
import {
  CONTACT_EMAIL,
  ROOT_DIAGNOSTIC_SECTION_HREF,
  SERVICES_PAGE_HREF,
  buildQuoteEmailBody,
  buildQuoteEmailHref,
  type QuoteBriefFields,
} from "../lib/contact";
import {
  SERVICE_PRODUCT_OPTIONS,
  getServiceByQuoteLabel,
  getServiceBySlug,
  services,
} from "../lib/services";

const fieldConfig: {
  id: keyof QuoteBriefFields;
  label: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  { id: "producto", label: "Servicio", placeholder: "Selecciona una opcion" },
  { id: "empresa", label: "Empresa", placeholder: "Nombre de tu empresa" },
  { id: "rol", label: "Rol", placeholder: "Tu rol o area" },
  {
    id: "objetivo",
    label: "Que necesitas resolver",
    placeholder: "Que queres volver visible, automatizar o construir",
    multiline: true,
  },
  {
    id: "fuentes",
    label: "Herramientas o fuentes actuales",
    placeholder: "Excel, CRM, ERP, SQL, manual, etc.",
  },
  {
    id: "destinatarios",
    label: "Quienes lo van a usar",
    placeholder: "Direccion, comercial, operaciones, equipo interno...",
  },
  { id: "plazo", label: "Plazo estimado", placeholder: "Urgente, este mes, proximo trimestre..." },
  {
    id: "desafio",
    label: "Contexto o desafio principal",
    placeholder: "Que esta trabando hoy la decision o la operacion",
    multiline: true,
  },
];

const emptyFields: QuoteBriefFields = {
  producto: services[0].quoteLabel,
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
  const [copied, setCopied] = useState(false);

  const selectedIntent =
    searchParams.get("intent") === "cotizacion" ? "cotizacion" : "diagnostico";
  const requestedService =
    getServiceBySlug(searchParams.get("service")) ??
    getServiceByQuoteLabel(searchParams.get("producto")) ??
    services[0];

  const [fields, setFields] = useState<QuoteBriefFields>(() => ({
    ...emptyFields,
    producto: requestedService.quoteLabel,
  }));

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    setFields((previous) => ({
      ...previous,
      producto: requestedService.quoteLabel,
    }));
  }, [requestedService]);

  const activeService = useMemo(
    () => getServiceByQuoteLabel(fields.producto) ?? requestedService,
    [fields.producto, requestedService],
  );

  const emailHref = useMemo(() => buildQuoteEmailHref(fields), [fields]);
  const emailBody = useMemo(() => buildQuoteEmailBody(fields), [fields]);

  const heroBadge =
    selectedIntent === "cotizacion" ? "Cotizacion guiada" : "Diagnostico guiado";
  const heroTitle =
    selectedIntent === "cotizacion"
      ? `Pedi alcance y cotizacion para ${activeService.title.toLowerCase()}`
      : `Aterriza tu caso para ${activeService.title.toLowerCase()} sin empezar desde cero`;
  const heroDescription =
    selectedIntent === "cotizacion"
      ? "Este flujo ya trae el servicio preseleccionado. Completas un brief corto y dejas armado el contexto para revisar alcance, complejidad y una primera lectura de presupuesto."
      : "Este flujo baja tu caso con el servicio correcto ya cargado. Asi podes explicar contexto, objetivo y restricciones sin volver a elegir manualmente la linea de trabajo.";
  const submitLabel =
    selectedIntent === "cotizacion"
      ? "Preparar cotizacion"
      : "Preparar diagnostico";

  const handleOpenMail = () => {
    trackFormSubmit("service_flow_mailto", fields.producto);

    if (selectedIntent === "cotizacion") {
      trackQuoteClick(`service_flow_${selectedIntent}`, fields.producto);
    } else {
      trackDiagnosisClick(`service_flow_${selectedIntent}`);
    }

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
                    {heroBadge}
                  </span>
                </div>

                <div className="space-y-5">
                  <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-[3.2rem]">
                    {heroTitle}
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    {heroDescription}
                  </p>
                  <p className="max-w-3xl text-base leading-relaxed text-foreground/72">
                    Servicio preseleccionado:{" "}
                    <span className="font-semibold text-foreground">
                      {activeService.title}
                    </span>
                    . Podes ajustar el brief o cambiar el servicio si detectas que otra linea encaja mejor.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {activeService.homeHighlights.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.5rem] border border-border/50 bg-white p-5"
                    >
                      <p className="text-sm leading-relaxed text-foreground/78">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[2rem] bg-foreground p-7 text-background">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                    Si todavia estas comparando
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    Primero podes revisar el overview de servicios y volver con mas criterio.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    Si aun no estas seguro de la linea correcta, conviene volver al overview o pasar por el diagnostico general del sitio.
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
                      onClick={() => trackDiagnosisClick("service_flow_compare")}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
                    >
                      Diagnostico general
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[2rem] border border-border/50 bg-white p-8 shadow-2xl shadow-black/[0.05] lg:p-10"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                    <activeService.icon className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Brief rapido del servicio
                    </p>
                    <p className="text-xs text-muted-foreground">
                      El servicio ya esta preseleccionado. Solo completas contexto y objetivo.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {fieldConfig.map((field) => (
                    <label key={field.id} className="space-y-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/55">
                        {field.label}
                      </span>
                      {field.id === "producto" ? (
                        <select
                          value={fields.producto}
                          onChange={(event) =>
                            setFields((previous) => ({
                              ...previous,
                              producto: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent/35"
                        >
                          {SERVICE_PRODUCT_OPTIONS.map((option) => (
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
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleOpenMail}
                    className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                  >
                    {submitLabel}
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
                    <p className="text-sm font-semibold text-foreground">
                      Como funciona hoy
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    El boton abre tu cliente de correo con el brief armado. Si no se abre o preferis mandarlo manualmente, copia el texto y envialo a{" "}
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
