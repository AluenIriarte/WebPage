import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, TrendingUp, Users } from "lucide-react";
import { DEMO_PAGE_HREF, QUOTE_PAGE_HREF } from "../lib/contact";
import { trackDiagnosisClick, trackEvent, trackQuoteClick } from "../lib/analytics";
import { HomeHeroPreview } from "./HomeHeroPreview";

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
                {"Dashboards comerciales a medida"}
              </span>
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[3.25rem]">
                {"Convert\u00ed tus datos de ventas "}
                <span className="text-accent">{"en ingresos"}</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {
                  "Dise\u00f1o sistemas de decisi\u00f3n comercial para que veas qu\u00e9 clientes se enfr\u00edan, d\u00f3nde cede el margen y d\u00f3nde hay expansi\u00f3n real por capturar."
                }
              </p>
              <p className="max-w-2xl text-sm leading-relaxed text-foreground/75 md:text-base">
                {
                  "Dashboards de ventas y BI comercial a medida para equipos que necesitan visibilidad sobre cartera, margen y expansi\u00f3n."
                }
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contacto"
                  onClick={() => trackDiagnosisClick("hero")}
                  className="group inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-medium text-accent-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/25"
                >
                  {"Agendar diagn\u00f3stico"}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>

                <Link
                  to={DEMO_PAGE_HREF}
                  onClick={() => trackEvent("demo_click", { source: "hero" })}
                  className="group inline-flex items-center justify-center rounded-full border border-border bg-white px-8 py-4 text-base font-medium transition-all duration-300 hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
                >
                  {"Ver demo"}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="pl-1">
                <Link
                  to={QUOTE_PAGE_HREF}
                  onClick={() => trackQuoteClick("hero")}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-200 hover:text-accent/75"
                >
                  {"\u00bfYa sab\u00e9s lo que quer\u00e9s? Ped\u00ed cotizaci\u00f3n"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="border-t border-border/50 pt-6">
              <div className="flex flex-wrap gap-5">
                {[
                  { icon: Users, text: "Diagn\u00f3stico inicial de 15 minutos" },
                  { icon: BarChart3, text: "Prioridades visibles en semanas" },
                  { icon: TrendingUp, text: "Trabajo confidencial y aplicado al negocio" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4 text-accent/60" />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-4 px-4 lg:mt-0 lg:px-0">
            <div className="mb-5 flex flex-wrap gap-2 lg:hidden">
              {[
                { color: "bg-violet-50 border-violet-100 text-violet-700", text: "12 clientes inactivos +90d" },
                { color: "bg-emerald-50 border-emerald-100 text-emerald-700", text: "+34% potencial cross-sell" },
                { color: "bg-amber-50 border-amber-100 text-amber-700", text: "Margen erosionado detectado" },
              ].map((pill) => (
                <span
                  key={pill.text}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold ${pill.color}`}
                >
                  {pill.text}
                </span>
              ))}
            </div>

            <HomeHeroPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
