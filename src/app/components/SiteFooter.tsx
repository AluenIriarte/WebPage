import { ArrowUpRight, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, PROCESS_EVALUATION_PAGE_HREF } from "../lib/contact";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#11131A] text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-7 lg:px-10 lg:py-16 xl:px-14">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display flex h-10 w-10 items-center justify-center border border-white/35 text-2xl italic">
                A
              </span>
              <div>
                <p className="text-sm font-semibold">Alan L. Perez</p>
                <p className="mono-label mt-1 text-[8px] uppercase text-white/58">IA aplicada a procesos</p>
              </div>
            </div>
            <p className="mt-6 max-w-lg text-sm leading-7 text-white/55">
              Implementación de flujos asistidos para estudios contables que necesitan ganar capacidad operativa
              sin delegar el criterio profesional.
            </p>
          </div>

          <div>
            <p className="mono-label text-[9px] font-semibold uppercase text-white/58">Recorrido</p>
            <div className="mt-5 grid gap-3 text-sm text-white/62">
              <a href="/#demo-contable" className="transition-colors hover:text-white">Demo</a>
              <a href="/#como-trabajamos" className="transition-colors hover:text-white">Método</a>
              <a href="/#privacidad" className="transition-colors hover:text-white">Control</a>
              <a href="/#alan" className="transition-colors hover:text-white">Quién implementa</a>
            </div>
          </div>

          <div>
            <p className="mono-label text-[9px] font-semibold uppercase text-white/58">Contacto</p>
            <div className="mt-5 grid gap-3">
              <Link
                to={PROCESS_EVALUATION_PAGE_HREF}
                className="group flex min-h-11 items-center justify-between border-b border-white/20 text-sm font-semibold text-white transition-colors hover:border-[#9DA9FF] hover:text-[#B3BBFF]"
              >
                Evaluar proceso
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex h-11 w-11 items-center justify-center border border-white/18 text-white/62 transition-colors hover:border-white/50 hover:text-white"
                  aria-label="Enviar email"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center border border-white/18 text-white/62 transition-colors hover:border-white/50 hover:text-white"
                  aria-label="LinkedIn de Alan L. Perez"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-[10px] text-white/52 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Alan L. Perez.</p>
          <p>Argentina · Datos ficticios en todas las demostraciones públicas</p>
        </div>
      </div>
    </footer>
  );
}
