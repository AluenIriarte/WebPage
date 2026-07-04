import {
  Check,
  CircleAlert,
  FileCheck2,
  FileSpreadsheet,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

const sourceFiles = [
  { name: "Sumas y saldos.xlsx", detail: "142 cuentas", status: "Normalizado" },
  { name: "Plan de cuentas.xlsx", detail: "Versión 2026", status: "Vinculado" },
  { name: "Ajustes de cierre.csv", detail: "18 registros", status: "Revisado" },
];

export function AccountingPrototype() {
  return (
    <div className="relative" aria-label="Prototipo visual de balance asistido con datos ficticios">
      <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-[#246BFD]/8 blur-3xl" />
      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0B1220] text-white shadow-[0_30px_90px_rgba(11,18,32,0.22)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8">
              <ScanSearch className="h-[18px] w-[18px] text-[#76A3FF]" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">Balance asistido</p>
              <p className="mt-0.5 text-[11px] text-white/45">Cierre anual · Caso demostrativo</p>
            </div>
          </div>
          <span className="mono-label inline-flex items-center gap-2 rounded-full border border-[#4ED4B3]/25 bg-[#4ED4B3]/10 px-3 py-1.5 text-[9px] font-semibold uppercase text-[#75E5C9]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#75E5C9]" />
            Datos ficticios
          </span>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between">
              <p className="mono-label text-[9px] font-semibold uppercase text-white/38">Fuentes del cierre</p>
              <span className="text-[10px] text-white/32">3/3 listas</span>
            </div>
            <div className="mt-4 space-y-2.5">
              {sourceFiles.map((file) => (
                <div key={file.name} className="rounded-2xl border border-white/8 bg-white/[0.035] p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/7">
                      <FileSpreadsheet className="h-4 w-4 text-white/68" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-white/88">{file.name}</p>
                      <p className="mt-1 text-[10px] text-white/38">{file.detail}</p>
                    </div>
                    <Check className="mt-1 h-3.5 w-3.5 text-[#75E5C9]" aria-label={file.status} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-[#76A3FF]/18 bg-[#246BFD]/8 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#76A3FF]" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-semibold text-white/82">Trazabilidad activa</p>
                  <p className="mt-1 text-[10px] leading-5 text-white/42">
                    Cada sugerencia conserva fuente, regla aplicada y estado de revisión.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="mono-label text-[9px] font-semibold uppercase text-white/38">Revisión profesional</p>
                <p className="mt-1.5 text-sm font-semibold">Estructura sugerida</p>
              </div>
              <span className="rounded-full bg-white/7 px-3 py-1 text-[10px] text-white/54">24 rubros</span>
            </div>

            <div className="mt-5 space-y-2.5">
              {[
                ["Caja y bancos", "12 cuentas vinculadas", "validado"],
                ["Créditos por ventas", "8 cuentas vinculadas", "validado"],
                ["Bienes de cambio", "3 cuentas para revisar", "alerta"],
                ["Bienes de uso", "6 cuentas vinculadas", "validado"],
              ].map(([title, detail, status]) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-3.5 py-3"
                >
                  {status === "alerta" ? (
                    <CircleAlert className="h-4 w-4 shrink-0 text-[#F2BC5A]" aria-label="Requiere revisión" />
                  ) : (
                    <FileCheck2 className="h-4 w-4 shrink-0 text-[#75E5C9]" aria-label="Validado" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-white/82">{title}</p>
                    <p className="mt-0.5 text-[10px] text-white/36">{detail}</p>
                  </div>
                  <span className="mono-label text-[8px] uppercase text-white/28">
                    {status === "alerta" ? "Revisar" : "Listo"}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-white/8 p-3.5">
                <p className="text-[9px] uppercase tracking-[0.08em] text-white/34">Sugerencias</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">21</p>
                <p className="mt-1 text-[9px] text-white/35">listas para validar</p>
              </div>
              <div className="rounded-xl border border-[#F2BC5A]/18 bg-[#F2BC5A]/5 p-3.5">
                <p className="text-[9px] uppercase tracking-[0.08em] text-[#F2BC5A]/70">Excepciones</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">3</p>
                <p className="mt-1 text-[9px] text-white/35">requieren criterio</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-white/[0.025] px-5 py-3 text-[9px] text-white/34 sm:px-6">
          <span className="mono-label uppercase">No reemplaza la revisión contable</span>
          <span>Prototipo privado</span>
        </div>
      </div>
    </div>
  );
}
