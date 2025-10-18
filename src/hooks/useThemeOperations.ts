import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { ThemeColors } from "@/types/theme";

export const useThemeOperations = () => {
  const { toast } = useToast();

  const applyTheme = async (userId: string, colors: ThemeColors) => {
    try {
      const { data: existingSettings } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      let result;
      
      if (existingSettings) {
        result = await supabase
          .from('brand_settings')
          .update({
            primary_color: colors.primary,
            secondary_color: colors.secondary,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        result = await supabase
          .from('brand_settings')
          .insert({
            user_id: userId,
            primary_color: colors.primary,
            secondary_color: colors.secondary
          });
      }

      if (result.error) throw result.error;

      toast({
        title: "Thème appliqué",
        description: "Le thème a été appliqué avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'application du thème:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'application du thème",
        variant: "destructive",
      });
    }
  };

  return { applyTheme };
};