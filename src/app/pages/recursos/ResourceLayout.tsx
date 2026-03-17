import { BarChart3, ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, QUOTE_PAGE_HREF, SERVICES_PAGE_HREF } from "../../lib/contact";

interface ResourceLayoutProps {
  children: React.ReactNode;
}

export function ResourceLayout({ children }: ResourceLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="group flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-foreground transition-colors group-hover:text-accent">
              Alan L. Perez
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to={SERVICES_PAGE_HREF}
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/5 hover:text-accent"
            >
              Servicios
            </Link>
            <Link
              to={QUOTE_PAGE_HREF}
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/5 hover:text-accent"
            >
              Presupuesto
            </Link>
            <Link
              to="/recursos"
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/5 hover:text-accent"
            >
              Recursos
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/5 hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Inicio
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="mt-24 border-t border-border/50 bg-white py-12">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent">
                <BarChart3 className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">Alan L. Perez</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                Inicio
              </Link>
              <Link
                to={SERVICES_PAGE_HREF}
                className="text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                Servicios
              </Link>
              <Link
                to={QUOTE_PAGE_HREF}
                className="text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                Pedir presupuesto
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                <Mail className="h-3.5 w-3.5" />
                Contacto
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-border/40 pt-6 text-center">
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} Alan L. Perez - Dashboards de ventas y BI comercial a
              medida
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
