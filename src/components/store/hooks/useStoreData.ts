import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { StoreSettings } from "../types";
import { useToast } from "@/hooks/use-toast";

const generateDomainName = (userId: string): string => {
  const timestamp = Date.now().toString(36);
  const userPrefix = userId.substring(0, 8);
  return `store-${userPrefix}-${timestamp}`;
};

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
        const generatedDomain = generateDomainName(user.id);
        const { data: newSettings, error: createError } = await supabase
          .from('store_settings')
          .insert([{
            user_id: user.id,
            store_name: 'Ma boutique',
            store_email: user.email,
            domain_name: generatedDomain,
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
        setSettings(newSettings as unknown as StoreSettings);
        
        toast({
          title: "Paramètres initialisés",
          description: "Les paramètres de votre boutique ont été créés avec succès",
        });
      } else {
        // If existing settings don't have a domain_name, generate one
        if (!existingSettings.domain_name) {
          const generatedDomain = generateDomainName(user.id);
          const { data: updatedSettings, error: updateError } = await supabase
            .from('store_settings')
            .update({ domain_name: generatedDomain })
            .eq('user_id', user.id)
            .select()
            .single();

          if (updateError) {
            console.error("Erreur lors de la mise à jour du domaine:", updateError);
            // Continue with existing settings even if update fails
            setSettings(existingSettings as unknown as StoreSettings);
          } else {
            console.log("Domaine généré et mis à jour:", generatedDomain);
            setSettings(updatedSettings as unknown as StoreSettings);
          }
        } else {
          setSettings(existingSettings as unknown as StoreSettings);
        }
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