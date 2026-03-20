export const CALENDLY_URL = "https://calendly.com/alanlperez1996/15";
export const CONTACT_EMAIL = "alanlperez1996@gmail.com";
export const DIAGNOSTIC_SECTION_HREF = "#contacto";
export const ROOT_DIAGNOSTIC_SECTION_HREF = "/#contacto";
export const SERVICES_PAGE_HREF = "/servicios";
export const QUOTE_PAGE_HREF = "/presupuesto-dashboard";
export const DEMO_PAGE_HREF = "/demo-dashboard";
export const AUTO_DIAGNOSTIC_PAGE_HREF = "/auto-diagnostico";
export const AUTO_DIAGNOSTIC_THANKYOU_HREF = "/gracias/auto-diagnostico";
export const ROOT_MINI_CASES_SECTION_HREF = "/#mini-casos";
export const PRIMARY_SERVICE_PAGE_HREF = "/servicios/dashboard-a-medida";

const quoteSubject = "Consulta por servicio a medida";

export function buildQuotePageHref(product?: string) {
  if (!product) {
    return QUOTE_PAGE_HREF;
  }

  return `${QUOTE_PAGE_HREF}?producto=${encodeURIComponent(product)}`;
}

export interface QuoteBriefFields {
  producto: string;
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
  const producto = normalizeField(fields.producto);
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
    "Quiero consultar por uno de tus servicios.",
    "",
    `Producto o servicio: ${producto}`,
    `Empresa: ${empresa}`,
    `Rol: ${rol}`,
    `Que necesito ver: ${objetivo}`,
    `Fuentes o herramientas actuales: ${fuentes}`,
    `Quienes lo van a usar: ${destinatarios}`,
    `Plazo estimado: ${plazo}`,
    `Contexto o desafio principal: ${desafio}`,
    "",
    "Gracias.",
  ].join("\n");
}

export function buildQuoteEmailHref(fields: Partial<QuoteBriefFields> = {}) {
  const subjectLine = normalizeField(fields.producto)
    ? `Consulta por ${normalizeField(fields.producto)}`
    : quoteSubject;
  const subject = encodeURIComponent(subjectLine);
  const body = encodeURIComponent(buildQuoteEmailBody(fields));
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export const QUOTE_EMAIL_HREF = buildQuoteEmailHref();
