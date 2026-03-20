import {
  Bot,
  FileBadge2,
  Globe,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import { QUOTE_PAGE_HREF } from "./contact";

export type ServiceSlug =
  | "dashboard-a-medida"
  | "automatizacion-de-procesos"
  | "paginas-web-y-landings"
  | "branding-kits";

export type ServiceIntent = "diagnostico" | "cotizacion";

export interface ServiceHighlight {
  title: string;
  description: string;
}

export interface ServiceUseCase {
  title: string;
  description: string;
}

export interface ServiceDefinition {
  slug: ServiceSlug;
  order: number;
  title: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  audience: string;
  deliverable: string;
  quoteLabel: string;
  aliases?: string[];
  icon: LucideIcon;
  homeHighlights: string[];
  includes: ServiceHighlight[];
  pains: string[];
  outcomes: ServiceHighlight[];
  useCases: ServiceUseCase[];
  seoTitle: string;
  seoDescription: string;
}

export const services: ServiceDefinition[] = [
  {
    slug: "dashboard-a-medida",
    order: 1,
    title: "Dashboard a medida",
    eyebrow: "Visibilidad y decisión",
    tagline: "Unificá comercial y otras áreas para decidir con una lectura clara, conectada y accionable.",
    summary:
      "Diseño dashboards a medida para ventas, proveedores, presupuesto, performance y operaciones. El foco no está en sumar gráficos sino en construir una capa de visibilidad que ordene decisiones reales.",
    audience:
      "Para dirección, gerencia comercial, operaciones o founders que necesitan integrar datos y dejar de mirar reportes dispersos.",
    deliverable: "Tablero ejecutivo + vistas operativas + criterios de lectura + conexión con fuentes reales.",
    quoteLabel: "Dashboard a medida",
    aliases: ["Dashboard de ventas / BI comercial a medida", "Dashboard para otra área"],
    icon: LayoutDashboard,
    homeHighlights: [
      "Ventas, cartera, proveedores, presupuesto y performance en una sola lectura.",
      "Conecta Excel, CRM, ERP o bases existentes sin depender de reportes sueltos.",
      "Pensado para seguimiento real, reuniones y decisiones, no para decorar pantallas.",
    ],
    includes: [
      {
        title: "Diseño de vistas ejecutivas y operativas",
        description: "Armado de una lectura principal para dirección y vistas complementarias para seguimiento diario o semanal.",
      },
      {
        title: "Modelo y criterio de datos",
        description: "Defino indicadores, reglas y estructura para que el tablero sostenga lectura consistente y no quede atado a planillas dispersas.",
      },
      {
        title: "Integración con fuentes reales",
        description: "Uso las herramientas y fuentes que ya existen para que el sistema sea útil y adoptable desde el día uno.",
      },
      {
        title: "Aterrizaje a rutina de negocio",
        description: "Se deja pensado para reuniones, alertas, seguimiento comercial y revisión de prioridades.",
      },
    ],
    pains: [
      "La información existe, pero está repartida entre planillas, ERP, CRM y reportes manuales.",
      "Se llega tarde a desvíos de cartera, margen o cumplimiento porque nadie ve la foto completa.",
      "Las reuniones se apoyan en datos distintos según quién arme el reporte.",
      "El negocio necesita una vista integrada para decidir sin depender del armado manual de cada semana.",
    ],
    outcomes: [
      {
        title: "Más claridad ejecutiva",
        description: "Una sola capa de lectura para ver qué está pasando y dónde conviene intervenir primero.",
      },
      {
        title: "Seguimiento real",
        description: "Menos tiempo consolidando información y más foco en reuniones, alertas y decisiones con criterio.",
      },
      {
        title: "Sistema reusable",
        description: "La solución queda lista para crecer a otras áreas, nuevas vistas o automatizaciones posteriores.",
      },
    ],
    useCases: [
      {
        title: "Dirección comercial",
        description: "Revenue, metas, cartera, vendedores, pipeline y señales de riesgo en una misma lectura.",
      },
      {
        title: "Operaciones y presupuesto",
        description: "Seguimiento de desempeño operativo, consumo presupuestario y cuellos de botella.",
      },
      {
        title: "Proveedores o abastecimiento",
        description: "Vista de compras, performance de proveedores, cumplimiento y desvíos críticos.",
      },
    ],
    seoTitle: "Dashboard a medida para ventas, operaciones y dirección | Alan L. Perez",
    seoDescription:
      "Servicio de dashboard a medida para ventas, operaciones, proveedores y dirección. Integración de datos, visibilidad real y seguimiento accionable.",
  },
  {
    slug: "automatizacion-de-procesos",
    order: 2,
    title: "Automatización de procesos",
    eyebrow: "Eficiencia operativa",
    tagline: "Reducí tareas manuales, errores y tiempos muertos en procesos repetitivos o administrativos.",
    summary:
      "Diseño automatizaciones para consolidación de información, seguimiento operativo, tareas administrativas y circuitos repetitivos que hoy dependen de intervención manual.",
    audience:
      "Para equipos de administración, operaciones, comercial o founders que quieren liberar horas y bajar fricción operativa.",
    deliverable: "Mapa de proceso + automatización implementada + criterios de excepción + handoff claro.",
    quoteLabel: "Automatización de procesos",
    aliases: ["Automatización / RPA", "IA aplicada al negocio", "Acompañamiento y capacitación"],
    icon: Bot,
    homeHighlights: [
      "Menos copy-paste, menos seguimiento manual y menos riesgo de error humano.",
      "Automatización de consolidación, envío, validación y actualización de información.",
      "Ideal para tareas administrativas, operativas o repetitivas con alto costo oculto.",
    ],
    includes: [
      {
        title: "Diagnóstico del proceso actual",
        description: "Se identifica el paso manual, la fricción operativa y los puntos donde hoy se pierde tiempo o consistencia.",
      },
      {
        title: "Diseño del flujo automatizado",
        description: "Defino entradas, validaciones, reglas, salidas y alertas para que el proceso no dependa de intervención constante.",
      },
      {
        title: "Implementación y pruebas",
        description: "La automatización se prueba con casos reales y se deja claro qué ocurre cuando aparece una excepción.",
      },
      {
        title: "Documentación y traspaso",
        description: "El equipo entiende qué quedó automatizado, dónde intervenir y cómo sostenerlo.",
      },
    ],
    pains: [
      "Procesos repetitivos consumen horas de personas que deberían estar enfocadas en tareas de más valor.",
      "Los errores aparecen por duplicación manual, copiado de datos o seguimiento desordenado.",
      "La operación depende de que alguien recuerde ejecutar, actualizar o consolidar información.",
      "No hay trazabilidad clara sobre estados, pendientes o excepciones.",
    ],
    outcomes: [
      {
        title: "Velocidad operativa",
        description: "Los ciclos se acortan y el equipo deja de dedicar tiempo a tareas mecánicas.",
      },
      {
        title: "Menos errores",
        description: "La lógica queda sistematizada y se reduce la variabilidad de ejecución manual.",
      },
      {
        title: "Más control",
        description: "El proceso deja de depender de memoria individual y gana trazabilidad.",
      },
    ],
    useCases: [
      {
        title: "Consolidación de reportes",
        description: "Unificación automática de información que hoy llega desde varias planillas, áreas o sistemas.",
      },
      {
        title: "Seguimiento operativo",
        description: "Alertas, estados, vencimientos y tareas repetitivas que hoy requieren control manual.",
      },
      {
        title: "Circuitos administrativos",
        description: "Procesos de validación, actualización, entrega o seguimiento que necesitan menos fricción y menos error.",
      },
    ],
    seoTitle: "Automatización de procesos administrativos y operativos | Alan L. Perez",
    seoDescription:
      "Servicio de automatización de procesos para reducir tareas manuales, errores y tiempos operativos en circuitos administrativos, comerciales y repetitivos.",
  },
  {
    slug: "paginas-web-y-landings",
    order: 3,
    title: "Páginas web y landings",
    eyebrow: "Oferta y conversión",
    tagline: "Sitios pensados para ordenar la oferta, explicar el valor y convertir interés en conversación.",
    summary:
      "Diseño páginas web y landings orientadas a claridad, posicionamiento y conversión. No se trata solo de verse bien: se trata de presentar mejor la oferta y facilitar el siguiente paso.",
    audience:
      "Para servicios B2B, productos digitales, consultorías o marcas personales que necesitan vender con más claridad.",
    deliverable: "Sitio o landing estratégica + estructura de oferta + jerarquía de CTA + adaptación responsive.",
    quoteLabel: "Páginas web y landings",
    aliases: ["Página web / landing page"],
    icon: Globe,
    homeHighlights: [
      "Landing pages y sitios diseñados para convertir, no solo para verse prolijos.",
      "Estructura clara de oferta, propuesta de valor, CTA y navegación.",
      "Ideal para ordenar servicios, productos, recursos y caminos comerciales.",
    ],
    includes: [
      {
        title: "Arquitectura de contenido",
        description: "Defino qué se dice, en qué orden y con qué jerarquía para que la propuesta se entienda rápido.",
      },
      {
        title: "Diseño responsive y desarrollo",
        description: "La experiencia se construye pensando en desktop y mobile con ritmo visual, legibilidad y foco en conversión.",
      },
      {
        title: "CTAs y rutas comerciales",
        description: "Se ordenan caminos de diagnóstico, contacto, cotización o descarga según el tipo de lead.",
      },
      {
        title: "Base SEO y performance",
        description: "Slugs, metadata, estructura y contenido indexable para que la página también funcione como canal de descubrimiento.",
      },
    ],
    pains: [
      "La web actual no deja claro qué ofrecés, para quién y cuál es el siguiente paso.",
      "La oferta compite contra sí misma porque no tiene jerarquía ni flujo comercial claro.",
      "El sitio se siente genérico, poco confiable o desordenado para un cliente B2B.",
      "No existe una landing específica para convertir tráfico de outreach, contenido o campañas.",
    ],
    outcomes: [
      {
        title: "Más claridad comercial",
        description: "La propuesta se entiende rápido y con mejor percepción de valor.",
      },
      {
        title: "Mejor conversión",
        description: "Los CTAs dejan de pelear entre sí y cada usuario encuentra un camino lógico.",
      },
      {
        title: "Activo reusable",
        description: "La web queda lista para recibir tráfico de LinkedIn, email, SEO o campañas.",
      },
    ],
    useCases: [
      {
        title: "Landing de servicio",
        description: "Para vender una solución puntual con foco en diagnóstico, cotización o demostración.",
      },
      {
        title: "Web de marca personal o consultoría",
        description: "Para ordenar oferta, recursos, autoridad y contacto sin caer en look de agencia genérica.",
      },
      {
        title: "Página de producto digital",
        description: "Para presentar una herramienta, recurso o solución con más claridad y más conversión.",
      },
    ],
    seoTitle: "Páginas web y landings B2B orientadas a conversión | Alan L. Perez",
    seoDescription:
      "Servicio de diseño y desarrollo de páginas web y landings B2B para ordenar oferta, mejorar claridad comercial y convertir tráfico en oportunidades.",
  },
  {
    slug: "branding-kits",
    order: 4,
    title: "Branding kits",
    eyebrow: "Activos de marca y venta",
    tagline: "Un sistema de piezas visuales y comerciales para vender mejor y comunicar con coherencia.",
    summary:
      "Branding kits reúne tres familias de activos: publishing kit, delivery kit y brand kit. La idea no es hacer diseño suelto, sino construir un sistema que ordene comunicación, ventas y entrega.",
    audience:
      "Para marcas personales, consultorías y negocios B2B que ya venden algo valioso pero comunican de forma dispersa.",
    deliverable: "Sistema de activos visuales y comerciales: publishing kit + delivery kit + brand kit.",
    quoteLabel: "Branding kits",
    aliases: ["Activos comerciales y de marca", "Sistema de contenido / calendario editorial"],
    icon: FileBadge2,
    homeHighlights: [
      "Publishing kit para contenido y presencia editorial coherente.",
      "Delivery kit para propuestas, entregables y experiencia de cliente.",
      "Brand kit para identidad, piezas base y consistencia visual.",
    ],
    includes: [
      {
        title: "Publishing kit",
        description: "Templates y activos para contenido, publicaciones, carruseles, piezas editoriales o sistema de comunicación.",
      },
      {
        title: "Delivery kit",
        description: "Piezas para propuestas, diagnósticos, entregables, documentos y experiencia post-venta o post-reunión.",
      },
      {
        title: "Brand kit",
        description: "Base de identidad, componentes visuales, reglas y piezas para que la marca no dependa de improvisación.",
      },
      {
        title: "Criterio de sistema",
        description: "Todo se piensa como familia de activos conectados, no como PDFs o piezas aisladas.",
      },
    ],
    pains: [
      "La marca comunica con piezas distintas, tonos distintos y sin sistema reconocible.",
      "Los materiales comerciales no sostienen el nivel del servicio o producto que se vende.",
      "Cada propuesta, PDF o publicación se arma desde cero y sin consistencia.",
      "No existe una base clara para vender, entregar y comunicar con el mismo estándar.",
    ],
    outcomes: [
      {
        title: "Más coherencia",
        description: "La marca se ve consistente en contenido, venta y entrega.",
      },
      {
        title: "Mejor percepción de valor",
        description: "Las piezas acompañan mejor la propuesta y elevan la experiencia completa.",
      },
      {
        title: "Sistema reusable",
        description: "Queda una base para operar con menos improvisación y más criterio visual/comercial.",
      },
    ],
    useCases: [
      {
        title: "Publishing kit",
        description: "Para sostener contenido y presencia editorial en LinkedIn, email o materiales de difusión.",
      },
      {
        title: "Delivery kit",
        description: "Para profesionalizar propuestas, diagnósticos, PDFs y documentos de entrega.",
      },
      {
        title: "Brand kit",
        description: "Para ordenar identidad, piezas base y look visual de la marca de forma consistente.",
      },
    ],
    seoTitle: "Branding kits para activos comerciales, publishing y delivery | Alan L. Perez",
    seoDescription:
      "Servicio de branding kits para construir publishing kit, delivery kit y brand kit como sistema de activos comerciales y visuales coherentes.",
  },
];

export const SERVICE_PRODUCT_OPTIONS = services.map((service) => service.quoteLabel);

export function getServiceBySlug(slug?: string | null) {
  if (!slug) {
    return null;
  }

  return services.find((service) => service.slug === slug) ?? null;
}

export function getServiceByQuoteLabel(label?: string | null) {
  if (!label) {
    return null;
  }

  const normalized = label.trim().toLowerCase();
  return (
    services.find((service) => {
      if (service.quoteLabel.toLowerCase() === normalized) {
        return true;
      }

      return service.aliases?.some((alias) => alias.toLowerCase() === normalized) ?? false;
    }) ?? null
  );
}

export function buildServicePath(slug: ServiceSlug) {
  return `/servicios/${slug}`;
}

export function buildServiceFlowHref(slug: ServiceSlug, intent: ServiceIntent = "diagnostico") {
  const params = new URLSearchParams({
    service: slug,
    intent,
  });

  return `${QUOTE_PAGE_HREF}?${params.toString()}`;
}
