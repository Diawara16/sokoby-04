import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockPredictions } from "@/components/logistics/StockPredictions";
import { SupplierApps } from "@/components/products/SupplierApps";
import { Truck, Package, AlertTriangle, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const AdvancedInventoryManagement = () => {
  const { data: lowStockProducts, isLoading } = useQuery({
    queryKey: ['low-stock-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('stock_predictions')
        .select(`
          *,
          product:products(name)
        `)
        .eq('user_id', user.id)
        .lt('predicted_demand', 10)
        .order('predicted_demand', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion avancée des stocks</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Prédictions des stocks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Prédictions des stocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StockPredictions />
          </CardContent>
        </Card>

        {/* Alertes de stock bas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes de stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : lowStockProducts && lowStockProducts.length > 0 ? (
                lowStockProducts.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock prévu : {Math.round(item.predicted_demand)} unités
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                      Stock bas
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Aucune alerte de stock bas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intégration Dropshipping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Fournisseurs Dropshipping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierApps />
        </CardContent>
      </Card>

      {/* Commandes fournisseurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Commandes en cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Les commandes fournisseurs apparaîtront ici
          </div>
        </CardContent>
      </Card>
    </div>
  );
};