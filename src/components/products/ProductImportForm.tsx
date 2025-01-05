import { useState } from "react"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { applications } from "@/data/applications"
import { niches } from "@/data/niches"

interface ProductFormData {
  name: string
  description: string
  price: string
  supplier: string
  niche: string
}

export function ProductImportForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>()

  const dropshippingApps = applications.filter(app => app.type === "dropshipping")

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      // Récupérer les paramètres de la boutique
      const { data: storeData, error: storeError } = await supabase
        .from('store_settings')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle()

      if (storeError) throw storeError

      const { error } = await supabase.from("ai_generated_products").insert({
        user_id: user.id,
        store_id: storeData?.id,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        supplier: data.supplier,
        niche: data.niche
      })

      if (error) throw error

      toast({
        title: "Produit importé",
        description: "Le produit a été importé avec succès",
      })
      
    } catch (error) {
      console.error("Erreur lors de l'import du produit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'import du produit",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Nom du produit</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              className="mt-1 h-32"
            />
          </div>

          <div>
            <Label htmlFor="price">Prix</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { required: true })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="supplier">Fournisseur</Label>
            <Select onValueChange={(value) => register("supplier").onChange({ target: { value } })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choisir un fournisseur" />
              </SelectTrigger>
              <SelectContent>
                {dropshippingApps.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    <div className="flex items-center gap-2">
                      <app.icon className="h-4 w-4" />
                      <span>{app.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="niche">Catégorie</Label>
            <Select onValueChange={(value) => register("niche").onChange({ target: { value } })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {niches.map((niche) => (
                  <SelectItem key={niche.name} value={niche.name}>
                    <div className="flex items-center gap-2">
                      <span>{niche.icon}</span>
                      <span>{niche.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Import en cours..." : "Importer le produit"}
        </Button>
      </div>
    </form>
  )
}