import { motion } from "motion/react";
import { Clock, ArrowRight, BarChart2, TrendingUp, Target, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { CommercialCta } from "../../components/CommercialCta";
import { ResourceLayout } from "./ResourceLayout";

const articles = [
  {
    slug: "que-es-un-dashboard",
    category: "Fundamentos",
    icon: LayoutDashboard,
    title: "¿Qué es un dashboard? Definición, tipos y para qué sirve",
    description:
      "Un dashboard es mucho más que un conjunto de gráficos. Es un sistema de visibilidad comercial que permite tomar decisiones con información en tiempo real, sin depender de reportes manuales ni intuición.",
    readTime: "8 min",
    tags: ["dashboard", "BI", "visualización"],
    image:
      "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZCUyMGRhdGElMjB2aXN1YWxpemF0aW9ufGVufDF8fHx8MTc3MzMyMDE0OHww&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    slug: "dashboard-de-ventas",
    category: "Ventas",
    icon: TrendingUp,
    title: "Dashboard de ventas: qué medir, cómo estructurarlo y por qué importa",
    description:
      "Un dashboard de ventas bien diseñado centraliza en un solo lugar los indicadores que determinan si tu equipo comercial está avanzando o estancado.",
    readTime: "10 min",
    tags: ["dashboard de ventas", "métricas comerciales", "CRM"],
    image:
      "https://images.unsplash.com/photo-1758691736764-2a88e313b1f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxlcyUyMHRlYW0lMjBtZWV0aW5nJTIwc3RyYXRlZ3klMjB3aGl0ZWJvYXJkfGVufDF8fHx8MTc3MzMyMDE1MHww&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    slug: "kpis-comerciales",
    category: "KPIs",
    icon: Target,
    title: "KPIs comerciales: la guía definitiva para medir lo que realmente importa",
    description:
      "No todos los indicadores son KPIs. Y no todos los KPIs son útiles. Esta guía explica cuáles son los KPIs comerciales más relevantes.",
    readTime: "12 min",
    tags: ["KPIs comerciales", "KPIs de ventas", "indicadores"],
    image:
      "https://images.unsplash.com/photo-1763038311036-6d18805537e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLUEklMjBtZXRyaWNzJTIwcGVyZm9ybWFuY2UlMjBidXNpbmVzcyUyMHJlcG9ydHxlbnwxfHx8fDE3NzMzMjAxNTN8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    slug: "tablero-de-ventas",
    category: "Ventas",
    icon: BarChart2,
    title: "Tablero de ventas: cómo construirlo y qué indicadores incluir",
    description:
      "Un tablero de ventas es la herramienta central para que gerentes y directores comerciales tomen decisiones rápidas con datos reales.",
    readTime: "9 min",
    tags: ["tablero de ventas", "tablero comercial", "indicadores"],
    image:
      "https://images.unsplash.com/photo-1762341114530-a0c54d8cc18b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVjdXRpdmUlMjBkZWNpc2lvbiUyMG1ha2luZyUyMGRhdGElMjBvZmZpY2V8ZW58MXx8fHwxNzczMzIwMTU2fDA&ixlib=rb-4.1.0&q=80&w=400",
  },
];

export function RecursosHub() {
  return (
    <ResourceLayout>
      <section className="border-b border-border/40 bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-8 rounded-full bg-accent/40" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/70">
                Recursos & Guías
              </span>
            </div>
            <h1 className="text-[2.4rem] leading-[1.1] tracking-tight text-foreground md:text-[3rem] lg:text-[3.4rem]">
              Guías para pasar
              <br />
              <span className="text-accent/80">de reportes a decisiones</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Contenido pensado para equipos que quieren entender dashboards, KPIs y visibilidad
              comercial con criterio de negocio.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="space-y-6">
            {articles.map((article, index) => {
              const Icon = article.icon;
              return (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={`/recursos/${article.slug}`} className="group block">
                    <div className="flex flex-col gap-6 rounded-2xl border border-border/50 bg-white p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 md:flex-row lg:p-8">
                      <div className="h-36 w-full flex-shrink-0 overflow-hidden rounded-xl bg-muted md:h-auto md:w-52">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 rounded-full border border-accent/12 bg-accent/8 px-2.5 py-1">
                            <Icon className="h-3 w-3 text-accent" />
                            <span className="text-[11px] font-semibold text-accent">
                              {article.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                            <Clock className="h-3 w-3" />
                            <span>{article.readTime} de lectura</span>
                          </div>
                        </div>

                        <h2 className="text-[1.1rem] font-semibold leading-snug text-foreground transition-colors group-hover:text-accent md:text-[1.2rem]">
                          {article.title}
                        </h2>

                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {article.description}
                        </p>

                        <div className="flex items-center gap-1.5 pt-1 text-sm font-medium text-accent">
                          Leer artículo
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground/70"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <CommercialCta
            title="Si querés llevar esto a tu operación, no hace falta saltar directo a agenda."
            description="Podés revisar el servicio de dashboards, pedir presupuesto si ya tenés claro el alcance o arrancar por diagnóstico si todavía estás ordenando el caso."
            primaryLabel="Ver servicio de dashboards"
          />
        </div>
      </section>
    </ResourceLayout>
  );
}
