import { ArrowDownRight, ArrowRight, Check, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { InteractiveAccountingWorkspace } from "../components/InteractiveAccountingWorkspace";
import { LandingSections } from "../components/LandingSections";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { trackDemoClick } from "../lib/analytics";
import { PROCESS_EVALUATION_PAGE_HREF } from "../lib/contact";

const reportUrl =
  "https://www.thomsonreuters.com.ar/content/dam/ewp-m/documents/argentina/es/pdf/white-papers/informe-inteligencia-artificial-en-la-contabilidad-en-argentina-2025.pdf";

export function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <SiteHeader />
      <main>
        <section id="home" className="paper-grid relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-40">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(45,91,255,0.42),transparent)]" />
          <div className="mx-auto max-w-[1440px] px-5 sm:px-7 lg:px-10 xl:px-14">
            <div className="grid items-end gap-10 border-b border-[#D9D5CB] pb-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16 lg:pb-16">
              <div>
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-[#2D5BFF]" />
                  <p className="mono-label text-[9px] font-semibold uppercase text-[#334BC1] sm:text-[10px]">
                    IA aplicada a estudios contables
                  </p>
                </div>
                <h1 className="mt-7 max-w-5xl font-display text-[3.5rem] leading-[0.88] tracking-[-0.045em] text-[#11131A] sm:text-[5rem] lg:text-[6.5rem] xl:text-[7.2rem]">
                  Cerrá más rápido
                  <span className="mt-1 block italic text-[#5148E5] sm:mt-2">
                    sin perder el control contable.
                  </span>
                </h1>
              </div>

              <div className="pb-1 lg:max-w-md lg:justify-self-end">
                <p className="text-base leading-7 text-[#555861] sm:text-lg sm:leading-8">
                  Diseñamos flujos privados que preparan balances y estructuran resúmenes bancarios para que tu
                  equipo deje de revisar todo y se concentre en excepciones.
                </p>
                <p className="mt-5 text-sm font-semibold tracking-[-0.01em] text-[#11131A]">
                  La IA prepara. Tu equipo decide.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <Link
                    to={PROCESS_EVALUATION_PAGE_HREF}
                    className="group inline-flex min-h-13 items-center justify-center gap-3 bg-[#11131A] px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#2D5BFF]"
                  >
                    Evaluar un proceso
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <a
                    href="#demo-contable"
                    onClick={() => trackDemoClick("premium_hero")}
                    className="group inline-flex min-h-13 items-center justify-center gap-3 border border-[#BEBAB0] bg-[#FCFCFA] px-6 text-sm font-semibold text-[#26282E] transition-colors duration-200 hover:border-[#777A84] hover:bg-white"
                  >
                    Explorar la demo
                    <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
                  </a>
                </div>

                <div className="mt-6 grid gap-2 text-[11px] text-[#62656D]">
                  {["Sin carga pública de archivos", "Piloto acotado antes de escalar"].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#1C806A]" aria-hidden="true" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 sm:mt-14 lg:mt-16">
              <InteractiveAccountingWorkspace />
            </div>
          </div>
        </section>

        <section aria-label="Contexto de adopción de inteligencia artificial" className="border-y border-[#2A2D38] bg-[#11131A] text-white">
          <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.72fr_0.72fr_1.56fr]">
            <div className="border-b border-white/10 px-5 py-8 sm:px-7 lg:border-b-0 lg:border-r lg:px-10 lg:py-10 xl:px-14">
              <p className="font-display text-5xl text-white sm:text-6xl">36%</p>
              <p className="mt-2 max-w-[14rem] text-xs leading-5 text-white/55">
                de los estudios relevados ya utiliza IA.
              </p>
            </div>
            <div className="border-b border-white/10 px-5 py-8 sm:px-7 lg:border-b-0 lg:border-r lg:px-10 lg:py-10 xl:px-14">
              <p className="font-display text-5xl text-white sm:text-6xl">76%</p>
              <p className="mt-2 max-w-[14rem] text-xs leading-5 text-white/55">
                espera reducir tareas administrativas.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-6 px-5 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-14">
              <p className="max-w-xl text-sm leading-6 text-white/68">
                La oportunidad no está en sumar una herramienta aislada. Está en convertir una tarea repetitiva
                en un proceso controlable, trazable y útil para el equipo.
              </p>
              <a
                href={reportUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-11 items-center gap-2 self-start text-[10px] font-semibold uppercase tracking-[0.1em] text-[#AEB7FF] transition-colors hover:text-white"
              >
                Informe Thomson Reuters Argentina 2025
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <LandingSections />
      </main>
      <SiteFooter />
    </div>
  );
}
