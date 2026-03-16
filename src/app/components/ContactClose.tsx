import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "../lib/contact";

export function ContactClose() {
  return (
    <section id="cierre" className="relative py-32 lg:py-40 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] -z-10 opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.10) 0%, transparent 70%)" }}
      />

      <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-10"
        >
          <div className="space-y-4">
            <h2 className="text-[2rem] md:text-[2.5rem] font-semibold tracking-tight text-foreground leading-[1.12]">
              ¿Tiene sentido hablar?
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Si algo de lo que leíste resonó, el siguiente paso es simple: revisá el diagnóstico de
              15 minutos y, si hace sentido, desde ahí podés agendar.
            </p>
          </div>

          <div className="w-full rounded-3xl border border-border/50 bg-white shadow-xl shadow-black/[0.04] p-8 lg:p-10 space-y-6">
            <div className="space-y-3 text-left">
              {[
                "Entiendo tu contexto comercial actual.",
                "Te marco la primera señal que conviene revisar.",
                "Te digo si tiene sentido avanzar o no.",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-[10px] font-bold text-accent/40 mt-0.5 w-4 flex-shrink-0 tabular-nums">
                    0{index + 1}
                  </span>
                  <span className="text-[0.92rem] text-foreground/70 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#contacto"
              className="group inline-flex w-full items-center justify-center gap-2 py-4 px-8 bg-foreground text-background font-medium rounded-full hover:bg-accent transition-all duration-300 hover:shadow-xl hover:shadow-accent/20"
            >
              Ver diagnóstico de 15 minutos
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>

            <p className="text-xs text-muted-foreground/50">
              Si preferís escribir primero, podés hacerlo a{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-muted-foreground/70 hover:text-accent underline underline-offset-2 transition-colors duration-200"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>

          <div className="w-full pt-2 border-t border-border/40 flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground/50">¿Buscás otros servicios?</p>
            <Link
              to="/servicios"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60 hover:text-accent transition-colors duration-200"
            >
              Ver todos los servicios
              <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
