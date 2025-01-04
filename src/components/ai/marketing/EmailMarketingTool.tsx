import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingToolCard } from "./MarketingToolCard";
import { useMarketingOperations } from "./useMarketingOperations";

export const EmailMarketingTool = () => {
  const { handleFeatureClick } = useMarketingOperations();

  const features = [
    "Segmentation automatique",
    "Personnalisation dynamique",
    "Analyses détaillées"
  ];

  return (
    <MarketingToolCard
      icon={Mail}
      title="Email Marketing Avancé"
      description="Segmentation avancée et personnalisation"
      features={features}
      onFeatureClick={handleFeatureClick}
    />
  );
};