import { SplitSquareVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingToolCard } from "./MarketingToolCard";
import { useMarketingOperations } from "./useMarketingOperations";

export const ABTestingTool = () => {
  const { handleFeatureClick } = useMarketingOperations();

  const features = [
    "Test de contenu",
    "Test d'objets",
    "Analyse des résultats"
  ];

  return (
    <MarketingToolCard
      icon={SplitSquareVertical}
      title="Tests A/B"
      description="Optimisation des campagnes par A/B testing"
      features={features}
      onFeatureClick={handleFeatureClick}
    />
  );
};