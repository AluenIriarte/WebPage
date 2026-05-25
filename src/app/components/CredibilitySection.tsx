import { motion } from "motion/react";
import profilePhoto from "../../../assets/images/profile2.png";
import { trackCalendlyClick, trackDiagnosisClick } from "../lib/analytics";
import { CALENDLY_URL } from "../lib/contact";

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
    <section id="autoridad" className="bg-muted/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-7 lg:items-start"
          >
            <div className="relative">
              <div className="h-36 w-36 overflow-hidden rounded-3xl border border-border/40 shadow-xl shadow-black/5 lg:h-44 lg:w-44">
                <img
                  src={profilePhoto}
                  alt="Alan L. Perez"
                  loading="lazy"
                  decoding="async"
                  width="176"
                  height="176"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-accent shadow-lg shadow-accent/30" />
            </div>

            <div className="text-center lg:text-left">
              <p className="text-base font-semibold text-foreground">Alan L. Perez</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Consultor en BI y sistemas de decisión comercial
              </p>
            </div>

            <div className="flex items-center gap-5">
              {profileStats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center lg:items-start">
                  <span className="text-xl font-semibold tracking-tight text-foreground">{stat.value}</span>
                  <span className="mt-0.5 text-[11px] font-medium text-muted-foreground/60">{stat.label}</span>
                </div>
              ))}
            </div>

            <a
              href="https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-xs font-medium text-muted-foreground/60 transition-colors duration-200 hover:text-accent"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
              <div className="h-px w-8 rounded-full bg-accent/40" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/70">
                Quién hay detrás
              </span>
            </div>

            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
              Experiencia aplicada para convertir <span className="text-accent">datos en decisiones útiles</span>
            </h2>

            <p className="text-base leading-relaxed text-muted-foreground">
              Trabajo con BI, reporting y automatización aplicada a operaciones comerciales y de
              gestión. Mi foco no es sumar gráficos, sino convertir información dispersa en claridad
              para decidir: clientes, vendedores, margen, objetivos y oportunidades.
            </p>

            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-full border border-border/60 bg-white px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors duration-200 hover:border-accent/30 hover:text-accent"
                >
                  {chip}
                </span>
              ))}
            </div>

            <p className="border-l-2 border-accent/30 pl-4 text-sm leading-relaxed text-muted-foreground">
              No se trata de sumar otra herramienta. Se trata de lograr impacto real, medible y accionable.
            </p>

            <a
              href={CALENDLY_URL}
              onClick={() => {
                trackDiagnosisClick("credibility_section_cta");
                trackCalendlyClick("credibility_section_cta");
              }}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent/75"
            >
              Solicitar diagnóstico
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
