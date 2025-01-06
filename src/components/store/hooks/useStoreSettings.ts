import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { StoreSettings } from "../types";

const createDefaultSettings = (userId: string, userEmail: string | undefined) => ({
  user_id: userId,
  store_name: 'Ma boutique',
  store_email: userEmail,
  domain_name: null,
  is_custom_domain: false,
  store_phone: null,
  store_address: null
});

const useStoreSettings = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleError = (error: any, message: string) => {
    console.error(message, error);
    toast({
      title: "Erreur",
      description: message,
      variant: "destructive",
    });
  };

  const fetchExistingSettings = async (userId: string) => {
    const { data: existingSettings, error: fetchError } = await supabase
      .from('store_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    return existingSettings;
  };

  const createNewSettings = async (userId: string, userEmail: string | undefined) => {
    const defaultSettings = createDefaultSettings(userId, userEmail);
    const { data: newSettings, error: createError } = await supabase
      .from('store_settings')
      .insert([defaultSettings])
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return newSettings;
  };

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
        return;
      }

      console.log("Utilisateur connecté:", user.id);
      const existingSettings = await fetchExistingSettings(user.id);

      if (!existingSettings) {
        console.log("Création des paramètres par défaut...");
        const newSettings = await createNewSettings(user.id, user.email);
        console.log("Nouveaux paramètres créés:", newSettings);
        setSettings(newSettings);
      } else {
        console.log("Paramètres chargés avec succès:", existingSettings);
        setSettings(existingSettings);
      }
    } catch (error: any) {
      handleError(error, "Impossible de charger les paramètres de la boutique");
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
      handleError(error, "Impossible de sauvegarder les paramètres");
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

export { useStoreSettings };