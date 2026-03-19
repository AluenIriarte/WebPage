import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, BarChart3, ClipboardCheck, FileText, MessageSquareMore } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import publishingKitPdf from "../../../assets/docs/Publishing Kit - PDF (17).pdf";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  DEMO_PAGE_HREF,
  ROOT_DIAGNOSTIC_SECTION_HREF,
  ROOT_MINI_CASES_SECTION_HREF,
} from "../lib/contact";
import { trackGuideClick } from "../lib/analytics";

const nextSteps = [
  {
    icon: BarChart3,
    title: "Ver demo real",
    description: "Si querés algo tangible antes de hablar, esta es la mejor forma de ver cómo se traduce en vistas y señales concretas.",
    href: DEMO_PAGE_HREF,
    internal: true,
  },
  {
    icon: MessageSquareMore,
    title: "Agendar diagnóstico",
    description: "Si ya querés revisar tu caso, esta es la salida más directa para avanzar con contexto real.",
    href: ROOT_DIAGNOSTIC_SECTION_HREF,
    internal: false,
  },
  {
    icon: FileText,
    title: "Ver caso aplicado",
    description: "Si preferís seguir entendiendo cómo aterriza esto en negocio, acá tenés un caso corto para verlo más claro.",
    href: ROOT_MINI_CASES_SECTION_HREF,
    internal: false,
  },
];

type RequestState = {
  nombre?: string;
  email?: string;
  empresa?: string;
  recurso?: string;
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

          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[2rem] border border-border/50 bg-white p-8 shadow-2xl shadow-black/[0.04] lg:p-10"
            >
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                  <ClipboardCheck className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-semibold tracking-wide text-accent">
                    Recurso solicitado
                  </span>
                </div>
                <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
                  {nombre ? `${nombre}, ya tenés el siguiente paso listo.` : "Ya tenés el siguiente paso listo."}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {email
                    ? `Tomé tu pedido con ${email}. Mientras cerramos la entrega automática por email, podés abrir el recurso ahora y seguir por uno de estos caminos.`
                    : "Ya quedó pedido tu recurso. Mientras cerramos la entrega automática por email, podés abrirlo ahora y seguir por uno de estos caminos."}
                </p>
                {recurso ? (
                  <p className="mt-3 text-sm font-medium text-foreground/70">
                    Recurso solicitado: {recurso}
                  </p>
                ) : null}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href={publishingKitPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackGuideClick("thank_you_page", "publishing_kit_pdf")}
                  className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Abrir el recurso ahora
                </a>
              </div>
            </motion.div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {nextSteps.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="flex h-full flex-col rounded-3xl border border-border/50 bg-white p-7 shadow-sm shadow-black/[0.03]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
                    <item.icon className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">{item.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

                  {item.internal ? (
                    <Link
                      to={item.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/75"
                    >
                      Ir ahora
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/75"
                    >
                      Ir ahora
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
