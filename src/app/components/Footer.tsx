import { Linkedin, Mail, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  CONTACT_EMAIL,
  QUOTE_PAGE_HREF,
  SERVICES_PAGE_HREF,
} from "../lib/contact";

export function Footer() {
  const location = useLocation();
  const homeHref = (hash: string) => (location.pathname === "/" ? hash : `/${hash}`);

  const navigation = {
    main: [
      { name: "Inicio", href: homeHref("#home"), internal: false },
      { name: "Qué resuelvo", href: homeHref("#problema"), internal: false },
      { name: "Cómo trabajo", href: homeHref("#proceso"), internal: false },
      { name: "Servicios", href: SERVICES_PAGE_HREF, internal: true },
      { name: "Pedir presupuesto", href: QUOTE_PAGE_HREF, internal: true },
      { name: "Recursos", href: "/recursos", internal: true },
    ],
    social: [
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/alan-leonel-perez-argentina/?skipRedirect=true",
        icon: Linkedin,
      },
      {
        name: "Email",
        href: `mailto:${CONTACT_EMAIL}`,
        icon: Mail,
      },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-foreground">Alan L. Perez</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Dashboards de ventas, tableros comerciales y sistemas de BI para volver visible dónde
              se pierde o se gana dinero.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Navegación</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  {item.internal ? (
                    <Link to={item.href} className="text-sm text-muted-foreground transition-colors hover:text-accent">
                      {item.name}
                    </Link>
                  ) : (
                    <a href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-accent">
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Contacto</h3>
            <div className="space-y-3">
              <Link
                to={QUOTE_PAGE_HREF}
                className="block text-sm font-medium text-foreground transition-colors hover:text-accent"
              >
                Pedir presupuesto
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="block text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                {CONTACT_EMAIL}
              </a>
              <div className="flex space-x-4 pt-2">
                {navigation.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-all duration-300 hover:bg-accent/10 hover:text-accent"
                    aria-label={item.name}
                  >
                    <item.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8">
          <p className="mb-6 text-center text-sm italic text-muted-foreground/40">
            Los datos no son el problema. Saber dónde mirar, sí.
          </p>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Alan L. Perez. Todos los derechos reservados.
            </p>
            <a
              href="https://alanlperez.com"
              className="text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              alanlperez.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
