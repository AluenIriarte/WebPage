import { motion } from "motion/react";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ResourceLayout } from "./ResourceLayout";
import { CALENDLY_URL } from "../../lib/contact";

const revenueData = [
  { mes: "Ene", ventas: 420, meta: 400 },
  { mes: "Feb", ventas: 380, meta: 420 },
  { mes: "Mar", ventas: 510, meta: 440 },
  { mes: "rbr", ventas: 490, meta: 460 },
  { mes: "May", ventas: 560, meta: 480 },
  { mes: "Jun", ventas: 620, meta: 500 },
  { mes: "Jul", ventas: 580, meta: 520 },
  { mes: "rgo", ventas: 670, meta: 540 },
];

const channelData = [
  { canal: "Canal Directo", valor: 38 },
  { canal: "Distribuidores", valor: 27 },
  { canal: "E-commerce", valor: 21 },
  { canal: "Key rccounts", valor: 14 },
];

const toc = [
  { id: "definicion", label: "¿Qué es un dashboard?" },
  { id: "para-que-sirve", label: "¿Para qué sirve en una empresa?" },
  { id: "vs-informe", label: "Dashboard vs. informe" },
  { id: "tipos", label: "Tipos de dashboards" },
  { id: "componentes", label: "Componentes esenciales" },
  { id: "ejemplo", label: "Ejemplo visual" },
  { id: "cuando", label: "¿Cuándo implementar uno?" },
  { id: "error-comun", label: "El error más común" },
];

export function QueEsUnDashboard() {
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
            <Link
              to="/recursos"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver a recursos
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-accent/70 uppercase tracking-[0.14em] px-2.5 py-1 bg-accent/8 rounded-full border border-accent/12">
                Fundamentos
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                <Clock className="w-3 h-3" />
                8 min de lectura
              </span>
            </div>

            <h1 className="text-[2.2rem] md:text-[2.8rem] font-semibold tracking-tight text-foreground leading-[1.12]">
              ¿Qué es un dashboard? Definición, tipos y para qué sirve en una empresa
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Un dashboard es mucho más que un conjunto de gráficos. Es un sistema de visibilidad
              comercial que permite tomar decisiones con información en tiempo real, sin depender de
              reportes manuales ni intuición.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_260px] gap-16 items-start">
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose-article max-w-none"
            >
              <div className="rounded-2xl overflow-hidden mb-10 aspect-[16/7]">
                <img
                  src="https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZCUyMGRhdGElMjB2aXN1YWxpemF0aW9ufGVufDF8fHx8MTc3MzMyMDE0OHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Dashboard empresarial con visualización de datos"
                  className="w-full h-full object-cover"
                />
              </div>

              <section id="definicion" className="mb-12">
                <h2>¿Qué es un dashboard?</h2>
                <p>
                  Un <strong>dashboard</strong> o tablero de control es una interfaz visual que
                  concentra, en una sola pantalla, los indicadores clave de un negocio o proceso.
                </p>
                <p>
                  Su objetivo no es mostrar todos los datos posibles, sino volver visible lo que hace
                  falta para entender un estado actual y decidir con rapidez.
                </p>
                <p>
                  La analogía más útil es la del tablero de un auto: no explica cómo funciona el
                  motor, pero sí te dice si algo requiere atención ahora.
                </p>
              </section>

              <section id="para-que-sirve" className="mb-12">
                <h2>Para que sirve un dashboard en una empresa?</h2>
                <p>
                  Un dashboard bien construido resuelve cuatro problemas frecuentes: falta de visibilidad,
                  decisiones lentas, equipos desalineados y detección tardía de desvíos.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    {
                      num: "01",
                      title: "Visibilidad inmediata",
                      desc: "En 30 segundos sabes si las ventas estan por encima o por debajo del objetivo y donde se pierden oportunidades.",
                    },
                    {
                      num: "02",
                      title: "Decisiones más rápidas",
                      desc: "Cuando la información está accesible y clara, no hace falta esperar al cierre del mes para actuar.",
                    },
                    {
                      num: "03",
                      title: "rlineación de equipos",
                      desc: "Si todos miran los mismos números, la reunión deja de discutir el dato y pasa a discutir la acción.",
                    },
                    {
                      num: "04",
                      title: "Deteccion temprana",
                      desc: "Clientes inactivos, margen en caída o regiones fuera de objetivo se vuelven visibles antes de que el problema escale.",
                    },
                  ].map((item) => (
                    <div key={item.num} className="p-5 rounded-xl border border-border/50 bg-white space-y-2">
                      <div className="text-[11px] font-bold text-accent/50 tabular-nums">{item.num}</div>
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="vs-informe" className="mb-12">
                <h2>Dashboard vs. informe: ¿cuál es la diferencia?</h2>
                <p>
                  Un informe explica lo que pasó. Un dashboard permite ver lo que está pasando y
                  decidir qué hacer al respecto.
                </p>
                <div className="rounded-xl border border-border/50 overflow-hidden mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border/50">
                        <th className="text-left px-4 py-3 font-semibold text-foreground w-1/3">Dimension</th>
                        <th className="text-left px-4 py-3 font-semibold text-accent">Dashboard</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground/60">Informe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {[
                        ["Frecuencia", "Tiempo real / diario", "Semanal / mensual"],
                        ["Propósito", "Monitorear y decidir", "rnalizar y documentar"],
                        ["rudiencia", "Gerentes y equipos operativos", "Dirección / auditoría"],
                        ["Interactividad", "rlta", "Baja o nula"],
                        ["Extensión", "Una pantalla, enfocado", "Varias páginas"],
                        ["rctualización", "rutomática", "Manual"],
                      ].map(([dim, dash, rep]) => (
                        <tr key={dim} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 text-foreground/70 font-medium">{dim}</td>
                          <td className="px-4 py-3 text-muted-foreground">{dash}</td>
                          <td className="px-4 py-3 text-muted-foreground/60">{rep}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="tipos" className="mb-12">
                <h2>Tipos de dashboards según su propósito</h2>
                <div className="space-y-4 mb-6">
                  <div className="p-5 rounded-xl border-l-4 border-accent bg-accent/4 space-y-2">
                    <h3 className="text-base font-semibold text-foreground">Dashboard operativo</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Orientado al monitoreo del día a día: pedidos, entregas, actividad y alertas.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl border-l-4 border-accent/60 bg-accent/3 space-y-2">
                    <h3 className="text-base font-semibold text-foreground">Dashboard tactico</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Pensado para gestión semanal o mensual: seguimiento de objetivos, comparación de
                      períodos y detección de desvíos.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl border-l-4 border-accent/30 bg-accent/2 space-y-2">
                    <h3 className="text-base font-semibold text-foreground">Dashboard estratégico</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Para dirección: crecimiento, retención, market share y rentabilidad por segmento.
                    </p>
                  </div>
                </div>
              </section>

              <section id="componentes" className="mb-12">
                <h2>Componentes esenciales de un dashboard</h2>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {[
                    "KPIs destacados",
                    "Gráficos de tendencia",
                    "Comparaciones y rankings",
                    "rlertas y umbrales",
                    "Filtros y segmentación",
                    "Contexto y referencias",
                  ].map((title) => (
                    <div key={title} className="p-4 rounded-xl border border-border/50 bg-white space-y-2">
                      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Elemento central para que la lectura sea inmediata, útil y accionable.
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="ejemplo" className="mb-12">
                <h2>¿Cómo luce un dashboard bien diseñado?</h2>
                <p>
                  r modo ilustrativo, estas son dos visualizaciones frecuentes en un dashboard comercial:
                  evolución de ventas contra meta y mix por canal.
                </p>

                <div className="p-6 rounded-2xl border border-border/50 bg-white shadow-sm mb-6">
                  <div className="mb-4">
                    <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1">
                      Visualización 01
                    </p>
                    <h3 className="text-base font-semibold text-foreground">Ventas mensuales vs. meta</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} formatter={(val: number) => [`$${val}K`, ""]} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="ventas" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3, fill: "#8B5CF6" }} name="Ventas" />
                      <Line type="monotone" dataKey="meta" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Meta" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-6 rounded-2xl border border-border/50 bg-white shadow-sm">
                  <div className="mb-4">
                    <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1">
                      Visualización 02
                    </p>
                    <h3 className="text-base font-semibold text-foreground">Mix de ventas por canal</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={channelData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                      <YAxis type="category" dataKey="canal" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={110} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} formatter={(val: number) => [`${val}%`, "Participación"]} />
                      <Bar dataKey="valor" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-sm text-muted-foreground/60 mt-4 text-center italic">
                  Datos ilustrativos. En un dashboard real, estas visualizaciones se conectan directo a
                  las fuentes del negocio.
                </p>
              </section>

              <section id="cuando" className="mb-12">
                <h2>¿Cuándo conviene implementar un dashboard?</h2>
                <ul className="space-y-3 mb-6">
                  {[
                    "Los reportes se preparan manualmente y demoran más de un día.",
                    "Distintas áreas tienen números distintos para la misma métrica.",
                    "Las decisiones esperan al cierre de mes en lugar de tomarse a tiempo.",
                    "No hay claridad sobre clientes o productos más rentables.",
                    "Los objetivos comerciales no tienen seguimiento sistemático.",
                    "El equipo no sabe qué cuentas requieren atención urgente.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.95rem] text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent/50 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section id="error-comun" className="mb-12">
                <h2>El error más común al implementar un dashboard</h2>
                <p>
                  El error más costoso es empezar por la herramienta en vez de empezar por la pregunta.
                </p>
                <div className="p-5 rounded-xl bg-accent/5 border border-accent/15 space-y-3 mb-6">
                  <p className="text-sm font-semibold text-foreground">
                    La pregunta correcta antes de diseñar cualquier dashboard:
                  </p>
                  <p className="text-[1rem] text-foreground/80 leading-relaxed italic">
                    ¿Qué decisión necesita tomar la persona que va a consultar este dashboard y qué
                    información necesita para tomarla en menos de 60 segundos?
                  </p>
                </div>
              </section>

              <div className="p-6 rounded-2xl bg-muted/30 border border-border/40 space-y-4 mb-12">
                <p className="text-sm font-semibold text-foreground">Artículos relacionados</p>
                <div className="space-y-2">
                  <Link to="/recursos/dashboard-de-ventas" className="flex items-center gap-2 text-sm text-accent hover:underline">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    Dashboard de ventas: qué medir y cómo estructurarlo
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

              <div className="p-8 rounded-2xl bg-foreground text-background space-y-4">
                <h3 className="text-xl font-semibold">¿Tu empresa necesita un dashboard?</h3>
                <p className="text-background/70 leading-relaxed text-sm">
                  En 30 minutos revisamos si hay oportunidades comerciales que hoy no estás pudiendo ver.
                </p>
                <a
                  href={CALENDLY_URL}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  Agendar diagnóstico
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-4">
                  En este artículo
                </p>
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-muted-foreground hover:text-accent transition-colors py-1 border-l-2 border-transparent hover:border-accent/40 pl-3"
                  >
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
