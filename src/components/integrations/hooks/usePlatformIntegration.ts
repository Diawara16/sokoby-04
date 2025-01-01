import { useState } from 'react';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { PlatformConfig } from '../types/platform';

export const usePlatformIntegration = () => {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleIntegration = async (platform: PlatformConfig) => {
    setIsLoading(prev => ({ ...prev, [platform.name]: true }));
    
    try {
      const { error } = await supabase
        .from('social_integrations')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          platform: platform.name.toLowerCase(),
          status: 'pending',
          settings: {}
        });

      if (error) throw error;

      toast({
        title: "Demande enregistrée",
        description: `Votre demande d'intégration avec ${platform.name} a été enregistrée. Nous vous guiderons dans la configuration.`,
      });
    } catch (error) {
      console.error(`Erreur lors de l'intégration ${platform.name}:`, error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [platform.name]: false }));
    }
  };

  return {
    isLoading,
    handleIntegration
  };
};