import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const HASH_BY_PATH: Record<string, string> = {
  "/servicios": "#soluciones",
  "/dashboard-de-ventas-power-bi": "#balance-asistido",
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
      <div className="w-full max-w-xl rounded-[1.75rem] border border-border bg-white p-8 text-center">
        <p className="mono-label text-[10px] font-semibold uppercase text-accent">Oferta actualizada</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Este servicio migró.</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Alan L. Perez ahora trabaja en IA aplicada a procesos contables. Te estamos llevando a la nueva
          propuesta.
        </p>
        <Link
          to={`/${target}`}
          className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white"
        >
          Ver la nueva propuesta
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
