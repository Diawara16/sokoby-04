import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export const ShippingPriceOptimizer = () => {
  const { data: partners, isLoading } = useQuery({
    queryKey: ['shipping-partners'],
    queryFn: async () => {
      const { data } = await supabase
        .from('shipping_partners')
        .select('*')
        .eq('status', 'active')
      return data || []
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Optimisation des prix de livraison
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {partners?.length === 0 ? (
              <p className="text-muted-foreground">
                Aucun partenaire de livraison configuré.
              </p>
            ) : (
              partners?.map((partner) => (
                <div key={partner.id} className="p-4 rounded-lg bg-muted">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{partner.name}</h3>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-600">
                      Actif
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Type d'intégration: {partner.integration_type}</p>
                    <p>Zones de couverture: {partner.coverage_areas?.join(', ') || 'Non spécifié'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}