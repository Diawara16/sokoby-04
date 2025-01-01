import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useLoyaltyPoints = () => {
  return useQuery({
    queryKey: ["loyalty-points"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: loyaltyPoints, error } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching loyalty points:", error);
        throw error;
      }

      if (!loyaltyPoints) {
        // Si aucun point de fidélité n'existe, retourner des valeurs par défaut
        return {
          points: 0,
          lifetime_points: 0,
          current_tier: "bronze",
          nextTierPoints: 1000,
        };
      }

      // Calculer les points nécessaires pour le prochain niveau
      const nextTierPoints = 
        loyaltyPoints.current_tier === "bronze" ? 1000 :
        loyaltyPoints.current_tier === "silver" ? 5000 :
        loyaltyPoints.current_tier === "gold" ? 10000 : 
        Infinity;

      return {
        ...loyaltyPoints,
        nextTierPoints,
      };
    },
  });
};