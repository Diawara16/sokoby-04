import { Helmet } from "react-helmet";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { MigrationDashboard } from "@/components/migration/MigrationDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveStoreCard } from "@/components/dashboard/ActiveStoreCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MarketplaceIntegrationsCard } from "@/components/integrations/MarketplaceIntegrationsCard";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Tableau de bord | Boutique</title>
        <meta name="description" content="Tableau de bord boutique: accès rapide, boutique active et intégrations marketplace." />
        <link rel="canonical" href={window.location.origin + "/"} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="migrations">Migrations</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <QuickActions />
          <ActiveStoreCard />
          <MarketplaceIntegrationsCard />
          <UserDashboard />
        </TabsContent>
        
        <TabsContent value="migrations" className="space-y-6">
          <MigrationDashboard />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <p className="text-gray-600">Analyses bientôt disponibles</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
