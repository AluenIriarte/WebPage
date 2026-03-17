export const CALENDLY_URL = "https://calendly.com/alanlperez1996/30min";
export const CONTACT_EMAIL = "alanlperez1996@gmail.com";
export const DIAGNOSTIC_SECTION_HREF = "#contacto";
export const ROOT_DIAGNOSTIC_SECTION_HREF = "/#contacto";
export const SERVICES_PAGE_HREF = "/servicios";
export const QUOTE_PAGE_HREF = "/presupuesto-dashboard";
export const DEMO_PAGE_HREF = "/demo-dashboard";
export const AUTO_DIAGNOSTIC_PAGE_HREF = "/auto-diagnostico";
export const AUTO_DIAGNOSTIC_THANKYOU_HREF = "/gracias/auto-diagnostico";

const quoteSubject = "Consulta por dashboard de ventas a medida";

export interface QuoteBriefFields {
  empresa: string;
  rol: string;
  objetivo: string;
  fuentes: string;
  destinatarios: string;
  plazo: string;
  desafio: string;
}

function normalizeField(value?: string) {
  return value?.trim() || "";
}

export function buildQuoteEmailBody(fields: Partial<QuoteBriefFields> = {}) {
  const empresa = normalizeField(fields.empresa);
  const rol = normalizeField(fields.rol);
  const objetivo = normalizeField(fields.objetivo);
  const fuentes = normalizeField(fields.fuentes);
  const destinatarios = normalizeField(fields.destinatarios);
  const plazo = normalizeField(fields.plazo);
  const desafio = normalizeField(fields.desafio);

  return [
    "Hola Alan,",
    "",
    "Quiero pedir una cotización para un dashboard a medida.",
    "",
    `Empresa: ${empresa}`,
    `Rol: ${rol}`,
    `Qué necesito ver: ${objetivo}`,
    `Fuentes o herramientas actuales: ${fuentes}`,
    `Quiénes lo van a usar: ${destinatarios}`,
    `Plazo estimado: ${plazo}`,
    `Contexto o desafío principal: ${desafio}`,
    "",
    "Gracias.",
  ].join("\n");
}

export function buildQuoteEmailHref(fields: Partial<QuoteBriefFields> = {}) {
  const subject = encodeURIComponent(quoteSubject);
  const body = encodeURIComponent(buildQuoteEmailBody(fields));
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export const QUOTE_EMAIL_HREF = buildQuoteEmailHref();
