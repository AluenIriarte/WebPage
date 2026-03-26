import { ExecutiveReading } from './ExecutiveReading';
import { TrendingUp, Users } from 'lucide-react';

const sellersData = [
  { name: 'María González', sales: 580000, target: 520000, clients: 42, newClients: 5, margin: 26.5 },
  { name: 'Carlos Méndez',  sales: 520000, target: 500000, clients: 38, newClients: 3, margin: 24.8 },
  { name: 'Ana Rodríguez',  sales: 490000, target: 480000, clients: 35, newClients: 7, margin: 25.2 },
  { name: 'Jorge Silva',    sales: 460000, target: 520000, clients: 32, newClients: 2, margin: 23.1 },
  { name: 'Laura Pérez',    sales: 440000, target: 480000, clients: 29, newClients: 4, margin: 22.8 },
];

export function RankingView() {
  return (
    <div className="h-full flex flex-col gap-3">

      {/* Tabla de ranking — ocupa todo el espacio disponible */}
      <div className="bg-[#FFFFFF] rounded-lg p-5 flex flex-col flex-1 min-h-0">
        <div className="shrink-0 mb-4">
          <h3 className="text-[#14131A] tracking-tight text-sm">Desempeño por vendedor</h3>
          <p className="text-[#6E6A7A] text-xs">Mes actual vs objetivo</p>
        </div>

        <div className="flex-1 min-h-0 overflow-auto space-y-4 pr-1">
          {sellersData.map((seller, index) => {
            const achievement = (seller.sales / seller.target) * 100;
            const overTarget = achievement >= 100;

            return (
              <div key={index} className="space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#7111DF]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#7111DF] text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-[#14131A] text-sm">{seller.name}</div>
                      <div className="text-[#6E6A7A] text-xs">{seller.clients} clientes activos</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[#14131A] tracking-tight">
                      ${(seller.sales / 1000).toFixed(0)}k
                    </div>
                    <div className={`text-xs ${overTarget ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {achievement.toFixed(0)}% del objetivo
                    </div>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="h-1.5 bg-[#F3F1EE] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${overTarget ? 'bg-emerald-500' : 'bg-[#7111DF]'}`}
                    style={{ width: `${Math.min(achievement, 100)}%` }}
                  />
                </div>

                {/* Métricas complementarias */}
                <div className="flex items-center gap-4 text-xs text-[#6E6A7A]">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{seller.newClients} nuevos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{seller.margin}% margen</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fila inferior — total + lectura ejecutiva */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0">
        <div className="bg-[#FFFFFF] rounded-lg p-4">
          <div className="text-[#6E6A7A] text-xs mb-1">Total cartera del equipo</div>
          <div className="text-[#14131A] text-2xl tracking-tight">$2.49M</div>
          <p className="text-[#6E6A7A] text-xs mt-1">176 clientes activos en total</p>
        </div>
        <ExecutiveReading
          insights={[
            'María González lidera con resultados sobre el objetivo y el mejor margen del equipo',
            'Jorge y Laura necesitan refuerzo en cierre para alcanzar el objetivo trimestral',
            'Ana Rodríguez tiene el mejor desempeño en captación de nuevos clientes',
          ]}
        />
      </div>

    </div>
  );
}
