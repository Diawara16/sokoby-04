import { AppSidebar } from "@/components/AppSidebar"
import { CustomReportBuilder } from "@/components/analytics/CustomReportBuilder"

const CustomReports = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Rapports personnalisés</h1>
          <CustomReportBuilder />
        </div>
      </main>
    </div>
  )
}

export default CustomReports