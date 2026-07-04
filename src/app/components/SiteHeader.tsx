import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Workflow, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { PROCESS_EVALUATION_PAGE_HREF } from "../lib/contact";

const navigation = [
  { label: "El problema", href: "/#problema" },
  { label: "Soluciones", href: "/#soluciones" },
  { label: "Cómo trabajamos", href: "/#como-trabajamos" },
  { label: "Privacidad", href: "/#privacidad" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/75 bg-[#F7F7F3]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link to="/" className="group flex min-h-11 items-center gap-3" aria-label="Alan L. Perez, inicio">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors duration-200 group-hover:bg-accent">
            <Workflow className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-[-0.02em] text-foreground">Alan L. Perez</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              IA aplicada
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex min-h-11 items-center text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to={PROCESS_EVALUATION_PAGE_HREF}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-accent"
          >
            Evaluar un proceso
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-navigation"
          className="border-t border-border bg-[#F7F7F3] px-5 pb-6 pt-4 lg:hidden"
          aria-label="Navegación móvil"
        >
          <div className="mx-auto grid max-w-7xl gap-1">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex min-h-12 items-center rounded-xl px-3 text-sm font-medium text-foreground hover:bg-white"
              >
                {item.label}
              </a>
            ))}
            <Link
              to={PROCESS_EVALUATION_PAGE_HREF}
              className="mt-3 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
            >
              Evaluar un proceso
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
