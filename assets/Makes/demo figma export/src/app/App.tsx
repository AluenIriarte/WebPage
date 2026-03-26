import { useState } from 'react';
import { GlobalView } from './components/GlobalView';
import { RankingView } from './components/RankingView';
import { VendedoresView } from './components/VendedoresView';

type ViewType = 'global' | 'ranking' | 'vendedores';

const viewDescriptions: Record<ViewType, string> = {
  global: 'Salud comercial general: volumen, margen, segmentación y alertas de negocio',
  ranking: 'Desempeño del equipo comercial: resultados vs objetivo y composición de cartera',
  vendedores: 'Vista operativa para vendedores: oportunidades por cliente y priorización de acciones',
};

const views: { key: ViewType; label: string }[] = [
  { key: 'global', label: 'Global' },
  { key: 'ranking', label: 'Ranking comercial' },
  { key: 'vendedores', label: 'Vendedores' },
];

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('global');

  return (
    <div className="h-screen bg-[#F3F1EE] flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 max-w-[1280px] mx-auto w-full px-4 md:px-8 flex flex-col py-4 md:py-5">

        {/* Header compacto */}
        <div className="mb-3 text-center shrink-0">
          <div className="text-[#7111DF] text-[10px] tracking-widest uppercase mb-1">DEMO GUIADA</div>
          <h1 className="text-[#14131A] text-xl md:text-2xl tracking-tight">
            Demo interactiva de tablero comercial
          </h1>
          <p className="text-[#655F7F] text-xs md:text-sm mt-1 hidden md:block">
            Tres vistas para entender volumen, desempeño y oportunidades de acción
          </p>
        </div>

        {/* Tabs compactos */}
        <div className="mb-3 shrink-0">
          <div className="flex items-center justify-center gap-2 mb-1">
            {views.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  activeView === key
                    ? 'bg-[#7111DF] text-white'
                    : 'bg-[#FFFFFF] text-[#655F7F] hover:bg-[#7111DF]/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-center text-[#6E6A7A] text-xs">
            {viewDescriptions[activeView]}
          </p>
        </div>

        {/* Bloque de dashboard — flex-1, sin scroll propio */}
        <div className="flex-1 min-h-0">
          {activeView === 'global' && <GlobalView />}
          {activeView === 'ranking' && <RankingView />}
          {activeView === 'vendedores' && <VendedoresView />}
        </div>

        {/* CTA compacto en barra horizontal */}
        <div className="shrink-0 mt-3 bg-[#FFFFFF] rounded-lg px-5 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[#14131A] text-sm tracking-tight truncate">¿Querés implementar estas vistas en tu negocio?</div>
            <div className="text-[#6E6A7A] text-xs hidden md:block">Cada solución se diseña según tu estructura comercial y necesidades.</div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="px-4 py-2 bg-[#7111DF] text-white rounded-lg text-sm hover:bg-[#5c0ec0] transition-colors whitespace-nowrap">
              Agendar diagnóstico
            </button>
            <button className="px-4 py-2 bg-[#F3F1EE] text-[#14131A] rounded-lg text-sm hover:bg-[#e8e5e0] transition-colors whitespace-nowrap hidden md:block">
              Ver otros indicadores
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
