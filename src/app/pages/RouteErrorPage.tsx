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
    <main className="min-h-screen bg-background px-6 py-16 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-border/50 bg-white p-8 shadow-2xl shadow-black/[0.05] lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold tracking-wide text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            Error de carga
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
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
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90"
            >
              <RefreshCcw className="h-4 w-4" />
              Recargar página
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:text-accent"
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
