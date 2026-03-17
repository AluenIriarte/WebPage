import { createBrowserRouter } from "react-router-dom";
import { Root } from "./pages/Root";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        lazy: async () => {
          const { Home } = await import("./pages/Home");
          return { Component: Home };
        },
      },
      {
        path: "servicios",
        lazy: async () => {
          const { Servicios } = await import("./pages/Servicios");
          return { Component: Servicios };
        },
      },
      {
        path: "demo-dashboard",
        lazy: async () => {
          const { DemoDashboard } = await import("./pages/DemoDashboard");
          return { Component: DemoDashboard };
        },
      },
      {
        path: "auto-diagnostico",
        lazy: async () => {
          const { AutoDiagnostico } = await import("./pages/AutoDiagnostico");
          return { Component: AutoDiagnostico };
        },
      },
      {
        path: "gracias/auto-diagnostico",
        lazy: async () => {
          const { GraciasAutoDiagnostico } = await import("./pages/GraciasAutoDiagnostico");
          return { Component: GraciasAutoDiagnostico };
        },
      },
      {
        path: "presupuesto-dashboard",
        lazy: async () => {
          const { PresupuestoDashboard } = await import("./pages/PresupuestoDashboard");
          return { Component: PresupuestoDashboard };
        },
      },
      {
        path: "recursos",
        lazy: async () => {
          const { RecursosHub } = await import("./pages/recursos/RecursosHub");
          return { Component: RecursosHub };
        },
      },
      {
        path: "recursos/que-es-un-dashboard",
        lazy: async () => {
          const { QueEsUnDashboard } = await import("./pages/recursos/QueEsUnDashboard");
          return { Component: QueEsUnDashboard };
        },
      },
      {
        path: "recursos/dashboard-de-ventas",
        lazy: async () => {
          const { DashboardDeVentas } = await import("./pages/recursos/DashboardDeVentas");
          return { Component: DashboardDeVentas };
        },
      },
      {
        path: "recursos/kpis-comerciales",
        lazy: async () => {
          const { KpisComerciales } = await import("./pages/recursos/KpisComerciales");
          return { Component: KpisComerciales };
        },
      },
      {
        path: "recursos/tablero-de-ventas",
        lazy: async () => {
          const { TableroDeVentas } = await import("./pages/recursos/TableroDeVentas");
          return { Component: TableroDeVentas };
        },
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
