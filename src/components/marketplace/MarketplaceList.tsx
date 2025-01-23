import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MARKETPLACES } from "./data/marketplaceData";
import { MarketplaceGrid } from "./MarketplaceGrid";

export const MarketplaceList = () => {
  const [integrations, setIntegrations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('marketplace_integrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const integrationsMap = data.reduce((acc: Record<string, any>, curr) => {
        acc[curr.marketplace_name] = curr;
        return acc;
      }, {});

      setIntegrations(integrationsMap);
    } catch (error) {
      console.error("Erreur lors du chargement des intégrations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les intégrations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (marketplaceId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('marketplace_integrations')
        .insert([
          {
            user_id: user.id,
            marketplace_name: marketplaceId,
            status: 'connected'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setIntegrations(prev => ({
        ...prev,
        [marketplaceId]: data
      }));

      toast({
        title: "Connexion réussie",
        description: `Votre boutique a été connectée à la marketplace ${marketplaceId}`,
      });

    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à la marketplace",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs defaultValue="global" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="global">Mondial</TabsTrigger>
        <TabsTrigger value="usa">États-Unis</TabsTrigger>
        <TabsTrigger value="europe">Europe</TabsTrigger>
        <TabsTrigger value="asia_pacific">Asie-Pacifique</TabsTrigger>
        <TabsTrigger value="latin_america">Amérique Latine</TabsTrigger>
        <TabsTrigger value="africa">Afrique</TabsTrigger>
      </TabsList>

      {Object.entries(MARKETPLACES).map(([region, marketplaces]) => (
        <TabsContent key={region} value={region} className="mt-0">
          <MarketplaceGrid
            marketplaces={marketplaces}
            integrations={integrations}
            onConnect={handleConnect}
            isLoading={isLoading}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};