import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function AutomatedReturns() {
  const [returns, setReturns] = useState<any[]>([])
  const { toast } = useToast()

  const handleAutomatedReturn = async (returnId: string, action: 'approve' | 'reject') => {
    try {
      const { data, error } = await supabase
        .from('returns')
        .update({ 
          automated_status: action === 'approve' ? 'approved' : 'rejected',
          processing_notes: [`${action === 'approve' ? 'Approuvé' : 'Rejeté'} automatiquement le ${new Date().toLocaleString()}`]
        })
        .eq('id', returnId)
        .select()

      if (error) throw error

      toast({
        title: "Succès",
        description: `Retour ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`,
      })

      // Rafraîchir la liste des retours
      fetchReturns()
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de traiter le retour",
        variant: "destructive",
      })
    }
  }

  const fetchReturns = async () => {
    const { data, error } = await supabase
      .from('returns')
      .select(`
        *,
        order:orders(*)
      `)
      .eq('automated_status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur:', error)
      return
    }

    setReturns(data || [])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Gestion automatisée des retours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {returns.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucun retour en attente de traitement
            </p>
          ) : (
            returns.map((returnItem) => (
              <div 
                key={returnItem.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">Retour #{returnItem.id.slice(0, 8)}</h4>
                  <p className="text-sm text-muted-foreground">
                    Raison: {returnItem.reason}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAutomatedReturn(returnItem.id, 'approve')}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Approuver
                  </button>
                  <button
                    onClick={() => handleAutomatedReturn(returnItem.id, 'reject')}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Rejeter
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}