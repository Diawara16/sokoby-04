import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { StoreSettings } from "../types";

export const useStoreSettings = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadStoreSettings = async () => {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Vous devez être connecté pour accéder aux paramètres");
      }

      console.log("Chargement des paramètres pour l'utilisateur:", user.id);

      const { data: existingSettings, error: fetchError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('user_id', user.id)
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

  const handleSave = async () => {
    try {
      setError(null);
      if (!settings) return;

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Vous devez être connecté pour sauvegarder");
      }

      console.log("Sauvegarde des paramètres:", settings);

      const { error: saveError } = await supabase
        .from('store_settings')
        .upsert({
          ...settings,
          user_id: user.id,
          updated_at: new Date().toISOString()
        });

      if (saveError) {
        console.error("Erreur lors de la sauvegarde:", saveError);
        throw saveError;
      }

      toast({
        title: "Succès",
        description: "Paramètres sauvegardés",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
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
    handleSave,
    reloadSettings: loadStoreSettings
  };
};