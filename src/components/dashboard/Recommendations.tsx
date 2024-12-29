import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface RecommendationsProps {
  daysRemaining: number;
  hasFeatures: boolean;
}

export const Recommendations = ({ daysRemaining, hasFeatures }: RecommendationsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Recommandations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {daysRemaining <= 3 && (
            <p className="text-sm text-amber-600">
              Votre période d'essai se termine bientôt. Pensez à souscrire à un abonnement pour continuer à utiliser nos services.
            </p>
          )}
          {!hasFeatures && (
            <p className="text-sm text-muted-foreground">
              Explorez nos différentes fonctionnalités pour tirer le meilleur parti de votre période d'essai !
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};