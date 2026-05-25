import { ArrowRight, BarChart3, TrendingUp, Users } from "lucide-react";
import { trackCalendlyClick, trackDiagnosisClick, trackEvent } from "../lib/analytics";
import { CALENDLY_URL } from "../lib/contact";
import { InteractiveDashboard } from "./HeroDashboard";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pb-24 pt-32 lg:pb-36 lg:pt-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 right-0 top-0 h-[600px] bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent" />
        <div className="absolute right-0 top-20 h-[600px] w-[600px] rounded-full bg-gradient-to-l from-accent/[0.04] to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
              <BarChart3 className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-semibold tracking-wide text-accent">
                Dashboards comerciales a medida
              </span>
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[3.25rem]">
                ¿Estás perdiendo clientes, margen u oportunidades{" "}
                <span className="text-accent">sin verlo a tiempo?</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Convertí tus datos de ventas en un tablero comercial para detectar clientes que se enfrían,
                margen que cede, vendedores fuera de objetivo y oportunidades reales por capturar.
              </p>
              <p className="max-w-2xl text-sm leading-relaxed text-foreground/75 md:text-base">
                Para empresas B2B que necesitan visibilidad sobre cartera, objetivos, margen y expansión.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={CALENDLY_URL}
                  onClick={() => {
                    trackDiagnosisClick("hero_primary");
                    trackCalendlyClick("hero_primary");
                  }}
                  className="group inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-medium text-accent-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/25"
                >
                  Solicitar diagnóstico comercial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>

                <a
                  href="#demo"
                  onClick={() => trackEvent("hero_demo_click", { target: "demo" })}
                  className="group inline-flex items-center justify-center rounded-full border border-border bg-white px-8 py-4 text-base font-medium text-foreground transition-all duration-300 hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
                >
                  Ver mini demo
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pl-1 pt-1">
                {[
                  { icon: Users, text: "Diagnóstico inicial de 15 minutos" },
                  { icon: BarChart3, text: "Prioridades visibles en semanas" },
                  { icon: TrendingUp, text: "Trabajo confidencial y aplicado al negocio" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-1.5 text-[0.82rem] text-muted-foreground/72">
                    <item.icon className="h-3.5 w-3.5 text-accent/45" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div id="demo" className="relative mt-4 scroll-mt-28 px-4 lg:mt-0 lg:px-0">
            <div className="mb-5 flex flex-wrap gap-2 lg:hidden">
              {[
                { color: "bg-rose-50 border-rose-100 text-rose-700", text: "12 cuentas en riesgo" },
                { color: "bg-violet-50 border-violet-100 text-violet-700", text: "3 zonas bajo objetivo" },
                { color: "bg-amber-50 border-amber-100 text-amber-700", text: "-4 pts de margen" },
                { color: "bg-emerald-50 border-emerald-100 text-emerald-700", text: "$890K expansión" },
              ].map((pill) => (
                <span
                  key={pill.text}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold ${pill.color}`}
                >
                  {pill.text}
                </span>
              ))}
            </div>

            <InteractiveDashboard variant="mini" animated={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
