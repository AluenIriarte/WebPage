import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, QUOTE_PAGE_HREF } from "../lib/contact";
import { trackDiagnosisClick, trackQuoteClick } from "../lib/analytics";

export function ContactClose() {
  return (
    <section id="cierre" className="relative overflow-hidden bg-[#F8F8F6] py-32 lg:py-40">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 opacity-60 blur-3xl"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-10"
        >
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
              <span className="text-xs font-semibold tracking-wide text-accent">Conversación inicial</span>
            </div>
            <h2 className="text-[2.4rem] font-semibold leading-[1.05] tracking-tight text-foreground md:text-[3.2rem]">
              ¿Tiene sentido hablar?
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Si algo de lo que leíste resonó, el siguiente paso es simple: podés revisar el
              diagnóstico de 15 minutos o, si ya sabés lo que querés, pedir presupuesto directo.
            </p>
          </div>

          <div className="w-full rounded-[2rem] border border-border/50 bg-white p-8 shadow-2xl shadow-black/[0.05] lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-5 text-left">
                {[
                  "Entiendo tu contexto comercial actual.",
                  "Te marco la primera señal que conviene revisar.",
                  "Te digo si conviene diagnóstico, servicio o presupuesto.",
                ].map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold tabular-nums text-accent">
                      0{index + 1}
                    </span>
                    <span className="text-[0.96rem] leading-relaxed text-foreground/75">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
              <a
                href="#contacto"
                onClick={() => trackDiagnosisClick("final_close")}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 font-medium text-background transition-all duration-300 hover:bg-accent hover:shadow-xl hover:shadow-accent/20"
              >
                Ver diagnóstico de 15 minutos
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <Link
                to={QUOTE_PAGE_HREF}
                onClick={() => trackQuoteClick("final_close")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:text-accent"
              >
                Pedir presupuesto
              </Link>
              </div>
            </div>

            <p className="mt-6 text-xs text-muted-foreground/50">
              Si preferís escribir primero, podés hacerlo a{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-muted-foreground/70 underline underline-offset-2 transition-colors duration-200 hover:text-accent"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>

          <div className="flex w-full items-center justify-between gap-4 border-t border-border/40 pt-2">
            <p className="text-xs text-muted-foreground/50">¿Buscás otros servicios?</p>
            <Link
              to="/servicios"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60 transition-colors duration-200 hover:text-accent"
            >
              Ver todos los servicios
              <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
