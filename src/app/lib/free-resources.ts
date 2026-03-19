import leadmagnet5PalancasCover from "../../../assets/leadmagnets/5 palancas/Page01Cover.png";
import leadmagnet5PalancasPdf from "../../../assets/leadmagnets/5 palancas/5 palancas comerciales.pdf";

export interface FreeResource {
  id: string;
  type: string;
  title: string;
  description: string;
  pageHref: string;
  coverSrc: string;
  pdfHref: string;
}

export const freeResources: FreeResource[] = [
  {
    id: "autoevaluacion-ejecutiva",
    type: "PDF",
    title: "5 palancas comerciales",
    description: "Guía ejecutiva para detectar oportunidades ocultas en clientes, mix, margen y foco comercial.",
    pageHref: "/recursos/autoevaluacion-ejecutiva",
    coverSrc: leadmagnet5PalancasCover,
    pdfHref: leadmagnet5PalancasPdf,
  },
];

export function getFreeResource(resourceId?: string | null) {
  if (!resourceId) {
    return null;
  }

  return freeResources.find((resource) => resource.id === resourceId) ?? null;
}
