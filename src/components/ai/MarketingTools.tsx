import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Target, Users, TrendingUp, Mail, Wand2, SplitSquareVertical } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const MarketingTools = () => {
  const { toast } = useToast();

  // Récupérer les campagnes et suggestions
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

      return {
        campaigns: campaigns || [],
        suggestions: [
          {
            title: "Email Marketing Avancé",
            description: "Segmentation avancée et personnalisation",
            icon: Mail,
            features: ["Segmentation automatique", "Personnalisation dynamique", "Analyses détaillées"]
          },
          {
            title: "Automatisation Marketing",
            description: "Workflows marketing automatisés",
            icon: Wand2,
            features: ["Séquences d'emails", "Déclencheurs comportementaux", "Scénarios personnalisés"]
          },
          {
            title: "Tests A/B",
            description: "Optimisation des campagnes par A/B testing",
            icon: SplitSquareVertical,
            features: ["Test de contenu", "Test d'objets", "Analyse des résultats"]
          }
        ]
      };
    }
  });

  // Mutation pour créer une nouvelle campagne
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

  // Mutation pour démarrer un test A/B
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Outils Marketing IA Avancés
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {marketingData?.suggestions.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div key={index} className="p-6 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tool.description}
                      </p>
                      <div className="mt-4 space-y-2">
                        {tool.features.map((feature, featureIndex) => (
                          <Button 
                            key={featureIndex}
                            variant="ghost" 
                            size="sm"
                            className="w-full justify-start text-left"
                            onClick={() => handleFeatureClick(feature)}
                          >
                            <span className="text-primary mr-2">•</span>
                            {feature}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};