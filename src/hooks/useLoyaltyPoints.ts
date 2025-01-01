import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "./use-toast";

interface LoyaltyPoints {
  points: number;
  lifetime_points: number;
  current_tier: string;
  nextTierPoints: number;
}

const DEFAULT_LOYALTY_STATE: LoyaltyPoints = {
  points: 0,
  lifetime_points: 0,
  current_tier: "bronze",
  nextTierPoints: 1000,
};

const calculateNextTierPoints = (currentTier: string): number => {
  switch (currentTier) {
    case "bronze":
      return 1000;
    case "silver":
      return 5000;
    case "gold":
      return 10000;
    default:
      return Infinity;
  }
};

export const useLoyaltyPoints = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["loyalty-points"],
    queryFn: async (): Promise<LoyaltyPoints> => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error("Auth error:", authError);
          toast({
            title: "Erreur d'authentification",
            description: "Impossible de vérifier votre identité",
            variant: "destructive",
          });
          return DEFAULT_LOYALTY_STATE;
        }

        if (!user) {
          console.log("No user found");
          return DEFAULT_LOYALTY_STATE;
        }

        const { data: loyaltyPoints, error } = await supabase
          .from("loyalty_points")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching loyalty points:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger vos points de fidélité",
            variant: "destructive",
          });
          return DEFAULT_LOYALTY_STATE;
        }

        if (!loyaltyPoints) {
          console.log("No loyalty points found for user", user.id);
          return DEFAULT_LOYALTY_STATE;
        }

        return {
          ...loyaltyPoints,
          nextTierPoints: calculateNextTierPoints(loyaltyPoints.current_tier),
        };
      } catch (error) {
        console.error("Error in useLoyaltyPoints:", error);
        toast({
          title: "Erreur inattendue",
          description: "Une erreur est survenue lors du chargement de vos points",
          variant: "destructive",
        });
        return DEFAULT_LOYALTY_STATE;
      }
    },
  });
};