import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints"
import { LoyaltyCard } from "./LoyaltyCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown } from "lucide-react"

export const LoyaltyOverview = () => {
  const { data: loyaltyData, isLoading } = useLoyaltyPoints()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        {loyaltyData && (
          <LoyaltyCard
            points={loyaltyData.points}
            lifetimePoints={loyaltyData.lifetime_points}
            tier={loyaltyData.current_tier}
            nextTierPoints={loyaltyData.nextTierPoints}
          />
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avantages du niveau {loyaltyData?.current_tier}</CardTitle>
          <Crown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {loyaltyData?.current_tier === "bronze" && (
              <>
                <p>✨ Gagnez 1 point pour chaque euro dépensé</p>
                <p>🎁 Accès aux récompenses de base</p>
              </>
            )}
            {loyaltyData?.current_tier === "silver" && (
              <>
                <p>✨ Gagnez 1.2 points pour chaque euro dépensé</p>
                <p>🎁 Accès aux récompenses silver</p>
                <p>📦 Livraison prioritaire</p>
              </>
            )}
            {loyaltyData?.current_tier === "gold" && (
              <>
                <p>✨ Gagnez 1.5 points pour chaque euro dépensé</p>
                <p>🎁 Accès aux récompenses gold</p>
                <p>📦 Livraison prioritaire</p>
                <p>🎯 Accès aux ventes privées</p>
              </>
            )}
            {loyaltyData?.current_tier === "diamond" && (
              <>
                <p>✨ Gagnez 2 points pour chaque euro dépensé</p>
                <p>🎁 Accès à toutes les récompenses</p>
                <p>📦 Livraison express gratuite</p>
                <p>🎯 Accès aux ventes privées</p>
                <p>👑 Service client prioritaire</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}