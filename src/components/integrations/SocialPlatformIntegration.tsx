import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AlertCircle, ShoppingBag, Instagram } from 'lucide-react';

interface PlatformConfig {
  name: string;
  icon: React.ReactNode;
  description: string;
  status: 'pending' | 'unavailable' | 'coming_soon';
  message: string;
}

const platforms: PlatformConfig[] = [
  {
    name: "Instagram Shopping",
    icon: <Instagram className="h-5 w-5" />,
    description: "Connectez votre catalogue produits à Instagram Shopping",
    status: 'pending',
    message: "Configuration requise du compte Instagram Business"
  },
  {
    name: "TikTok Shop",
    icon: <ShoppingBag className="h-5 w-5" />,
    description: "Intégrez votre boutique avec TikTok Shop pour vendre directement sur TikTok",
    status: 'coming_soon',
    message: "TikTok Shop sera bientôt disponible dans votre région"
  }
];

export const SocialPlatformIntegration = () => {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleIntegration = async (platform: PlatformConfig) => {
    setIsLoading(prev => ({ ...prev, [platform.name]: true }));
    
    try {
      // Enregistrer l'intention d'intégration
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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {platforms.map((platform) => (
        <Card key={platform.name} className="relative overflow-hidden">
          {platform.status === 'coming_soon' && (
            <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
              Bientôt disponible
            </div>
          )}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {platform.icon}
              {platform.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{platform.description}</p>
            {platform.status === 'unavailable' ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>{platform.message}</span>
              </div>
            ) : (
              <Button 
                onClick={() => handleIntegration(platform)}
                disabled={isLoading[platform.name] || platform.status === 'coming_soon'}
                className="w-full"
                variant={platform.status === 'coming_soon' ? "outline" : "default"}
              >
                {isLoading[platform.name] ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : null}
                {platform.status === 'coming_soon' 
                  ? "Bientôt disponible" 
                  : `Connecter ${platform.name}`}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};