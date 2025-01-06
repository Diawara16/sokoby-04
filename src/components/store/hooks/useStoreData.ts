import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { StoreSettings } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useStoreData = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadStoreSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Vous devez être connecté pour accéder aux paramètres");
      }

      console.log("Chargement des paramètres pour l'utilisateur:", user.id);

      // Ajout d'un ORDER BY created_at DESC pour s'assurer d'avoir les paramètres les plus récents
      const { data: existingSettings, error: fetchError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error("Erreur lors de la récupération des paramètres:", fetchError);
        throw fetchError;
      }

      console.log("Paramètres récupérés:", existingSettings);

      if (!existingSettings) {
        console.log("Création de nouveaux paramètres");
        const { data: newSettings, error: createError } = await supabase
          .from('store_settings')
          .insert([{
            user_id: user.id,
            store_name: 'Ma boutique',
            store_email: user.email,
            domain_name: null,
            is_custom_domain: false,
            store_phone: null,
            store_address: null
          }])
          .select()
          .single();

        if (createError) {
          console.error("Erreur lors de la création des paramètres:", createError);
          throw createError;
        }

        console.log("Nouveaux paramètres créés:", newSettings);
        setSettings(newSettings);
      } else {
        setSettings(existingSettings);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres de la boutique",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoreSettings();
  }, []);

  return {
    settings,
    setSettings,
    isLoading,
    error,
    reloadSettings: loadStoreSettings
  };
};