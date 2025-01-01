import { ChartBar, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useOrderStats } from "./hooks/useOrderStats";
import { StatCard } from "./components/StatCard";
import { PopularProducts } from "./components/PopularProducts";
import type { StatCard as StatCardType } from "./types/orderStats";

export const OrderStatistics = () => {
  const { stats, isLoading } = useOrderStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards: StatCardType[] = [
    {
      title: "Commandes totales",
      value: stats.total_orders.toString(),
      icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
      description: "Nombre total de commandes",
      secondaryValue: `${stats.monthly_growth >= 0 ? '+' : ''}${stats.monthly_growth.toFixed(1)}% ce mois-ci`
    },
    {
      title: "Chiffre d'affaires",
      value: `${stats.total_revenue.toFixed(2)} €`,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      description: "Revenu total généré",
      secondaryValue: `${stats.revenue_growth >= 0 ? '+' : ''}${stats.revenue_growth.toFixed(1)}% ce mois-ci`
    },
    {
      title: "Panier moyen",
      value: `${stats.average_order_value.toFixed(2)} €`,
      icon: <ChartBar className="h-4 w-4 text-muted-foreground" />,
      description: "Valeur moyenne par commande"
    },
    {
      title: "Commandes ce mois",
      value: stats.orders_this_month.toString(),
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      description: `Pour ${format(new Date(), 'MMMM yyyy', { locale: fr })}`,
      secondaryValue: `${stats.revenue_this_month.toFixed(2)} € de CA`
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <PopularProducts products={stats.most_popular_products} />
    </div>
  );
};