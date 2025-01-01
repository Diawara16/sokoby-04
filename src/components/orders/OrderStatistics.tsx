import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ChartBar, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface OrderStats {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  orders_this_month: number;
}

export const OrderStatistics = () => {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrderStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer toutes les commandes
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculer les statistiques
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const total_orders = orders.length;
      const total_revenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const average_order_value = total_orders > 0 ? total_revenue / total_orders : 0;
      const orders_this_month = orders.filter(order => 
        new Date(order.created_at) >= firstDayOfMonth
      ).length;

      setStats({
        total_orders,
        total_revenue,
        average_order_value,
        orders_this_month
      });
    } catch (error) {
      console.error('Error fetching order stats:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques des commandes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chargement...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Commandes totales",
      value: stats.total_orders.toString(),
      icon: ShoppingCart,
      description: "Nombre total de commandes"
    },
    {
      title: "Chiffre d'affaires",
      value: `${stats.total_revenue.toFixed(2)} €`,
      icon: DollarSign,
      description: "Revenu total généré"
    },
    {
      title: "Panier moyen",
      value: `${stats.average_order_value.toFixed(2)} €`,
      icon: ChartBar,
      description: "Valeur moyenne par commande"
    },
    {
      title: "Commandes ce mois",
      value: stats.orders_this_month.toString(),
      icon: TrendingUp,
      description: `Pour ${format(new Date(), 'MMMM yyyy')}`
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};