import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-[2rem] border border-border/60 bg-white p-10 md:p-14 shadow-2xl shadow-black/[0.06] text-center space-y-6">
        <p className="text-xs font-semibold text-accent/70 uppercase tracking-[0.18em]">404</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
          Esta pagina no existe
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          La ruta que abriste no forma parte de la nueva web. Volve al inicio y segui desde ahi.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white rounded-full font-medium text-base hover:bg-accent/90 transition-all duration-300 hover:shadow-xl hover:shadow-accent/25"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
