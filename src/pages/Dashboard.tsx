import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserDashboard } from "@/components/dashboard/UserDashboard"
import { AppSidebar } from "@/components/AppSidebar"

const Dashboard = () => {
  return (
    <>
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground mt-2">
              Bienvenue sur votre espace personnel Sokoby
            </p>
          </div>

          <UserDashboard />
        </div>
      </main>
    </>
  )
}

export default Dashboard