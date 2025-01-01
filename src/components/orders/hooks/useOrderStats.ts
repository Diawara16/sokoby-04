import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import type { OrderStats, PopularProduct } from "../types/orderStats";

export const useOrderStats = () => {
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

      const total_orders = orders.length;
      const total_revenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const average_order_value = total_orders > 0 ? total_revenue / total_orders : 0;

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

      const monthly_growth = orders_last_month.length > 0 
        ? ((orders_this_month.length - orders_last_month.length) / orders_last_month.length) * 100
        : 0;

      const revenue_growth = revenue_last_month > 0
        ? ((revenue_this_month - revenue_last_month) / revenue_last_month) * 100
        : 0;

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

  return { stats, isLoading };
};