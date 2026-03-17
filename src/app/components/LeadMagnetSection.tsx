import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, ClipboardList, Radar } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AUTO_DIAGNOSTIC_PAGE_HREF,
  SERVICES_PAGE_HREF,
} from "../lib/contact";

const questionsPreview = [
  "¿Podés detectar clientes en riesgo antes de perderlos?",
  "¿Ves margen por producto, categoría o canal?",
  "¿Las reuniones comerciales trabajan con datos útiles y actuales?",
  "¿Tenés claro dónde hay expansión real por capturar?",
];

const outcomes = [
  {
    icon: ClipboardList,
    title: "Te ordena la lectura",
    description: "En lugar de bajar por intuición, te marca qué conviene revisar primero.",
  },
  {
    icon: Radar,
    title: "Te muestra brechas",
    description: "Separa rápido si hoy el problema es de visibilidad, de foco o de operación.",
  },
  {
    icon: CheckCircle2,
    title: "Te deja un siguiente paso",
    description: "No termina en un score vacío: te deriva a demo, servicios o diagnóstico.",
  },
];

export function LeadMagnetSection() {
  return (
    <section id="recurso" className="bg-[#F8F8F6] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div
              className="absolute inset-0 -z-10 rounded-[2rem] opacity-60 blur-3xl"
              style={{ background: "radial-gradient(circle at 30% 30%, rgba(139,92,246,0.18), transparent 65%)" }}
            />

            <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-2xl shadow-black/[0.04]">
              <div className="border-b border-border/40 px-7 py-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent/60">
                  Auto-diagnóstico guiado
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  En 3 minutos podés saber si hoy estás viendo o suponiendo.
                </h3>
              </div>

              <div className="space-y-4 px-7 py-7">
                {questionsPreview.map((question, index) => (
                  <div key={question} className="rounded-2xl border border-border/50 bg-muted/25 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium leading-relaxed text-foreground/80">{question}</p>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/45">
                        0{index + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["Sí", "A medias", "No"].map((option) => (
                        <div
                          key={option}
                          className={`rounded-full px-3 py-2 text-center text-[11px] font-medium ${
                            option === "A medias"
                              ? "border border-accent/25 bg-accent/7 text-accent"
                              : "border border-border/50 text-muted-foreground"
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border border-accent/15 bg-accent/6 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/70">
                    Resultado
                  </p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    Lectura inicial para saber si hoy conviene demo, servicios o diagnóstico.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="space-y-7"
          >
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent/60">
                Recurso autoguiado
              </p>
              <h2 className="text-3xl font-semibold leading-[1.06] tracking-tight text-foreground md:text-4xl lg:text-5xl">
                Si todavía no querés hablar, podés empezar por un{" "}
                <span className="text-accent">auto-diagnóstico ejecutivo</span>
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Este bloque reemplaza al lead magnet genérico por una experiencia más útil: te deja
                recorrer las señales clave, entender qué te falta ver y elegir el siguiente paso con
                más criterio.
              </p>
            </div>

            <div className="space-y-4">
              {outcomes.map((item) => (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-border/50 bg-white p-5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/10">
                    <item.icon className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={AUTO_DIAGNOSTIC_PAGE_HREF}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
              >
                Hacer auto-diagnóstico
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to={SERVICES_PAGE_HREF}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
              >
                Prefiero ver servicios
              </Link>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground/75">
              Después lo podemos convertir en un activo descargable y conectarlo a email. Por ahora,
              queda como ruta real de auto-guía dentro de la web.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
