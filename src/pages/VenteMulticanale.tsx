import { applications } from "@/data/applications";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { useAppConnections } from "@/hooks/useAppConnections";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialPlatformIntegration } from "@/components/integrations/SocialPlatformIntegration";
import { MarketplaceList } from "@/components/marketplace/MarketplaceList";

const VenteMulticanale = () => {
  const { connectedApps, isLoading, handleConnect, handleDisconnect } = useAppConnections();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Vente multicanale</h1>
          <p className="text-muted-foreground">
            Connectez votre boutique à d'autres plateformes de vente pour augmenter votre visibilité
          </p>
        </div>

        <Tabs defaultValue="sales-channels" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sales-channels">Canaux de vente</TabsTrigger>
            <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
            <TabsTrigger value="marketplaces">Marketplaces</TabsTrigger>
          </TabsList>

          <TabsContent value="sales-channels">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {applications
                .filter(app => ['facebook', 'instagram', 'tiktok', 'amazon', 'ebay', 'walmart', 'pinterest'].includes(app.id))
                .map((app) => (
                  <ApplicationCard
                    key={app.id}
                    name={app.name}
                    description={app.description}
                    icon={app.icon}
                    isConnected={!!connectedApps[app.name]}
                    onConnect={() => handleConnect(app.name, app.authUrl)}
                    onDisconnect={() => handleDisconnect(app.name)}
                    isLoading={isLoading}
                    price={app.price}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="social">
            <SocialPlatformIntegration />
          </TabsContent>

          <TabsContent value="marketplaces">
            <MarketplaceList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VenteMulticanale;