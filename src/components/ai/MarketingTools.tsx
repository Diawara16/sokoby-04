import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Target, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const MarketingTools = () => {
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
            title: "Campagnes Email",
            description: "Créez des campagnes email personnalisées",
            icon: Megaphone
          },
          {
            title: "Ciblage Client",
            description: "Identifiez vos clients idéaux",
            icon: Target
          },
          {
            title: "Analyse Audience",
            description: "Comprenez votre audience",
            icon: Users
          },
          {
            title: "Tendances",
            description: "Suivez les tendances du marché",
            icon: TrendingUp
          }
        ]
      };
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Outils Marketing IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {marketingData?.suggestions.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div key={index} className="p-4 rounded-lg bg-muted flex items-start space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tool.description}
                    </p>
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