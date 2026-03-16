import { BarChart3, ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "../../lib/contact";

interface ResourceLayoutProps {
  children: React.ReactNode;
}

export function ResourceLayout({ children }: ResourceLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
              Alan L. Perez
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/recursos"
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-accent transition-colors rounded-lg hover:bg-accent/5"
            >
              Recursos
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-accent transition-colors rounded-lg hover:bg-accent/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Inicio
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="border-t border-border/50 bg-white mt-24 py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">Alan L. Perez</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Inicio
              </Link>
              <Link
                to="/recursos"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Recursos
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Contacto
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/40 text-center">
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} Alan L. Perez - Business Intelligence & Sistemas de Decisión
              Comercial
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
