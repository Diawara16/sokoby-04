import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "./use-toast";

export const useFavorites = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addToFavorites = async (productId: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter des favoris",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .insert([{ product_id: productId, user_id: user.id }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Produit ajouté aux favoris",
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter aux favoris",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour gérer vos favoris",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ product_id: productId, user_id: user.id });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Produit retiré des favoris",
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer des favoris",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkIsFavorite = async (productId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select()
        .match({ product_id: productId, user_id: user.id })
        .maybeSingle();

      if (error) {
        console.error('Error checking favorite status:', error);
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