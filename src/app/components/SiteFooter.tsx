import { Linkedin, Mail, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, PROCESS_EVALUATION_PAGE_HREF } from "../lib/contact";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0B1220] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0B1220]">
                <Workflow className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">Alan L. Perez</p>
                <p className="text-xs text-white/55">IA aplicada a procesos contables</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/62">
              Implementación de flujos asistidos para estudios contables que necesitan ganar capacidad
              operativa sin delegar el criterio profesional.
            </p>
          </div>

          <div>
            <p className="mono-label text-[10px] font-semibold uppercase text-white/40">Explorar</p>
            <div className="mt-4 grid gap-3 text-sm text-white/70">
              <a href="/#soluciones" className="hover:text-white">Soluciones</a>
              <a href="/#como-trabajamos" className="hover:text-white">Cómo trabajamos</a>
              <a href="/#privacidad" className="hover:text-white">Privacidad</a>
              <Link to={PROCESS_EVALUATION_PAGE_HREF} className="hover:text-white">Evaluar un proceso</Link>
            </div>
          </div>

          <div>
            <p className="mono-label text-[10px] font-semibold uppercase text-white/40">Contacto</p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                aria-label="Enviar email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                aria-label="LinkedIn de Alan L. Perez"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Alan L. Perez.</p>
          <p>Argentina · Implementación y acompañamiento profesional</p>
        </div>
      </div>
    </footer>
  );
}
