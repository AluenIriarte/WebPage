import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "Ya tenemos reportes. ¿Esto agrega algo?",
    answer:
      "Sí, si hoy tus reportes muestran datos pero no priorizan decisiones. El objetivo no es tener más tableros, sino ver antes dónde intervenir.",
  },
  {
    question: "No tenemos los datos perfectos. ¿Igual sirve?",
    answer:
      "Sí. Muchas veces el primer valor aparece ordenando lo que ya existe y definiendo qué conviene mirar.",
  },
  {
    question: "¿Esto es para cualquier negocio?",
    answer:
      "Tiene sentido cuando hay volumen comercial, recurrencia o cartera para analizar. El tamaño importa menos que la complejidad del negocio.",
  },
  {
    question: "¿Cuándo no tiene sentido trabajar juntos?",
    answer:
      "Cuando no hay intención de usar datos para decidir, cuando el problema todavía no duele o cuando no existe un caso comercial claro para priorizar.",
  },
  {
    question: "¿Qué sale de la reunión inicial?",
    answer:
      "Una lectura inicial del caso, la primera señal que conviene mirar y una recomendación honesta sobre si vale la pena avanzar.",
  },
  {
    question: "¿Trabajás solo dashboards?",
    answer:
      "No. El dashboard suele ser una parte. También puedo ordenar datos, automatizar reporting y dejar alertas o vistas de seguimiento.",
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
        className="rounded-2xl border overflow-hidden"
      >
        <button onClick={onToggle} className="w-full flex items-start gap-4 px-6 py-5 text-left group">
          <span className="flex-1 text-base font-semibold text-foreground leading-snug group-hover:text-accent transition-colors duration-200">
            {faq.question}
          </span>

          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 mt-0.5"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{ background: isOpen ? "rgba(139,92,246,0.12)" : "rgba(0,0,0,0.05)" }}
            >
              <Plus
                className="w-3.5 h-3.5 transition-colors duration-200"
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
                className="mx-6 h-px bg-gradient-to-r from-accent/30 via-accent/15 to-transparent origin-left"
              />
              <div className="px-6 pt-4 pb-6">
                <p className="text-[0.92rem] text-muted-foreground leading-relaxed">{faq.answer}</p>
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
    <section id="faq" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(139,92,246,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-3xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent/40 rounded-full" />
            <span className="text-[11px] font-semibold text-accent/70 uppercase tracking-[0.14em]">
              Preguntas frecuentes
            </span>
            <div className="h-px w-8 bg-accent/40 rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Las objeciones que aparecen
            <br className="hidden md:block" /> antes de avanzar
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Sin tecnicismos. Sin compromisos. Solo respuestas directas.
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
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/40"
        >
          <p className="text-sm text-muted-foreground/60 text-center sm:text-left">
            ¿Quedó alguna duda sin responder?
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/75 transition-colors duration-200 group"
          >
            Hablemos
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
