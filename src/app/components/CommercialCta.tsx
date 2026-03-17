import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  QUOTE_PAGE_HREF,
  ROOT_DIAGNOSTIC_SECTION_HREF,
  SERVICES_PAGE_HREF,
} from "../lib/contact";

interface CommercialCtaProps {
  title: string;
  description: string;
  primaryLabel?: string;
}

export function CommercialCta({
  title,
  description,
  primaryLabel = "Ver servicio de dashboards",
}: CommercialCtaProps) {
  return (
    <div className="space-y-4 rounded-2xl bg-foreground p-8 text-background">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-background/70">{description}</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to={SERVICES_PAGE_HREF}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90"
        >
          {primaryLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to={QUOTE_PAGE_HREF}
          className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
        >
          Pedir presupuesto
        </Link>
      </div>

      <a
        href={ROOT_DIAGNOSTIC_SECTION_HREF}
        className="inline-flex items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white/70"
      >
        Prefiero empezar por diagnóstico
        <span>→</span>
      </a>
    </div>
  );
}
