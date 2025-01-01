import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown } from "lucide-react";

interface LoyaltyCardProps {
  points: number;
  lifetimePoints: number;
  tier: string;
  nextTierPoints: number;
}

export const LoyaltyCard = ({ points, lifetimePoints, tier, nextTierPoints }: LoyaltyCardProps) => {
  const progress = (lifetimePoints / nextTierPoints) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Programme de fidélité</CardTitle>
        <Crown className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{points} points</div>
        <p className="text-xs text-muted-foreground">
          Niveau {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </p>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            {nextTierPoints - lifetimePoints} points pour le prochain niveau
          </p>
        </div>
      </CardContent>
    </Card>
  );
};