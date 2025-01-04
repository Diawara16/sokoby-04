import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingToolCard } from "./MarketingToolCard";
import { useMarketingOperations } from "./useMarketingOperations";

export const AutomationTool = () => {
  const { handleFeatureClick } = useMarketingOperations();

  const features = [
    "Séquences d'emails",
    "Déclencheurs comportementaux",
    "Scénarios personnalisés"
  ];

  return (
    <MarketingToolCard
      icon={Wand2}
      title="Automatisation Marketing"
      description="Workflows marketing automatisés"
      features={features}
      onFeatureClick={handleFeatureClick}
    />
  );
};