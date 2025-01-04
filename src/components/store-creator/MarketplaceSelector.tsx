import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Store, Globe, ShoppingBag } from "lucide-react";

interface Marketplace {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface MarketplaceRegion {
  id: string;
  name: string;
  code: string;
  marketplaces: Marketplace[];
}

export const MarketplaceSelector = () => {
  const [regions, setRegions] = useState<MarketplaceRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadMarketplaces();
  }, []);

  const loadMarketplaces = async () => {
    try {
      // Charger les régions
      const { data: regionsData, error: regionsError } = await supabase
        .from('marketplace_regions')
        .select('*')
        .order('name');

      if (regionsError) throw regionsError;

      // Charger les marketplaces pour chaque région
      const regionsWithMarketplaces = await Promise.all(
        regionsData.map(async (region) => {
          const { data: marketplaces, error: marketplacesError } = await supabase
            .from('marketplace_details')
            .select('*')
            .eq('region_id', region.id)
            .order('name');

          if (marketplacesError) throw marketplacesError;

          return {
            ...region,
            marketplaces: marketplaces
          };
        })
      );

      setRegions(regionsWithMarketplaces);
    } catch (error) {
      console.error('Erreur lors du chargement des marketplaces:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les marketplaces",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarketplaceSelect = (marketplaceId: string) => {
    setSelectedMarketplaces(prev => {
      if (prev.includes(marketplaceId)) {
        return prev.filter(id => id !== marketplaceId);
      }
      return [...prev, marketplaceId];
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Chargement des marketplaces...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Sélectionnez vos marketplaces
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="mb-4">
            {regions.map((region) => (
              <TabsTrigger key={region.code} value={region.code}>
                {region.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {regions.map((region) => (
            <TabsContent key={region.code} value={region.code}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {region.marketplaces.map((marketplace) => (
                  <Card key={marketplace.id} className="relative overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <ShoppingBag className="h-5 w-5" />
                          {marketplace.name}
                        </span>
                        <Badge variant={marketplace.status === 'active' ? 'default' : 'secondary'}>
                          {marketplace.status === 'active' ? 'Disponible' : 'Bientôt'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {marketplace.description}
                      </p>
                      <Button
                        variant={selectedMarketplaces.includes(marketplace.id) ? "secondary" : "default"}
                        className="w-full"
                        onClick={() => handleMarketplaceSelect(marketplace.id)}
                        disabled={marketplace.status !== 'active'}
                      >
                        {selectedMarketplaces.includes(marketplace.id) ? 'Sélectionné' : 'Sélectionner'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};