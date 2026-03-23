import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { DEMO_PAGE_HREF, ROOT_DIAGNOSTIC_SECTION_HREF } from "../lib/contact";

const LINKEDIN_URL = "https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true";

interface CommercialCtaProps {
  title: string;
  description: string;
}

export function CommercialCta({ title, description }: CommercialCtaProps) {
  return (
    <div className="rounded-[2rem] border border-border/50 bg-white p-8 shadow-2xl shadow-black/[0.05] lg:p-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-4 py-2">
        <span className="text-xs font-semibold tracking-wide text-accent">Siguiente paso</span>
      </div>

      <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to={DEMO_PAGE_HREF}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent"
        >
          Ver demo
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <a
          href={ROOT_DIAGNOSTIC_SECTION_HREF}
          className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
        >
          Agendar diagnóstico
        </a>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        ¿Preferís un contacto más simple primero?{" "}
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent transition-colors hover:text-accent/75"
        >
          Escribime por LinkedIn
        </a>
        .
      </p>
    </div>
  );
}
