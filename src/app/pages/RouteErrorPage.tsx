import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

function getErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return error.statusText || "No pudimos cargar esta página.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No pudimos cargar esta página.";
}

export function RouteErrorPage() {
  const error = useRouteError();
  const message = getErrorMessage(error);
  const isChunkLoadError = /Failed to fetch dynamically imported module|ChunkLoadError|Importing a module script failed/i.test(
    message,
  );

  return (
    <main className="paper-grid relative min-h-screen bg-background px-6 py-16 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <div className="w-full border border-[#BEBAB0] bg-[#FCFCFA] p-8 shadow-[0_28px_80px_rgba(17,19,26,0.08)] lg:p-10">
          <div className="inline-flex items-center gap-2 border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold tracking-wide text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5" />
            Error de carga
          </div>

          <h1 className="mt-6 font-display text-5xl leading-[0.95] text-[#11131A] md:text-6xl">
            {isChunkLoadError ? "La web se actualizó mientras navegabas." : "No pudimos abrir esta página."}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {isChunkLoadError
              ? "Recargá la página para traer la versión nueva del sitio y seguir navegando sin fricción."
              : "Hubo un problema cargando esta ruta. Probá recargar o volver al inicio."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#11131A] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#2D5BFF]"
            >
              <RefreshCcw className="h-4 w-4" />
              Recargar página
            </button>
            <Link
              to="/"
              className="inline-flex min-h-12 items-center justify-center border border-[#BEBAB0] px-6 text-sm font-semibold text-foreground transition-colors hover:border-[#2D5BFF] hover:text-[#2D5BFF]"
            >
              Volver al inicio
            </Link>
          </div>

          {!isChunkLoadError ? (
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Detalle técnico: {message}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
