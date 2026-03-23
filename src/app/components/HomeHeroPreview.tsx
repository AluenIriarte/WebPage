const chartSeries = {
  ventas: [180, 220, 195, 260],
  margen: [125, 158, 140, 190],
};

function buildLinePath(values: number[], width: number, height: number) {
  const step = width / (values.length - 1);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * (height - 24) - 12;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function buildAreaPath(values: number[], width: number, height: number) {
  const linePath = buildLinePath(values, width, height);
  return `${linePath} L ${width} ${height} L 0 ${height} Z`;
}

const lineWidth = 760;
const lineHeight = 200;
const ventasPath = buildLinePath(chartSeries.ventas, lineWidth, lineHeight);
const margenPath = buildLinePath(chartSeries.margen, lineWidth, lineHeight);
const areaPath = buildAreaPath(chartSeries.margen, lineWidth, lineHeight);

const summaryCards = [
  { label: "Expansion", value: "$348K", note: "potencial cross-sell" },
  { label: "Rentabilidad", value: "+22%", note: "mejora de margen" },
];

export function HomeHeroPreview() {
  return (
    <div className="relative">
      <div className="absolute inset-x-6 bottom-0 top-6 -z-10 rounded-[2.2rem] bg-[radial-gradient(circle_at_top_right,rgba(113,17,223,0.16),transparent_58%)] blur-3xl" />

      <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-[0_28px_80px_rgba(20,19,26,0.08)]">
        <div className="border-b border-border/40 px-5 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                Dashboard de ventas
              </p>
              <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-[1.15rem]">
                Lectura comercial activa
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-emerald-700">En vivo</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[#F7F4FB] p-1 text-[11px] font-medium text-muted-foreground">
            <span className="px-3 py-2 text-center">Semana</span>
            <span className="rounded-xl bg-white px-3 py-2 text-center text-foreground shadow-sm">Mes</span>
            <span className="px-3 py-2 text-center">Q1 2026</span>
          </div>
        </div>

        <div className="px-4 pb-4 pt-5 sm:px-5 sm:pb-5">
          <div className="mb-3 grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3">
            <div className="flex flex-col justify-between pb-8 text-[10px] text-muted-foreground/80">
              <span>260</span>
              <span>195</span>
              <span>130</span>
              <span>65</span>
              <span>0</span>
            </div>

            <div className="overflow-hidden rounded-[1.3rem]">
              <svg viewBox={`0 0 ${lineWidth} ${lineHeight}`} className="h-44 w-full sm:h-48" aria-hidden="true">
                <defs>
                  <linearGradient id="home-preview-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CFE4F9" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#CFE4F9" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3].map((index) => (
                  <line
                    key={index}
                    x1="0"
                    y1={26 + index * 40}
                    x2={lineWidth}
                    y2={26 + index * 40}
                    stroke="rgba(20,19,26,0.07)"
                    strokeWidth="1"
                  />
                ))}

                <path d={areaPath} fill="url(#home-preview-area)" />
                <path d={ventasPath} fill="none" stroke="#7C4DFF" strokeWidth="3.25" strokeLinecap="round" />
                <path d={margenPath} fill="none" stroke="#06B6D4" strokeWidth="3.25" strokeLinecap="round" />
              </svg>

              <div className="mt-1 grid grid-cols-4 gap-2 px-1 text-[10px] font-medium text-muted-foreground/80">
                {["S1", "S2", "S3", "S4"].map((label) => (
                  <span key={label} className="text-center">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-5 flex items-center gap-5 pl-[2.85rem] text-[10px] font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-4 rounded-full bg-[#7C4DFF]" />
              <span>Ventas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-4 rounded-full bg-[#06B6D4]" />
              <span>Margen</span>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.95fr)]">
            {summaryCards.map((card) => (
              <div key={card.label} className="rounded-[1.2rem] border border-[#ECE6F2] bg-[#FCFBFE] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                  {card.label}
                </p>
                <p className="mt-2 text-[1.65rem] font-semibold tracking-tight text-foreground">{card.value}</p>
                <p className="mt-1 text-[11px] font-semibold text-emerald-600">{card.note}</p>
              </div>
            ))}

            <div className="rounded-[1.2rem] border border-amber-200 bg-white p-4 shadow-[0_14px_28px_rgba(20,19,26,0.06)]">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                    <span className="text-sm">!</span>
                  </div>
                  <span className="text-[13px] font-semibold text-amber-700">Riesgo detectado</span>
                </div>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-500">
                  Urgente
                </span>
              </div>

              <p className="text-[1.7rem] font-semibold tracking-tight text-foreground">12 cuentas</p>
              <p className="mt-1 text-xs text-muted-foreground">sin actividad por mas de 90 dias</p>

              <div className="mt-3 flex gap-1">
                {[1, 1, 1, 1, 1, 0, 0].map((filled, index) => (
                  <div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full ${filled ? "bg-amber-400" : "bg-muted"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
