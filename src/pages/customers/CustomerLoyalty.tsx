import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LoyaltyCard } from "@/components/loyalty/LoyaltyCard";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

export default function CustomerLoyalty() {
  const { data: loyaltyData, isLoading: isLoadingLoyalty } = useLoyaltyPoints();
  const { toast } = useToast();

  const { data: rewards } = useQuery({
    queryKey: ["loyalty-rewards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loyalty_rewards")
        .select("*")
        .eq("is_active", true)
        .order("points_cost", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: history } = useQuery({
    queryKey: ["loyalty-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loyalty_points_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleRedeemReward = async (rewardId: string, pointsCost: number) => {
    if (!loyaltyData || loyaltyData.points < pointsCost) {
      toast({
        title: "Points insuffisants",
        description: "Vous n'avez pas assez de points pour cette récompense",
        variant: "destructive",
      });
      return;
    }

    try {
      // Note: redeem_reward function needs to be created in database
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      // Deduct points manually for now
      const { error } = await supabase
        .from('loyalty_points_history')
        .insert({
          user_id: user.id,
          points_change: -pointsCost,
          reason: `Reward redeemed: ${rewardId}`
        })

      if (error) throw error;

      toast({
        title: "Récompense échangée",
        description: "Votre récompense a été ajoutée à votre compte",
      });
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'échanger la récompense",
        variant: "destructive",
      });
    }
  };

  if (isLoadingLoyalty) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Programme de fidélité</h1>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="md:col-span-1">
          {loyaltyData && (
            <LoyaltyCard
              points={loyaltyData.points}
              lifetimePoints={loyaltyData.lifetime_points}
              tier={loyaltyData.current_tier}
              nextTierPoints={loyaltyData.nextTierPoints}
            />
          )}
        </div>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Avantages du niveau {loyaltyData?.current_tier}</CardTitle>
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

      <Tabs defaultValue="rewards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Raison</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history?.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {formatDistance(new Date(entry.created_at), new Date(), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell className={entry.points_change >= 0 ? "text-green-600" : "text-red-600"}>
                        {entry.points_change >= 0 ? "+" : ""}{entry.points_change}
                      </TableCell>
                      <TableCell>{entry.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}