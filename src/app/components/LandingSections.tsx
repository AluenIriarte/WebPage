import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  CircleAlert,
  Clock3,
  DatabaseZap,
  FileLock2,
  FileSearch2,
  Files,
  Landmark,
  ListChecks,
  Repeat2,
  ScanLine,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PROCESS_EVALUATION_PAGE_HREF } from "../lib/contact";

function Eyebrow({
  children,
  light = false,
  centered = false,
}: {
  children: React.ReactNode;
  light?: boolean;
  centered?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
      <span className={`h-px w-7 ${light ? "bg-white/30" : "bg-accent/45"}`} />
      <p
        className={`mono-label text-[10px] font-semibold uppercase ${
          light ? "text-white/50" : "text-accent"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

const painPoints = [
  {
    icon: Clock3,
    title: "El cierre consume más horas de las necesarias",
    body: "El equipo repite cargas, ordenamientos y controles antes de poder aplicar criterio profesional.",
  },
  {
    icon: Files,
    title: "La información llega en formatos distintos",
    body: "Excel, CSV, PDF y sistemas contables obligan a rearmar la misma estructura una y otra vez.",
  },
  {
    icon: Repeat2,
    title: "Se revisa todo, incluso lo que ya está bien",
    body: "Sin una capa que priorice excepciones, el esfuerzo se distribuye igual entre casos simples y complejos.",
  },
];

const balanceSteps = [
  {
    number: "01",
    title: "Ordenar entradas",
    body: "Recibimos las fuentes acordadas y normalizamos su estructura sin modificar los originales.",
  },
  {
    number: "02",
    title: "Proponer relaciones",
    body: "El flujo sugiere mapeos, agrupaciones y observaciones con referencia a la fuente.",
  },
  {
    number: "03",
    title: "Revisar excepciones",
    body: "El profesional concentra la atención en casos atípicos, diferencias y decisiones de criterio.",
  },
  {
    number: "04",
    title: "Preparar la salida",
    body: "La estructura validada queda lista para continuar el circuito habitual del estudio.",
  },
];

const pilotSteps = [
  {
    icon: FileSearch2,
    number: "01",
    title: "Relevamiento",
    body: "Entendemos el circuito actual, las fuentes y dónde se concentra el trabajo repetitivo.",
  },
  {
    icon: SlidersHorizontal,
    number: "02",
    title: "Configuración",
    body: "Adaptamos un prototipo a un único proceso, con alcance y controles explícitos.",
  },
  {
    icon: UserCheck,
    number: "03",
    title: "Validación",
    body: "El equipo prueba la salida y define qué requiere aprobación humana o ajuste.",
  },
  {
    icon: BadgeCheck,
    number: "04",
    title: "Medición",
    body: "Comparamos el circuito anterior y el nuevo antes de decidir si conviene escalar.",
  },
];

const faqs = [
  {
    question: "¿Es un software contable nuevo?",
    answer:
      "No. La propuesta inicial es implementar un flujo asistido alrededor del proceso y las herramientas que el estudio ya utiliza. El piloto permite comprobar valor antes de pensar en una plataforma más amplia.",
  },
  {
    question: "¿La IA arma y aprueba el balance sola?",
    answer:
      "No. Puede ordenar información, sugerir relaciones y señalar excepciones. La revisión, los ajustes y la aprobación final siguen en manos del profesional contable.",
  },
  {
    question: "¿Tengo que enviar documentación desde esta web?",
    answer:
      "No. El formulario no acepta archivos ni datos contables sensibles. Las condiciones de acceso, retención y eliminación se acuerdan antes de usar información real en un piloto.",
  },
  {
    question: "¿Puedo ver las demos antes de avanzar?",
    answer:
      "Sí. Después de evaluar el proceso coordinamos una reunión privada para mostrar los prototipos relevantes y revisar si existe un caso razonable para pilotear.",
  },
  {
    question: "¿Trabajan solamente con balances?",
    answer:
      "Es el flujo principal de esta primera etapa. También mostramos procesamiento de resúmenes bancarios y, en la reunión privada, otros prototipos disponibles.",
  },
];

export function LandingSections() {
  return (
    <>
      <section id="problema" className="border-y border-border bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div>
              <Eyebrow>El problema operativo</Eyebrow>
              <h2 className="mt-6 max-w-md text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-foreground sm:text-4xl lg:text-[2.75rem]">
                El criterio profesional no debería gastarse en preparar el trabajo.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                Antes de analizar, el estudio suele dedicar horas a copiar, ordenar, reconciliar y volver a
                controlar información dispersa.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {painPoints.map((point, index) => (
                <article
                  key={point.title}
                  className="group flex min-h-[280px] flex-col rounded-[1.5rem] border border-border bg-[#F7F7F3] p-6 transition-colors duration-200 hover:border-[#B9C7DA] sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white text-foreground">
                      <point.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="mono-label text-[10px] text-muted-foreground/60">0{index + 1}</span>
                  </div>
                  <div className="mt-auto pt-12">
                    <h3 className="text-lg font-semibold leading-snug tracking-[-0.025em]">{point.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{point.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F7F3] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow centered>El cambio de enfoque</Eyebrow>
            <h2 className="mt-6 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl lg:text-[2.75rem]">
              De revisar todo a trabajar sobre lo que necesita criterio.
            </h2>
          </div>

          <div className="mt-12 grid overflow-hidden rounded-[1.75rem] border border-border bg-white lg:grid-cols-2">
            <div className="p-7 sm:p-9 lg:p-11">
              <p className="mono-label text-[10px] font-semibold uppercase text-muted-foreground">Circuito actual</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">Trabajo manual distribuido</h3>
              <div className="mt-7 space-y-3">
                {[
                  "Abrir y reordenar cada archivo",
                  "Cruzar información de forma manual",
                  "Revisar casos correctos y excepciones por igual",
                  "Reconstruir el historial de cada decisión",
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl bg-[#F7F7F3] px-4 py-3.5 text-sm text-muted-foreground">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#A56A1E]" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border bg-[#0B1220] p-7 text-white sm:p-9 lg:border-l lg:border-t-0 lg:p-11">
              <p className="mono-label text-[10px] font-semibold uppercase text-[#75E5C9]">Circuito asistido</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">Revisión enfocada y trazable</h3>
              <div className="mt-7 space-y-3">
                {[
                  "Fuentes normalizadas bajo reglas visibles",
                  "Sugerencias vinculadas al dato original",
                  "Excepciones separadas para revisión profesional",
                  "Registro del estado y la decisión final",
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.035] px-4 py-3.5 text-sm text-white/68">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#75E5C9]" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="soluciones" className="border-y border-border bg-white py-20 lg:py-28">
        <div id="balance-asistido" className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>Flujo principal</Eyebrow>
              <h2 className="mt-6 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl lg:text-[2.75rem]">
                Armado asistido de balances
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                Un flujo para preparar, ordenar y revisar la estructura del balance manteniendo al profesional
                dentro de cada decisión relevante.
              </p>
              <div className="mt-7 rounded-2xl border border-[#A9BFEA] bg-[#F2F6FF] p-5">
                <div className="flex gap-3">
                  <BookOpenCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <p className="text-sm leading-6 text-[#33445F]">
                    El prototipo asiste la preparación. No interpreta normativa ni aprueba estados contables de
                    forma autónoma.
                  </p>
                </div>
              </div>
              <Link
                to={`${PROCESS_EVALUATION_PAGE_HREF}?proceso=balance-asistido`}
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent"
              >
                Evaluar este proceso
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="divide-y divide-border rounded-[1.75rem] border border-border bg-[#F7F7F3]">
              {balanceSteps.map((step) => (
                <article key={step.number} className="grid gap-4 p-6 sm:grid-cols-[80px_1fr] sm:p-8">
                  <span className="mono-label text-xs font-semibold text-accent">{step.number}</span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em]">{step.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-20 rounded-[2rem] bg-[#E9F0FF] p-6 sm:p-9 lg:mt-28 lg:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-accent">
                  <Landmark className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="mono-label mt-6 text-[10px] font-semibold uppercase text-accent">Segundo flujo</p>
                <h2 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.045em] sm:text-4xl">
                  Resúmenes bancarios listos para trabajar
                </h2>
                <p className="mt-5 text-base leading-7 text-[#52627A]">
                  Estructuramos movimientos de archivos bancarios para reducir carga inicial, detectar
                  inconsistencias y preparar una salida revisable.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/70 bg-white p-5 shadow-[0_24px_70px_rgba(36,107,253,0.09)] sm:p-7">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: ScanLine, label: "Entrada", value: "PDF / Excel" },
                    { icon: DatabaseZap, label: "Proceso", value: "Estructuración" },
                    { icon: ListChecks, label: "Salida", value: "Revisión" },
                  ].map((item, index) => (
                    <div key={item.label} className="relative rounded-2xl border border-border p-4">
                      <item.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                      <p className="mono-label mt-5 text-[9px] uppercase text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold">{item.value}</p>
                      {index < 2 ? (
                        <ArrowRight className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-accent sm:block" />
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-3 rounded-2xl bg-[#F7F7F3] p-4">
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#A56A1E]" aria-hidden="true" />
                  <p className="text-xs leading-5 text-muted-foreground">
                    La compatibilidad y las validaciones necesarias se revisan según banco, formato y sistema de
                    destino.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-trabajamos" className="bg-[#F7F7F3] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <Eyebrow>Del diagnóstico al piloto</Eyebrow>
              <h2 className="mt-6 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl">
                Primero validamos el proceso. Después decidimos si escalar.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                No empezamos vendiendo una plataforma. Empezamos entendiendo una tarea concreta y definiendo qué
                resultado sería útil para el estudio.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {pilotSteps.map((step) => (
                <article key={step.number} className="rounded-[1.5rem] border border-border bg-white p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF3FF] text-accent">
                      <step.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="mono-label text-[10px] text-muted-foreground/60">{step.number}</span>
                  </div>
                  <h3 className="mt-8 text-lg font-semibold tracking-[-0.025em]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="privacidad" className="overflow-hidden bg-[#0B1220] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <Eyebrow light>Control antes que automatización</Eyebrow>
              <h2 className="mt-6 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl lg:text-[2.75rem]">
                Documentación sensible no entra por un formulario público.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/58">
                La web sirve para entender el proceso. Antes de usar información real, acordamos alcance,
                accesos, retención y eliminación para el piloto.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: FileLock2, title: "Sin carga pública", body: "El formulario no recibe balances, extractos ni archivos de clientes." },
                { icon: ShieldCheck, title: "Entorno acordado", body: "La forma de trabajo se define antes de procesar documentación real." },
                { icon: Workflow, title: "Trazabilidad", body: "Las sugerencias deben poder vincularse a una fuente y a una revisión." },
                { icon: UserCheck, title: "Control humano", body: "Las decisiones profesionales permanecen a cargo del estudio." },
              ].map((item) => (
                <article key={item.title} className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                  <item.icon className="h-5 w-5 text-[#75E5C9]" aria-hidden="true" />
                  <h3 className="mt-5 text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/48">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow>Evidencia disponible</Eyebrow>
              <h2 className="mt-6 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl">
                Prototipos probados. Promesas todavía no.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                Podemos mostrar los recorridos y conversar sobre su aplicación. No publicamos porcentajes,
                ahorros ni resultados de clientes que todavía no fueron validados.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-[#F7F7F3] p-6 sm:p-8">
              <p className="mono-label text-[10px] font-semibold uppercase text-muted-foreground">Qué vas a ver en la demo</p>
              <div className="mt-6 space-y-4">
                {[
                  "Recorrido del balance asistido con datos ficticios",
                  "Ejemplo de estructuración de un resumen bancario",
                  "Puntos de revisión y trazabilidad del flujo",
                  "Catálogo privado de otros prototipos disponibles",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#159A80]" aria-hidden="true" />
                    <p className="text-sm leading-6 text-[#3E4A5B]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F7F3] py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <Eyebrow centered>Preguntas frecuentes</Eyebrow>
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Lo que conviene aclarar antes de una demo
            </h2>
          </div>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-1">
                <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 py-5 text-left text-base font-semibold [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-lg font-normal transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-6 pr-12 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="evaluar" className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-[#246BFD] px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
            <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="mono-label text-[10px] font-semibold uppercase text-white/60">Siguiente paso</p>
                <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                  Elegí un proceso. Nosotros evaluamos si vale la pena pilotearlo.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
                  El formulario no pide archivos. Solo el contexto necesario para preparar una conversación útil.
                </p>
              </div>
              <Link
                to={PROCESS_EVALUATION_PAGE_HREF}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#0B1220] transition-colors duration-200 hover:bg-[#EAF0FF]"
              >
                Evaluar un proceso
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
