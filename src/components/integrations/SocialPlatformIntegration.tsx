import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SocialPlatformIntegration = () => {
  const { toast } = useToast();
  
  const { data: integrations, isLoading } = useQuery({
    queryKey: ['social-integrations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('social_integrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    }
  });

  const handleConnect = async (platform: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('social_integrations')
        .insert([
          {
            user_id: user.id,
            platform,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Connexion initiée",
        description: `La connexion à ${platform} a été initiée avec succès.`,
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter à la plateforme.",
        variant: "destructive",
      });
    }
  };

  const platforms = [
    {
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      color: 'bg-blue-600'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      color: 'bg-pink-600'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      color: 'bg-sky-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intégrations Réseaux Sociaux</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {platforms.map((platform) => {
            const isConnected = integrations?.some(
              i => i.platform === platform.name.toLowerCase() && i.status === 'active'
            );

            return (
              <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`${platform.color} p-2 rounded-full text-white`}>
                    {platform.icon}
                  </div>
                  <span className="font-medium">{platform.name}</span>
                </div>
                <Button
                  variant={isConnected ? "outline" : "default"}
                  onClick={() => handleConnect(platform.name.toLowerCase())}
                  disabled={isConnected}
                >
                  {isConnected ? 'Connecté' : 'Connecter'}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};