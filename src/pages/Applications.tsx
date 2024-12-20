import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ShoppingBag, Star, TrendingUp, Truck, Image } from "lucide-react";

const applications = [
  {
    id: 1,
    name: "DSERS-Aliexpress",
    description: "Importez et gérez facilement des produits Aliexpress",
    icon: ShoppingBag,
    status: "non-connecté",
  },
  {
    id: 2,
    name: "Zendrop",
    description: "Solution complète de dropshipping et fulfillment",
    icon: Truck,
    status: "non-connecté",
  },
  {
    id: 3,
    name: "Loox",
    description: "Avis photos et vidéos de clients",
    icon: Image,
    status: "non-connecté",
  },
  {
    id: 4,
    name: "TikTok Shop",
    description: "Vendez vos produits directement sur TikTok",
    icon: TrendingUp,
    status: "non-connecté",
  },
  {
    id: 5,
    name: "AliReviews",
    description: "Importez des avis Aliexpress sur votre boutique",
    icon: Star,
    status: "non-connecté",
  },
];

const Applications = () => {
  const handleConnect = (appName: string) => {
    // Pour l'instant, on affiche juste un toast
    toast({
      title: "Connexion en cours",
      description: `La connexion à ${appName} sera bientôt disponible.`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Applications</h1>
          <p className="text-muted-foreground">
            Intégrez des applications populaires pour améliorer votre boutique
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <Card key={app.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <app.icon className="h-8 w-8 text-primary" />
                  <CardTitle>{app.name}</CardTitle>
                </div>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button 
                  onClick={() => handleConnect(app.name)}
                  variant="outline" 
                  className="w-full"
                >
                  Connecter
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applications;