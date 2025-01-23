import { ShippingIntegrationCard } from "./ShippingIntegrationCard";
import { Package, Truck, Box } from "lucide-react";

const shippingProviders = [
  {
    name: "DHL Express",
    description: "Service de livraison express international avec suivi en temps réel",
    icon: <Truck className="h-5 w-5 text-yellow-500" />,
    provider: "dhl"
  },
  {
    name: "FedEx",
    description: "Solutions de livraison rapide avec couverture mondiale",
    icon: <Package className="h-5 w-5 text-purple-500" />,
    provider: "fedex"
  },
  {
    name: "UPS",
    description: "Service de transport et logistique fiable",
    icon: <Box className="h-5 w-5 text-brown-500" />,
    provider: "ups"
  }
];

export const ShippingIntegrations = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {shippingProviders.map((provider) => (
        <ShippingIntegrationCard
          key={provider.provider}
          {...provider}
        />
      ))}
    </div>
  );
};