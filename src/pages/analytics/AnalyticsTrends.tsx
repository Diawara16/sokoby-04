import { AppSidebar } from "@/components/AppSidebar"
import { TrendsDashboard } from "@/components/analytics/TrendsDashboard"

const AnalyticsTrends = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Tendances</h1>
          <TrendsDashboard />
        </div>
      </main>
    </div>
  )
}

export default AnalyticsTrends