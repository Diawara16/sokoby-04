import { StoreSettings as StoreSettingsComponent } from "@/components/store/StoreSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface StoreSettingsProps {
  showDomainOnly?: boolean;
}

const StoreSettings = ({ showDomainOnly }: StoreSettingsProps) => {
  if (showDomainOnly) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Configuration du nom de domaine</h1>
        <Card className="p-6">
          <StoreSettingsComponent showDomainOnly />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres de la boutique</h1>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="domain">Nom de domaine</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <StoreSettingsComponent />
          </Card>
        </TabsContent>

        <TabsContent value="domain">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Configuration du nom de domaine</h2>
            <StoreSettingsComponent showDomainOnly />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreSettings;