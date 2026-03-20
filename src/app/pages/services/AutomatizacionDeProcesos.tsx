import { ServicePageTemplate } from "../../components/services/ServicePageTemplate";
import { getServiceBySlug } from "../../lib/services";

const service = getServiceBySlug("automatizacion-de-procesos");

export function AutomatizacionDeProcesos() {
  if (!service) {
    return null;
  }

  return <ServicePageTemplate service={service} />;
}
