import { ArrowDown, ArrowLeft, CalendarCheck2, Check, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { trackCalendlyClick, trackDemoClick } from "../lib/analytics";
import { CALENDLY_URL } from "../lib/contact";

export function EvaluationThankYou() {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <SiteHeader />
      <main className="paper-grid relative pb-20 pt-28 lg:pb-28 lg:pt-36">
        <div className="mx-auto max-w-6xl px-5 sm:px-7 lg:px-10">
          <div className="overflow-hidden border border-[#BEBAB0] bg-[#FCFCFA] shadow-[0_30px_90px_rgba(17,19,26,0.09)]">
            <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
              <section className="p-7 sm:p-10 lg:p-14">
                <span className="flex h-12 w-12 items-center justify-center border border-[#B8DCCF] bg-[#EDF8F3] text-[#127C68]">
                  <Check className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="mono-label mt-7 text-[10px] font-semibold uppercase text-[#127C68]">
                  Evaluación recibida
                </p>
                <h1 className="mt-5 max-w-2xl font-display text-5xl leading-[0.95] tracking-[-0.035em] text-[#11131A] sm:text-6xl">
                  Ya tenemos el contexto inicial.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-[#666870]">
                  El siguiente paso es revisar la información y conversar sobre el proceso. Si querés acelerar
                  la coordinación, podés reservar ahora una reunión privada.
                </p>

                <a
                  href="#agenda"
                  onClick={() => {
                    trackDemoClick("evaluation_thank_you");
                    trackCalendlyClick("evaluation_thank_you");
                  }}
                  className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 bg-[#11131A] px-7 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#2D5BFF]"
                >
                  Elegir un horario
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>

                <div className="mt-7">
                  <Link
                    to="/"
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#666870] transition-colors hover:text-[#11131A]"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Volver al inicio
                  </Link>
                </div>
              </section>

              <aside className="border-t border-[#2A2D38] bg-[#11131A] p-7 text-white sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
                <p className="mono-label text-[10px] font-semibold uppercase text-white/58">En la reunión</p>
                <div className="mt-7 space-y-6">
                  {[
                    {
                      icon: CalendarCheck2,
                      title: "Revisamos el proceso",
                      body: "Validamos si entendimos bien el volumen, las fuentes y el cuello de botella.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Mostramos la demo relevante",
                      body: "El recorrido se hace con datos ficticios y sin exponer información de terceros.",
                    },
                    {
                      icon: Check,
                      title: "Definimos si hay un piloto",
                      body: "Solo avanzamos si existe un alcance acotado, controlable y medible.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/12 bg-white/[0.04] text-[#8FE1C5]">
                        <item.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="text-sm font-semibold">{item.title}</h2>
                        <p className="mt-1.5 text-xs leading-5 text-white/52">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>

          <section id="agenda" className="mt-12 scroll-mt-24">
            <div className="mb-6 max-w-2xl">
              <p className="mono-label text-[10px] font-semibold uppercase text-[#334BC1]">Agenda privada</p>
              <h2 className="mt-4 font-display text-4xl leading-none text-[#11131A] sm:text-5xl">
                Elegí un horario para revisar el proceso.
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#666870]">
                La reserva se gestiona con Calendly. No hace falta enviar documentación antes de la reunión.
              </p>
            </div>
            <div className="overflow-hidden border border-[#BEBAB0] bg-[#FCFCFA]">
              <iframe
                title="Agenda para demo privada"
                src={`${CALENDLY_URL}?embed_type=Inline&hide_gdpr_banner=1&background_color=fcfcfa&text_color=11131a&primary_color=2d5bff`}
                className="h-[760px] w-full border-0"
                loading="lazy"
              />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
