import { useState } from "react"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductNameField } from "./form/ProductNameField"
import { ProductDescriptionField } from "./form/ProductDescriptionField"
import { ProductPriceField } from "./form/ProductPriceField"
import { SupplierField } from "./form/SupplierField"
import { NicheField } from "./form/NicheField"
import { ProductFormData } from "./types"

export function ProductImportForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>()

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: storeData, error: storeError } = await supabase
        .from('store_settings')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle()

      if (storeError) throw storeError
      if (!storeData) throw new Error("Aucune boutique trouvée")

      const { error } = await supabase.from("ai_generated_products").insert({
        user_id: user.id,
        store_id: storeData.id,
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
          <ProductNameField register={register} />
          <ProductDescriptionField register={register} />
          <ProductPriceField register={register} />
          <SupplierField register={register} />
          <NicheField register={register} />
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