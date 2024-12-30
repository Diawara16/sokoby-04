import { ShoppingBag, Settings, Users } from "lucide-react";
import { DashboardMetric } from "./DashboardMetric";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DashboardMetricsProps {
  cartItemsCount: number;
  featuresCount: number;
  lastLogin: string | null;
}

export const DashboardMetrics = ({ cartItemsCount, featuresCount, lastLogin }: DashboardMetricsProps) => {
  const metrics = [
    {
      title: "Produits en panier",
      value: String(cartItemsCount),
      description: "Nombre total de produits dans votre panier",
      icon: <ShoppingBag className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Fonctionnalités utilisées",
      value: String(featuresCount),
      description: "Nombre de fonctionnalités que vous utilisez",
      icon: <Settings className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Dernière connexion",
      value: lastLogin ? format(new Date(lastLogin), "dd/MM/yyyy", { locale: fr }) : "Jamais",
      description: "Date de votre dernière connexion",
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric, index) => (
        <DashboardMetric key={index} {...metric} />
      ))}
    </div>
  );
};