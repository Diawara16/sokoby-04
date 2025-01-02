import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

export default function ImportedProducts() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Produits Importés</h1>
        <Link to="/produits/importes/ajouter">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des produits importés</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aucun produit importé pour le moment. Cliquez sur le bouton "Ajouter un produit" pour commencer.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}