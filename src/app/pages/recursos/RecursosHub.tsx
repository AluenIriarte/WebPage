import { motion } from "motion/react";
import { Clock, ArrowRight, BarChart2, TrendingUp, Target, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { ResourceLayout } from "./ResourceLayout";
import { ROOT_DIAGNOSTIC_SECTION_HREF } from "../../lib/contact";

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
      <section className="py-20 lg:py-28 border-b border-border/40 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-accent/40 rounded-full" />
              <span className="text-[11px] font-semibold text-accent/70 uppercase tracking-[0.14em]">
                Recursos & Guías
              </span>
            </div>
            <h1 className="text-[2.4rem] md:text-[3rem] lg:text-[3.4rem] font-semibold tracking-tight text-foreground leading-[1.1]">
              Guías para pasar
              <br />
              <span className="text-accent/80">de reportes a decisiones</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Contenido pensado para equipos que quieren entender dashboards, KPIs y visibilidad comercial
              con criterio de negocio.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
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
                    <div className="flex flex-col md:flex-row gap-6 p-6 lg:p-8 rounded-2xl border border-border/50 bg-white hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
                      <div className="w-full md:w-52 h-36 md:h-auto flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/8 rounded-full border border-accent/12">
                            <Icon className="w-3 h-3 text-accent" />
                            <span className="text-[11px] font-semibold text-accent">{article.category}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                            <Clock className="w-3 h-3" />
                            <span>{article.readTime} de lectura</span>
                          </div>
                        </div>

                        <h2 className="text-[1.1rem] md:text-[1.2rem] font-semibold text-foreground leading-snug group-hover:text-accent transition-colors">
                          {article.title}
                        </h2>

                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {article.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-sm font-medium text-accent pt-1">
                          Leer artículo
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </div>

                        <div className="flex gap-2 flex-wrap pt-1">
                          {article.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground/70">
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

      <section className="py-16 border-t border-border/40 bg-muted/30">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Si querés llevar esto a tu operación, revisamos si hay un caso real
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            En 15 minutos vemos si hoy hay una oportunidad concreta en cartera, margen o expansión que
            valga la pena trabajar.
          </p>
          <a
            href={ROOT_DIAGNOSTIC_SECTION_HREF}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full font-medium text-sm hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
          >
            Revisar mi caso
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </ResourceLayout>
  );
}
