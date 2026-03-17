export const CALENDLY_URL = "https://calendly.com/alanlperez1996/30min";
export const CONTACT_EMAIL = "alanlperez1996@gmail.com";
export const DIAGNOSTIC_SECTION_HREF = "#contacto";
export const ROOT_DIAGNOSTIC_SECTION_HREF = "/#contacto";
export const SERVICES_PAGE_HREF = "/servicios";
export const QUOTE_PAGE_HREF = "/presupuesto-dashboard";

const quoteSubject = encodeURIComponent("Consulta por dashboard de ventas a medida");
const quoteBody = encodeURIComponent(
  [
    "Hola Alan,",
    "",
    "Quiero pedir una cotización para un dashboard a medida.",
    "",
    "Empresa:",
    "Rol:",
    "Qué quiero ver en el dashboard:",
    "Herramientas o fuentes de datos actuales:",
    "Plazo estimado:",
    "",
    "Gracias.",
  ].join("\n"),
);

export const QUOTE_EMAIL_HREF = `mailto:${CONTACT_EMAIL}?subject=${quoteSubject}&body=${quoteBody}`;
