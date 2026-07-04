import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { PROCESS_EVALUATION_PAGE_HREF } from "../lib/contact";

const navigation = [
  { label: "La demo", href: "/#demo-contable" },
  { label: "El método", href: "/#como-trabajamos" },
  { label: "Control", href: "/#privacidad" },
  { label: "Quién implementa", href: "/#alan" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 18);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        scrolled || menuOpen
          ? "border-[#D9D5CB]/90 bg-[#F5F1E8]/95 backdrop-blur-xl"
          : "border-transparent bg-[#F5F1E8]/72 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-7 lg:px-10 xl:px-14">
        <Link to="/" className="group flex min-h-11 items-center gap-3" aria-label="Alan L. Perez, inicio">
          <span className="font-display flex h-9 w-9 items-center justify-center border border-[#11131A] text-xl italic text-[#11131A] transition-colors duration-200 group-hover:border-[#2D5BFF] group-hover:text-[#2D5BFF]">
            A
          </span>
          <span>
            <span className="block text-[13px] font-semibold tracking-[-0.015em] text-[#11131A]">Alan L. Perez</span>
            <span className="mono-label mt-0.5 block text-[8px] font-semibold uppercase text-[#62645F]">
              IA aplicada
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegación principal">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative flex min-h-11 items-center text-xs font-semibold text-[#666870] transition-colors duration-200 after:absolute after:bottom-1 after:left-0 after:h-px after:w-0 after:bg-[#2D5BFF] after:transition-[width] after:duration-200 hover:text-[#11131A] hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to={PROCESS_EVALUATION_PAGE_HREF}
            className="group inline-flex min-h-11 items-center justify-center gap-2 bg-[#11131A] px-5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2D5BFF]"
          >
            Evaluar un proceso
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center border border-[#BEBAB0] bg-[#FCFCFA] text-[#11131A] lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <m.nav
            id="mobile-navigation"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            className="border-t border-[#D9D5CB] bg-[#F5F1E8] px-5 pb-6 pt-4 lg:hidden"
            aria-label="Navegación móvil"
          >
            <div className="mx-auto grid max-w-[1440px]">
              {navigation.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="grid min-h-13 grid-cols-[36px_1fr] items-center border-b border-[#D9D5CB] text-sm font-semibold text-[#303239]"
                >
                  <span className="mono-label text-[8px] text-[#62645F]">0{index + 1}</span>
                  {item.label}
                </a>
              ))}
              <Link
                to={PROCESS_EVALUATION_PAGE_HREF}
                className="mt-5 inline-flex min-h-13 items-center justify-between bg-[#11131A] px-5 text-sm font-semibold text-white"
              >
                Evaluar un proceso
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </m.nav>
        ) : null}
      </AnimatePresence>
      </header>
    </LazyMotion>
  );
}
