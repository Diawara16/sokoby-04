import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Zap, 
  Palette, 
  BarChart3, 
  ShoppingBag,
  Puzzle,
  Users,
  Settings
} from "lucide-react";
import { T } from "@/components/translation/T";

export const QuickActions = () => {
  const actions = [
    {
      title: "Créer une page",
      description: "Utilisez l'éditeur visuel pour créer une nouvelle page",
      icon: <Palette className="h-5 w-5" />,
      href: "/editeur-pages",
      variant: "default" as const
    },
    {
      title: "Extensions",
      description: "Parcourez le marketplace d'extensions",
      icon: <Puzzle className="h-5 w-5" />,
      href: "/marketplace",
      variant: "outline" as const
    },
    {
      title: "Intégrations Zapier",
      description: "Connectez votre boutique à 6000+ apps",
      icon: <Zap className="h-5 w-5" />,
      href: "/zapier",
      variant: "outline" as const
    },
    {
      title: "Ajouter un produit",
      description: "Ajoutez un nouveau produit à votre catalogue",
      icon: <Plus className="h-5 w-5" />,
      href: "/products/add",
      variant: "outline" as const
    },
    {
      title: "Analytics",
      description: "Consultez vos statistiques de vente",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/analytics",
      variant: "outline" as const
    },
    {
      title: "Commandes",
      description: "Gérez vos commandes en cours",
      icon: <ShoppingBag className="h-5 w-5" />,
      href: "/orders",
      variant: "outline" as const
    },
    {
      title: "Clients",
      description: "Gérez votre base clients",
      icon: <Users className="h-5 w-5" />,
      href: "/customers",
      variant: "outline" as const
    },
    {
      title: "Paramètres",
      description: "Configurez votre boutique",
      icon: <Settings className="h-5 w-5" />,
      href: "/settings",
      variant: "outline" as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <T>Actions rapides</T>
        </CardTitle>
        <CardDescription>
          <T>Accédez rapidement aux fonctionnalités principales</T>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Button
                variant={action.variant}
                className="h-auto flex-col gap-2 p-4 w-full"
              >
                {action.icon}
                <div className="text-center">
                  <div className="font-medium text-xs">
                    <T>{action.title}</T>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    <T>{action.description}</T>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};