import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { QUOTE_PAGE_HREF, ROOT_DIAGNOSTIC_SECTION_HREF } from "../lib/contact";

type QuoteRequestState = {
  nombre?: string;
  email?: string;
  empresa?: string;
  producto?: string;
};

export function GraciasPresupuestoDashboard() {
  const location = useLocation();
  const routeState = (location.state as QuoteRequestState | null) ?? null;

  let sessionState: QuoteRequestState | null = null;
  if (typeof window !== "undefined") {
    const stored = window.sessionStorage.getItem("quote_request");
    if (stored) {
      try {
        sessionState = JSON.parse(stored) as QuoteRequestState;
      } catch {
        sessionState = null;
      }
    }
  }

  const request = routeState ?? sessionState;
  const nombre = request?.nombre?.trim();
  const email = request?.email?.trim();
  const empresa = request?.empresa?.trim();
  const producto = request?.producto?.trim();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden pb-20 pt-32 lg:pb-28 lg:pt-40">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-0 right-0 top-0 h-[460px] bg-gradient-to-b from-accent/[0.05] via-transparent to-transparent" />
          </div>

          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[2rem] border border-border/50 bg-white p-8 shadow-2xl shadow-black/[0.04] lg:p-12"
            >
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                  <ClipboardCheck className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-semibold tracking-wide text-accent">
                    Solicitud recibida
                  </span>
                </div>

                <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
                  {nombre ? `Recibido, ${nombre}.` : "Solicitud enviada."}
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {email
                    ? `Te confirmamos por email en ${email} que el brief entro correctamente.`
                    : "Te confirmamos por email que el brief entro correctamente."}
                </p>

                <div className="mt-6 space-y-3 text-base leading-relaxed text-foreground/72">
                  <p>Revisa tu inbox y tambien spam o promociones por si la confirmacion cae ahi.</p>
                  <p>Reviso el caso y te respondo en las proximas 24 horas con una primera lectura de alcance.</p>
                  {producto || empresa ? (
                    <p className="text-sm text-muted-foreground">
                      {producto ? `Servicio: ${producto}. ` : ""}
                      {empresa ? `Empresa: ${empresa}.` : ""}
                    </p>
                  ) : null}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={ROOT_DIAGNOSTIC_SECTION_HREF}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                  >
                    Agendar diagnostico
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to={QUOTE_PAGE_HREF}
                    className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                  >
                    Volver al brief
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
