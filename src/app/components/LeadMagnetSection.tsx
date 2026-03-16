import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowRight, Send, TrendingUp, BarChart2, Zap } from "lucide-react";

const signals = [
  { ok: true, text: "Los reportes muestran tendencias, no solo totales" },
  { ok: true, text: "El equipo identifica clientes en riesgo antes de perderlos" },
  { ok: false, text: "Hay visibilidad sobre margen por producto o categoria" },
  { ok: false, text: "Los datos guian reuniones comerciales semanales" },
  { ok: false, text: "Se puede medir el impacto de cada accion tomada" },
];

const benefits = [
  { icon: BarChart2, title: "Las 5 senales de visibilidad ciega", sub: "Como reconocerlas en tu operacion" },
  { icon: TrendingUp, title: "El test datos vs. decisiones reales", sub: "Una pregunta que lo revela todo" },
  { icon: Zap, title: "Plan de 30 dias para cerrar la brecha", sub: "Sin cambiar toda la infraestructura" },
];

const ACCENT = "#8B5CF6";

function PremiumGuideMockup() {
  return (
    <div className="relative select-none w-full max-w-[580px] mx-auto" style={{ perspective: "1800px" }}>
      <div
        className="absolute inset-0 -z-10 blur-[120px] opacity-[0.08] scale-90"
        style={{ background: `radial-gradient(ellipse at 50% 60%, ${ACCENT}, transparent 70%)` }}
      />

      <motion.div
        initial={{ rotateX: 8, rotateY: -12, y: 30, opacity: 0 }}
        whileInView={{ rotateX: 2, rotateY: -5, y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ background: "#D4D4D2", transform: "rotate(2deg) translateY(16px) translateX(14px)", opacity: 0.4 }}
        />
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ background: "#E2E2E0", transform: "rotate(0.8deg) translateY(8px) translateX(6px)", opacity: 0.6 }}
        />

        <div
          className="relative rounded-2xl overflow-hidden border border-black/[0.06] bg-white"
          style={{ boxShadow: "0 50px 100px -20px rgba(0,0,0,0.25), 0 25px 50px -12px rgba(0,0,0,0.1)" }}
        >
          <div className="grid md:grid-cols-[1fr_10px_1fr]">
            <div className="bg-[#101d31] text-white p-6 md:p-8">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center rounded-lg w-[26px] h-[26px] text-[9px] font-extrabold tracking-[0.04em]"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, rgba(139,92,246,0.8))" }}
                  >
                    BI
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/55">Alan L. Perez</span>
                    <span className="text-[8px] tracking-[0.06em] text-white/20">Business Intelligence</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[7px] uppercase tracking-[0.08em] text-white/35">Live</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[7.5px] font-semibold uppercase tracking-[0.15em] text-accent/80">
                    Dashboard ejecutivo
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <p className="text-[10px] text-white/35">Visibilidad comercial · Q1 2026</p>
              </div>

              <div className="rounded-xl border border-white/6 bg-white/4 p-3">
                <div className="grid grid-cols-8 gap-2 h-28 items-end">
                  {[28, 42, 35, 55, 48, 72, 65, 85].map((value, index) => (
                    <div
                      key={index}
                      className={`rounded-t-md ${index >= 6 ? "bg-accent/80" : "bg-white/10"}`}
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[
                    { label: "Crecimiento", value: "+34%", color: "#34D399" },
                    { label: "Senales", value: "2 / 5", color: "#FBBF24" },
                    { label: "Tiempo", value: "10 min", color: ACCENT },
                  ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-white/8 bg-white/5 px-2 py-3 text-center">
                      <span className="block text-sm font-bold" style={{ color: kpi.color }}>
                        {kpi.value}
                      </span>
                      <span className="block text-[7.5px] uppercase tracking-[0.08em] text-white/30 mt-1">
                        {kpi.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden md:block bg-gradient-to-r from-black/25 via-white/10 to-black/10" />

            <div className="bg-[#fcfcfa] p-6 md:p-8">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-black/35">Diagnostico</p>
                  <p className="text-[9px] text-black/40 mt-1 leading-relaxed">Tenes datos o<br />visibilidad real?</p>
                </div>
                <div className="w-12 h-12 rounded-full border-[6px] border-accent/20 border-t-accent flex items-center justify-center text-accent text-xs font-bold">
                  3/5
                </div>
              </div>

              <div className="h-px mb-4 bg-black/8" />

              <div className="space-y-3">
                {signals.map((signal) => (
                  <div key={signal.text} className="flex items-start gap-2.5">
                    <div
                      className={`w-4 h-4 mt-0.5 rounded-full flex items-center justify-center ${signal.ok ? "bg-accent text-white" : "border border-black/10 text-black/20"}`}
                    >
                      {signal.ok ? <Check className="w-2.5 h-2.5" strokeWidth={3} /> : <span className="w-2 h-[2px] rounded bg-black/20" />}
                    </div>
                    <p
                      className={`text-[9.5px] leading-[1.35] ${signal.ok ? "text-black/65 font-semibold" : "text-black/25 line-through"}`}
                    >
                      {signal.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl p-4 border border-accent/15 bg-accent/5">
                <div className="flex items-center gap-3">
                  <span className="text-[28px] leading-none font-bold text-accent">3/5</span>
                  <div className="w-px h-8 bg-accent/20" />
                  <div>
                    <p className="text-[9.5px] font-semibold text-black/55">Senales sin activar</p>
                    <p className="text-[8px] text-black/35">en tu equipo hoy</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className={`flex-1 h-2 rounded-full ${index <= 2 ? "bg-accent" : "bg-accent/10"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 5 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -top-4 -right-4 z-20 rounded-xl text-center px-4 py-3 text-white"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 12px 32px rgba(139,92,246,0.45)" }}
          >
            <p className="text-[10px] font-extrabold tracking-[0.1em] leading-[1.25]">RECURSO<br />GRATUITO</p>
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
              <span className="text-[9px] font-semibold text-white/85">$0</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

type FormState = "idle" | "form" | "success";

function FormBlock() {
  const [state, setState] = useState<FormState>("idle");
  const [fields, setFields] = useState({ nombre: "", email: "", empresa: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setState("success");
    }, 1200);
  };

  const inputClassName =
    "w-full px-4 py-2.5 rounded-xl border border-black/[0.1] bg-white text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:border-transparent transition-all";
  const labelClassName = "text-[11px] font-medium mb-1 block text-foreground/45";

  return (
    <AnimatePresence mode="wait">
      {state === "idle" && (
        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 items-start">
          <button
            onClick={() => setState("form")}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-[14px] text-white group transition-all"
            style={{ background: ACCENT, boxShadow: "0 4px 20px rgba(139,92,246,0.45)" }}
          >
            Descargar guia gratuita
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a href="#contacto" className="text-[13px] font-medium transition-colors pl-1 text-foreground/40 hover:text-foreground/70">
            Prefiero hablar directamente →
          </a>
          <p className="text-[11px] pl-1 text-foreground/30">
            Sin spam. Solo contenido de valor para equipos comerciales.
          </p>
        </motion.div>
      )}

      {state === "form" && (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-2.5 max-w-[340px]"
        >
          <p className="text-[15px] font-semibold text-foreground">A donde te la enviamos?</p>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            {[
              { id: "nombre", label: "Nombre", type: "text", ph: "Tu nombre" },
              { id: "email", label: "Email de trabajo", type: "email", ph: "tu@empresa.com" },
              { id: "empresa", label: "Empresa", type: "text", ph: "Nombre de tu empresa" },
            ].map((field) => (
              <div key={field.id}>
                <span className={labelClassName}>{field.label}</span>
                <input
                  type={field.type}
                  required
                  placeholder={field.ph}
                  value={fields[field.id as keyof typeof fields]}
                  onChange={(event) =>
                    setFields((previous) => ({ ...previous, [field.id]: event.target.value }))
                  }
                  className={inputClassName}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-60 mt-1 transition-all"
              style={{ background: ACCENT }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Enviarme la guia
                </>
              )}
            </button>
            <button type="button" onClick={() => setState("idle")} className="text-xs py-1 transition-colors text-foreground/35 hover:text-foreground/65">
              ← Volver
            </button>
          </form>
        </motion.div>
      )}

      {state === "success" && (
        <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4 max-w-[300px]">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: `${ACCENT}15` }}>
            <Check className="w-5 h-5" style={{ color: ACCENT }} />
          </div>
          <div>
            <p className="text-[17px] font-semibold text-foreground">En camino</p>
            <p className="text-sm mt-1 leading-relaxed text-foreground/50">
              Revisa <strong className="text-foreground/80">{fields.email}</strong> en los proximos minutos.
            </p>
          </div>
          <a href="#cierre" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white w-fit" style={{ background: ACCENT }}>
            Coordinemos una conversacion →
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LeadMagnetSection() {
  return (
    <section id="recurso" className="bg-[#F8F8F6]">
      <div className="border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-14 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-5"
          >
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#8B5CF6]/[0.06] border border-[#8B5CF6]/15 w-fit"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
              <span className="text-[13px] text-[#8B5CF6] font-medium">
                El 80% de los equipos comerciales decide con datos incompletos.
              </span>
            </motion.div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B5CF6]">Recurso gratuito</span>
              <div className="h-px flex-1 bg-[#8B5CF6]/20 max-w-[60px]" />
            </div>
            <h2 className="text-[44px] lg:text-[68px] font-semibold text-foreground leading-[1.02] tracking-tight max-w-[900px]">
              Guia practica de senales
              <br />
              <span className="text-[#8B5CF6]">de alto impacto.</span>
            </h2>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-14 lg:py-20">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <PremiumGuideMockup />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <p className="text-[15px] text-foreground/55 leading-relaxed max-w-[380px]">
              Una guia ejecutiva para saber si tu equipo esta mirando los datos correctos o solo los disponibles.
              En 10 minutos sabes exactamente donde esta tu brecha.
            </p>

            <div className="flex flex-col gap-2.5">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center mt-0.5">
                    <benefit.icon className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground/85">{benefit.title}</p>
                    <p className="text-[11.5px] text-foreground/45">{benefit.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-black/[0.06]" />
            <FormBlock />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
