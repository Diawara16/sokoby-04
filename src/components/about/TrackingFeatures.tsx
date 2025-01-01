import { Package, Truck, MapPin, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const trackingFeatures = [
  {
    icon: Package,
    title: "Suivi en temps réel",
    description: "Suivez vos commandes en temps réel, de la confirmation jusqu'à la livraison"
  },
  {
    icon: Truck,
    title: "Transporteurs fiables",
    description: "Partenariat avec les meilleurs transporteurs pour assurer des livraisons rapides et sûres"
  },
  {
    icon: MapPin,
    title: "Localisation précise",
    description: "Localisez vos colis à tout moment grâce à notre système de géolocalisation"
  },
  {
    icon: Clock,
    title: "Estimations précises",
    description: "Recevez des estimations précises des délais de livraison"
  },
  {
    icon: CheckCircle2,
    title: "Confirmation de livraison",
    description: "Notifications automatiques à chaque étape importante de la livraison"
  }
]

const TrackingFeatures = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-8">Suivi de Commande</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trackingFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TrackingFeatures