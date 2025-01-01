import { Truck, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const ShippingInfo = () => {
  return (
    <div className="space-y-8 mb-12">
      <Card className="hover:shadow-lg transition-all">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Livraison et Suivi</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Nous nous engageons à offrir une expérience de livraison transparente :</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Suivi en temps réel de vos commandes</li>
                  <li>Notifications automatiques sur l'état de la livraison</li>
                  <li>Estimation précise des délais de livraison</li>
                  <li>Choix de transporteurs fiables</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Politique de Retours</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Notre politique de retours est conçue pour votre tranquillité d'esprit :</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Retours acceptés sous 30 jours après réception</li>
                  <li>Processus de retour simple et rapide</li>
                  <li>Remboursement garanti pour les articles retournés en bon état</li>
                  <li>Support client dédié pour vous accompagner</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ShippingInfo