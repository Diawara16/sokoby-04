import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShippingPriceOptimizer } from "@/components/logistics/ShippingPriceOptimizer"
import { StockPredictions } from "@/components/logistics/StockPredictions"

const SmartLogistics = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="container mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Logistique intelligente</h1>
          
          <div className="grid gap-6 md:grid-cols-2">
            <ShippingPriceOptimizer />
            <StockPredictions />
          </div>
        </div>
      </main>
    </div>
  )
}

export default SmartLogistics