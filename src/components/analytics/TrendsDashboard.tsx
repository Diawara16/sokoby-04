import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react"
import { MetricCard } from "./metrics/MetricCard"
import { SalesChart } from "./charts/SalesChart"
import { OrdersCustomersChart } from "./charts/OrdersCustomersChart"
import { useTrendsData } from "./hooks/useTrendsData"
import { calculateTrend } from "./utils/calculations"
import { Button } from "@/components/ui/button"

export const TrendsDashboard = () => {
  const { data: trendsData, isLoading, error, refetch } = useTrendsData()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tendances des 6 derniers mois</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Ventes"
          value={`${trendsData?.at(-1)?.sales.toFixed(2) ?? 0}€`}
          trend={calculateTrend(trendsData, 'sales')}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Commandes"
          value={trendsData?.at(-1)?.orders ?? 0}
          trend={calculateTrend(trendsData, 'orders')}
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <MetricCard
          title="Clients"
          value={trendsData?.at(-1)?.customers ?? 0}
          trend={calculateTrend(trendsData, 'customers')}
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Panier moyen"
          value={`${trendsData?.at(-1)?.averageOrderValue.toFixed(2) ?? 0}€`}
          trend={calculateTrend(trendsData, 'averageOrderValue')}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart data={trendsData} />
        <OrdersCustomersChart data={trendsData} />
      </div>
    </div>
  )
}