import { motion } from "motion/react";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { CommercialCta } from "../../components/CommercialCta";
import { ResourceLayout } from "./ResourceLayout";

const regionData = [
  { region: "AMBA", real: 1840, meta: 1600 },
  { region: "NOA", real: 720, meta: 900 },
  { region: "NEA", real: 540, meta: 600 },
  { region: "Cuyo", real: 680, meta: 650 },
  { region: "Patagonia", real: 410, meta: 400 },
  { region: "Centro", real: 930, meta: 850 },
];

const monthlyTrend = [
  { mes: "Mar", ventas: 3890 },
  { mes: "Abr", ventas: 4120 },
  { mes: "May", ventas: 3750 },
  { mes: "Jun", ventas: 4380 },
  { mes: "Jul", ventas: 4210 },
  { mes: "Ago", ventas: 4920 },
  { mes: "Sep", ventas: 5180 },
  { mes: "Oct", ventas: 5040 },
];

const clienteValorData = [
  { x: 12, y: 2400, z: 8, name: "Segmento A" },
  { x: 8, y: 1800, z: 5, name: "Segmento B" },
  { x: 24, y: 4200, z: 14, name: "Segmento C" },
  { x: 4, y: 800, z: 3, name: "Segmento D" },
  { x: 18, y: 3100, z: 10, name: "Segmento E" },
  { x: 6, y: 1200, z: 4, name: "Segmento F" },
  { x: 30, y: 6800, z: 22, name: "Segmento G" },
];

const toc = [
  { id: "definicion", label: "¿Qué es un tablero de ventas?" },
  { id: "diferencias", label: "Tablero vs. dashboard vs. reporte" },
  { id: "estructura", label: "Estructura recomendada" },
  { id: "indicadores", label: "Indicadores por vista" },
  { id: "regiones", label: "Análisis regional y territorial" },
  { id: "clientes", label: "Vista de cartera de clientes" },
  { id: "como-presentarlo", label: "Cómo presentarlo al equipo" },
  { id: "herramientas", label: "Herramientas para construirlo" },
];

export function TableroDeVentas() {
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
                9 min de lectura
              </span>
            </div>
            <h1 className="text-[2.2rem] md:text-[2.8rem] font-semibold tracking-tight text-foreground leading-[1.12]">
              Tablero de ventas: cómo construirlo y qué indicadores incluir
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Un tablero de ventas es la herramienta central para que gerentes y directores comerciales tomen decisiones rápidas con datos reales.
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
                  src="https://images.unsplash.com/photo-1762341114530-a0c54d8cc18b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVjdXRpdmUlMjBkZWNpc2lvbiUyMG1ha2luZyUyMGRhdGElMjBvZmZpY2V8ZW58MXx8fHwxNzczMzIwMTU2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Tablero de ventas ejecutivo"
                  className="w-full h-full object-cover"
                />
              </div>

              <section id="definicion">
                <h2>¿Qué es un tablero de ventas?</h2>
                <p>
                  Es una interfaz de control que concentra los indicadores clave del área comercial y los presenta de forma visual para facilitar decisiones rápidas.
                </p>
              </section>

              <section id="diferencias">
                <h2>Tablero de ventas, dashboard y reporte</h2>
                <div className="p-5 rounded-xl bg-muted/30 border border-border/40 space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Tablero / Dashboard:</strong> Herramienta visual, dinámica y actualizada con frecuencia.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Reporte de ventas:</strong> Documento estático y retrospectivo.
                  </p>
                </div>
              </section>

              <section id="estructura">
                <h2>Estructura recomendada</h2>
                <div className="space-y-4">
                  {[
                    "Nivel 1 - Vista ejecutiva",
                    "Nivel 2 - Vista de gestión comercial",
                    "Nivel 3 - Vista de análisis de cartera",
                    "Nivel 4 - Vista de detalle",
                  ].map((item) => (
                    <div key={item} className="p-5 rounded-xl border border-border/40 bg-white">
                      <h3 className="text-sm font-semibold text-foreground">{item}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Cada vista responde a un nivel distinto de decisión y debe mantener foco propio.
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="indicadores">
                <h2>Indicadores por vista</h2>
                <div className="rounded-xl border border-border/50 overflow-hidden mb-8">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border/50">
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Vista</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Indicadores principales</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {[
                        ["Ejecutiva", "Revenue total, variación vs. meta, variación vs. período anterior, margen bruto"],
                        ["Gestión comercial", "Pipeline activo, cumplimiento por vendedor, oportunidades en riesgo, clientes inactivos"],
                        ["Análisis de cartera", "Mix por producto/canal, revenue por segmento, frecuencia de compra, ticket promedio"],
                        ["Detalle operativo", "Historial de transacciones, actividad por cuenta y estado de oportunidades"],
                      ].map(([view, indicators]) => (
                        <tr key={view} className="hover:bg-muted/20">
                          <td className="px-4 py-3 font-medium text-foreground/80 align-top whitespace-nowrap">{view}</td>
                          <td className="px-4 py-3 text-muted-foreground">{indicators}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 rounded-2xl border border-border/50 bg-white shadow-sm">
                  <div className="mb-4">
                    <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1">Vista ejecutiva</p>
                    <h3 className="text-base font-semibold text-foreground">Evolución de ventas</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}K`} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} formatter={(val: number) => [`$${val.toLocaleString()}`, "Ventas"]} />
                      <Line type="monotone" dataKey="ventas" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3, fill: "#8B5CF6" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section id="regiones">
                <h2>Análisis regional y territorial</h2>
                <div className="p-6 rounded-2xl border border-border/50 bg-white shadow-sm">
                  <h3 className="text-base font-semibold text-foreground mb-5">Ventas reales vs. meta por región</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={regionData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                      <Bar dataKey="meta" fill="#e9d5ff" radius={[4, 4, 0, 0]} name="Meta" />
                      <Bar dataKey="real" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Real" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section id="clientes">
                <h2>Vista de cartera de clientes</h2>
                <div className="p-6 rounded-2xl border border-border/50 bg-white shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-foreground">Mapa de valor de segmentos</h3>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Frecuencia vs. ticket promedio
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" dataKey="x" name="Frecuencia" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} label={{ value: "Frecuencia de compra", position: "insideBottom", offset: -5, fontSize: 10, fill: "#9ca3af" }} />
                      <YAxis type="number" dataKey="y" name="Ticket" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                      <ZAxis type="number" dataKey="z" range={[60, 400]} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                        cursor={{ strokeDasharray: "3 3" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white border border-border/50 rounded-lg p-3 shadow-md text-xs">
                                <p className="font-semibold text-foreground mb-1">{data.name}</p>
                                <p className="text-muted-foreground">Frecuencia: {data.x} compras/año</p>
                                <p className="text-muted-foreground">Ticket: ${data.y.toLocaleString()}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter data={clienteValorData} fill="#8B5CF6" fillOpacity={0.7} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section id="como-presentarlo">
                <h2>Cómo presentarlo al equipo</h2>
                <div className="space-y-3">
                  {[
                    "Reunión diaria de 10 minutos",
                    "Reunión semanal de gestión",
                    "Revisión mensual de cartera",
                  ].map((item, index) => (
                    <div key={item} className="flex gap-4 p-5 rounded-xl border border-border/40 bg-white">
                      <div className="text-[11px] font-bold text-accent/40 tabular-nums pt-0.5 flex-shrink-0">0{index + 1}</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">{item}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          El tablero solo genera valor si se integra a una rutina clara de gestión.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="herramientas">
                <h2>Herramientas para construirlo</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Power BI",
                    "Looker Studio",
                    "Tableau",
                    "Google Sheets / Excel avanzado",
                  ].map((tool) => (
                    <div key={tool} className="p-5 rounded-xl border border-border/50 bg-white space-y-2">
                      <h3 className="text-sm font-semibold text-foreground">{tool}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        La herramienta importa menos que la selección de indicadores, el diseño de vistas y la rutina de uso.
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
                  <Link to="/recursos/dashboard-de-ventas" className="flex items-center gap-2 text-sm text-accent hover:underline">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    Dashboard de ventas: qué medir y cómo estructurarlo
                  </Link>
                  <Link to="/recursos/kpis-comerciales" className="flex items-center gap-2 text-sm text-accent hover:underline">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    KPIs comerciales: la guía definitiva
                  </Link>
                </div>
              </div>
              <CommercialCta
                title={"¿Necesitás un tablero de ventas para tu empresa?"}
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
