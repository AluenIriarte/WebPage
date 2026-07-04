import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main className="paper-grid relative flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <div className="w-full max-w-2xl space-y-6 border border-[#BEBAB0] bg-[#FCFCFA] p-10 text-center shadow-[0_28px_80px_rgba(17,19,26,0.08)] md:p-14">
        <p className="mono-label text-[10px] font-semibold uppercase text-[#334BC1]">404</p>
        <h1 className="font-display text-5xl leading-[0.95] text-[#11131A] md:text-6xl">
          Esta página no existe
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          La ruta que abriste no forma parte de la nueva web. Volvé al inicio y seguí desde ahí.
        </p>
        <Link
          to="/"
          className="inline-flex min-h-13 items-center justify-center bg-[#11131A] px-8 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#2D5BFF]"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
