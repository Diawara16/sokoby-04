import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Plus, 
  Settings, 
  Activity, 
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { T } from "@/components/translation/T";
import { useToast } from "@/hooks/use-toast";

const ZapierIntegration = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const triggers = [
    {
      id: 1,
      name: "Nouvelle commande",
      description: "Se déclenche quand une nouvelle commande est créée",
      enabled: true,
      webhookUrl: "https://hooks.zapier.com/hooks/catch/...",
      lastTriggered: "Il y a 2 heures"
    },
    {
      id: 2,
      name: "Nouveau client",
      description: "Se déclenche quand un nouveau client s'inscrit",
      enabled: false,
      webhookUrl: "",
      lastTriggered: "Jamais"
    },
    {
      id: 3,
      name: "Produit épuisé",
      description: "Se déclenche quand un produit n'est plus en stock",
      enabled: true,
      webhookUrl: "https://hooks.zapier.com/hooks/catch/...",
      lastTriggered: "Il y a 1 jour"
    }
  ];

  const integrationExamples = [
    {
      title: "E-commerce → Email",
      description: "Envoyez automatiquement un email de confirmation après chaque commande",
      apps: ["Sokoby", "Gmail", "Mailchimp"]
    },
    {
      title: "CRM → Notification",
      description: "Ajoutez automatiquement les nouveaux clients à votre CRM",
      apps: ["Sokoby", "HubSpot", "Slack"]
    },
    {
      title: "Comptabilité → Facturation",
      description: "Créez automatiquement des factures dans votre logiciel comptable",
      apps: ["Sokoby", "QuickBooks", "Stripe"]
    }
  ];

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une URL de webhook Zapier",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          event: "test_webhook",
          data: {
            message: "Test depuis Sokoby"
          }
        }),
      });

      toast({
        title: "Test envoyé",
        description: "Le webhook a été testé. Vérifiez votre historique Zapier.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de tester le webhook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-8 w-8 text-primary" />
            <T as="h1" className="text-4xl font-bold">Intégration Zapier</T>
          </div>
          <T as="p" className="text-xl text-muted-foreground">
            Connectez votre boutique à plus de 6000 applications automatiquement
          </T>
        </div>

        <Tabs defaultValue="triggers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="triggers">
              <Activity className="mr-2 h-4 w-4" />
              <T>Déclencheurs</T>
            </TabsTrigger>
            <TabsTrigger value="setup">
              <Settings className="mr-2 h-4 w-4" />
              <T>Configuration</T>
            </TabsTrigger>
            <TabsTrigger value="examples">
              <ExternalLink className="mr-2 h-4 w-4" />
              <T>Exemples</T>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="triggers">
            <div className="grid gap-4">
              {triggers.map((trigger) => (
                <Card key={trigger.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {trigger.name}
                          {trigger.enabled ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              <T>Actif</T>
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="mr-1 h-3 w-3" />
                              <T>Inactif</T>
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{trigger.description}</CardDescription>
                      </div>
                      <Switch checked={trigger.enabled} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong><T>URL Webhook:</T></strong> 
                        <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                          {trigger.webhookUrl || "Non configuré"}
                        </code>
                      </div>
                      <div>
                        <strong><T>Dernier déclenchement:</T></strong> {trigger.lastTriggered}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle>
                  <T>Tester un Webhook Zapier</T>
                </CardTitle>
                <CardDescription>
                  <T>Testez votre configuration Zapier en envoyant un webhook d'exemple</T>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhook-url">
                    <T>URL du Webhook Zapier</T>
                  </Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </div>
                
                <Button onClick={testWebhook} disabled={isLoading}>
                  {isLoading ? (
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-4 w-4" />
                  )}
                  <T>Tester le Webhook</T>
                </Button>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        <T>Comment configurer Zapier</T>
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ol className="list-decimal list-inside space-y-1">
                          <li><T>Créez un nouveau Zap sur zapier.com</T></li>
                          <li><T>Choisissez "Webhooks by Zapier" comme déclencheur</T></li>
                          <li><T>Sélectionnez "Catch Hook"</T></li>
                          <li><T>Copiez l'URL du webhook fournie</T></li>
                          <li><T>Collez-la dans le champ ci-dessus et testez</T></li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrationExamples.map((example, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <CardDescription>{example.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {example.apps.map((app, appIndex) => (
                        <Badge key={appIndex} variant="outline">
                          {app}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <T>Créer ce Zap</T>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ZapierIntegration;