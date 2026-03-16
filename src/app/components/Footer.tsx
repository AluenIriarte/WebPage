import { Linkedin, Mail, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { CONTACT_EMAIL } from "../lib/contact";

export function Footer() {
  const location = useLocation();
  const homeHref = (hash: string) => (location.pathname === "/" ? hash : `/${hash}`);

  const navigation = {
    main: [
      { name: "Inicio", href: homeHref("#home"), internal: false },
      { name: "Qué resuelvo", href: homeHref("#problema"), internal: false },
      { name: "Cómo trabajo", href: homeHref("#proceso"), internal: false },
      { name: "Oportunidades", href: homeHref("#oportunidades"), internal: false },
      { name: "Servicios", href: "/servicios", internal: true },
      { name: "Recursos", href: "/recursos", internal: true },
    ],
    social: [
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/alanlperez",
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
    <footer className="bg-white border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-foreground">Alan L. Perez</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Transformo datos comerciales en sistemas de decisión claros, accionables y orientados a
              detectar oportunidades.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Navegación</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  {item.internal ? (
                    <Link to={item.href} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                      {item.name}
                    </Link>
                  ) : (
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Contacto</h3>
            <div className="space-y-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="block text-sm text-muted-foreground hover:text-accent transition-colors"
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
                    className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-accent/10 hover:text-accent transition-all duration-300"
                    aria-label={item.name}
                  >
                    <item.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground/40 italic mb-6">
            Los datos no son el problema. Saber dónde mirar, sí.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Alan L. Perez. Todos los derechos reservados.
            </p>
            <a
              href="https://alanlperez.com"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              alanlperez.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
