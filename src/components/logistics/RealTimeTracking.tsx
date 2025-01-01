import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Bell } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Shipment {
  id: string
  tracking_number: string
  shipping_carrier: string
  status: string
  estimated_delivery_date: string
}

export function RealTimeTracking() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchShipments()

    // Écouter les mises à jour en temps réel
    const channel = supabase
      .channel('orders-tracking')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `shipping_carrier=is.not.null`
        },
        (payload) => {
          toast({
            title: "Mise à jour du suivi",
            description: `La commande #${payload.new.id.slice(0, 8)} a été mise à jour`,
          })
          fetchShipments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchShipments = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .not('shipping_carrier', 'is', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur:', error)
      return
    }

    setShipments(data || [])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Suivi en temps réel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shipments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucune expédition en cours
            </p>
          ) : (
            shipments.map((shipment) => (
              <div 
                key={shipment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">
                    Commande #{shipment.id.slice(0, 8)}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {shipment.shipping_carrier} - {shipment.tracking_number}
                  </p>
                  {shipment.estimated_delivery_date && (
                    <p className="text-sm text-muted-foreground">
                      Livraison estimée: {new Date(shipment.estimated_delivery_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    shipment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    shipment.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {shipment.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}