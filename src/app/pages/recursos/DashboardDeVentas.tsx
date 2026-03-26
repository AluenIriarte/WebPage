import { motion } from "motion/react";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";
import { CommercialCta } from "../../components/CommercialCta";
import { ResourceLayout } from "./ResourceLayout";

const pipelineData = [
  { etapa: "Prospectos", cantidad: 240, conversion: 100 },
  { etapa: "Calificados", cantidad: 180, conversion: 75 },
  { etapa: "Propuesta", cantidad: 110, conversion: 46 },
  { etapa: "Negociación", cantidad: 62, conversion: 26 },
  { etapa: "Cierre", cantidad: 38, conversion: 16 },
];

const repData = [
  { vendedor: "M. Garcia", logrado: 94, meta: 100 },
  { vendedor: "P. Lopez", logrado: 87, meta: 100 },
  { vendedor: "S. Torres", logrado: 112, meta: 100 },
  { vendedor: "R. Diaz", logrado: 78, meta: 100 },
  { vendedor: "L. Mendez", logrado: 103, meta: 100 },
];

const trendData = [
  { sem: "S1", nuevos: 18, renovaciones: 32, perdidos: 4 },
  { sem: "S2", nuevos: 22, renovaciones: 28, perdidos: 6 },
  { sem: "S3", nuevos: 15, renovaciones: 35, perdidos: 3 },
  { sem: "S4", nuevos: 28, renovaciones: 31, perdidos: 5 },
  { sem: "S5", nuevos: 31, renovaciones: 29, perdidos: 7 },
  { sem: "S6", nuevos: 24, renovaciones: 38, perdidos: 4 },
  { sem: "S7", nuevos: 36, renovaciones: 34, perdidos: 6 },
  { sem: "S8", nuevos: 42, renovaciones: 40, perdidos: 5 },
];

const toc = [
  { id: "que-es", label: "¿Qué es un dashboard de ventas?" },
  { id: "diferencia", label: "No es un CRM ni un reporte" },
  { id: "metricas-clave", label: "Métricas que no pueden faltar" },
  { id: "pipeline", label: "El pipeline visual" },
  { id: "rendimiento", label: "Rendimiento por vendedor" },
  { id: "frecuencia", label: "¿Con qué frecuencia mirarlo?" },
  { id: "estructura", label: "Cómo estructurar las vistas" },
  { id: "errores", label: "Errores frecuentes" },
];

export function DashboardDeVentas() {
  return (
    <ResourceLayout>
      <header className="py-16 lg:py-24 border-b border-border/40 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <Link to="/recursos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver a recursos
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-accent/70 uppercase tracking-[0.14em] px-2.5 py-1 bg-accent/8 rounded-full border border-accent/12">
                Ventas
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                <Clock className="w-3 h-3" />
                10 min de lectura
              </span>
            </div>
            <h1 className="text-[2.2rem] md:text-[2.8rem] font-semibold tracking-tight text-foreground leading-[1.12]">
              Dashboard de ventas: qué medir, cómo estructurarlo y por qué importa
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Un dashboard de ventas bien diseñado centraliza en un solo lugar los indicadores que determinan si tu equipo comercial está avanzando o estancado.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_260px] gap-16 items-start">
            <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="prose-article">
              <div className="rounded-2xl overflow-hidden mb-10 aspect-[16/7]">
                <img
                  src="https://images.unsplash.com/photo-1758691736764-2a88e313b1f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxlcyUyMHRlYW0lMjBtZWV0aW5nJTIwc3RyYXRlZ3klMjB3aGl0ZWJvYXJkfGVufDF8fHx8MTc3MzMyMDE1MHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Equipo comercial revisando dashboard de ventas"
                  className="w-full h-full object-cover"
                />
              </div>

              <section id="que-es">
                <h2>¿Qué es un dashboard de ventas?</h2>
                <p>
                  Es una herramienta de visualización que concentra los indicadores clave del proceso
                  comercial. A diferencia de un reporte estático, es dinámico y pensado para soportar
                  decisiones en tiempo real.
                </p>
              </section>

              <section id="diferencia">
                <h2>No es un CRM ni un reporte</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "CRM",
                      desc: "Es la base de datos del proceso comercial. Donde se carga y mantiene la información.",
                    },
                    {
                      title: "Reporte de ventas",
                      desc: "Documento estático que resume lo que ocurrió en un periodo.",
                    },
                    {
                      title: "Dashboard de ventas",
                      desc: "Interfaz dinámica que lee los datos y los presenta para decidir ahora.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="p-5 rounded-xl border border-border/50 bg-white space-y-2">
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="metricas-clave">
                <h2>Las métricas que no pueden faltar</h2>
                <div className="space-y-3">
                  {[
                    "Revenue total del periodo",
                    "Ticket promedio",
                    "Cantidad de transacciones",
                    "Tasa de conversión del pipeline",
                    "Clientes activos vs. inactivos",
                    "Rendimiento por vendedor",
                    "Margen por producto o segmento",
                  ].map((metric, index) => (
                    <div key={metric} className="flex gap-4 p-4 rounded-xl border border-border/40 bg-white">
                      <div className="text-[11px] font-bold text-accent/40 tabular-nums pt-0.5 w-5 flex-shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{metric}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Indicador esencial para entender si el equipo comercial avanza, dónde se frena y dónde conviene intervenir.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="pipeline">
                <h2>El pipeline visual: la columna vertebral del dashboard</h2>
                <div className="p-6 rounded-2xl border border-border/50 bg-white shadow-sm">
                  <div className="mb-4">
                    <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1">
                      Ejemplo de pipeline comercial
                    </p>
                    <h3 className="text-base font-semibold text-foreground">Oportunidades activas por etapa</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={pipelineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="etapa" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                      <Bar yAxisId="left" dataKey="cantidad" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Cantidad" />
                      <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Conversión %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section id="rendimiento">
                <h2>Rendimiento por vendedor</h2>
                <div className="p-6 rounded-2xl border border-border/50 bg-white shadow-sm">
                  <h3 className="text-base font-semibold text-foreground mb-5">Cumplimiento de meta por vendedor</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={repData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} domain={[0, 120]} />
                      <YAxis type="category" dataKey="vendedor" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} formatter={(val: number) => [`${val}%`, "Logrado"]} />
                      <Bar dataKey="logrado" radius={[0, 6, 6, 0]} name="Logrado" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section id="frecuencia">
                <h2>¿Con qué frecuencia revisar un dashboard de ventas?</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { freq: "Diario", use: "Revenue, actividad y alertas prioritarias." },
                    { freq: "Semanal", use: "Pipeline, avance vs. meta y oportunidades calientes." },
                    { freq: "Mensual", use: "Cierre de periodo, margen, mix y comparación histórica." },
                  ].map((item) => (
                    <div key={item.freq} className="p-5 rounded-xl border border-border/50 bg-white space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Revisión {item.freq}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.use}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="estructura">
                <h2>Cómo estructurar las vistas</h2>
                <div className="p-6 rounded-2xl border border-border/50 bg-white shadow-sm mb-6">
                  <div className="mb-5">
                    <h3 className="text-base font-semibold text-foreground">
                      Evolución semanal: nuevas ventas, renovaciones y pérdidas
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="sem" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                      <Area type="monotone" dataKey="nuevos" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} name="Nuevas ventas" />
                      <Area type="monotone" dataKey="renovaciones" stackId="1" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.4} name="Renovaciones" />
                      <Area type="monotone" dataKey="perdidos" stackId="1" stroke="#f1f5f9" fill="#f1f5f9" fillOpacity={0.8} name="Perdidas" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {[
                    "Vista ejecutiva: KPIs críticos y lectura inmediata.",
                    "Vista operativa: pipeline, alertas y seguimiento por vendedor.",
                    "Vista de análisis: filtros, segmentos, regiones y mix.",
                  ].map((text) => (
                    <div key={text} className="flex gap-4 p-4 rounded-xl border border-border/40 bg-white">
                      <div className="w-1 rounded-full bg-accent/40 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="errores">
                <h2>Errores frecuentes</h2>
                <div className="space-y-3">
                  {[
                    "Mostrar demasiados indicadores.",
                    "No conectar bien las fuentes de datos.",
                    "Diseñar para el analista en lugar de para quien decide.",
                    "Depender de actualización manual.",
                    "No tener una vista inicial clara.",
                  ].map((error) => (
                    <div key={error} className="p-5 rounded-xl border border-border/40 bg-white space-y-2">
                      <p className="text-sm font-semibold text-red-500/80">✗ {error}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Cada uno de estos errores reduce adopción y hace que el tablero pierda valor operativo.
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-6 rounded-2xl bg-muted/30 border border-border/40 space-y-4 mb-12">
                <p className="text-sm font-semibold text-foreground">Artículos relacionados</p>
                <div className="space-y-2">
                  <Link to="/recursos/que-es-un-dashboard" className="flex items-center gap-2 text-sm text-accent hover:underline">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    ¿Qué es un dashboard? Definición, tipos y para qué sirve
                  </Link>
                  <Link to="/recursos/kpis-comerciales" className="flex items-center gap-2 text-sm text-accent hover:underline">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    KPIs comerciales: la guía definitiva
                  </Link>
                  <Link to="/recursos/tablero-de-ventas" className="flex items-center gap-2 text-sm text-accent hover:underline">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    Tablero de ventas: cómo construirlo
                  </Link>
                </div>
              </div>
              <CommercialCta
                title={"¿Necesitás un dashboard de ventas para tu empresa?"}
                description={"Podés ver una demo real, bajar tu caso a diagnóstico o escribir por LinkedIn si preferís un contacto más simple."}
              />
            </motion.article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-4">
                  En este artículo
                </p>
                {toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="block text-sm text-muted-foreground hover:text-accent transition-colors py-1 border-l-2 border-transparent hover:border-accent/40 pl-3">
                    {item.label}
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </ResourceLayout>
  );
}
