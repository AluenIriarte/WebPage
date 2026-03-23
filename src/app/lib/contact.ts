export const CALENDLY_URL = "https://calendly.com/alanlperez1996/15";
export const CONTACT_EMAIL = "alanlperez1996@gmail.com";
export const DIAGNOSTIC_SECTION_HREF = "#contacto";
export const ROOT_DIAGNOSTIC_SECTION_HREF = "/#contacto";
export const SERVICES_PAGE_HREF = "/servicios";
export const QUOTE_PAGE_HREF = "/presupuesto-dashboard";
export const DEMO_PAGE_HREF = "/demo-dashboard";
export const AUTO_DIAGNOSTIC_PAGE_HREF = "/auto-diagnostico";
export const AUTO_DIAGNOSTIC_THANKYOU_HREF = "/gracias/auto-diagnostico";
export const PRIMARY_SERVICE_PAGE_HREF = "/dashboard-de-ventas-power-bi";

const quoteSubject = "Consulta por dashboard de ventas a medida";

export const PRODUCT_OPTIONS = [
  "Dashboard de ventas / BI comercial a medida",
  "Dashboard para otra área",
  "Automatización / RPA",
  "IA aplicada al negocio",
  "Acompañamiento y capacitación",
  "Página web / landing page",
  "Activos comerciales y de marca",
  "Sistema de contenido / calendario editorial",
] as const;

export function buildQuotePageHref(product?: string) {
  if (!product) {
    return QUOTE_PAGE_HREF;
  }

  return `${QUOTE_PAGE_HREF}?producto=${encodeURIComponent(product)}`;
}

export interface QuoteBriefFields {
  nombre: string;
  email: string;
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
    "Quiero pedir una cotizacion para uno de tus servicios o productos digitales.",
    "",
    `Nombre: ${normalizeField(fields.nombre)}`,
    `Email: ${normalizeField(fields.email)}`,
    `Producto o servicio: ${producto}`,
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
