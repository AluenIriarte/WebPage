import { motion } from "motion/react";
import profilePhoto from "../../../assets/images/profile2.png";

const chips = [
  "BI operativo",
  "Reporting de gestión",
  "Dashboards ejecutivos",
  "Automatización",
  "Visibilidad comercial",
  "Adopción de herramientas",
];

const profileStats = [
  { value: "3+", label: "años" },
  { value: "30+", label: "proyectos" },
  { value: "4+", label: "países" },
];

export function CredibilitySection() {
  return (
    <section id="autoridad" className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center lg:items-start gap-7"
          >
            <div className="relative">
              <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-3xl overflow-hidden border border-border/40 shadow-xl shadow-black/5">
                <img
                  src={profilePhoto}
                  alt="Alan L. Perez"
                  loading="lazy"
                  decoding="async"
                  width="176"
                  height="176"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-accent shadow-lg shadow-accent/30" />
            </div>

            <div className="text-center lg:text-left">
              <p className="text-base font-semibold text-foreground">Alan L. Perez</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Consultor en BI y sistemas de decisión comercial
              </p>
            </div>

            <div className="flex items-center gap-5">
              {profileStats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center lg:items-start">
                  <span className="text-xl font-semibold text-foreground tracking-tight">{stat.value}</span>
                  <span className="text-[11px] text-muted-foreground/60 font-medium mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>

            <a
              href="https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground/60 hover:text-accent transition-colors duration-200 group"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Ver perfil en LinkedIn
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-7"
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-accent/40 rounded-full" />
              <span className="text-[11px] font-semibold text-accent/70 uppercase tracking-[0.14em]">
                Quién hay detrás
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground leading-tight">
              Experiencia aplicada para convertir <span className="text-accent">datos en decisiones útiles</span>
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed">
              Hace más de 3 años acompaño a empresas en entornos globales, diseñando herramientas de
              BI, automatización y reporting para que la información se convierta en foco, claridad y
              acción.
            </p>

            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-border/60 text-foreground/70 hover:border-accent/30 hover:text-accent transition-colors duration-200"
                >
                  {chip}
                </span>
              ))}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-accent/30 pl-4">
              No se trata de sumar otra herramienta, se trata de lograr impacto real. Medible y
              accionable.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
