import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ChartBar, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { fr } from "date-fns/locale";

interface OrderStats {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  orders_this_month: number;
  monthly_growth: number;
  revenue_this_month: number;
  revenue_growth: number;
  most_popular_products: Array<{
    name: string;
    total_quantity: number;
    total_revenue: number;
  }>;
}

export const OrderStatistics = () => {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrderStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const firstDayThisMonth = startOfMonth(now);
      const lastDayThisMonth = endOfMonth(now);
      const firstDayLastMonth = startOfMonth(subMonths(now, 1));
      const lastDayLastMonth = endOfMonth(subMonths(now, 1));

      // Récupérer toutes les commandes
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          created_at,
          items:order_items(
            quantity,
            price_at_time,
            product:products(name)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculer les statistiques de base
      const total_orders = orders.length;
      const total_revenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const average_order_value = total_orders > 0 ? total_revenue / total_orders : 0;

      // Calculer les statistiques mensuelles
      const orders_this_month = orders.filter(order => 
        new Date(order.created_at) >= firstDayThisMonth &&
        new Date(order.created_at) <= lastDayThisMonth
      );

      const orders_last_month = orders.filter(order => 
        new Date(order.created_at) >= firstDayLastMonth &&
        new Date(order.created_at) <= lastDayLastMonth
      );

      const revenue_this_month = orders_this_month.reduce((sum, order) => sum + order.total_amount, 0);
      const revenue_last_month = orders_last_month.reduce((sum, order) => sum + order.total_amount, 0);

      // Calculer la croissance
      const monthly_growth = orders_last_month.length > 0 
        ? ((orders_this_month.length - orders_last_month.length) / orders_last_month.length) * 100
        : 0;

      const revenue_growth = revenue_last_month > 0
        ? ((revenue_this_month - revenue_last_month) / revenue_last_month) * 100
        : 0;

      // Calculer les produits les plus populaires
      const productStats = new Map();
      orders.forEach(order => {
        order.items.forEach((item: any) => {
          const productName = item.product.name;
          const revenue = item.quantity * item.price_at_time;
          
          if (!productStats.has(productName)) {
            productStats.set(productName, { total_quantity: 0, total_revenue: 0 });
          }
          
          const stats = productStats.get(productName);
          stats.total_quantity += item.quantity;
          stats.total_revenue += revenue;
        });
      });

      const most_popular_products = Array.from(productStats.entries())
        .map(([name, stats]) => ({
          name,
          ...stats
        }))
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 3);

      setStats({
        total_orders,
        total_revenue,
        average_order_value,
        orders_this_month: orders_this_month.length,
        monthly_growth,
        revenue_this_month,
        revenue_growth,
        most_popular_products
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
      description: "Nombre total de commandes",
      secondaryValue: `${stats.monthly_growth >= 0 ? '+' : ''}${stats.monthly_growth.toFixed(1)}% ce mois-ci`
    },
    {
      title: "Chiffre d'affaires",
      value: `${stats.total_revenue.toFixed(2)} €`,
      icon: DollarSign,
      description: "Revenu total généré",
      secondaryValue: `${stats.revenue_growth >= 0 ? '+' : ''}${stats.revenue_growth.toFixed(1)}% ce mois-ci`
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
      description: `Pour ${format(new Date(), 'MMMM yyyy', { locale: fr })}`,
      secondaryValue: `${stats.revenue_this_month.toFixed(2)} € de CA`
    }
  ];

  return (
    <div className="space-y-8">
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
              {stat.secondaryValue && (
                <p className={`text-xs mt-2 ${
                  stat.secondaryValue.includes('+') 
                    ? 'text-success-500' 
                    : 'text-destructive'
                }`}>
                  {stat.secondaryValue}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.most_popular_products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Produits les plus vendus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.most_popular_products.map((product, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.total_quantity} unités vendues
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.total_revenue.toFixed(2)} €</p>
                    <p className="text-sm text-muted-foreground">
                      CA total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};