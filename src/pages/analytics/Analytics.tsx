
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { SalesChart } from "@/components/analytics/charts/SalesChart";
import { OrdersCustomersChart } from "@/components/analytics/charts/OrdersCustomersChart";
import { MetricCard } from "@/components/analytics/metrics/MetricCard";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Analytics = () => {
  const { toast } = useToast();

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      const { data: customers, error: customersError } = await supabase
        .from("customer_details")
        .select("*");

      if (customersError) throw customersError;

      return {
        orders,
        customers,
        totalRevenue: orders?.reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0,
        totalOrders: orders?.length || 0,
        totalCustomers: customers?.length || 0,
        averageOrderValue: orders?.length 
          ? (orders.reduce((acc, order) => acc + (order.total_amount || 0), 0) / orders.length)
          : 0
      };
    }
  });

  const handleExportData = () => {
    if (!analyticsData) return;

    const csvContent = [
      ["Date", "Commandes", "Clients", "Revenu"],
      ...analyticsData.orders.map(order => [
        new Date(order.created_at).toLocaleDateString(),
        "1",
        "1",
        order.total_amount
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Vos données ont été exportées avec succès",
    });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Button onClick={handleExportData} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter les données
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Revenu Total"
          value={`$${analyticsData?.totalRevenue.toFixed(2)}`}
          description="Revenu total généré"
        />
        <MetricCard
          title="Commandes"
          value={analyticsData?.totalOrders.toString() || "0"}
          description="Nombre total de commandes"
        />
        <MetricCard
          title="Clients"
          value={analyticsData?.totalCustomers.toString() || "0"}
          description="Nombre total de clients"
        />
        <MetricCard
          title="Panier Moyen"
          value={`$${analyticsData?.averageOrderValue.toFixed(2)}`}
          description="Valeur moyenne des commandes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Évolution des ventes</h2>
          <SalesChart data={analyticsData?.orders || []} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Commandes et Clients</h2>
          <OrdersCustomersChart data={analyticsData?.orders || []} />
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
