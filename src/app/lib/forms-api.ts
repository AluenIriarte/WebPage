const DEFAULT_FORMS_WORKER_BASE =
  "https://divine-bread-7e7e.alanlperez1996.workers.dev";
const FORMS_WORKER_BASE = (
  import.meta.env.VITE_FORMS_WORKER_BASE || DEFAULT_FORMS_WORKER_BASE
).replace(/\/$/, "");

interface ApiResponse {
  ok: boolean;
  message?: string;
}

export interface QuoteRequestResponse extends ApiResponse {
  requestId: string;
}

export interface LeadMagnetRequestPayload {
  nombre: string;
  email: string;
  empresa?: string;
  recursoId: string;
  recurso: string;
  recursoHref: string;
}

export interface QuoteRequestPayload {
  nombre: string;
  email: string;
  empresa: string;
  producto: string;
  rol?: string;
  objetivo?: string;
  fuentes?: string;
  destinatarios?: string;
  plazo?: string;
  desafio?: string;
}

async function postJson<TPayload extends object, TResponse extends ApiResponse = ApiResponse>(
  path: string,
  payload: TPayload,
) {
  const response = await fetch(`${FORMS_WORKER_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data: TResponse | null = null;
  try {
    data = (await response.json()) as TResponse;
  } catch {
    data = null;
  }

  if (!response.ok || !data?.ok) {
    throw new Error(data?.message || "No se pudo procesar la solicitud.");
  }

  return data as TResponse;
}

export function submitLeadMagnetRequest(payload: LeadMagnetRequestPayload) {
  return postJson("/lead-magnet", payload);
}

export async function submitQuoteRequest(payload: QuoteRequestPayload) {
  const response = await postJson<QuoteRequestPayload, QuoteRequestResponse>(
    "/quote-request",
    payload,
  );

  if (!response.requestId) {
    throw new Error("La solicitud se envio sin devolver un requestId.");
  }

  return response;
}
