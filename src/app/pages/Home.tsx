import { ArrowRight, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { AccountingPrototype } from "../components/AccountingPrototype";
import { LandingSections } from "../components/LandingSections";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { PROCESS_EVALUATION_PAGE_HREF } from "../lib/contact";

export function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <SiteHeader />
      <main>
        <section id="home" className="relative overflow-hidden pb-20 pt-32 lg:pb-28 lg:pt-40">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-[560px] bg-[linear-gradient(to_bottom,rgba(36,107,253,0.055),transparent)]" />
            <div className="absolute right-[-12rem] top-[-8rem] h-[34rem] w-[34rem] rounded-full border border-[#246BFD]/8" />
            <div className="absolute right-[-7rem] top-[-3rem] h-[24rem] w-[24rem] rounded-full border border-[#246BFD]/8" />
          </div>

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
              <div>
                <div className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#B9C9E8] bg-white px-3.5 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#2452A6]">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  IA aplicada a estudios contables
                </div>

                <h1 className="mt-7 max-w-2xl text-[2.7rem] font-semibold leading-[0.99] tracking-[-0.058em] text-foreground sm:text-6xl lg:text-[4.15rem]">
                  Cerrá más rápido sin perder el control contable.
                </h1>
                <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
                  Implementamos flujos privados que ordenan documentación, asisten el armado de balances y
                  convierten resúmenes bancarios en información lista para revisar.
                </p>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  La IA acelera. Tu equipo valida.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={PROCESS_EVALUATION_PAGE_HREF}
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-accent"
                  >
                    Evaluar un proceso
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a
                    href="#soluciones"
                    className="inline-flex min-h-14 items-center justify-center rounded-full border border-border bg-white px-7 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-[#AAB7C7] hover:bg-[#F2F4F6]"
                  >
                    Ver cómo funciona
                  </a>
                </div>

                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted-foreground">
                  {["Sin carga pública de archivos", "Demo privada guiada", "Piloto antes de escalar"].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#159A80]" aria-hidden="true" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <AccountingPrototype />
              </div>
            </div>

            <div className="mt-16 grid gap-4 border-t border-border pt-6 sm:grid-cols-3 lg:mt-20">
              {[
                {
                  icon: LockKeyhole,
                  label: "Entorno de demostración",
                  value: "Datos ficticios y acceso privado",
                },
                {
                  icon: ShieldCheck,
                  label: "Criterio profesional",
                  value: "Revisión humana en cada salida",
                },
                {
                  icon: ArrowRight,
                  label: "Primera implementación",
                  value: "Un proceso acotado y medible",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 py-2">
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="mono-label text-[9px] font-semibold uppercase text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-xs font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LandingSections />
      </main>
      <SiteFooter />
    </div>
  );
}
