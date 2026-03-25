import { createBrowserRouter } from "react-router-dom";
import { AutoDiagnostico } from "./pages/AutoDiagnostico";
import { DashboardVentasPowerBi } from "./pages/DashboardVentasPowerBi";
import { DemoDashboard } from "./pages/DemoDashboard";
import { GraciasAutoDiagnostico } from "./pages/GraciasAutoDiagnostico";
import { GraciasPresupuestoDashboard } from "./pages/GraciasPresupuestoDashboard";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Root } from "./pages/Root";
import { RouteErrorPage } from "./pages/RouteErrorPage";
import { Servicios } from "./pages/Servicios";
import { PresupuestoDashboard } from "./pages/PresupuestoDashboard";
import { AutoevaluacionEjecutiva } from "./pages/recursos/AutoevaluacionEjecutiva";
import { DashboardDeVentas } from "./pages/recursos/DashboardDeVentas";
import { KpisComerciales } from "./pages/recursos/KpisComerciales";
import { QueEsUnDashboard } from "./pages/recursos/QueEsUnDashboard";
import { RecursosHub } from "./pages/recursos/RecursosHub";
import { TableroDeVentas } from "./pages/recursos/TableroDeVentas";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "servicios",
        Component: Servicios,
      },
      {
        path: "dashboard-de-ventas-power-bi",
        Component: DashboardVentasPowerBi,
      },
      {
        path: "demo-dashboard",
        Component: DemoDashboard,
      },
      {
        path: "auto-diagnostico",
        Component: AutoDiagnostico,
      },
      {
        path: "gracias/auto-diagnostico",
        Component: GraciasAutoDiagnostico,
      },
      {
        path: "gracias/presupuesto-dashboard",
        Component: GraciasPresupuestoDashboard,
      },
      {
        path: "presupuesto-dashboard",
        Component: PresupuestoDashboard,
      },
      {
        path: "recursos",
        Component: RecursosHub,
      },
      {
        path: "recursos/que-es-un-dashboard",
        Component: QueEsUnDashboard,
      },
      {
        path: "recursos/dashboard-de-ventas",
        Component: DashboardDeVentas,
      },
      {
        path: "recursos/autoevaluacion-ejecutiva",
        Component: AutoevaluacionEjecutiva,
      },
      {
        path: "recursos/kpis-comerciales",
        Component: KpisComerciales,
      },
      {
        path: "recursos/tablero-de-ventas",
        Component: TableroDeVentas,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);
