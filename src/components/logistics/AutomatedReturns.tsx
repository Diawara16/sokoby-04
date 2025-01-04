import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export const AutomatedReturns = () => {
  const { data: returns, isLoading } = useQuery({
    queryKey: ['returns'],
    queryFn: async () => {
      const { data } = await supabase
        .from('returns')
        .select(`
          *,
          order:orders(
            id
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)
      return data || []
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500 bg-green-50'
      case 'pending':
        return 'text-yellow-500 bg-yellow-50'
      case 'rejected':
        return 'text-red-500 bg-red-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Retours automatisés
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {returns?.length === 0 ? (
              <p className="text-muted-foreground">
                Aucun retour en cours.
              </p>
            ) : (
              returns?.map((returnItem) => (
                <div key={returnItem.id} className="p-4 rounded-lg bg-muted">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">
                      Retour #{returnItem.id.slice(0, 8)}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(returnItem.status)}`}>
                      {returnItem.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Commande: #{returnItem.order.id.slice(0, 8)}</p>
                    <p>Raison: {returnItem.reason}</p>
                    {returnItem.tracking_number && (
                      <p>Numéro de suivi: {returnItem.tracking_number}</p>
                    )}
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