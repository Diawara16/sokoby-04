import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Target, Users, TrendingUp, Mail, Wand2, SplitSquareVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const MarketingTools = () => {
  const { toast } = useToast();
  const { data: marketingData, isLoading } = useQuery({
    queryKey: ['marketing-suggestions'],
    queryFn: async () => {
      const { data: campaigns } = await supabase
        .from('email_campaigns')
        .select('name, status')
        .order('created_at', { ascending: false })
        .limit(3);

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
          },
          {
            title: "Analyse Audience",
            description: "Comprenez votre audience en profondeur",
            icon: Users,
            features: ["Segmentation avancée", "Profils détaillés", "Comportements"]
          }
        ]
      };
    }
  });

  const handleFeatureClick = (feature: string) => {
    toast({
      title: "Fonctionnalité disponible",
      description: `La fonctionnalité "${feature}" sera bientôt disponible dans votre tableau de bord.`,
    });
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
}