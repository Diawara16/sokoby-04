import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react"
import { MetricCard } from "./metrics/MetricCard"
import { SalesChart } from "./charts/SalesChart"
import { OrdersCustomersChart } from "./charts/OrdersCustomersChart"
import { useTrendsData } from "./hooks/useTrendsData"
import { calculateTrend } from "./utils/calculations"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export const TrendsDashboard = () => {
  const { data: trendsData, isLoading, error, refetch } = useTrendsData()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive">Une erreur est survenue lors du chargement des données</p>
        <Button onClick={() => refetch()} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  if (!trendsData || trendsData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-muted-foreground">Aucune donnée disponible pour la période sélectionnée</p>
      </div>
    )
  }

  const formatValue = (value: number) => `${value.toFixed(2)}€`

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tendances des 6 derniers mois</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Ventes"
          value={formatValue(trendsData[trendsData.length - 1].sales)}
          trend={calculateTrend(trendsData, 'sales')}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Commandes"
          value={trendsData[trendsData.length - 1].orders}
          trend={calculateTrend(trendsData, 'orders')}
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <MetricCard
          title="Clients"
          value={trendsData[trendsData.length - 1].customers}
          trend={calculateTrend(trendsData, 'customers')}
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Panier moyen"
          value={formatValue(trendsData[trendsData.length - 1].averageOrderValue)}
          trend={calculateTrend(trendsData, 'averageOrderValue')}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart data={trendsData.map(item => ({
          created_at: item.date,
          total_amount: item.sales
        }))} />
        <OrdersCustomersChart data={trendsData.map(item => ({
          created_at: item.date
        }))} />
      </div>
    </div>
  )
}