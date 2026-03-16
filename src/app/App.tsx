import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

export default function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-accent/15 bg-white px-5 py-3 shadow-lg shadow-black/[0.04]">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Cargando...</span>
          </div>
        </div>
      }
    />
  );
}
