import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  trial_ends_at: string | null;
  features_usage: Record<string, number>;
  last_login: string | null;
}

export const useProfileData = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour accéder à votre tableau de bord",
            variant: "destructive",
          });
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors de la récupération du profil:", error);
          throw error;
        }

        if (!data) {
          toast({
            title: "Profil non trouvé",
            description: "Impossible de charger votre profil",
            variant: "destructive",
          });
          return;
        }

        const { data: cartItems, error: cartError } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id);

        if (cartError) throw cartError;

        setProfile(data);
        setCartItemsCount(cartItems?.length || 0);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du profil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  return {
    profile,
    loading,
    cartItemsCount,
  };
};