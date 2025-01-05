import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "./use-toast";

export const useFavorites = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addToFavorites = async (productId: string) => {
    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error("Erreur d'authentification");
      }
      
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour ajouter des favoris",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .insert([{ product_id: productId, user_id: user.id }]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Ajouté aux favoris",
        description: "Le produit a été ajouté à vos favoris",
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter aux favoris. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error("Erreur d'authentification");
      }

      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour gérer vos favoris",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ product_id: productId, user_id: user.id });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Retiré des favoris",
        description: "Le produit a été retiré de vos favoris",
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer des favoris. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkIsFavorite = async (productId: string): Promise<boolean> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        return false;
      }
      
      if (!user) {
        return false;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select()
        .match({ product_id: productId, user_id: user.id })
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  };

  return {
    loading,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite,
  };
};