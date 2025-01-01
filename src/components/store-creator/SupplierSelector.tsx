import { Card } from "@/components/ui/card";
import { applications } from "@/data/applications";
import { ApplicationCard } from "@/components/applications/ApplicationCard";

interface SupplierSelectorProps {
  selectedSupplier: string | null;
  onSupplierSelect: (supplier: string) => void;
}

export const SupplierSelector = ({
  selectedSupplier,
  onSupplierSelect,
}: SupplierSelectorProps) => {
  // Ne garder que les fournisseurs de dropshipping
  const suppliers = applications.filter(app => app.type === "dropshipping");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">
        Choisissez votre fournisseur de dropshipping
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {suppliers.map((app) => (
          <ApplicationCard
            key={app.id}
            name={app.name}
            description={app.description}
            icon={app.icon}
            isConnected={selectedSupplier === app.name}
            onConnect={() => onSupplierSelect(app.name)}
            onDisconnect={() => onSupplierSelect("")}
            isLoading={false}
            price={app.price}
          />
        ))}
      </div>
    </div>
  );
};