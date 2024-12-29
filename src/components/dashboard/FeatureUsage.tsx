import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface FeatureUsageProps {
  features: Record<string, number>;
}

export const FeatureUsage = ({ features }: FeatureUsageProps) => {
  const hasFeatures = Object.keys(features).length > 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Utilisation des fonctionnalités
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hasFeatures ? (
            Object.entries(features).map(([feature, count]) => (
              <div key={feature} className="flex justify-between items-center">
                <span className="text-sm">{feature}</span>
                <span className="text-sm font-medium">{count} utilisations</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucune utilisation enregistrée
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};