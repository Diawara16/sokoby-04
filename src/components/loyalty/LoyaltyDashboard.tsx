import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoyaltyOverview } from "./LoyaltyOverview"
import { LoyaltyRewards } from "./LoyaltyRewards"
import { LoyaltyHistory } from "./LoyaltyHistory"

export const LoyaltyDashboard = () => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Aperçu</TabsTrigger>
        <TabsTrigger value="rewards">Récompenses</TabsTrigger>
        <TabsTrigger value="history">Historique</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <LoyaltyOverview />
      </TabsContent>

      <TabsContent value="rewards">
        <LoyaltyRewards />
      </TabsContent>

      <TabsContent value="history">
        <LoyaltyHistory />
      </TabsContent>
    </Tabs>
  )
}