import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Link2, ShoppingCart, Package } from "lucide-react";
import { MyDomainsTab } from "./MyDomainsTab";
import { ConnectDomainTab } from "./ConnectDomainTab";
import { DomainPurchaseTab } from "./DomainPurchaseTab";
import { PurchasedDomainsTab } from "./PurchasedDomainsTab";

export const DomainsDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDomainAdded = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="h-7 w-7 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Domaines</h2>
          <p className="text-sm text-muted-foreground">Gérez les noms de domaine de votre boutique</p>
        </div>
      </div>

      <Tabs defaultValue="my-domains" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="my-domains" className="flex items-center gap-2 text-xs sm:text-sm py-2">
            <Globe className="h-4 w-4" />
            Mes domaines
          </TabsTrigger>
          <TabsTrigger value="connect" className="flex items-center gap-2 text-xs sm:text-sm py-2">
            <Link2 className="h-4 w-4" />
            Connecter
          </TabsTrigger>
          <TabsTrigger value="buy" className="flex items-center gap-2 text-xs sm:text-sm py-2">
            <ShoppingCart className="h-4 w-4" />
            Acheter
          </TabsTrigger>
          <TabsTrigger value="purchased" className="flex items-center gap-2 text-xs sm:text-sm py-2">
            <Package className="h-4 w-4" />
            Achetés
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-domains">
          <Card>
            <CardHeader>
              <CardTitle>Mes domaines</CardTitle>
              <CardDescription>Tous les domaines connectés à votre boutique</CardDescription>
            </CardHeader>
            <CardContent>
              <MyDomainsTab refreshKey={refreshKey} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connect">
          <Card>
            <CardHeader>
              <CardTitle>Connecter un domaine</CardTitle>
              <CardDescription>Ajoutez un domaine existant en configurant vos enregistrements DNS</CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectDomainTab onDomainAdded={handleDomainAdded} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buy">
          <Card>
            <CardHeader>
              <CardTitle>Acheter un domaine</CardTitle>
              <CardDescription>Recherchez un domaine, réservez-le et configurez-le automatiquement</CardDescription>
            </CardHeader>
            <CardContent>
              <DomainPurchaseTab onDomainPurchased={handleDomainAdded} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchased">
          <Card>
            <CardHeader>
              <CardTitle>Mes domaines achetés</CardTitle>
              <CardDescription>Domaines enregistrés via le système d'achat Sokoby</CardDescription>
            </CardHeader>
            <CardContent>
              <PurchasedDomainsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
