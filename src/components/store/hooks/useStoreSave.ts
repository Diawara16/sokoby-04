import { supabase } from "@/lib/supabase";
import { StoreSettings } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useStoreSave = () => {
  const { toast } = useToast();

  const saveSettings = async (settings: StoreSettings) => {
    try {
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
        }, {
          onConflict: 'user_id'
        });

      if (saveError) {
        console.error("Erreur lors de la sauvegarde:", saveError);
        throw saveError;
      }

      toast({
        title: "Succès",
        description: "Paramètres sauvegardés avec succès",
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
      return false;
    }
  };

  return { saveSettings };
};