import React from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Boutique() {
  const { data: storeSettings, isLoading, error } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      console.log("Récupération des paramètres de la boutique pour l'utilisateur:", user.id)
      
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.error("Erreur lors de la récupération des paramètres:", error)
        throw error
      }

      console.log("Paramètres récupérés:", data)
      return data
    }
  })

  if (error) {
    return (
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-8">
          <Alert variant="destructive">
            <AlertDescription>
              Une erreur est survenue lors de la récupération des paramètres de la boutique
            </AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Ma Boutique</h1>
            <Link to="/produits/ajouter">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un produit
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !storeSettings ? (
            <Card>
              <CardHeader>
                <CardTitle>Configuration requise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Vous devez d'abord configurer les paramètres de votre boutique.
                </p>
                <Link to="/parametres">
                  <Button>
                    Configurer ma boutique
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{storeSettings.store_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Email :</strong> {storeSettings.store_email}</p>
                    {storeSettings.store_phone && (
                      <p><strong>Téléphone :</strong> {storeSettings.store_phone}</p>
                    )}
                    {storeSettings.store_address && (
                      <p><strong>Adresse :</strong> {storeSettings.store_address}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}