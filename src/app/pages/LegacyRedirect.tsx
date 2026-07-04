import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const HASH_BY_PATH: Record<string, string> = {
  "/servicios": "#soluciones",
  "/dashboard-de-ventas-power-bi": "#demo-contable",
  "/auto-diagnostico": "#como-trabajamos",
  "/presupuesto-dashboard": "#evaluar",
};

export function LegacyRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const target = HASH_BY_PATH[location.pathname] || "";

  useEffect(() => {
    navigate(`/${target}`, { replace: true });
  }, [navigate, target]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-xl border border-[#BEBAB0] bg-[#FCFCFA] p-8 text-center shadow-[0_28px_80px_rgba(17,19,26,0.08)]">
        <p className="mono-label text-[10px] font-semibold uppercase text-[#334BC1]">Oferta actualizada</p>
        <h1 className="mt-5 font-display text-5xl leading-none text-[#11131A]">Este servicio migró.</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Alan L. Perez ahora trabaja en IA aplicada a procesos contables. Te estamos llevando a la nueva
          propuesta.
        </p>
        <Link
          to={`/${target}`}
          className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 bg-[#11131A] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#2D5BFF]"
        >
          Ver la nueva propuesta
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
