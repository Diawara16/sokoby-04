import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export const StockPredictions = () => {
  const { data: predictions, isLoading } = useQuery({
    queryKey: ['stock-predictions'],
    queryFn: async () => {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .limit(5)

      // Simuler des prédictions de stock
      return [
        { name: "T-shirt Basic", risk: "high", daysUntilStockout: 5, reorderQuantity: 100 },
        { name: "Jean Slim", risk: "medium", daysUntilStockout: 12, reorderQuantity: 50 },
        { name: "Sneakers Classic", risk: "low", daysUntilStockout: 30, reorderQuantity: 25 }
      ]
    }
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-500 bg-red-50'
      case 'medium':
        return 'text-yellow-500 bg-yellow-50'
      case 'low':
        return 'text-green-500 bg-green-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Prédiction des ruptures de stock
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {predictions && predictions.map((item, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{item.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(item.risk)}`}>
                    {item.risk === 'high' ? 'Urgent' : item.risk === 'medium' ? 'Attention' : 'Normal'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Jours avant rupture</p>
                    <p className="font-medium">{item.daysUntilStockout} jours</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantité à commander</p>
                    <p className="font-medium">{item.reorderQuantity} unités</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}