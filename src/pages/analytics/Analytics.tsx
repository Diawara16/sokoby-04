import { AppSidebar } from "@/components/AppSidebar";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

const Analytics = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="container mx-auto">
          <AnalyticsDashboard />
        </div>
      </main>
    </div>
  );
};

export default Analytics;