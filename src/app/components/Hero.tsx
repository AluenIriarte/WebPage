import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, BarChart3, TrendingUp, Users } from "lucide-react";
import {
  DEMO_PAGE_HREF,
  QUOTE_PAGE_HREF,
  SERVICES_PAGE_HREF,
} from "../lib/contact";
import { InteractiveDashboard } from "./HeroDashboard";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pb-24 pt-32 lg:pb-36 lg:pt-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 right-0 top-0 h-[600px] bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent" />
        <div className="absolute right-0 top-20 h-[600px] w-[600px] rounded-full bg-gradient-to-l from-accent/[0.04] to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex items-center space-x-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2"
            >
              <BarChart3 className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-semibold tracking-wide text-accent">
                Dashboards comerciales a medida
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="space-y-5"
            >
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[3.25rem]">
                Convertí tus datos de ventas <span className="text-accent">en ingresos</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Diseño sistemas de decisión comercial para que veas qué clientes se enfrían, dónde
                cede el margen y dónde hay expansión real por capturar.
              </p>
              <p className="max-w-2xl text-sm leading-relaxed text-foreground/75 md:text-base">
                Dashboards de ventas y BI comercial a medida para equipos que necesitan visibilidad
                sobre cartera, margen y expansión.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contacto"
                  className="group inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-medium text-accent-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/25"
                >
                  Solicitar diagnóstico
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
                <Link
                  to={SERVICES_PAGE_HREF}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-white px-8 py-4 text-base font-medium transition-all duration-300 hover:border-accent/40 hover:bg-accent/5"
                >
                  Ver servicios
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <Link
                  to={QUOTE_PAGE_HREF}
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-accent"
                >
                  Pedir presupuesto
                  <span className="text-accent/60">→</span>
                </Link>
                <Link
                  to={DEMO_PAGE_HREF}
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-accent"
                >
                  Ver demo completa
                  <span className="text-accent/60">→</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="border-t border-border/50 pt-6"
            >
              <div className="flex flex-wrap gap-5">
                {[
                  { icon: Users, text: "Diagnóstico inicial de 15 minutos" },
                  { icon: BarChart3, text: "Prioridades visibles en semanas" },
                  { icon: TrendingUp, text: "Trabajo confidencial y aplicado al negocio" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4 text-accent/60" />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-4 px-4 lg:mt-0 lg:px-0"
          >
            <div className="mb-5 flex flex-wrap gap-2 lg:hidden">
              {[
                { color: "bg-violet-50 border-violet-100 text-violet-700", text: "12 clientes inactivos +90d" },
                { color: "bg-emerald-50 border-emerald-100 text-emerald-700", text: "+34% potencial cross-sell" },
                { color: "bg-amber-50 border-amber-100 text-amber-700", text: "Margen erosionado detectado" },
              ].map((pill, index) => (
                <motion.span
                  key={pill.text}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold ${pill.color}`}
                >
                  {pill.text}
                </motion.span>
              ))}
            </div>

            <InteractiveDashboard variant="mini" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
