import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MarketplaceCard } from "./MarketplaceCard";
import { useToast } from "@/hooks/use-toast";

const MARKETPLACES = [
  {
    id: "jumia",
    name: "Jumia",
    description: "Connectez-vous à Jumia pour vendre vos produits sur la plus grande marketplace d'Afrique."
  },
  {
    id: "glovo",
    name: "Glovo",
    description: "Intégrez Glovo pour la livraison rapide de vos produits en ville."
  },
  {
    id: "jiji",
    name: "Jiji",
    description: "Vendez sur Jiji pour atteindre des millions d'acheteurs potentiels."
  }
];

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

    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {MARKETPLACES.map((marketplace) => (
        <MarketplaceCard
          key={marketplace.id}
          name={marketplace.name}
          description={marketplace.description}
          status={integrations[marketplace.id]?.status || 'disconnected'}
          onConnect={() => handleConnect(marketplace.id)}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};