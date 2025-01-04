import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { PlatformConfig } from '../types/platform';

export const usePlatformIntegration = () => {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [integrations, setIntegrations] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      const { data, error } = await supabase
        .from('social_integrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const integrationsMap = data.reduce((acc, integration) => ({
        ...acc,
        [integration.platform]: integration
      }), {});

      setIntegrations(integrationsMap);
      console.log("Intégrations récupérées:", integrationsMap);
    } catch (error: any) {
      console.error('Erreur lors du chargement des intégrations:', error);
      setError(error.message);
    }
  };

  const handleIntegration = async (platform: PlatformConfig) => {
    setIsLoading(prev => ({ ...prev, [platform.name]: true }));
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté");

      console.log(`Initialisation de l'intégration avec ${platform.name}`);

      const { data, error } = await supabase.functions.invoke('social-platform-auth', {
        body: { 
          platform: platform.name.toLowerCase(),
          userId: user.id
        }
      });

      if (error) throw error;

      console.log("Réponse de l'intégration:", data);

      await fetchIntegrations();
    } catch (error: any) {
      console.error(`Erreur lors de l'intégration ${platform.name}:`, error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, [platform.name]: false }));
    }
  };

  return {
    isLoading,
    handleIntegration,
    integrations,
    error
  };
};