export interface FreeResource {
  id: string;
  type: string;
  title: string;
  description: string;
  pageHref: string;
}

export const freeResources: FreeResource[] = [
  {
    id: "autoevaluacion-ejecutiva",
    type: "PDF",
    title: "Autoevaluación ejecutiva",
    description: "Señales clave para detectar oportunidades ocultas en tus ventas.",
    pageHref: "/recursos/autoevaluacion-ejecutiva",
  },
];

export function getFreeResource(resourceId?: string | null) {
  if (!resourceId) {
    return null;
  }

  return freeResources.find((resource) => resource.id === resourceId) ?? null;
}
