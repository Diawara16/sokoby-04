import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function AddImportedProduct() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Fonctionnalité en développement",
      description: "L'ajout de produits importés sera bientôt disponible.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/produits/importes" className="flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux produits importés
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un produit importé</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input id="name" placeholder="Nom du produit" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Prix</Label>
              <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier">Fournisseur</Label>
              <Input id="supplier" placeholder="Nom du fournisseur" />
            </div>

            <Button type="submit" className="w-full">
              Ajouter le produit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}