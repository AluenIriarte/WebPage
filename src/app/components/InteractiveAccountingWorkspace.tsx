import {
  Check,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  Fingerprint,
  RefreshCcw,
  ScanText,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { KeyboardEvent, useRef, useState } from "react";
import {
  DemoItemTone,
  WorkflowKind,
  WorkflowStage,
  workflowDemoFixtures,
  workflowStages,
} from "../lib/workflow-demo";
import { trackWorkspaceFlowChange, trackWorkspaceStageView } from "../lib/analytics";

const workflowKinds: WorkflowKind[] = ["balance", "bank-summary"];

const toneStyles: Record<DemoItemTone, string> = {
  source: "border-[#D9D5CB] bg-[#FCFCFA] text-[#40434D]",
  processing: "border-[#BFC9FF] bg-[#F0F2FF] text-[#2D4BC6]",
  validated: "border-[#B8DCCF] bg-[#EDF8F3] text-[#146A58]",
  warning: "border-[#E6C78D] bg-[#FFF8E9] text-[#8A5A10]",
};

function ItemIcon({ tone }: { tone: DemoItemTone }) {
  const className = "h-4 w-4";

  if (tone === "validated") return <CheckCircle2 className={className} aria-hidden="true" />;
  if (tone === "warning") return <TriangleAlert className={className} aria-hidden="true" />;
  if (tone === "processing") return <RefreshCcw className={className} aria-hidden="true" />;
  return <FileSpreadsheet className={className} aria-hidden="true" />;
}

export function InteractiveAccountingWorkspace() {
  const [workflow, setWorkflow] = useState<WorkflowKind>("balance");
  const [stage, setStage] = useState<WorkflowStage>("suggestions");
  const flowTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();
  const fixture = workflowDemoFixtures[workflow];
  const detail = fixture.stages[stage];
  const stageIndex = workflowStages.findIndex((item) => item.id === stage);

  const selectWorkflow = (nextWorkflow: WorkflowKind) => {
    if (nextWorkflow === workflow) return;
    setWorkflow(nextWorkflow);
    trackWorkspaceFlowChange(nextWorkflow);
    trackWorkspaceStageView(nextWorkflow, stage);
  };

  const selectStage = (nextStage: WorkflowStage) => {
    if (nextStage === stage) return;
    setStage(nextStage);
    trackWorkspaceStageView(workflow, nextStage);
  };

  const handleFlowKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % workflowKinds.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + workflowKinds.length) % workflowKinds.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = workflowKinds.length - 1;
    if (nextIndex === currentIndex) return;

    event.preventDefault();
    const nextWorkflow = workflowKinds[nextIndex];
    selectWorkflow(nextWorkflow);
    flowTabRefs.current[nextIndex]?.focus();
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        id="demo-contable"
        className="workspace-frame relative scroll-mt-28"
        aria-label="Demo interactiva de procesos contables con datos ficticios"
      >
      <div className="pointer-events-none absolute -inset-x-10 -bottom-10 top-20 -z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(73,76,255,0.14),transparent_68%)] blur-3xl" />

      <div className="overflow-hidden border border-[#2A2D38] bg-[#11131A] shadow-[0_38px_100px_rgba(17,19,26,0.22)] sm:rounded-[1.4rem]">
        <div className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 text-white sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-xl italic text-white">
              A
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[-0.01em]">Prototipo de proceso</p>
              <p className="mt-0.5 text-[10px] text-white/62">{fixture.caseName}</p>
            </div>
          </div>

          <div
            className="grid grid-cols-2 rounded-lg border border-white/10 bg-black/20 p-1"
            role="tablist"
            aria-label="Proceso demostrado"
          >
            {workflowKinds.map((kind, index) => {
              const selected = workflow === kind;
              return (
                <button
                  key={kind}
                  ref={(node) => {
                    flowTabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`workflow-tab-${kind}`}
                  aria-selected={selected}
                  aria-controls="workflow-panel"
                  tabIndex={selected ? 0 : -1}
                  onKeyDown={(event) => handleFlowKeyDown(event, index)}
                  onClick={() => selectWorkflow(kind)}
                  className={`min-h-11 rounded-md px-4 text-[11px] font-semibold transition-colors duration-200 ${
                    selected
                      ? "bg-white text-[#11131A] shadow-sm"
                      : "text-white/52 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {workflowDemoFixtures[kind].label}
                </button>
              );
            })}
          </div>

          <div className="mono-label inline-flex min-h-9 items-center gap-2 self-start rounded-full border border-[#86D9BD]/25 bg-[#86D9BD]/10 px-3 text-[9px] font-semibold uppercase text-[#8FE1C5] lg:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8FE1C5]" />
            Demo con datos ficticios
          </div>
        </div>

        <div
          id="workflow-panel"
          role="tabpanel"
          aria-labelledby={`workflow-tab-${workflow}`}
          className="bg-[#F7F5EF]"
        >
          <div className="border-b border-[#D9D5CB] bg-[#FCFCFA] px-4 py-3 sm:px-6 lg:hidden">
            <div className="no-scrollbar flex gap-2 overflow-x-auto" aria-label="Etapas del proceso">
              {workflowStages.map((item) => {
                const selected = stage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectStage(item.id)}
                    className={`min-h-11 shrink-0 border px-3 text-left text-[10px] font-semibold transition-colors ${
                      selected
                        ? "border-[#2D5BFF] bg-[#EEF1FF] text-[#2449CE]"
                        : "border-[#D9D5CB] bg-white text-[#676A74]"
                    }`}
                  >
                    <span className="mono-label mr-2 text-[8px] opacity-60">{item.number}</span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid lg:min-h-[570px] lg:grid-cols-[210px_minmax(0,1fr)_250px]">
            <aside className="hidden border-r border-[#D9D5CB] bg-[#F1EEE6] p-5 lg:flex lg:flex-col">
              <p className="mono-label text-[9px] font-semibold uppercase text-[#62645F]">Recorrido</p>
              <div className="relative mt-5 space-y-1">
                <div className="absolute bottom-5 left-[17px] top-5 w-px bg-[#D2CEC4]" aria-hidden="true">
                  <m.div
                    className="w-px origin-top bg-[#2D5BFF]"
                    animate={{ height: `${(stageIndex / (workflowStages.length - 1)) * 100}%` }}
                    transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
                  />
                </div>
                {workflowStages.map((item, index) => {
                  const selected = stage === item.id;
                  const completed = index < stageIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => selectStage(item.id)}
                      className={`group relative flex min-h-14 w-full items-center gap-3 px-1 text-left ${
                        selected ? "text-[#11131A]" : "text-[#5F625F] hover:text-[#11131A]"
                      }`}
                    >
                      <span
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold transition-colors ${
                          selected
                            ? "border-[#2D5BFF] bg-[#2D5BFF] text-white"
                            : completed
                              ? "border-[#86C7B1] bg-[#E6F5EF] text-[#176B59]"
                              : "border-[#D2CEC4] bg-[#F1EEE6] text-[#62645F] group-hover:border-[#9A9A95]"
                        }`}
                      >
                        {completed ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : item.number}
                      </span>
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto border-t border-[#D2CEC4] pt-5">
                <p className="mono-label text-[8px] font-semibold uppercase text-[#62645F]">Fuentes</p>
                <div className="mt-3 space-y-3">
                  {fixture.sources.map((source) => (
                    <div key={source.name} className="min-w-0">
                      <p className="truncate text-[10px] font-semibold text-[#42444B]">{source.name}</p>
                      <p className="mt-0.5 text-[9px] text-[#62645F]">{source.meta}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <main className="min-w-0 bg-[#FCFCFA] p-5 sm:p-7 lg:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={`${workflow}-${stage}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
                >
                  <div className="flex flex-col gap-4 border-b border-[#E2DED5] pb-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-xl">
                      <p className="mono-label text-[9px] font-semibold uppercase text-[#4656B8]">{detail.eyebrow}</p>
                      <h3 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-[#11131A] sm:text-2xl">
                        {detail.title}
                      </h3>
                      <p className="mt-3 max-w-lg text-xs leading-5 text-[#686A72] sm:text-sm sm:leading-6">
                        {detail.description}
                      </p>
                    </div>
                    <span className="mono-label inline-flex min-h-8 shrink-0 items-center self-start border border-[#B8DCCF] bg-[#EDF8F3] px-3 text-[8px] font-semibold uppercase text-[#146A58]">
                      {detail.status}
                    </span>
                  </div>

                  <div className="mt-5 overflow-hidden border border-[#D9D5CB]">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] border-b border-[#D9D5CB] bg-[#F4F1EA] px-4 py-2.5">
                      <p className="mono-label text-[8px] font-semibold uppercase text-[#62645F]">Elemento</p>
                      <p className="mono-label text-[8px] font-semibold uppercase text-[#62645F]">Estado</p>
                    </div>
                    {detail.items.map((item) => (
                      <div
                        key={item.label}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-[#E7E3DA] bg-white px-4 py-3.5 last:border-b-0"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${toneStyles[item.tone]}`}
                          >
                            <ItemIcon tone={item.tone} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-[#282A31]">{item.label}</p>
                            <p className="mt-1 truncate text-[10px] text-[#666870]">{item.detail}</p>
                          </div>
                        </div>
                        <span
                          className={`max-w-[120px] border px-2.5 py-1 text-right text-[9px] font-semibold ${toneStyles[item.tone]}`}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {detail.metrics.map((metric) => (
                      <div key={metric.label} className="border border-[#D9D5CB] bg-[#F8F6F1] p-4">
                        <p className="mono-label text-[8px] font-semibold uppercase text-[#666870]">{metric.label}</p>
                        <p className="mt-2 font-display text-3xl text-[#11131A]">{metric.value}</p>
                        <p className="mt-1 text-[9px] text-[#666870]">{metric.note}</p>
                      </div>
                    ))}
                  </div>
                </m.div>
              </AnimatePresence>
            </main>

            <aside className="border-t border-[#D9D5CB] bg-[#F4F1EA] p-5 sm:p-6 lg:border-l lg:border-t-0">
              <div className="flex items-center gap-2 text-[#2D4BC6]">
                <Fingerprint className="h-4 w-4" aria-hidden="true" />
                <p className="mono-label text-[9px] font-semibold uppercase">Trazabilidad</p>
              </div>
              <p className="mt-4 text-sm font-semibold leading-5 text-[#26282E]">
                Cada salida conserva una referencia.
              </p>

              <div className="mt-6 divide-y divide-[#D9D5CB] border-y border-[#D9D5CB]">
                {detail.trace.map((item) => (
                  <div key={item.label} className="py-4">
                    <p className="mono-label text-[8px] font-semibold uppercase text-[#62645F]">{item.label}</p>
                    <p className="mt-1.5 text-[11px] leading-5 text-[#474950]">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border border-[#C5BDFD] bg-[#F0EEFF] p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#5842D7]" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] font-semibold text-[#34276F]">Revisión humana requerida</p>
                    <p className="mt-1 text-[9px] leading-4 text-[#6D6493]">
                      Ninguna sugerencia se aprueba desde esta demostración.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextStage = workflowStages[Math.min(stageIndex + 1, workflowStages.length - 1)].id;
                  selectStage(nextStage);
                }}
                disabled={stageIndex === workflowStages.length - 1}
                className="mt-5 flex min-h-11 w-full items-center justify-between border-t border-[#D9D5CB] pt-4 text-left text-[10px] font-semibold text-[#555860] transition-colors hover:text-[#2D4BC6] disabled:cursor-default disabled:text-[#A4A39E]"
              >
                {stageIndex === workflowStages.length - 1 ? "Fin del recorrido" : "Continuar el recorrido"}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </aside>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#2A2D38] bg-[#11131A] px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-2 text-[9px] text-white/62">
              <ScanText className="h-3.5 w-3.5 text-[#9DA9FF]" aria-hidden="true" />
              <span>Prototipo privado · Sin documentos reales</span>
            </div>
            <p className="mono-label text-[8px] uppercase text-white/55">
              La IA prepara <span className="mx-2 text-white/20">/</span> Tu equipo decide
            </p>
          </div>
        </div>
      </div>
      </div>
    </LazyMotion>
  );
}
