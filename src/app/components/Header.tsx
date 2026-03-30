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
import { DEMO_PAGE_HREF } from "../lib/contact";

const recursos = [
  {
    label: "Todas las guias",
    desc: "Hub de recursos y articulos",
    href: "/recursos",
    icon: BookOpen,
    isHub: true,
  },
  {
    label: "Que es un dashboard?",
    desc: "Definicion, tipos y para que sirve",
    href: "/recursos/que-es-un-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Dashboard de ventas",
    desc: "Que medir y como estructurarlo",
    href: "/recursos/dashboard-de-ventas",
    icon: TrendingUp,
  },
  {
    label: "KPIs comerciales",
    desc: "La guia definitiva",
    href: "/recursos/kpis-comerciales",
    icon: Target,
  },
  {
    label: "Tablero de ventas",
    desc: "Como construirlo e implementarlo",
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
  const disableEntranceMotion = isDemoConversion || isDemoPage;

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
    { label: "Qu\u00e9 resuelvo", href: homeHref("#problema") },
    { label: "C\u00f3mo trabajo", href: homeHref("#proceso") },
    { label: "FAQ", href: homeHref("#faq") },
    { label: "Ir a contacto", href: homeHref("#contacto") },
  ];
  const [opportunitiesItem, processItem, faqItem, contactItem] = navItems;
  const primaryCtaItem = { label: contactItem.label, mobileLabel: "Contacto", href: contactItem.href };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDemoConversion || isDemoPage
          ? "border-b border-border/50 bg-[rgba(243,241,238,0.88)] backdrop-blur-xl"
          : isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
      }`}
      initial={disableEntranceMotion ? { y: 0 } : { y: -100 }}
      animate={{ y: 0 }}
      transition={disableEntranceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5">
            <a href={brandHref} className="group flex items-center space-x-2">
              <span className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-xl">
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
            <nav className="hidden items-center space-x-8 md:flex">
              <a
                href={opportunitiesItem.href}
                className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {opportunitiesItem.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>

              <a
                href={processItem.href}
                className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {processItem.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>

              <Link
                to={DEMO_PAGE_HREF}
                className={`group relative text-sm font-medium transition-colors ${
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
                  className={`group relative flex items-center gap-1 text-sm font-medium transition-colors ${
                    isRecursosOpen ? "text-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Recursos
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
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
                      className="absolute top-full left-1/2 mt-4 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-border/50 bg-white shadow-xl shadow-black/[0.08]"
                    >
                      <div className="p-2">
                        <Link
                          to="/recursos"
                          onClick={() => setIsRecursosOpen(false)}
                          className="group/item flex items-center gap-3 rounded-xl border border-accent/12 bg-accent/6 px-3 py-2.5 transition-colors hover:bg-accent/10"
                        >
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-accent/15">
                            <BookOpen className="h-3.5 w-3.5 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold leading-tight text-foreground transition-colors group-hover/item:text-accent">
                              Todas las guias
                            </p>
                            <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground/70">
                              Hub de recursos y articulos
                            </p>
                          </div>
                        </Link>
                      </div>

                      <div className="mx-4 border-t border-border/40" />

                      <div className="space-y-0.5 p-2">
                        {recursos.slice(1).map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setIsRecursosOpen(false)}
                              className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/60"
                            >
                              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover/item:bg-accent/10">
                                <Icon className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover/item:text-accent" />
                              </div>
                              <div>
                                <p className="text-sm font-medium leading-tight text-foreground transition-colors group-hover/item:text-accent">
                                  {item.label}
                                </p>
                                <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground/60">
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

              <a
                href={faqItem.href}
                className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {faqItem.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>

              <a
                href={primaryCtaItem.href}
                className="group relative rounded-full border border-accent/15 bg-accent/[0.05] px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-accent/25 hover:bg-accent/[0.08] hover:text-accent"
              >
                {primaryCtaItem.label}
                <span className="absolute -bottom-1 left-3 right-3 h-0.5 scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </nav>
          )}

          {!isConversion && (
            <div className="flex items-center gap-2 md:hidden">
              <a
                href={primaryCtaItem.href}
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-accent/15 bg-accent/[0.05] px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/25 hover:bg-accent/[0.08] hover:text-accent"
              >
                {primaryCtaItem.mobileLabel}
              </a>

              <button
                onClick={() => setIsMobileMenuOpen((value) => !value)}
                className="p-2 text-foreground transition-colors hover:text-accent"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
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
              className="border-t border-border bg-white/95 backdrop-blur-xl md:hidden"
            >
              <div className="space-y-1 px-6 py-6">
                <a
                  href={opportunitiesItem.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-accent/5 hover:text-accent"
                >
                  {opportunitiesItem.label}
                </a>

                <a
                  href={processItem.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-accent/5 hover:text-accent"
                >
                  {processItem.label}
                </a>

                <Link
                  to={DEMO_PAGE_HREF}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-accent/5 ${
                    isDemoPage ? "text-accent" : "text-foreground hover:text-accent"
                  }`}
                >
                  Ver demo
                </Link>

                <div>
                  <button
                    onClick={() => setIsMobileRecursosOpen((value) => !value)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-accent/5 hover:text-accent"
                  >
                    Recursos
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
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
                                className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent/5 ${
                                  item.isHub
                                    ? "font-semibold text-accent"
                                    : "text-muted-foreground hover:text-accent"
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                                {item.label}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <a
                  href={faqItem.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-accent/5 hover:text-accent"
                >
                  {faqItem.label}
                </a>

                <a
                  href={primaryCtaItem.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-full border border-accent/15 bg-accent/[0.05] px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:border-accent/25 hover:bg-accent/[0.08] hover:text-accent"
                >
                  {primaryCtaItem.label}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.header>
  );
}
