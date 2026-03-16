import { motion } from "motion/react";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { ResourceLayout } from "./ResourceLayout";

const kpiRadarData = [
  { kpi: "Tasa cierre", value: 72 },
  { kpi: "Retencion", value: 85 },
  { kpi: "Ticket prom.", value: 60 },
  { kpi: "Cobertura", value: 90 },
  { kpi: "Velocidad", value: 55 },
  { kpi: "Cross-sell", value: 40 },
];

const retentionData = [
  { mes: "Ene", retencion: 88 },
  { mes: "Feb", retencion: 85 },
  { mes: "Mar", retencion: 91 },
  { mes: "Abr", retencion: 89 },
  { mes: "May", retencion: 83 },
  { mes: "Jun", retencion: 86 },
  { mes: "Jul", retencion: 90 },
  { mes: "Ago", retencion: 93 },
];

const costoData = [
  { canal: "Inbound digital", cac: 420, ltv: 4800 },
  { canal: "Outbound", cac: 680, ltv: 6200 },
  { canal: "Referidos", cac: 210, ltv: 5100 },
  { canal: "Key Accounts", cac: 1200, ltv: 18000 },
];

const toc = [
  { id: "que-es-un-kpi", label: "Que es un KPI comercial?" },
  { id: "diferencia-metricas", label: "KPIs vs. metricas" },
  { id: "categorias", label: "Categorias principales" },
  { id: "kpis-de-ventas", label: "KPIs de ventas esenciales" },
  { id: "kpis-de-clientes", label: "KPIs de clientes" },
  { id: "kpis-de-eficiencia", label: "KPIs de eficiencia comercial" },
  { id: "como-elegir", label: "Como elegir tus KPIs" },
  { id: "error-de-medicion", label: "El error de medir todo" },
];

export function KpisComerciales() {
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
                KPIs
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                <Clock className="w-3 h-3" />
                12 min de lectura
              </span>
            </div>
            <h1 className="text-[2.2rem] md:text-[2.8rem] font-semibold tracking-tight text-foreground leading-[1.12]">
              KPIs comerciales: la guia definitiva para medir lo que realmente importa
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              No todos los indicadores son KPIs. Y no todos los KPIs son utiles. Esta guia explica cuales son los mas relevantes y como elegirlos.
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
                  src="https://images.unsplash.com/photo-1763038311036-6d18805537e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLUEklMjBtZXRyaWNzJTIwcGVyZm9ybWFuY2UlMjBidXNpbmVzcyUyMHJlcG9ydHxlbnwxfHx8fDE3NzMzMjAxNTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="KPIs comerciales en reporte de negocio"
                  className="w-full h-full object-cover"
                />
              </div>

              <section id="que-es-un-kpi">
                <h2>Que es un KPI comercial?</h2>
                <p>
                  Un KPI comercial es un indicador clave de rendimiento que mide si una actividad comercial esta yendo en la direccion correcta segun un objetivo definido.
                </p>
                <ul>
                  {[
                    "Tiene un objetivo claro asociado",
                    "Se mide con una frecuencia definida",
                    "Tiene un responsable",
                    "Permite actuar si hay desvio",
                  ].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section id="diferencia-metricas">
                <h2>KPIs vs. metricas</h2>
                <div className="rounded-xl border border-border/50 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border/50">
                        <th className="text-left px-4 py-3 font-semibold text-foreground w-1/3">Criterio</th>
                        <th className="text-left px-4 py-3 font-semibold text-accent">KPI</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground/60">Metrica</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {[
                        ["Importancia", "Critico para el objetivo", "Informativo"],
                        ["Objetivo", "Siempre tiene uno asociado", "No necesariamente"],
                        ["Responsable", "Si", "Puede o no tenerlo"],
                        ["Accion derivada", "Obliga a actuar", "Aporta contexto"],
                        ["Cantidad ideal", "5 a 10 por area", "Sin limite"],
                      ].map(([c, k, m]) => (
                        <tr key={c} className="hover:bg-muted/20">
                          <td className="px-4 py-3 text-foreground/70 font-medium">{c}</td>
                          <td className="px-4 py-3 text-muted-foreground">{k}</td>
                          <td className="px-4 py-3 text-muted-foreground/60">{m}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="categorias">
                <h2>Las tres categorias de KPIs comerciales</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { cat: "KPIs de resultado", desc: "Miden lo que ya paso: revenue, unidades y cierres." },
                    { cat: "KPIs de proceso", desc: "Miden como funciona el proceso: conversion, ciclo y actividad." },
                    { cat: "KPIs de prediccion", desc: "Anticipan lo que puede ocurrir: pipeline, propuestas, demos." },
                  ].map((item) => (
                    <div key={item.cat} className="p-5 rounded-xl border border-border/50 bg-white space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">{item.cat}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="kpis-de-ventas">
                <h2>KPIs de ventas esenciales</h2>
                <div className="p-6 rounded-2xl border border-border/50 bg-white shadow-sm mb-8">
                  <div className="mb-2">
                    <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1">Ejemplo</p>
                    <h3 className="text-base font-semibold text-foreground">
                      Mapa de salud comercial
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={kpiRadarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="kpi" tick={{ fontSize: 11, fill: "#6b7280" }} />
                      <Radar name="Desempeno" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {[
                    "Revenue total",
                    "Tasa de conversion",
                    "Ticket promedio",
                    "Ciclo de venta",
                    "Costo de adquisicion (CAC)",
                    "Pipeline activo",
                    "Cuota de cumplimiento",
                  ].map((item) => (
                    <div key={item} className="p-4 rounded-xl border border-border/40 bg-white">
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        KPI clave para medir resultados, anticipar desvíos y gestionar el proceso comercial.
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="kpis-de-clientes">
                <h2>KPIs de clientes</h2>
                <div className="p-6 rounded-2xl border border-border/50 bg-white shadow-sm mb-8">
                  <h3 className="text-base font-semibold text-foreground mb-5">Tasa de retencion mensual</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={retentionData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[70, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} formatter={(val: number) => [`${val}%`, "Retencion"]} />
                      <Line type="monotone" dataKey="retencion" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3, fill: "#8B5CF6" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section id="kpis-de-eficiencia">
                <h2>KPIs de eficiencia comercial</h2>
                <div className="p-6 rounded-2xl border border-border/50 bg-white shadow-sm mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-5">CAC vs. LTV por canal</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={costoData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="canal" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} formatter={(val: number) => [`$${val.toLocaleString()}`, ""]} />
                      <Bar dataKey="cac" fill="#e9d5ff" radius={[4, 4, 0, 0]} name="CAC" />
                      <Bar dataKey="ltv" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="LTV" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section id="como-elegir">
                <h2>Como elegir los KPIs correctos</h2>
                <div className="space-y-4">
                  {[
                    "Tu modelo de negocio",
                    "Tu etapa de crecimiento",
                    "Las decisiones que necesitas tomar",
                  ].map((item, index) => (
                    <div key={item} className="flex gap-4 p-5 rounded-xl border border-border/40 bg-white">
                      <div className="text-[11px] font-bold text-accent/40 tabular-nums pt-0.5 flex-shrink-0">0{index + 1}</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">{item}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          La seleccion correcta depende del contexto y de las decisiones que la organizacion necesita tomar con mas frecuencia.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="error-de-medicion">
                <h2>El error de medir todo</h2>
                <div className="p-6 rounded-xl bg-accent/5 border border-accent/15 space-y-4">
                  <p className="text-base font-semibold text-foreground">
                    Si en un dashboard hay mas de 10 KPIs en la vista principal, hay demasiados.
                  </p>
                  <p className="text-[1rem] text-foreground/75 leading-relaxed">
                    Un indicador que no cambia el comportamiento de nadie no es un KPI: es ruido.
                  </p>
                </div>
              </section>

              <div className="p-6 rounded-2xl bg-muted/30 border border-border/40 space-y-4 mb-12">
                <p className="text-sm font-semibold text-foreground">Articulos relacionados</p>
                <div className="space-y-2">
                  <Link to="/recursos/que-es-un-dashboard" className="flex items-center gap-2 text-sm text-accent hover:underline">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    Que es un dashboard? Definicion, tipos y para que sirve
                  </Link>
                  <Link to="/recursos/dashboard-de-ventas" className="flex items-center gap-2 text-sm text-accent hover:underline">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    Dashboard de ventas: que medir y como estructurarlo
                  </Link>
                  <Link to="/recursos/tablero-de-ventas" className="flex items-center gap-2 text-sm text-accent hover:underline">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    Tablero de ventas: como construirlo
                  </Link>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-foreground text-background space-y-4">
                <h3 className="text-xl font-semibold">Que KPIs deberia medir tu empresa?</h3>
                <p className="text-background/70 leading-relaxed text-sm">
                  En una charla breve revisamos tu contexto comercial actual y definimos cuales son los indicadores que mas sentido tiene monitorear.
                </p>
                <a
                  href="mailto:alanlperez1996@gmail.com?subject=KPIs comerciales"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  Consultar sobre KPIs
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-4">
                  En este articulo
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
