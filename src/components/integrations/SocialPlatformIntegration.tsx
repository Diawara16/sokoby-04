import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface PlatformConfig {
  name: string;
  apiKeyName: string;
  description: string;
}

const platforms: PlatformConfig[] = [
  {
    name: "TikTok Shop",
    apiKeyName: "TIKTOK_API_KEY",
    description: "Intégrez votre boutique avec TikTok Shop pour vendre directement sur TikTok"
  },
  {
    name: "Instagram Shopping",
    apiKeyName: "INSTAGRAM_API_KEY",
    description: "Connectez votre catalogue produits à Instagram Shopping"
  }
];

export const SocialPlatformIntegration = () => {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleIntegration = async (platform: PlatformConfig) => {
    setIsLoading(prev => ({ ...prev, [platform.name]: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('social-platform-auth', {
        body: { platform: platform.name.toLowerCase() }
      });

      if (error) throw error;

      console.log(`Intégration ${platform.name} initiée:`, data);
      
      toast({
        title: "Intégration initiée",
        description: `L'intégration avec ${platform.name} a été initiée avec succès.`,
      });
    } catch (error) {
      console.error(`Erreur lors de l'intégration ${platform.name}:`, error);
      toast({
        title: "Erreur d'intégration",
        description: `Une erreur est survenue lors de l'intégration avec ${platform.name}.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [platform.name]: false }));
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {platforms.map((platform) => (
        <Card key={platform.name}>
          <CardHeader>
            <CardTitle>{platform.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{platform.description}</p>
            <Button 
              onClick={() => handleIntegration(platform)}
              disabled={isLoading[platform.name]}
              className="w-full"
            >
              {isLoading[platform.name] ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : null}
              Connecter {platform.name}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};