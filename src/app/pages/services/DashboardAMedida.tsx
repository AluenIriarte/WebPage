import { ServicePageTemplate } from "../../components/services/ServicePageTemplate";
import { getServiceBySlug } from "../../lib/services";

const service = getServiceBySlug("dashboard-a-medida");

export function DashboardAMedida() {
  if (!service) {
    return null;
  }

  return <ServicePageTemplate service={service} />;
}
