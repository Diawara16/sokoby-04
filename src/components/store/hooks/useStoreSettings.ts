import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { StoreSettings } from "../types";

export const useStoreSettings = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadStoreSettings = async () => {
    try {
      console.log("Chargement des paramètres de la boutique...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("Aucun utilisateur connecté");
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour accéder aux paramètres de la boutique",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log("Utilisateur connecté:", user.id);
      const { data: existingSettings, error: fetchError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Erreur lors du chargement des paramètres:", fetchError);
        throw fetchError;
      }

      console.log("Paramètres existants:", existingSettings);

      if (!existingSettings) {
        console.log("Création des paramètres par défaut...");
        const { data: newSettings, error: createError } = await supabase
          .from('store_settings')
          .insert({
            user_id: user.id,
            store_name: 'Ma boutique',
            store_email: user.email,
            domain_name: null,
            is_custom_domain: false,
            store_phone: null,
            store_address: null
          })
          .select()
          .single();

        if (createError) {
          console.error("Erreur lors de la création des paramètres:", createError);
          throw createError;
        }

        console.log("Nouveaux paramètres créés:", newSettings);
        setSettings(newSettings);
      } else {
        console.log("Paramètres chargés avec succès:", existingSettings);
        setSettings(existingSettings);
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des paramètres de la boutique:", error);
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
      if (!settings) return;

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour sauvegarder les paramètres",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('store_settings')
        .upsert({
          ...settings,
          user_id: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les paramètres ont été sauvegardés",
      });
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
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
    handleSave
  };
};