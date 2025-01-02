import { Card } from "@/components/ui/card"
import { applications } from "@/data/applications"
import { useToast } from "@/hooks/use-toast"

export function SupplierApps() {
  const { toast } = useToast()
  const dropshippingApps = applications.filter(app => app.type === "dropshipping")

  const handleAppClick = (app: typeof applications[0]) => {
    window.open(app.authUrl, '_blank')
    toast({
      title: "Connexion au fournisseur",
      description: `Vous allez être redirigé vers ${app.name} pour vous connecter`,
    })
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Applications de fournisseurs</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {dropshippingApps.map((app) => (
          <div
            key={app.id}
            onClick={() => handleAppClick(app)}
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <app.icon className="h-6 w-6 mr-3 text-gray-600" />
            <div>
              <h3 className="font-medium">{app.name}</h3>
              <p className="text-sm text-gray-500">{app.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}