import { ServicePageTemplate } from "../../components/services/ServicePageTemplate";
import { getServiceBySlug } from "../../lib/services";

const service = getServiceBySlug("branding-kits");

export function BrandingKits() {
  if (!service) {
    return null;
  }

  return <ServicePageTemplate service={service} />;
}
