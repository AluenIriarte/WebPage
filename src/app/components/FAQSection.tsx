import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "Ya tenemos reportes. ¿Esto agrega algo?",
    answer:
      "Sí. Si hoy los reportes muestran datos pero no priorizan decisiones, todavía falta una capa de lectura comercial accionable.",
  },
  {
    question: "No tenemos los datos perfectos. ¿Igual sirve?",
    answer:
      "Sí. Muchas veces el primer valor aparece ordenando lo que ya existe y definiendo qué conviene mirar primero.",
  },
  {
    question: "¿Necesito tener Power BI o una herramienta ya contratada?",
    answer:
      "No. La herramienta se define según el contexto. Primero importa la lectura de negocio y después la implementación.",
  },
  {
    question: "¿Esto es para cualquier negocio?",
    answer:
      "No. Tiene sentido sobre todo en negocios B2B o de gestión con cartera, recurrencia, margen y decisiones comerciales que necesitan más visibilidad.",
  },
  {
    question: "¿Cuánto tarda en verse una primera versión?",
    answer:
      "Depende del punto de partida, pero la prioridad es llegar rápido a una primera lectura útil, no esperar a tener un sistema perfecto.",
  },
  {
    question: "¿Cuándo no tiene sentido trabajar juntos?",
    answer:
      "Cuando no hay intención de usar los datos para decidir, cuando el problema todavía no duele o cuando no existe un caso comercial claro para priorizar.",
  },
  {
    question: "¿Qué sale de la reunión inicial?",
    answer:
      "Sale una lectura inicial del caso, las primeras prioridades visibles y una recomendación honesta sobre si conviene diagnóstico, cotización o no avanzar.",
  },
  {
    question: "¿Trabajás solo dashboards?",
    answer:
      "No. El dashboard suele ser una parte. También puedo ordenar datos, automatizar reporting y dejar alertas o vistas de seguimiento para gestión real.",
  },
];

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={{
          backgroundColor: isOpen ? "rgba(139,92,246,0.03)" : "rgba(255,255,255,1)",
          borderColor: isOpen ? "rgba(139,92,246,0.2)" : "rgba(0,0,0,0.07)",
        }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-2xl border"
      >
        <button onClick={onToggle} className="group flex w-full items-start gap-4 px-6 py-5 text-left">
          <span className="flex-1 text-base font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-accent">
            {faq.question}
          </span>

          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-0.5 flex-shrink-0"
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-200"
              style={{ background: isOpen ? "rgba(139,92,246,0.12)" : "rgba(0,0,0,0.05)" }}
            >
              <Plus
                className="h-3.5 w-3.5 transition-colors duration-200"
                style={{ color: isOpen ? "#8B5CF6" : "rgba(0,0,0,0.4)" }}
                strokeWidth={2.5}
              />
            </div>
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mx-6 h-px origin-left bg-gradient-to-r from-accent/30 via-accent/15 to-transparent"
              />
              <div className="px-6 pt-4 pb-6">
                <p className="text-[0.92rem] leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section id="faq" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(139,92,246,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px w-8 rounded-full bg-accent/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/70">
              Preguntas frecuentes
            </span>
            <div className="h-px w-8 rounded-full bg-accent/40" />
          </div>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Dudas normales antes de avanzar
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Objeciones reales, respondidas sin tecnicismos ni vueltas.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row"
        >
          <p className="text-center text-sm text-muted-foreground/60 sm:text-left">
            ¿Quedó alguna duda sin responder?
          </p>
          <a
            href="#contacto"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent/75"
          >
            Elegir el próximo paso
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
