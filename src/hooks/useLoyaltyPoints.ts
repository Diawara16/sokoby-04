import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useLoyaltyPoints = () => {
  return useQuery({
    queryKey: ["loyalty-points"],
    queryFn: async () => {
      const { data: loyaltyPoints, error } = await supabase
        .from("loyalty_points")
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      // Calculate next tier points
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