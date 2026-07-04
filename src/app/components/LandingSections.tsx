import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  FileLock2,
  Fingerprint,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { trackAuthorityLinkClick } from "../lib/analytics";
import { PROCESS_EVALUATION_PAGE_HREF } from "../lib/contact";

const linkedinUrl = "https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true";

const repetitiveWork = [
  ["Copiar", "Movimientos, saldos y referencias"],
  ["Ordenar", "Archivos, versiones y formatos"],
  ["Conciliar", "Fuentes que no hablan entre sí"],
  ["Revisar", "Todo, incluso lo que ya está bien"],
];

const pilotSteps = [
  {
    number: "01",
    title: "Relevar",
    body: "Entender el circuito, las fuentes y dónde se concentra el trabajo repetitivo.",
  },
  {
    number: "02",
    title: "Configurar",
    body: "Adaptar un prototipo a un único proceso con alcance y controles explícitos.",
  },
  {
    number: "03",
    title: "Validar",
    body: "Probar la salida con el equipo y registrar qué necesita aprobación o ajuste.",
  },
  {
    number: "04",
    title: "Medir",
    body: "Comparar el circuito anterior y el asistido antes de decidir si conviene escalar.",
  },
];

const faqs = [
  {
    question: "¿Es un software contable nuevo?",
    answer:
      "No. Implementamos un flujo asistido alrededor del proceso y de las herramientas que el estudio ya utiliza. El piloto permite comprobar valor antes de pensar en una plataforma más amplia.",
  },
  {
    question: "¿La IA arma y aprueba un balance sola?",
    answer:
      "No. Puede ordenar información, sugerir relaciones y señalar excepciones. La revisión, los ajustes y la aprobación final continúan en manos del profesional contable.",
  },
  {
    question: "¿Tengo que enviar documentación desde esta web?",
    answer:
      "No. El formulario no acepta archivos ni información contable sensible. Accesos, retención y eliminación se acuerdan antes de utilizar datos reales.",
  },
  {
    question: "¿Puedo ver la demo antes de avanzar?",
    answer:
      "Sí. La evaluación inicial sirve para preparar una demostración privada con el flujo más cercano al proceso del estudio.",
  },
];

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <span className={`h-px w-9 ${light ? "bg-[#9DA9FF]" : "bg-[#2D5BFF]"}`} />
      <p
        className={`mono-label text-[9px] font-semibold uppercase sm:text-[10px] ${
          light ? "text-[#B3BBFF]" : "text-[#334BC1]"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

export function LandingSections() {
  return (
    <>
      <section id="problema" className="bg-[#FCFCFA] py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-7 lg:px-10 xl:px-14">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <SectionLabel>El trabajo que no se ve</SectionLabel>
              <h2 className="mt-7 max-w-2xl font-display text-4xl leading-[0.98] tracking-[-0.035em] text-[#11131A] sm:text-5xl lg:text-6xl">
                El criterio profesional no debería gastarse en preparar el trabajo.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-[#666870]">
                Antes de analizar, el equipo dedica horas a reconstruir contexto. La automatización útil empieza
                ahí: en lo repetitivo, lo trazable y lo que puede revisarse.
              </p>
            </div>

            <div className="border-t border-[#BEBAB0]">
              {repetitiveWork.map(([title, description], index) => (
                <div
                  key={title}
                  className="grid grid-cols-[48px_0.55fr_1fr] items-center gap-3 border-b border-[#D9D5CB] py-5 sm:grid-cols-[64px_0.5fr_1fr] sm:gap-5 sm:py-6"
                >
                  <span className="mono-label text-[9px] font-semibold text-[#62645F]">0{index + 1}</span>
                  <p className="font-display text-2xl text-[#26282E] sm:text-3xl">{title}</p>
                  <p className="text-xs leading-5 text-[#777981] sm:text-sm sm:leading-6">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid border border-[#C8C1F6] bg-[#F1EEFF] lg:mt-24 lg:grid-cols-2">
            <div className="border-b border-[#C8C1F6] p-6 sm:p-9 lg:border-b-0 lg:border-r lg:p-11">
              <p className="mono-label text-[9px] font-semibold uppercase text-[#5E587A]">Circuito actual</p>
              <p className="mt-5 max-w-lg font-display text-3xl leading-[1.05] text-[#312A55] sm:text-4xl">
                Revisar todo para descubrir qué requería atención.
              </p>
            </div>
            <div className="bg-[#11131A] p-6 text-white sm:p-9 lg:p-11">
              <p className="mono-label text-[9px] font-semibold uppercase text-[#AEB7FF]">Circuito asistido</p>
              <p className="mt-5 max-w-lg font-display text-3xl leading-[1.05] sm:text-4xl">
                Trabajar sobre excepciones con la fuente siempre visible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="soluciones" className="border-y border-[#D9D5CB] bg-[#F4F1EA] py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-7 lg:px-10 xl:px-14">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionLabel>De entrada a revisión</SectionLabel>
              <h2 className="mt-7 font-display text-4xl leading-[0.98] tracking-[-0.035em] text-[#11131A] sm:text-5xl">
                Un proceso continuo. Cuatro decisiones visibles.
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-[#666870]">
                La demo no representa un producto terminado. Muestra cómo se diseña un flujo alrededor del trabajo
                real del estudio.
              </p>
              <Link
                to={`${PROCESS_EVALUATION_PAGE_HREF}?proceso=balance-asistido`}
                className="group mt-8 inline-flex min-h-12 items-center gap-3 border-b border-[#11131A] text-sm font-semibold text-[#11131A] transition-colors hover:border-[#2D5BFF] hover:text-[#2D5BFF]"
              >
                Evaluar este proceso
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="border-t border-[#BEBAB0]">
              {[
                ["01", "Ordenar entradas", "Registrar fuentes, versiones y estructura sin modificar los originales."],
                ["02", "Normalizar", "Llevar campos comparables a un esquema de trabajo y hacer visibles las diferencias."],
                ["03", "Proponer", "Sugerir relaciones o categorías con referencia, regla y estado de confianza."],
                ["04", "Revisar", "Separar lo validable de las excepciones que requieren criterio profesional."],
              ].map(([number, title, body]) => (
                <article
                  key={number}
                  className="grid gap-4 border-b border-[#BEBAB0] py-7 sm:grid-cols-[80px_0.55fr_1fr] sm:gap-6 sm:py-8"
                >
                  <span className="mono-label text-[10px] font-semibold text-[#4656B8]">{number}</span>
                  <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#22242A] sm:text-xl">{title}</h3>
                  <p className="max-w-xl text-sm leading-6 text-[#6D6F77]">{body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-20 grid border-t border-[#BEBAB0] lg:mt-28 lg:grid-cols-2">
            <div className="border-b border-[#BEBAB0] py-8 lg:border-b-0 lg:border-r lg:pr-12">
              <p className="mono-label text-[9px] font-semibold uppercase text-[#62645F]">Flujo principal</p>
              <h3 className="mt-4 font-display text-4xl text-[#11131A]">Balance asistido</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#6D6F77]">
                Preparación, mapeo y revisión de la estructura del balance con el profesional dentro de cada
                decisión relevante.
              </p>
            </div>
            <div className="py-8 lg:pl-12">
              <p className="mono-label text-[9px] font-semibold uppercase text-[#62645F]">Segundo flujo</p>
              <h3 className="mt-4 font-display text-4xl text-[#11131A]">Resúmenes bancarios</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#6D6F77]">
                Movimientos estructurados, referencias conservadas y excepciones separadas para continuar el
                circuito del estudio.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-trabajamos" className="overflow-hidden bg-[#11131A] py-20 text-white sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-7 lg:px-10 xl:px-14">
          <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
            <div>
              <SectionLabel light>Del diagnóstico al piloto</SectionLabel>
              <h2 className="mt-7 max-w-xl font-display text-4xl leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                Un proceso primero. Evidencia antes de escalar.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/58">
                No empezamos vendiendo una plataforma. Definimos una tarea concreta, un resultado útil y los
                controles que el estudio necesita conservar.
              </p>
            </div>

            <div className="border-t border-white/20">
              {pilotSteps.map((step) => (
                <article
                  key={step.number}
                  className="grid gap-4 border-b border-white/20 py-7 sm:grid-cols-[74px_0.5fr_1fr] sm:gap-6 sm:py-8"
                >
                  <span className="font-display text-3xl text-[#8D96FF]">{step.number}</span>
                  <h3 className="text-lg font-semibold tracking-[-0.02em]">{step.title}</h3>
                  <p className="text-sm leading-6 text-white/52">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="privacidad" className="bg-[#FCFCFA] py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-7 lg:px-10 xl:px-14">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">
            <div>
              <SectionLabel>Control antes que automatización</SectionLabel>
              <h2 className="mt-7 max-w-3xl font-display text-4xl leading-[0.98] tracking-[-0.035em] text-[#11131A] sm:text-5xl lg:text-6xl">
                La documentación sensible no entra por un formulario público.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#666870]">
                La web sirve para entender el proceso. Antes de utilizar información real se acuerdan alcance,
                accesos, retención y eliminación.
              </p>
            </div>

            <div className="border border-[#D9D5CB] bg-[#F4F1EA]">
              <div className="flex items-center justify-between border-b border-[#D9D5CB] px-5 py-4">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-[#4656B8]" aria-hidden="true" />
                  <p className="mono-label text-[9px] font-semibold uppercase text-[#4656B8]">Registro de control</p>
                </div>
                <span className="mono-label text-[8px] uppercase text-[#62645F]">Piloto</span>
              </div>
              <div className="divide-y divide-[#D9D5CB]">
                {[
                  { icon: FileLock2, label: "Ingreso", value: "Sin carga pública de documentos" },
                  { icon: Fingerprint, label: "Trazabilidad", value: "Fuente y regla visibles" },
                  { icon: UserCheck, label: "Decisión", value: "Validación a cargo del estudio" },
                  { icon: ShieldCheck, label: "Entorno", value: "Condiciones acordadas por piloto" },
                ].map((item) => (
                  <div key={item.label} className="grid grid-cols-[40px_0.55fr_1fr] items-center gap-3 px-5 py-5">
                    <item.icon className="h-4 w-4 text-[#5D6068]" aria-hidden="true" />
                    <p className="mono-label text-[8px] font-semibold uppercase text-[#62645F]">{item.label}</p>
                    <p className="text-xs font-semibold leading-5 text-[#33353C]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="alan" className="border-y border-[#C8C1F6] bg-[#F1EEFF] py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-7 lg:px-10 xl:px-14">
          <div className="grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
            <div className="relative min-h-[220px] overflow-hidden border border-[#C8C1F6] bg-[#E9E4FF]">
              <span className="absolute -bottom-16 -left-2 font-display text-[18rem] leading-none text-[#6C52FF]/16 sm:text-[22rem]">
                A
              </span>
              <div className="absolute inset-x-6 top-6 flex items-center justify-between">
                <p className="mono-label text-[9px] font-semibold uppercase text-[#5A4E9E]">Alan L. Perez</p>
                <p className="mono-label text-[8px] uppercase text-[#5E587A]">Argentina</p>
              </div>
            </div>

            <div>
              <SectionLabel>Quién implementa</SectionLabel>
              <h2 className="mt-7 max-w-3xl font-display text-4xl leading-[1] tracking-[-0.03em] text-[#211C3C] sm:text-5xl">
                Datos, automatización e IA aplicada con el proceso real como punto de partida.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#5E587A]">
                Alan L. Perez diseña implementaciones que combinan tecnología, contexto operativo y validación
                humana. El objetivo no es automatizar por automatizar, sino construir una forma de trabajo que el
                equipo pueda entender, controlar y medir.
              </p>
              <div className="mt-8 border-l-2 border-[#6C52FF] pl-5">
                <p className="text-sm leading-6 text-[#4E476E]">
                  Participó como expositor en una charla en la UBA sobre inteligencia artificial, tecnología y el
                  valor del criterio humano.
                </p>
              </div>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAuthorityLinkClick("linkedin")}
                className="group mt-8 inline-flex min-h-12 items-center gap-3 border-b border-[#4B3DB4] text-sm font-semibold text-[#4B3DB4] transition-colors hover:border-[#211C3C] hover:text-[#211C3C]"
              >
                Ver perfil y actividad
                <ExternalLink className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FCFCFA] py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-5 sm:px-7 lg:px-10">
          <SectionLabel>Preguntas antes de una demo</SectionLabel>
          <h2 className="mt-7 max-w-3xl font-display text-4xl leading-[1] text-[#11131A] sm:text-5xl">
            Lo importante, sin letra chica.
          </h2>
          <div className="mt-12 border-t border-[#BEBAB0]">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="group border-b border-[#BEBAB0]">
                <summary className="grid min-h-20 cursor-pointer list-none grid-cols-[48px_1fr_36px] items-center gap-3 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <span className="mono-label text-[9px] text-[#62645F]">0{index + 1}</span>
                  <span className="text-base font-semibold tracking-[-0.015em] text-[#292B31] sm:text-lg">
                    {faq.question}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center border border-[#BEBAB0] text-lg font-normal transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-7 pl-[60px] pr-4 text-sm leading-7 text-[#6D6F77]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="evaluar" className="bg-[#2D5BFF] text-white">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.35fr_0.65fr]">
          <div className="px-5 py-16 sm:px-7 sm:py-20 lg:border-r lg:border-white/20 lg:px-10 lg:py-24 xl:px-14">
            <p className="mono-label text-[9px] font-semibold uppercase text-white/62">Siguiente paso</p>
            <h2 className="mt-6 max-w-4xl font-display text-4xl leading-[0.95] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Elegí un proceso. Evaluamos si vale la pena pilotearlo.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
              El formulario no pide archivos. Solo el contexto necesario para preparar una conversación útil.
            </p>
          </div>
          <div className="flex items-end px-5 pb-16 sm:px-7 sm:pb-20 lg:px-10 lg:py-24 xl:px-14">
            <Link
              to={PROCESS_EVALUATION_PAGE_HREF}
              className="group inline-flex min-h-14 w-full items-center justify-between bg-white px-6 text-sm font-semibold text-[#11131A] transition-colors hover:bg-[#F1EEFF]"
            >
              Evaluar un proceso
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
