const chartSeries = {
  ventas: [28, 39, 51, 63, 76],
  margen: [28, 37, 49, 60, 76],
};

function buildLinePath(values: number[], width: number, height: number) {
  const step = width / (values.length - 1);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * (height - 18) - 12;
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
const ventasPath = buildLinePath(chartSeries.ventas, lineWidth, lineHeight);
const margenPath = buildLinePath(chartSeries.margen, lineWidth, lineHeight);
const areaPath = buildAreaPath(chartSeries.ventas, lineWidth, lineHeight);

const metrics = [
  { label: "Cartera en riesgo", value: "12 cuentas", note: "+90 dias sin actividad" },
  { label: "Margen cedido", value: "-2.8 pts", note: "3 categorias para revisar" },
  { label: "Expansion visible", value: "$348K", note: "cross-sell priorizado" },
];

export function HomeHeroPreview() {
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
                Tablero comercial activo
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Lectura general de cartera, margen y expansion.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-emerald-700">En vivo</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[#F6F4FA] p-1.5 text-[11px] font-medium text-muted-foreground">
            <span className="rounded-xl border border-accent/10 bg-white px-3 py-2.5 text-center text-foreground shadow-sm">Mes</span>
            <span className="px-3 py-2.5 text-center">Equipo</span>
            <span className="px-3 py-2.5 text-center">Mix</span>
          </div>
        </div>

        <div className="space-y-5 px-5 pb-5 pt-5 sm:px-7 sm:pb-7">
          <div className="rounded-[1.6rem] border border-[#E9E2F2] bg-[#FCFBFE] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                  Lectura ejecutiva
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                  La facturacion aguanta, pero la perdida esta en actividad y margen.
                </p>
              </div>
              <span className="hidden rounded-full border border-accent/15 bg-accent/6 px-3 py-1.5 text-[11px] font-semibold text-accent sm:inline-flex">
                Prioridad hoy
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-[1.35rem] border border-border/40 bg-white">
              <div className="border-b border-border/35 px-4 py-3 sm:px-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                      Panorama mensual
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                      Ventas vs margen
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">Q1 2026</span>
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

                  <path d={areaPath} fill="url(#home-preview-area)" />
                  <path d={ventasPath} fill="none" stroke="#7111DF" strokeWidth="4" strokeLinecap="round" />
                  <path d={margenPath} fill="none" stroke="#05B6D3" strokeWidth="4" strokeLinecap="round" />
                </svg>

                <div className="mt-1 flex items-center gap-5 px-1 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-0.5 w-5 rounded-full bg-[#7111DF]" />
                    <span className="text-[10px] font-medium text-muted-foreground">Ventas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-0.5 w-5 rounded-full bg-[#05B6D3]" />
                    <span className="text-[10px] font-medium text-muted-foreground">Margen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
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
