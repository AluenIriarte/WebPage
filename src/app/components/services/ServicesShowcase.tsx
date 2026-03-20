import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { trackDiagnosisClick } from "../../lib/analytics";
import { buildServiceFlowHref, buildServicePath, services } from "../../lib/services";

interface ServicesShowcaseProps {
  sectionId?: string;
  eyebrow: string;
  title: string;
  description: string;
  compact?: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function ServicesShowcase({
  sectionId = "servicios",
  eyebrow,
  title,
  description,
  compact = false,
}: ServicesShowcaseProps) {
  return (
    <section id={sectionId} className={`bg-[#F8F8F6] ${compact ? "py-20 lg:py-24" : "py-24 lg:py-28"}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-[3rem]">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        </motion.div>

        <div className="mt-14 space-y-5 lg:mt-16">
          {services.map((service, index) => {
            const quoteHref = buildServiceFlowHref(service.slug, "diagnostico");

            return (
              <motion.article
                key={service.slug}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="overflow-hidden rounded-[2rem] border border-border/55 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.05)]"
              >
                <div className="grid gap-px bg-border/45 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="bg-white px-7 py-8 lg:px-9 lg:py-9">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-sm font-semibold text-accent">
                            0{service.order}
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                            {service.eyebrow}
                          </span>
                        </div>
                        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground md:text-[2rem]">
                          {service.title}
                        </h3>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4F1FF] text-accent">
                        <service.icon className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/78">
                      {service.tagline}
                    </p>

                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {service.summary}
                    </p>

                    <div className="mt-7 rounded-[1.5rem] border border-border/55 bg-[#FBFBF9] p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                        Entregable
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/78">{service.deliverable}</p>
                    </div>
                  </div>

                  <div className="bg-[#FCFCFA] px-7 py-8 lg:px-9 lg:py-9">
                    <div className="rounded-[1.5rem] border border-border/55 bg-white p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/55">
                        Ideal para
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/78">{service.audience}</p>
                    </div>

                    <div className="mt-5 space-y-3">
                      {service.homeHighlights.map((item) => (
                        <div key={item} className="flex gap-3 rounded-[1.35rem] border border-border/45 bg-white px-4 py-4">
                          <div className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/55" />
                          <p className="text-sm leading-relaxed text-foreground/75">{item}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Link
                        to={quoteHref}
                        onClick={() => trackDiagnosisClick("services_showcase_card", service.title)}
                        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                      >
                        Iniciar diagnóstico
                      </Link>
                      <Link
                        to={buildServicePath(service.slug)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
                      >
                        Ver detalle
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
