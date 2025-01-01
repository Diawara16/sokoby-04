import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints"

export const LoyaltyRewards = () => {
  const { toast } = useToast()
  const { data: loyaltyData } = useLoyaltyPoints()

  const { data: rewards, isLoading } = useQuery({
    queryKey: ["loyalty-rewards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loyalty_rewards")
        .select("*")
        .eq("is_active", true)
        .order("points_cost", { ascending: true })

      if (error) throw error
      return data
    },
  })

  const handleRedeemReward = async (rewardId: string, pointsCost: number) => {
    if (!loyaltyData || loyaltyData.points < pointsCost) {
      toast({
        title: "Points insuffisants",
        description: "Vous n'avez pas assez de points pour cette récompense",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.rpc("redeem_reward", {
        reward_id: rewardId,
      })

      if (error) throw error

      toast({
        title: "Récompense échangée",
        description: "Votre récompense a été ajoutée à votre compte",
      })
    } catch (error) {
      console.error("Error redeeming reward:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'échanger la récompense",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {rewards?.map((reward) => (
        <Card key={reward.id}>
          <CardHeader>
            <CardTitle className="text-lg">{reward.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {reward.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold">{reward.points_cost} points</span>
              <Button
                onClick={() => handleRedeemReward(reward.id, reward.points_cost)}
                disabled={!loyaltyData || loyaltyData.points < reward.points_cost}
              >
                Échanger
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}