import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { QUOTE_PAGE_HREF } from "../lib/contact";
import { trackDiagnosisClick, trackQuoteClick } from "../lib/analytics";

export function ContactClose() {
  return (
    <section id="cierre" className="relative overflow-hidden bg-[#F8F8F6] py-32 lg:py-40">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 opacity-60 blur-3xl"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[2rem] border border-border/50 bg-white p-8 shadow-2xl shadow-black/[0.05] lg:p-12"
        >
          <div className="mx-auto max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
              <span className="text-xs font-semibold tracking-wide text-accent">Cierre</span>
            </div>

            <h2 className="text-[2.4rem] font-semibold leading-[1.05] tracking-tight text-foreground md:text-[3.2rem]">
              {"Si tiene sentido avanzar, el siguiente paso es simple."}
            </h2>

            <p className="text-lg leading-relaxed text-muted-foreground">
              {
                "Con el diagnóstico alcanza para bajar tu caso a una primera lectura seria y definir si vale la pena avanzar."
              }
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <a
              href="#contacto"
              onClick={() => trackDiagnosisClick("final_close")}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 font-medium text-background transition-all duration-300 hover:bg-accent hover:shadow-xl hover:shadow-accent/20"
            >
              {"Agendar diagnóstico"}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>

            <p className="text-sm text-muted-foreground">
              {"¿Ya tenés claro lo que buscás? "}
              <Link
                to={QUOTE_PAGE_HREF}
                onClick={() => trackQuoteClick("final_close")}
                className="font-medium text-accent transition-colors hover:text-accent/75"
              >
                {"Pedí cotización"}
              </Link>
              {"."}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
