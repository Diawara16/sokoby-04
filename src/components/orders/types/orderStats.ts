export interface PopularProduct {
  name: string;
  total_quantity: number;
  total_revenue: number;
}

export interface OrderStats {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  orders_this_month: number;
  monthly_growth: number;
  revenue_this_month: number;
  revenue_growth: number;
  most_popular_products: PopularProduct[];
}

export interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  secondaryValue?: string;
}