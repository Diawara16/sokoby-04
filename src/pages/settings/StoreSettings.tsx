import { StoreSettings as StoreSettingsComponent } from "@/components/store/StoreSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const StoreSettings = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres de la boutique</h1>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="domain">Domaine</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <StoreSettingsComponent />
          </Card>
        </TabsContent>

        <TabsContent value="domain">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Configuration du domaine</h2>
            <div className="space-y-4">
              <StoreSettingsComponent showDomainOnly />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreSettings;