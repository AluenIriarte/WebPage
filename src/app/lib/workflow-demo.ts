export type WorkflowKind = "balance" | "bank-summary";

export type WorkflowStage = "inputs" | "normalization" | "suggestions" | "review";

export type DemoItemTone = "source" | "processing" | "validated" | "warning";

export interface WorkflowDemoItem {
  label: string;
  detail: string;
  value: string;
  tone: DemoItemTone;
}

export interface WorkflowStageDetail {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  items: WorkflowDemoItem[];
  metrics: Array<{
    label: string;
    value: string;
    note: string;
  }>;
  trace: Array<{
    label: string;
    value: string;
  }>;
}

export interface WorkflowDemoFixture {
  label: string;
  shortLabel: string;
  caseName: string;
  summary: string;
  sources: Array<{
    name: string;
    meta: string;
  }>;
  stages: Record<WorkflowStage, WorkflowStageDetail>;
}

export const workflowStages: Array<{
  id: WorkflowStage;
  number: string;
  label: string;
}> = [
  { id: "inputs", number: "01", label: "Entradas" },
  { id: "normalization", number: "02", label: "Normalización" },
  { id: "suggestions", number: "03", label: "Sugerencias" },
  { id: "review", number: "04", label: "Revisión" },
];

export const workflowDemoFixtures: Record<WorkflowKind, WorkflowDemoFixture> = {
  balance: {
    label: "Balance asistido",
    shortLabel: "Balance",
    caseName: "Cierre anual · Caso demostrativo",
    summary: "Prepara la estructura y concentra la revisión profesional en relaciones y excepciones.",
    sources: [
      { name: "Sumas y saldos.xlsx", meta: "142 cuentas · 3 hojas" },
      { name: "Plan de cuentas.xlsx", meta: "Versión 2026" },
      { name: "Ajustes de cierre.csv", meta: "18 registros" },
    ],
    stages: {
      inputs: {
        eyebrow: "Fuentes del cierre",
        title: "Tres entradas, una estructura de trabajo.",
        description:
          "El flujo registra cada fuente y conserva su referencia antes de proponer cualquier relación.",
        status: "3 fuentes listas",
        items: [
          { label: "Sumas y saldos", detail: "Estructura detectada", value: "142 cuentas", tone: "source" },
          { label: "Plan de cuentas", detail: "Versión identificada", value: "2026", tone: "source" },
          { label: "Ajustes de cierre", detail: "Campos verificados", value: "18 registros", tone: "validated" },
        ],
        metrics: [
          { label: "Fuentes", value: "3/3", note: "registradas" },
          { label: "Originales", value: "100%", note: "sin modificar" },
        ],
        trace: [
          { label: "Origen", value: "Archivos acordados para la demo" },
          { label: "Control", value: "Nombre, versión y estructura" },
          { label: "Salida", value: "Inventario de fuentes" },
        ],
      },
      normalization: {
        eyebrow: "Estructura común",
        title: "Campos comparables sin tocar los originales.",
        description:
          "Nombres, códigos y saldos se llevan a un esquema de trabajo para detectar faltantes y duplicados.",
        status: "Normalización completa",
        items: [
          { label: "Código de cuenta", detail: "Formato unificado", value: "142/142", tone: "validated" },
          { label: "Denominación", detail: "Espacios y variantes", value: "7 ajustadas", tone: "processing" },
          { label: "Saldo", detail: "Signo y moneda", value: "2 a revisar", tone: "warning" },
        ],
        metrics: [
          { label: "Campos", value: "426", note: "normalizados" },
          { label: "Alertas", value: "2", note: "sin resolver" },
        ],
        trace: [
          { label: "Regla", value: "Normalización de código y denominación" },
          { label: "Referencia", value: "Fila original preservada" },
          { label: "Control", value: "Diferencias visibles para revisión" },
        ],
      },
      suggestions: {
        eyebrow: "Relaciones sugeridas",
        title: "El sistema propone; el profesional decide.",
        description:
          "Cada agrupación incluye la fuente utilizada y un estado de confianza para priorizar la revisión.",
        status: "24 rubros propuestos",
        items: [
          { label: "Caja y bancos", detail: "12 cuentas vinculadas", value: "Alta confianza", tone: "validated" },
          { label: "Créditos por ventas", detail: "8 cuentas vinculadas", value: "Alta confianza", tone: "validated" },
          { label: "Bienes de cambio", detail: "3 relaciones posibles", value: "Revisar", tone: "warning" },
        ],
        metrics: [
          { label: "Sugerencias", value: "21", note: "listas para validar" },
          { label: "Excepciones", value: "3", note: "requieren criterio" },
        ],
        trace: [
          { label: "Fuente", value: "Plan de cuentas + sumas y saldos" },
          { label: "Criterio", value: "Coincidencia de código y denominación" },
          { label: "Estado", value: "Pendiente de validación humana" },
        ],
      },
      review: {
        eyebrow: "Mesa de revisión",
        title: "La atención va a lo que realmente necesita criterio.",
        description:
          "Las propuestas aceptadas y las excepciones quedan separadas para que el cierre continúe por el circuito habitual.",
        status: "Revisión en curso",
        items: [
          { label: "Relaciones validadas", detail: "Confirmadas por el equipo", value: "21", tone: "validated" },
          { label: "Bienes de cambio", detail: "Definir agrupación", value: "1 decisión", tone: "warning" },
          { label: "Saldos con signo atípico", detail: "Revisar fuente", value: "2 casos", tone: "warning" },
        ],
        metrics: [
          { label: "Validadas", value: "21", note: "con trazabilidad" },
          { label: "Pendientes", value: "3", note: "visibles" },
        ],
        trace: [
          { label: "Responsable", value: "Equipo profesional del estudio" },
          { label: "Registro", value: "Estado y observación por relación" },
          { label: "Salida", value: "Estructura lista para continuar" },
        ],
      },
    },
  },
  "bank-summary": {
    label: "Resúmenes bancarios",
    shortLabel: "Bancos",
    caseName: "Cuenta corriente · Caso demostrativo",
    summary: "Convierte movimientos dispersos en una base estructurada y lista para controlar.",
    sources: [
      { name: "Resumen_Banco_Río.pdf", meta: "18 páginas" },
      { name: "Movimientos_junio.xlsx", meta: "268 filas" },
      { name: "Reglas_conceptos.csv", meta: "34 referencias" },
    ],
    stages: {
      inputs: {
        eyebrow: "Documentos bancarios",
        title: "PDF y planillas dentro del mismo inventario.",
        description:
          "La demo identifica períodos, cuentas y formatos sin pedir documentación real desde la web.",
        status: "3 fuentes listas",
        items: [
          { label: "Resumen bancario", detail: "18 páginas detectadas", value: "PDF", tone: "source" },
          { label: "Detalle de movimientos", detail: "Encabezados verificados", value: "268 filas", tone: "source" },
          { label: "Reglas de conceptos", detail: "Referencias disponibles", value: "34 reglas", tone: "validated" },
        ],
        metrics: [
          { label: "Período", value: "06/26", note: "identificado" },
          { label: "Fuentes", value: "3/3", note: "registradas" },
        ],
        trace: [
          { label: "Origen", value: "Archivos ficticios de demostración" },
          { label: "Control", value: "Cuenta, período y formato" },
          { label: "Salida", value: "Inventario bancario" },
        ],
      },
      normalization: {
        eyebrow: "Movimientos estructurados",
        title: "Una fila consistente por movimiento.",
        description:
          "Fecha, concepto, referencia, débito y crédito se ordenan con vínculo al documento de origen.",
        status: "268 filas estructuradas",
        items: [
          { label: "Fechas", detail: "Formato unificado", value: "268/268", tone: "validated" },
          { label: "Débitos y créditos", detail: "Columnas separadas", value: "268/268", tone: "validated" },
          { label: "Referencias incompletas", detail: "Texto parcial en origen", value: "4 casos", tone: "warning" },
        ],
        metrics: [
          { label: "Movimientos", value: "268", note: "estructurados" },
          { label: "Alertas", value: "4", note: "visibles" },
        ],
        trace: [
          { label: "Regla", value: "Fecha, concepto e importe" },
          { label: "Referencia", value: "Página y línea de origen" },
          { label: "Control", value: "Totales de entrada y salida" },
        ],
      },
      suggestions: {
        eyebrow: "Conceptos sugeridos",
        title: "Patrones repetidos, decisiones visibles.",
        description:
          "Las referencias conocidas se proponen como categorías y los conceptos ambiguos quedan separados.",
        status: "231 conceptos sugeridos",
        items: [
          { label: "Comisiones bancarias", detail: "32 movimientos", value: "Validable", tone: "validated" },
          { label: "Transferencias recibidas", detail: "86 movimientos", value: "Validable", tone: "validated" },
          { label: "Concepto abreviado", detail: "Sin referencia suficiente", value: "9 casos", tone: "warning" },
        ],
        metrics: [
          { label: "Sugeridos", value: "231", note: "con referencia" },
          { label: "Sin criterio", value: "9", note: "para revisar" },
        ],
        trace: [
          { label: "Fuente", value: "Concepto bancario + reglas acordadas" },
          { label: "Criterio", value: "Coincidencia exacta o parcial" },
          { label: "Estado", value: "Pendiente de aprobación" },
        ],
      },
      review: {
        eyebrow: "Control final",
        title: "La salida muestra qué está listo y qué falta resolver.",
        description:
          "El equipo revisa excepciones, confirma categorías y exporta una base para continuar el trabajo.",
        status: "9 excepciones abiertas",
        items: [
          { label: "Movimientos validados", detail: "Categoría confirmada", value: "222", tone: "validated" },
          { label: "Referencias incompletas", detail: "Volver al documento", value: "4 casos", tone: "warning" },
          { label: "Conceptos ambiguos", detail: "Definir criterio", value: "5 casos", tone: "warning" },
        ],
        metrics: [
          { label: "Validados", value: "222", note: "listos para exportar" },
          { label: "Pendientes", value: "9", note: "identificados" },
        ],
        trace: [
          { label: "Responsable", value: "Equipo del estudio" },
          { label: "Registro", value: "Categoría y observación" },
          { label: "Salida", value: "Base estructurada revisable" },
        ],
      },
    },
  },
};
