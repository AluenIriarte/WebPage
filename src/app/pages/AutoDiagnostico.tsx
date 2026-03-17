import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, CircleOff, Layers3, Radar, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  AUTO_DIAGNOSTIC_THANKYOU_HREF,
  QUOTE_PAGE_HREF,
  ROOT_DIAGNOSTIC_SECTION_HREF,
  SERVICES_PAGE_HREF,
} from "../lib/contact";

type ScoreValue = 0 | 1 | 2;

const answersScale: { label: string; value: ScoreValue }[] = [
  { label: "Sí", value: 2 },
  { label: "A medias", value: 1 },
  { label: "No", value: 0 },
];

const questions = [
  "¿Podés detectar clientes o cuentas en riesgo antes de perderlas?",
  "¿Ves margen o rentabilidad por producto, categoría o canal sin trabajo manual extra?",
  "¿Tus reuniones comerciales usan una lectura semanal clara, no solo reportes sueltos?",
  "¿Sabés dónde hay expansión real por capturar dentro de la cartera actual?",
  "¿Podés distinguir rápido qué señales requieren acción comercial y cuáles solo ruido?",
  "¿El equipo tiene visibilidad consistente sin depender de archivos dispersos o armado manual?",
];

function getResult(score: number, maxScore: number) {
  const ratio = score / maxScore;

  if (ratio >= 0.72) {
    return {
      icon: CheckCircle2,
      tone: "emerald",
      title: "Ya hay base para operar con criterio",
      description:
        "No parece faltar todo. Lo más probable es que convenga ordenar foco, elevar algunas señales y refinar el sistema.",
      recommendation: "El mejor siguiente paso suele ser revisar servicios o ver una demo más completa.",
    };
  }

  if (ratio >= 0.4) {
    return {
      icon: Radar,
      tone: "violet",
      title: "Hay visibilidad parcial, pero todavía no alcanza",
      description:
        "Seguramente ya existen datos y reportes, pero todavía no están traducidos a prioridades claras para el equipo comercial.",
      recommendation:
        "Acá conviene ver demo o pedir un diagnóstico para detectar qué señal vale atacar primero.",
    };
  }

  return {
    icon: TriangleAlert,
    tone: "amber",
    title: "Hoy decidís con muchas zonas ciegas",
    description:
      "Lo más probable es que el problema no sea falta total de datos, sino ausencia de una capa útil de lectura y priorización.",
    recommendation:
      "Acá suele tener sentido avanzar por diagnóstico o, si ya tenés alcance en mente, pedir presupuesto.",
  };
}

export function AutoDiagnostico() {
  const [answers, setAnswers] = useState<(ScoreValue | null)[]>(() => questions.map(() => null));

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const answeredCount = answers.filter((value) => value !== null).length;
  const score = answers.reduce((sum, current) => sum + (current ?? 0), 0);
  const maxScore = questions.length * 2;
  const completed = answeredCount === questions.length;
  const result = useMemo(() => getResult(score, maxScore), [maxScore, score]);
  const progress = Math.round((answeredCount / questions.length) * 100);
  const resultToneClass =
    result.tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : result.tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-accent/15 bg-accent/6 text-accent";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden pb-16 pt-32 lg:pb-24 lg:pt-40">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-0 right-0 top-0 h-[520px] bg-gradient-to-b from-accent/[0.05] via-transparent to-transparent" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-7"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
                  <Radar className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-semibold tracking-wide text-accent">
                    Auto-diagnóstico comercial
                  </span>
                </div>

                <div className="space-y-5">
                  <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-[3.2rem]">
                    Evaluá si hoy tu equipo decide con visibilidad real
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    Respondiendo estas preguntas podés ubicar rápido si hoy te falta lectura sobre
                    cartera, margen, expansión o foco comercial.
                  </p>
                  <p className="max-w-3xl text-base leading-relaxed text-foreground/70">
                    No reemplaza un diagnóstico, pero sí te deja una primera lectura seria para
                    elegir mejor si te conviene ver demo, servicios, presupuesto o una conversación.
                  </p>
                </div>

                <div className="rounded-3xl border border-border/50 bg-white p-6 shadow-xl shadow-black/[0.03]">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Progreso</p>
                      <p className="text-xs text-muted-foreground">
                        {answeredCount} de {questions.length} preguntas respondidas
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-accent">{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/70">
                    <motion.div
                      className="h-2 rounded-full bg-accent"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.aside
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="lg:sticky lg:top-28"
              >
                <div className="rounded-3xl border border-border/50 bg-white p-8 shadow-2xl shadow-black/[0.04]">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
                    Lectura actual
                  </p>
                  <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${resultToneClass}`}>
                    <result.icon className="h-3.5 w-3.5" />
                    Resultado dinámico
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">{result.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{result.description}</p>

                  <div className="mt-6 rounded-2xl bg-muted/25 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                      Score
                    </p>
                    <div className="mt-2 flex items-end gap-3">
                      <span className="text-4xl font-semibold tracking-tight text-foreground">{score}</span>
                      <span className="pb-1 text-sm text-muted-foreground">/ {maxScore}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/72">{result.recommendation}</p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link
                      to={AUTO_DIAGNOSTIC_THANKYOU_HREF}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-colors ${
                        completed
                          ? "bg-accent text-white hover:bg-accent/90"
                          : "pointer-events-none bg-muted text-muted-foreground"
                      }`}
                    >
                      Ver próximos pasos
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to={SERVICES_PAGE_HREF}
                      className="inline-flex w-full items-center justify-center rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                    >
                      Ver servicios
                    </Link>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>

        <section className="pb-20 lg:pb-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-5">
              {questions.map((question, index) => (
                <motion.article
                  key={question}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="rounded-3xl border border-border/50 bg-white p-6 shadow-sm shadow-black/[0.02] lg:p-7"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-3xl">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
                        Pregunta 0{index + 1}
                      </p>
                      <h3 className="text-lg font-semibold leading-snug text-foreground">{question}</h3>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {answersScale.map((option) => {
                        const selected = answers[index] === option.value;
                        return (
                          <button
                            key={option.label}
                            onClick={() =>
                              setAnswers((previous) =>
                                previous.map((value, currentIndex) =>
                                  currentIndex === index ? option.value : value,
                                ),
                              )
                            }
                            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                              selected
                                ? "border-accent bg-accent text-white"
                                : "border-border bg-white text-muted-foreground hover:border-accent/35 hover:text-accent"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55 }}
              className="mt-12 rounded-[2rem] bg-foreground p-8 text-background lg:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                    Cuando termines
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-white">
                    Elegí el siguiente paso según tu punto de partida
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
                    Si todavía estás comparando, servicios y demo te ordenan. Si ya sabés que querés
                    resolver, presupuesto o diagnóstico te llevan más directo.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a
                    href={ROOT_DIAGNOSTIC_SECTION_HREF}
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-white"
                  >
                    Solicitar diagnóstico
                  </a>
                  <Link
                    to={QUOTE_PAGE_HREF}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
                  >
                    Pedir presupuesto
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
