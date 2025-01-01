import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "./use-toast";

export const useLoyaltyPoints = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["loyalty-points"],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error("Auth error:", authError);
          throw new Error("Erreur d'authentification");
        }

        if (!user) {
          console.log("No user found");
          return {
            points: 0,
            lifetime_points: 0,
            current_tier: "bronze",
            nextTierPoints: 1000,
          };
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
          console.log("No loyalty points found for user", user.id);
          return {
            points: 0,
            lifetime_points: 0,
            current_tier: "bronze",
            nextTierPoints: 1000,
          };
        }

        const nextTierPoints = 
          loyaltyPoints.current_tier === "bronze" ? 1000 :
          loyaltyPoints.current_tier === "silver" ? 5000 :
          loyaltyPoints.current_tier === "gold" ? 10000 : 
          Infinity;

        return {
          ...loyaltyPoints,
          nextTierPoints,
        };
      } catch (error) {
        console.error("Error in useLoyaltyPoints:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos points de fidélité",
          variant: "destructive",
        });
        throw error;
      }
    },
  });
};