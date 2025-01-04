import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketingToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  onFeatureClick: (feature: string) => void;
}

export const MarketingToolCard = ({
  icon: Icon,
  title,
  description,
  features,
  onFeatureClick
}: MarketingToolCardProps) => {
  return (
    <div className="p-6 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="rounded-full bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
          <div className="mt-4 space-y-2">
            {features.map((feature, featureIndex) => (
              <Button 
                key={featureIndex}
                variant="ghost" 
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => onFeatureClick(feature)}
              >
                <span className="text-primary mr-2">•</span>
                {feature}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};