import { useEffect, useMemo, useState } from "react";

type PreviewView = "month" | "team" | "mix";

type PreviewMetric = {
  label: string;
  value: string;
  note: string;
};

type PreviewConfig = {
  title: string;
  subtitle: string;
  summary: string;
  badge: string;
  chartEyebrow: string;
  chartTitle: string;
  periodLabel: string;
  xLabels: string[];
  primaryLabel: string;
  secondaryLabel: string;
  primary: number[];
  secondary: number[];
  metrics: PreviewMetric[];
};

const previewViews: { key: PreviewView; label: string }[] = [
  { key: "month", label: "Mes" },
  { key: "team", label: "Equipo" },
  { key: "mix", label: "Mix" },
];

const previewData: Record<PreviewView, PreviewConfig> = {
  month: {
    title: "Tablero comercial activo",
    subtitle: "Lectura general de cartera, margen y expansion.",
    summary: "La facturacion aguanta, pero la perdida esta en actividad y margen.",
    badge: "Prioridad hoy",
    chartEyebrow: "Panorama mensual",
    chartTitle: "Ventas vs margen",
    periodLabel: "Q1 2026",
    xLabels: ["S1", "S2", "S3", "S4", "S5"],
    primaryLabel: "Ventas",
    secondaryLabel: "Margen",
    primary: [28, 39, 51, 63, 76],
    secondary: [28, 37, 49, 60, 76],
    metrics: [
      { label: "Cartera en riesgo", value: "12 cuentas", note: "+90 dias sin actividad" },
      { label: "Margen cedido", value: "-2.8 pts", note: "3 categorias para revisar" },
      { label: "Expansion visible", value: "$348K", note: "cross-sell priorizado" },
    ],
  },
  team: {
    title: "Vista de seguimiento comercial",
    subtitle: "Lectura de cumplimiento, foco y brecha por equipo.",
    summary: "El desvio esta en seguimiento y conversion del equipo interior.",
    badge: "Intervenir ahora",
    chartEyebrow: "Ritmo del equipo",
    chartTitle: "Cumplimiento vs actividad",
    periodLabel: "Ultimas 5 semanas",
    xLabels: ["Norte", "Interior", "AMBA", "Canal", "Key"],
    primaryLabel: "Cumplimiento",
    secondaryLabel: "Actividad",
    primary: [74, 62, 81, 69, 88],
    secondary: [78, 58, 76, 64, 84],
    metrics: [
      { label: "Equipo bajo meta", value: "1 equipo", note: "prioridad de coaching" },
      { label: "Brecha activa", value: "$28K", note: "vs objetivo mensual" },
      { label: "Seguimiento util", value: "97%", note: "cumplimiento promedio" },
    ],
  },
  mix: {
    title: "Lectura de mix y rentabilidad",
    subtitle: "Cruce de volumen, margen y huecos de linea.",
    summary: "El crecimiento mas limpio esta en lineas premium con baja penetracion.",
    badge: "Hueco visible",
    chartEyebrow: "Mix comercial",
    chartTitle: "Volumen vs margen",
    periodLabel: "Lineas activas",
    xLabels: ["Linea A", "Linea B", "Linea C", "Linea D", "Linea E"],
    primaryLabel: "Volumen",
    secondaryLabel: "Margen",
    primary: [82, 76, 48, 64, 59],
    secondary: [34, 41, 68, 53, 61],
    metrics: [
      { label: "Linea prioritaria", value: "Linea C", note: "mayor opcion de expansion" },
      { label: "Mix incompleto", value: "47 cuentas", note: "categorias sin trabajar" },
      { label: "Margen premium", value: "36%", note: "linea de mayor calidad" },
    ],
  },
};

function buildLinePath(values: number[], width: number, height: number) {
  const step = width / (values.length - 1);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * (height - 24) - 14;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function buildAreaPath(values: number[], width: number, height: number) {
  const linePath = buildLinePath(values, width, height);
  return `${linePath} L ${width} ${height} L 0 ${height} Z`;
}

const lineWidth = 460;
const lineHeight = 196;

export function HomeHeroPreview() {
  const [view, setView] = useState<PreviewView>("month");
  const [interactive, setInteractive] = useState(false);
  const data = previewData[view];

  useEffect(() => {
    const timer = window.setTimeout(() => setInteractive(true), 800);
    return () => window.clearTimeout(timer);
  }, []);

  const chartPaths = useMemo(() => {
    const primaryPath = buildLinePath(data.primary, lineWidth, lineHeight);
    const secondaryPath = buildLinePath(data.secondary, lineWidth, lineHeight);
    const areaPath = buildAreaPath(data.primary, lineWidth, lineHeight);

    return { primaryPath, secondaryPath, areaPath };
  }, [data]);

  return (
    <div className="relative">
      <div className="absolute inset-x-6 bottom-0 top-6 -z-10 rounded-[2.25rem] bg-[radial-gradient(circle_at_top_right,rgba(113,17,223,0.18),transparent_55%)] blur-3xl" />

      <div className="overflow-hidden rounded-[2.25rem] border border-border/60 bg-white shadow-[0_32px_90px_rgba(20,19,26,0.08)]">
        <div className="border-b border-border/40 px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-7">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent/70">
                Sistema de decision
              </p>
              <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-[1.15rem]">
                {data.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">{data.subtitle}</p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-emerald-700">En vivo</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[#F6F4FA] p-1.5 text-[11px] font-medium text-muted-foreground">
            {previewViews.map((item) => {
              const isActive = item.key === view;

              return (
                <button
                  key={item.key}
                  type="button"
                  disabled={!interactive}
                  onClick={() => setView(item.key)}
                  className={`rounded-xl px-3 py-2.5 text-center transition-all duration-200 ${
                    isActive
                      ? "border border-accent/10 bg-white text-foreground shadow-sm"
                      : "text-muted-foreground"
                  } ${interactive ? "hover:text-foreground" : "cursor-default"}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-5 px-5 pb-5 pt-5 sm:px-7 sm:pb-7">
          <div className="rounded-[1.6rem] border border-[#E9E2F2] bg-[#FCFBFE] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                  Lectura ejecutiva
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">{data.summary}</p>
              </div>
              <span className="hidden rounded-full border border-accent/15 bg-accent/6 px-3 py-1.5 text-[11px] font-semibold text-accent sm:inline-flex">
                {data.badge}
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-[1.35rem] border border-border/40 bg-white">
              <div className="border-b border-border/35 px-4 py-3 sm:px-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                      {data.chartEyebrow}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">{data.chartTitle}</p>
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{data.periodLabel}</span>
                </div>
              </div>

              <div className="bg-[linear-gradient(180deg,rgba(113,17,223,0.02),rgba(113,17,223,0))] px-3 pb-3 pt-4 sm:px-5">
                <svg viewBox={`0 0 ${lineWidth} ${lineHeight}`} className="h-44 w-full sm:h-48" aria-hidden="true">
                  <defs>
                    <linearGradient id="home-preview-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7111DF" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#7111DF" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {[0, 1, 2, 3].map((index) => (
                    <line
                      key={index}
                      x1="0"
                      y1={30 + index * 38}
                      x2={lineWidth}
                      y2={30 + index * 38}
                      stroke="rgba(20,19,26,0.08)"
                      strokeWidth="1"
                    />
                  ))}

                  <path d={chartPaths.areaPath} fill="url(#home-preview-area)" />
                  <path d={chartPaths.primaryPath} fill="none" stroke="#7111DF" strokeWidth="4" strokeLinecap="round" />
                  <path d={chartPaths.secondaryPath} fill="none" stroke="#05B6D3" strokeWidth="4" strokeLinecap="round" />
                </svg>

                <div className="mt-1 flex items-center gap-5 px-1 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-0.5 w-5 rounded-full bg-[#7111DF]" />
                    <span className="text-[10px] font-medium text-muted-foreground">{data.primaryLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-0.5 w-5 rounded-full bg-[#05B6D3]" />
                    <span className="text-[10px] font-medium text-muted-foreground">{data.secondaryLabel}</span>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-5 gap-2 px-1 text-[10px] font-medium text-muted-foreground/80">
                  {data.xLabels.map((label) => (
                    <span key={label} className="text-center">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {data.metrics.map((metric) => (
              <div key={metric.label} className="rounded-[1.3rem] border border-[#E9E2F2] bg-[#FCFBFE] p-4 sm:p-[1.125rem]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                  {metric.label}
                </p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{metric.value}</p>
                <p className="mt-1 text-[11px] font-medium text-muted-foreground">{metric.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
