import { Helmet } from "react-helmet";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { MigrationDashboard } from "@/components/migration/MigrationDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveStoreCard } from "@/components/dashboard/ActiveStoreCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MarketplaceIntegrationsCard } from "@/components/integrations/MarketplaceIntegrationsCard";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <Helmet>
        <title>Tableau de bord | Boutique</title>
        <meta name="description" content="Tableau de bord boutique: accès rapide, boutique active et intégrations marketplace." />
        <link rel="canonical" href={window.location.origin + "/"} />
      </Helmet>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Tableau de bord</h1>
      
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="migrations" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Migrations</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Analyses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <QuickActions />
          <ActiveStoreCard />
          <MarketplaceIntegrationsCard />
          <UserDashboard />
        </TabsContent>
        
        <TabsContent value="migrations" className="space-y-4 sm:space-y-6">
          <MigrationDashboard />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-gray-600">Analyses bientôt disponibles</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
