import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DomainChecker } from "@/components/store/DomainChecker";
import { ConnectExistingDomain } from "@/components/domain/ConnectExistingDomain";
import { DnsMonitoring } from "@/components/dns/DnsMonitoring";
import { useState } from "react";

export default function DomainSettings() {
  const [selectedDomain, setSelectedDomain] = useState("");

  const handleDomainPurchase = (domain: string) => {
    console.log("Domain selected for purchase:", domain);
    // TODO: Implement domain purchase logic
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configuration du domaine</h3>
        <p className="text-sm text-muted-foreground">
          Connectez un domaine existant ou obtenez un sous-domaine Sokoby.
        </p>
      </div>

      <Tabs defaultValue="existing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="existing">Domaine existant</TabsTrigger>
          <TabsTrigger value="obtain">Obtenir un domaine</TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connecter un domaine existant</CardTitle>
            </CardHeader>
            <CardContent>
              <ConnectExistingDomain />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Surveillance DNS</CardTitle>
            </CardHeader>
            <CardContent>
              <DnsMonitoring />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="obtain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Obtenir un sous-domaine Sokoby</CardTitle>
            </CardHeader>
            <CardContent>
              <DomainChecker
                value={selectedDomain}
                onChange={setSelectedDomain}
                onPurchase={handleDomainPurchase}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}