import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ContactClose() {
  const [form, setForm] = useState({ nombre: "", email: "", empresa: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.nombre || !form.email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  return (
    <section id="cierre" className="relative py-32 lg:py-40 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] -z-10 opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.10) 0%, transparent 70%)" }}
      />

      <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l4.5 4.5L16 6" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>

              <div className="space-y-2">
                <p className="text-xl font-semibold text-foreground tracking-tight">Listo, {form.nombre}.</p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Te escribo en menos de 24 horas para coordinar.
                </p>
              </div>

              <p className="text-xs text-muted-foreground/40 pt-2">
                Revisa tu bandeja, puede caer en spam la primera vez.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-10"
            >
              <div className="space-y-4">
                <h2 className="text-[2rem] md:text-[2.5rem] font-semibold tracking-tight text-foreground leading-[1.12]">
                  ¿Tiene sentido hablar?
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Si algo de lo que leíste resonó, el siguiente paso es simple. Dejá tus datos y te
                  escribo para agendar una primera conversación.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={(event) => setForm({ ...form, nombre: event.target.value })}
                    required
                    className="w-full px-4 py-3 text-sm bg-muted/40 border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-accent/40 focus:bg-white transition-all"
                  />
                  <input
                    type="email"
                    placeholder="tu@empresa.com"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    required
                    className="w-full px-4 py-3 text-sm bg-muted/40 border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-accent/40 focus:bg-white transition-all"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Empresa (opcional)"
                  value={form.empresa}
                  onChange={(event) => setForm({ ...form, empresa: event.target.value })}
                  className="w-full px-4 py-3 text-sm bg-muted/40 border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-accent/40 focus:bg-white transition-all"
                />

                <button
                  type="submit"
                  disabled={loading || !form.nombre || !form.email}
                  className="group w-full flex items-center justify-center gap-2 py-4 px-8 bg-foreground text-background font-medium rounded-full hover:bg-accent transition-all duration-300 hover:shadow-xl hover:shadow-accent/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <>
                      Quiero que me contacten
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-muted-foreground/45">
                O escribime directo a{" "}
                <a
                  href="mailto:alanlperez1996@gmail.com"
                  className="text-muted-foreground/70 hover:text-accent underline underline-offset-2 transition-colors duration-200"
                >
                  alanlperez1996@gmail.com
                </a>
              </p>

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
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
