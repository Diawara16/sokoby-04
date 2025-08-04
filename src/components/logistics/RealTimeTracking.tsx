import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export const RealTimeTracking = () => {
  const { data: routes, isLoading } = useQuery({
    queryKey: ['delivery-routes'],
    queryFn: async () => {
      const { data } = await supabase
        .from('delivery_routes')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(5)
      return data || []
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Suivi des livraisons en temps réel
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {routes?.length === 0 ? (
              <p className="text-muted-foreground">
                Aucune route de livraison active.
              </p>
            ) : (
              routes?.map((route) => (
                <div key={route.id} className="p-4 rounded-lg bg-muted">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Route #{route.id.slice(0, 8)}</h3>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600">
                      Score: {Math.round(route.optimization_score * 100)}%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Temps estimé: {route.estimated_delivery_time ? String(route.estimated_delivery_time) : 'Non disponible'}</p>
                    <p>Points de livraison: {(route.route_data as any)?.stops?.length || 0}</p>
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