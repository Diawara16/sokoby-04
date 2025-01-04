import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useMarketingOperations = () => {
  const { toast } = useToast();

  const { data: marketingData, isLoading, refetch } = useQuery({
    queryKey: ['marketing-suggestions'],
    queryFn: async () => {
      const { data: campaigns, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error("Erreur lors de la récupération des campagnes:", error);
        throw error;
      }

      return { campaigns: campaigns || [] };
    }
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (feature: string) => {
      const campaignData = {
        name: `Campagne - ${feature}`,
        subject: `Nouvelle campagne - ${feature}`,
        content: `Contenu de test pour ${feature}`,
        status: 'draft',
        user_id: (await supabase.auth.getUser()).data.user?.id
      };

      const { data, error } = await supabase
        .from('email_campaigns')
        .insert(campaignData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Campagne créée",
        description: "Une nouvelle campagne a été créée avec succès.",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la campagne:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  });

  const startAbTestMutation = useMutation({
    mutationFn: async (feature: string) => {
      const testData = {
        name: `Test A/B - ${feature}`,
        variant_a: `Version A - ${feature}`,
        variant_b: `Version B - ${feature}`,
        status: 'running',
        user_id: (await supabase.auth.getUser()).data.user?.id
      };

      await supabase.functions.invoke('start-ab-test', {
        body: { testData }
      });
    },
    onSuccess: () => {
      toast({
        title: "Test A/B démarré",
        description: "Le test A/B a été configuré et démarré avec succès.",
      });
    },
    onError: (error) => {
      console.error("Erreur lors du démarrage du test A/B:", error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer le test A/B. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  });

  const handleFeatureClick = async (feature: string) => {
    if (feature.includes("Test")) {
      startAbTestMutation.mutate(feature);
    } else {
      createCampaignMutation.mutate(feature);
    }
  };

  return {
    marketingData,
    isLoading,
    handleFeatureClick
  };
};