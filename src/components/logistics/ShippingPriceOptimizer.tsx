import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Package } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export const ShippingPriceOptimizer = () => {
  const { data: optimizedPrices, isLoading } = useQuery({
    queryKey: ['shipping-prices'],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from('orders')
        .select('shipping_address, total_amount')
        .order('created_at', { ascending: false })
        .limit(100)

      // Simuler des prix optimisés basés sur les données historiques
      return {
        local: { base: "4.99€", optimized: "3.99€", savings: "20%" },
        national: { base: "8.99€", optimized: "7.49€", savings: "16%" },
        international: { base: "24.99€", optimized: "19.99€", savings: "20%" }
      }
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Optimisation des prix de livraison
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {optimizedPrices && Object.entries(optimizedPrices).map(([zone, prices]) => (
              <div key={zone} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div>
                  <h3 className="font-medium capitalize">{zone}</h3>
                  <p className="text-sm text-muted-foreground">Prix de base: {prices.base}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">{prices.optimized}</p>
                  <p className="text-sm text-green-600">-{prices.savings}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}