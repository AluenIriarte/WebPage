import { KPICard } from './KPICard';
import { AlertCircle, TrendingUp, Package } from 'lucide-react';

const clientsData = [
  {
    name: 'Industrias del Sur S.A.',
    revenue: 85000,
    buys: ['Línea A', 'Línea B'],
    doesntBuy: ['Línea C', 'Línea D'],
    opportunity: 'Ampliar a Línea C',
    coverage: 50,
    priority: 'high',
  },
  {
    name: 'Comercial Norte Ltda.',
    revenue: 72000,
    buys: ['Línea A', 'Línea C'],
    doesntBuy: ['Línea B', 'Línea D'],
    opportunity: 'Cross-sell Línea B',
    coverage: 50,
    priority: 'high',
  },
  {
    name: 'Grupo Técnico Este',
    revenue: 58000,
    buys: ['Línea B', 'Línea C', 'Línea D'],
    doesntBuy: ['Línea A'],
    opportunity: 'Completar portafolio',
    coverage: 75,
    priority: 'medium',
  },
  {
    name: 'Soluciones Oeste S.A.S.',
    revenue: 45000,
    buys: ['Línea A'],
    doesntBuy: ['Línea B', 'Línea C', 'Línea D'],
    opportunity: 'Ampliar categorías',
    coverage: 25,
    priority: 'high',
  },
  {
    name: 'Distribuidora Central',
    revenue: 38000,
    buys: ['Línea A', 'Línea B', 'Línea C'],
    doesntBuy: ['Línea D'],
    opportunity: 'Línea D premium',
    coverage: 75,
    priority: 'low',
  },
];

export function VendedoresView() {
  return (
    <div className="h-full flex flex-col gap-3">

      {/* KPIs superiores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        <KPICard label="Clientes activos"        value="42"    change="5 nuevos este mes"        changeType="positive" />
        <KPICard label="Cartera total"           value="$580k" change="+11.5% vs mes anterior"   changeType="positive" />
        <KPICard label="Oportunidades"           value="18"    change="Para ampliar categorías"  changeType="neutral"  />
        <div className="bg-[#FFFFFF] rounded-lg p-4 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-700 mb-1">
            <Package className="w-4 h-4" />
            <div className="text-xs">Alerta de stock</div>
          </div>
          <div className="text-[#14131A] text-sm tracking-tight">Línea C limitada</div>
          <div className="text-[#6E6A7A] text-xs mt-1">Priorizar Líneas A y B</div>
        </div>
      </div>

      {/* Lista de clientes — flex-1 con scroll interno */}
      <div className="bg-[#FFFFFF] rounded-lg p-4 flex flex-col flex-1 min-h-0">
        <div className="shrink-0 mb-3">
          <h3 className="text-[#14131A] tracking-tight text-sm">Cartera por cliente</h3>
          <p className="text-[#6E6A7A] text-xs">Oportunidades de ampliación</p>
        </div>

        <div className="flex-1 min-h-0 overflow-auto space-y-4 pr-1">
          {clientsData.map((client, index) => (
            <div key={index} className="space-y-2">
              {/* Header del cliente */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-[#14131A] text-sm tracking-tight">{client.name}</h4>
                    {client.priority === 'high' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs shrink-0">
                        <TrendingUp className="w-3 h-3" />
                        Alta oportunidad
                      </span>
                    )}
                  </div>
                  <div className="text-[#6E6A7A] text-xs">
                    Aporte mensual: ${(client.revenue / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>

              {/* Cobertura */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6E6A7A]">Cobertura de portafolio</span>
                  <span className="text-[#14131A]">{client.coverage}%</span>
                </div>
                <div className="h-1.5 bg-[#F3F1EE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#7111DF] rounded-full" style={{ width: `${client.coverage}%` }} />
                </div>
              </div>

              {/* Detalle de compra */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="text-[#6E6A7A] text-xs mb-1">Compra</div>
                  <div className="flex flex-wrap gap-1">
                    {client.buys.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs">{item}</span>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-[#6E6A7A] text-xs mb-1">No compra aún</div>
                  <div className="flex flex-wrap gap-1">
                    {client.doesntBuy.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-[#F3F1EE] text-[#6E6A7A] text-xs">{item}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Acción sugerida */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#7111DF]/5 border border-[#7111DF]/10">
                <AlertCircle className="w-4 h-4 text-[#7111DF] shrink-0" />
                <div className="text-[#6E6A7A] text-xs">{client.opportunity}</div>
              </div>

              {index < clientsData.length - 1 && <div className="border-t border-[#F3F1EE]" />}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
