import { Helmet } from "react-helmet";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { MigrationDashboard } from "@/components/migration/MigrationDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveStoreCard } from "@/components/dashboard/ActiveStoreCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MarketplaceIntegrationsCard } from "@/components/integrations/MarketplaceIntegrationsCard";
import { KPIDashboard } from "@/components/ai-store/KPIDashboard";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { TrialBanner } from "@/components/subscription/TrialBanner";
import { useCurrentStoreId } from "@/hooks/useCurrentStoreId";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { storeId } = useCurrentStoreId();
  const payment = searchParams.get('payment');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Redirect to success page if payment was successful
    if (payment === 'success' && sessionId) {
      navigate(`/success?session_id=${sessionId}`, { replace: true });
    }
  }, [payment, sessionId, navigate]);
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <Helmet>
        <title>Tableau de bord | Boutique</title>
        <meta name="description" content="Tableau de bord boutique: accès rapide, boutique active et intégrations marketplace." />
        <link rel="canonical" href={window.location.origin + "/"} />
      </Helmet>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Tableau de bord</h1>
        <Button size="lg" className="font-semibold" asChild>
          <Link to="/generer-boutique-ia">
            <Sparkles className="h-4 w-4 mr-2" />
            Générer une boutique avec l'IA
          </Link>
        </Button>
      </div>
      <TrialBanner storeId={storeId} />
      
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
          <KPIDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
