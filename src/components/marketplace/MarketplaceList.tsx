import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MarketplaceCard } from "./MarketplaceCard";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MARKETPLACES = {
  global: [
    {
      id: "amazon",
      name: "Amazon",
      description: "La plus grande marketplace au monde, présente dans de nombreux pays."
    },
    {
      id: "ebay",
      name: "eBay",
      description: "Plateforme mondiale de vente en ligne, idéale pour l'international."
    },
    {
      id: "etsy",
      name: "Etsy",
      description: "Marketplace spécialisée dans les produits artisanaux et créatifs."
    }
  ],
  usa: [
    {
      id: "walmart",
      name: "Walmart Marketplace",
      description: "Plus grand détaillant physique des États-Unis avec une forte présence en ligne."
    },
    {
      id: "target",
      name: "Target Plus",
      description: "Plateforme de vente en ligne du géant américain Target."
    }
  ],
  europe: [
    {
      id: "cdiscount",
      name: "Cdiscount",
      description: "Une des principales marketplaces en France."
    },
    {
      id: "allegro",
      name: "Allegro",
      description: "Leader du e-commerce en Europe centrale et de l'Est."
    },
    {
      id: "zalando",
      name: "Zalando",
      description: "Principale plateforme de mode en Europe."
    }
  ],
  asia_pacific: [
    {
      id: "flipkart",
      name: "Flipkart",
      description: "Leader du e-commerce en Inde."
    },
    {
      id: "rakuten",
      name: "Rakuten",
      description: "Grande marketplace japonaise avec présence internationale."
    },
    {
      id: "trademe",
      name: "Trade Me",
      description: "Plus grande marketplace de Nouvelle-Zélande."
    }
  ],
  africa: [
    {
      id: "jumia",
      name: "Jumia",
      description: "Plus grande marketplace d'Afrique."
    },
    {
      id: "glovo",
      name: "Glovo",
      description: "Plateforme de livraison rapide en ville."
    },
    {
      id: "jiji",
      name: "Jiji",
      description: "Marketplace de petites annonces populaire en Afrique."
    }
  ]
};

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
        <TabsTrigger value="africa">Afrique</TabsTrigger>
      </TabsList>

      {Object.entries(MARKETPLACES).map(([region, marketplaces]) => (
        <TabsContent key={region} value={region} className="mt-0">
          <div className="grid gap-6 md:grid-cols-3">
            {marketplaces.map((marketplace) => (
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
        </TabsContent>
      ))}
    </Tabs>
  );
};