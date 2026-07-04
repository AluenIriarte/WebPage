import { createBrowserRouter } from "react-router-dom";
import { LegacyRedirect } from "./pages/LegacyRedirect";
import { Root } from "./pages/Root";
import { RouteErrorPage } from "./pages/RouteErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { Home } = await import("./pages/Home");
          return { Component: Home };
        },
      },
      {
        path: "evaluar-proceso",
        lazy: async () => {
          const { ProcessEvaluation } = await import("./pages/ProcessEvaluation");
          return { Component: ProcessEvaluation };
        },
      },
      {
        path: "gracias/evaluacion",
        lazy: async () => {
          const { EvaluationThankYou } = await import("./pages/EvaluationThankYou");
          return { Component: EvaluationThankYou };
        },
      },
      {
        path: "servicios",
        Component: LegacyRedirect,
      },
      {
        path: "dashboard-de-ventas-power-bi",
        Component: LegacyRedirect,
      },
      {
        path: "auto-diagnostico",
        Component: LegacyRedirect,
      },
      {
        path: "gracias/auto-diagnostico",
        Component: LegacyRedirect,
      },
      {
        path: "gracias/presupuesto-dashboard",
        Component: LegacyRedirect,
      },
      {
        path: "presupuesto-dashboard",
        Component: LegacyRedirect,
      },
      {
        path: "recursos/*",
        Component: LegacyRedirect,
      },
      {
        path: "*",
        lazy: async () => {
          const { NotFound } = await import("./pages/NotFound");
          return { Component: NotFound };
        },
      },
    ],
  },
]);
