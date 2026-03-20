import { ServicePageTemplate } from "../../components/services/ServicePageTemplate";
import { getServiceBySlug } from "../../lib/services";

const service = getServiceBySlug("paginas-web-y-landings");

export function PaginasWebYLandings() {
  if (!service) {
    return null;
  }

  return <ServicePageTemplate service={service} />;
}
