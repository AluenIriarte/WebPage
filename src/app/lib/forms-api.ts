const FORMS_WORKER_BASE = "https://divine-bread-7e7e.alanlperez1996.workers.dev";

interface ApiResponse {
  ok: boolean;
  message?: string;
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

async function postJson<TPayload extends object>(path: string, payload: TPayload) {
  const response = await fetch(`${FORMS_WORKER_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data: ApiResponse | null = null;
  try {
    data = (await response.json()) as ApiResponse;
  } catch {
    data = null;
  }

  if (!response.ok || !data?.ok) {
    throw new Error(data?.message || "No se pudo procesar la solicitud.");
  }

  return data;
}

export function submitLeadMagnetRequest(payload: LeadMagnetRequestPayload) {
  return postJson("/lead-magnet", payload);
}

export function submitQuoteRequest(payload: QuoteRequestPayload) {
  return postJson("/quote-request", payload);
}
