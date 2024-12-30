import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

const reports = [
  {
    title: "Rapport des ventes mensuelles",
    description: "Un aperçu détaillé des ventes du mois avec analyses",
    icon: FileText,
  },
  {
    title: "Analyse des clients",
    description: "Segmentation et comportement des clients",
    icon: FileText,
  },
  {
    title: "Performance des produits",
    description: "Classement et analyse des produits les plus vendus",
    icon: FileText,
  }
]

const AnalyticsReports = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Rapports avancés</h1>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <report.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{report.description}</p>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AnalyticsReports