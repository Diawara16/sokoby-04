import { Card } from "@/components/ui/card";
import { Clock, ShoppingBag, MousePointer, DollarSign } from "lucide-react";

const kpis = [
  {
    label: "Temps de création",
    value: "< 5 min",
    icon: Clock,
    description: "Du clic à la boutique en ligne",
    color: "text-blue-500",
  },
  {
    label: "Premier produit visible",
    value: "< 2 min",
    icon: ShoppingBag,
    description: "Produit affiché sur votre vitrine",
    color: "text-green-500",
  },
  {
    label: "Premier clic checkout",
    value: "< 48h",
    icon: MousePointer,
    description: "Objectif après lancement marketing",
    color: "text-orange-500",
  },
  {
    label: "Première vente",
    value: "< 7 jours",
    icon: DollarSign,
    description: "Avec les bons produits + marketing",
    color: "text-primary",
  },
];

export function KPIDashboard() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">📊 Objectifs de performance</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-4 text-center space-y-2 hover:shadow-md transition-shadow">
            <kpi.icon className={`h-6 w-6 mx-auto ${kpi.color}`} />
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-sm font-medium text-foreground">{kpi.label}</p>
            <p className="text-xs text-muted-foreground">{kpi.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
