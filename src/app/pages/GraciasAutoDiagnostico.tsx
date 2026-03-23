import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { DEMO_PAGE_HREF } from "../lib/contact";

type RequestState = {
  nombre?: string;
  email?: string;
  empresa?: string;
  recursoId?: string;
  recurso?: string;
  recursoHref?: string;
};

export function GraciasAutoDiagnostico() {
  const location = useLocation();
  const routeState = (location.state as RequestState | null) ?? null;

  let sessionState: RequestState | null = null;
  if (typeof window !== "undefined") {
    const stored = window.sessionStorage.getItem("leadmagnet_request");
    if (stored) {
      try {
        sessionState = JSON.parse(stored) as RequestState;
      } catch {
        sessionState = null;
      }
    }
  }

  const request = routeState ?? sessionState;
  const nombre = request?.nombre?.trim();
  const email = request?.email?.trim();
  const recurso = request?.recurso?.trim();

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
                  {nombre ? `Recibido, ${nombre}.` : "Recibido."}
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {email
                    ? `Te enviamos${recurso ? ` ${recurso}` : " el recurso"} a ${email}.`
                    : recurso
                      ? `Te enviamos ${recurso} por email.`
                      : "Tu solicitud ya quedó registrada."}
                </p>

                <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/70">
                  Mientras tanto, si querés ver un ejemplo concreto antes de hablar, mirá la demo.
                </p>

                <div className="mt-8">
                  <Link
                    to={DEMO_PAGE_HREF}
                    className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-accent"
                  >
                    Ver demo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
