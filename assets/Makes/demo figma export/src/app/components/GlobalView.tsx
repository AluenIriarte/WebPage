import { KPICard } from './KPICard';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Bar, Line, Legend,
} from 'recharts';

const trendData = [
  { month: 'Ene', value: 2840000 },
  { month: 'Feb', value: 3120000 },
  { month: 'Mar', value: 2980000 },
  { month: 'Abr', value: 3250000 },
  { month: 'May', value: 3180000 },
  { month: 'Jun', value: 3420000 },
];

const regionData = [
  { region: 'Centro', ventas: 1150000, margen: 24.1 },
  { region: 'Norte',  ventas: 820000,  margen: 26.4 },
  { region: 'Sur',    ventas: 680000,  margen: 28.7 },
  { region: 'Litoral',ventas: 520000,  margen: 22.3 },
  { region: 'NOA',    ventas: 250000,  margen: 19.8 },
];

const CustomTooltipRegion = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px' }}>
        <div style={{ color: '#14131A', marginBottom: 4, fontWeight: 500 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color, fontSize: 13 }}>
            {p.name}: {p.dataKey === 'ventas' ? `$${(p.value / 1000).toFixed(0)}k` : `${p.value}%`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function GlobalView() {
  return (
    <div className="h-full flex flex-col gap-3">

      {/* KPIs — fila superior */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        <KPICard label="Ventas totales"    value="$3.42M"       change="+8.2% vs mes anterior" changeType="positive" />
        <KPICard label="Margen operativo"  value="24.8%"        change="-1.2 pp"               changeType="negative" />
        <KPICard label="Cartera activa"    value="284 clientes" change="+12 nuevos"             changeType="positive" />
        <KPICard label="Ticket promedio"   value="$12,042"      change="+3.8%"                 changeType="positive" />
      </div>

      {/* Gráficos — fila inferior, ocupa todo el espacio restante */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-0">

        {/* Evolución de ventas */}
        <div className="bg-[#FFFFFF] rounded-lg p-4 flex flex-col min-h-0">
          <div className="shrink-0 mb-2">
            <h3 className="text-[#14131A] tracking-tight text-sm">Evolución de ventas</h3>
            <p className="text-[#6E6A7A] text-xs">Últimos 6 meses</p>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7111DF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7111DF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                <XAxis dataKey="month" stroke="#6E6A7A" tick={{ fontSize: 12 }} />
                <YAxis
                  stroke="#6E6A7A"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                  width={52}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 8 }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ventas']}
                />
                <Area type="monotone" dataKey="value" stroke="#7111DF" strokeWidth={2} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ventas por región + margen (doble eje) */}
        <div className="bg-[#FFFFFF] rounded-lg p-4 flex flex-col min-h-0">
          <div className="shrink-0 mb-2">
            <h3 className="text-[#14131A] tracking-tight text-sm">Volumen por región</h3>
            <p className="text-[#6E6A7A] text-xs">Ventas ($) y margen (%) por región</p>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={regionData} margin={{ top: 4, right: 36, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                <XAxis dataKey="region" stroke="#6E6A7A" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  stroke="#7111DF"
                  tick={{ fontSize: 12, fill: '#7111DF' }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={52}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#655F7F"
                  tick={{ fontSize: 12, fill: '#655F7F' }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 40]}
                  width={36}
                />
                <Tooltip content={<CustomTooltipRegion />} />
                <Legend
                  iconSize={10}
                  formatter={(value) => (
                    <span style={{ fontSize: 12, color: '#6E6A7A' }}>
                      {value === 'ventas' ? 'Ventas' : 'Margen %'}
                    </span>
                  )}
                />
                <Bar
                  yAxisId="left"
                  dataKey="ventas"
                  name="ventas"
                  fill="#7111DF"
                  fillOpacity={0.85}
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="margen"
                  name="margen"
                  stroke="#655F7F"
                  strokeWidth={2}
                  dot={{ fill: '#655F7F', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
