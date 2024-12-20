import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ShoppingBag, Star, TrendingUp, Truck, Image, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";

const applications = [
  {
    id: 1,
    name: "DSERS-Aliexpress",
    description: "Importez et gérez facilement des produits Aliexpress",
    icon: ShoppingBag,
    authUrl: "https://login.dsers.com/oauth/authorize",
    status: "non-connecté",
  },
  {
    id: 2,
    name: "Zendrop",
    description: "Solution complète de dropshipping et fulfillment",
    icon: Truck,
    authUrl: "https://app.zendrop.com/oauth/authorize",
    status: "non-connecté",
  },
  {
    id: 3,
    name: "Loox",
    description: "Avis photos et vidéos de clients",
    icon: Image,
    authUrl: "https://admin.loox.io/oauth/authorize",
    status: "non-connecté",
  },
  {
    id: 4,
    name: "TikTok Shop",
    description: "Vendez vos produits directement sur TikTok",
    icon: TrendingUp,
    authUrl: "https://auth.tiktok-shops.com/oauth/authorize",
    status: "non-connecté",
  },
  {
    id: 5,
    name: "AliReviews",
    description: "Importez des avis Aliexpress sur votre boutique",
    icon: Star,
    authUrl: "https://app.alireviews.io/oauth/authorize",
    status: "non-connecté",
  },
  {
    id: 6,
    name: "CJDropshipping",
    description: "Plateforme complète de dropshipping et fulfillment",
    icon: Package,
    authUrl: "https://developers.cjdropshipping.com/oauth2/authorize",
    status: "non-connecté",
  },
];

const Applications = () => {
  const [connectedApps, setConnectedApps] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConnectedApps();
  }, []);

  const loadConnectedApps = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: connections, error } = await supabase
        .from('app_connections')
        .select('app_name, status')
        .eq('user_id', user.id);

      if (error) throw error;

      const connectedStatus = connections.reduce((acc, conn) => ({
        ...acc,
        [conn.app_name]: conn.status === 'active'
      }), {});

      setConnectedApps(connectedStatus);
    } catch (error) {
      console.error('Erreur lors du chargement des applications connectées:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'état des connexions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (appName: string, authUrl: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour utiliser cette fonctionnalité",
          variant: "destructive",
        });
        return;
      }

      // Pour l'exemple, nous simulons une connexion réussie
      // Dans un cas réel, il faudrait rediriger vers l'URL d'authentification
      const { error } = await supabase
        .from('app_connections')
        .upsert({
          user_id: user.id,
          app_name: appName,
          status: 'active',
          connected_at: new Date().toISOString(),
        });

      if (error) throw error;

      setConnectedApps(prev => ({
        ...prev,
        [appName]: true
      }));

      toast({
        title: "Connexion réussie",
        description: `L'application ${appName} a été connectée avec succès.`,
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      toast({
        title: "Erreur",
        description: "La connexion a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async (appName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('app_connections')
        .update({ status: 'inactive' })
        .eq('user_id', user.id)
        .eq('app_name', appName);

      if (error) throw error;

      setConnectedApps(prev => ({
        ...prev,
        [appName]: false
      }));

      toast({
        title: "Déconnexion réussie",
        description: `L'application ${appName} a été déconnectée.`,
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur",
        description: "La déconnexion a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Applications</h1>
          <p className="text-muted-foreground">
            Intégrez des applications populaires pour améliorer votre boutique
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <Card key={app.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <app.icon className="h-8 w-8 text-primary" />
                  <CardTitle>{app.name}</CardTitle>
                </div>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button 
                  onClick={() => connectedApps[app.name] 
                    ? handleDisconnect(app.name)
                    : handleConnect(app.name, app.authUrl)
                  }
                  variant={connectedApps[app.name] ? "destructive" : "outline"}
                  className="w-full"
                  disabled={isLoading}
                >
                  {connectedApps[app.name] ? "Déconnecter" : "Connecter"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applications;