import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ShippingIntegrations } from "@/components/shipping/ShippingIntegrations";
import { Package } from "lucide-react";

const ShippingSettings = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Intégrations de livraison
          </CardTitle>
        </CardHeader>
        <ShippingIntegrations />
      </Card>
    </div>
  );
};

export default ShippingSettings;