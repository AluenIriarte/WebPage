import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  TrendingUp,
  Target,
  BarChart2,
  BookOpen,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { trackDiagnosisClick } from "../lib/analytics";
import { DEMO_PAGE_HREF } from "../lib/contact";

const recursos = [
  {
    label: "Todas las gu\u00edas",
    desc: "Hub de recursos y art\u00edculos",
    href: "/recursos",
    icon: BookOpen,
    isHub: true,
  },
  {
    label: "\u00bfQu\u00e9 es un dashboard?",
    desc: "Definici\u00f3n, tipos y para qu\u00e9 sirve",
    href: "/recursos/que-es-un-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Dashboard de ventas",
    desc: "Qu\u00e9 medir y c\u00f3mo estructurarlo",
    href: "/recursos/dashboard-de-ventas",
    icon: TrendingUp,
  },
  {
    label: "KPIs comerciales",
    desc: "La gu\u00eda definitiva",
    href: "/recursos/kpis-comerciales",
    icon: Target,
  },
  {
    label: "Tablero de ventas",
    desc: "C\u00f3mo construirlo e implementarlo",
    href: "/recursos/tablero-de-ventas",
    icon: BarChart2,
  },
];

interface HeaderProps {
  variant?: "default" | "conversion";
}

export function Header({ variant = "default" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRecursosOpen, setIsRecursosOpen] = useState(false);
  const [isMobileRecursosOpen, setIsMobileRecursosOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const isConversion = variant === "conversion";
  const isDemoConversion = isConversion && location.pathname === "/demo-dashboard";
  const isDemoPage = location.pathname === DEMO_PAGE_HREF;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isConversion) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRecursosOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isConversion]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileRecursosOpen(false);
    setIsRecursosOpen(false);
  }, [location.pathname, location.hash]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsRecursosOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsRecursosOpen(false), 120);
  };

  const homeHref = (hash: string) => (location.pathname === "/" ? hash : `/${hash}`);
  const brandHref = homeHref("#home");

  const navItems = [
    { label: "Inicio", href: homeHref("#home") },
    { label: "Qu\u00e9 resuelvo", href: homeHref("#problema") },
    { label: "C\u00f3mo trabajo", href: homeHref("#proceso") },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDemoConversion || isDemoPage
          ? "border-b border-border/50 bg-[rgba(243,241,238,0.88)] backdrop-blur-xl"
          : isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-5">
            <a href={brandHref} className="flex items-center space-x-2 group">
              <span className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                Alan L. Perez
              </span>
            </a>

            {isDemoConversion && (
              <a
                href={homeHref("#home")}
                className="hidden md:inline-flex text-sm font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                Volver al inicio
              </a>
            )}
          </div>

          {!isConversion && (
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                </a>
              ))}

              <Link
                to={DEMO_PAGE_HREF}
                className={`text-sm font-medium transition-colors relative group ${
                  isDemoPage ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Ver demo
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                    isDemoPage ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>

              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setIsRecursosOpen((value) => !value)}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors relative group ${
                    isRecursosOpen ? "text-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Recursos
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isRecursosOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isRecursosOpen ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isRecursosOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white rounded-2xl shadow-xl shadow-black/[0.08] border border-border/50 overflow-hidden"
                    >
                      <div className="p-2">
                        <Link
                          to="/recursos"
                          onClick={() => setIsRecursosOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-accent/6 border border-accent/12 hover:bg-accent/10 transition-colors group/item"
                        >
                          <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-3.5 h-3.5 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground group-hover/item:text-accent transition-colors leading-tight">
                              Todas las gu\u00edas
                            </p>
                            <p className="text-[11px] text-muted-foreground/70 leading-tight mt-0.5">
                              Hub de recursos y art\u00edculos
                            </p>
                          </div>
                        </Link>
                      </div>

                      <div className="mx-4 border-t border-border/40" />

                      <div className="p-2 space-y-0.5">
                        {recursos.slice(1).map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setIsRecursosOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
                            >
                              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover/item:bg-accent/10 transition-colors">
                                <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover/item:text-accent transition-colors" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground group-hover/item:text-accent transition-colors leading-tight">
                                  {item.label}
                                </p>
                                <p className="text-[11px] text-muted-foreground/60 leading-tight mt-0.5">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {!isConversion && (
              <a
                href={homeHref("#contacto")}
                onClick={() => trackDiagnosisClick("header_desktop")}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-accent text-accent-foreground rounded-full font-medium text-sm hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
              >
                {"Agendar diagn\u00f3stico"}
              </a>
            )}

            {isConversion && (
              <a
                href={homeHref("#contacto")}
                onClick={() => trackDiagnosisClick("header_conversion")}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-accent text-accent-foreground rounded-full font-medium text-sm hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
              >
                {"Agendar diagn\u00f3stico"}
              </a>
            )}
          </div>

          {!isConversion && (
            <button
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {isConversion && (
            <a
              href={homeHref("#contacto")}
              onClick={() => trackDiagnosisClick("header_conversion_mobile")}
              className="md:hidden inline-flex items-center justify-center px-4 py-2.5 bg-accent text-accent-foreground rounded-full font-medium text-sm hover:bg-accent/90 transition-colors"
            >
              {"Agendar diagn\u00f3stico"}
            </a>
          )}
        </div>
      </div>

      {!isConversion && (
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-border bg-white/95 backdrop-blur-xl"
            >
              <div className="px-6 py-6 space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-base font-medium text-foreground hover:text-accent transition-colors rounded-lg hover:bg-accent/5"
                  >
                    {item.label}
                  </a>
                ))}

                <Link
                  to={DEMO_PAGE_HREF}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 text-base font-medium transition-colors rounded-lg hover:bg-accent/5 ${
                    isDemoPage ? "text-accent" : "text-foreground hover:text-accent"
                  }`}
                >
                  Ver demo
                </Link>

                <div>
                  <button
                    onClick={() => setIsMobileRecursosOpen((value) => !value)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-base font-medium text-foreground hover:text-accent transition-colors rounded-lg hover:bg-accent/5"
                  >
                    Recursos
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isMobileRecursosOpen ? "rotate-180 text-accent" : "text-muted-foreground"
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isMobileRecursosOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-accent/20 pl-3">
                          {recursos.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setIsMobileRecursosOpen(false);
                                }}
                                className={`flex items-center gap-2 py-2 text-sm transition-colors rounded-lg px-2 hover:bg-accent/5 ${
                                  item.isHub
                                    ? "font-semibold text-accent"
                                    : "text-muted-foreground hover:text-accent"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                {item.label}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-3">
                  <a
                    href={homeHref("#contacto")}
                    onClick={() => {
                      trackDiagnosisClick("header_mobile");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-center px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium text-sm hover:bg-accent/90 transition-colors"
                  >
                    {"Agendar diagn\u00f3stico"}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.header>
  );
}
