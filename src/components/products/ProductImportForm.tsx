import { useState } from "react"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductNameField } from "./form/ProductNameField"
import { ProductDescriptionField } from "./form/ProductDescriptionField"
import { ProductPriceField } from "./form/ProductPriceField"
import { SupplierField } from "./form/SupplierField"
import { NicheField } from "./form/NicheField"
import { ProductFormData } from "./types"
import { useProductImport } from "./hooks/useProductImport"

export function ProductImportForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormData>()
  const { importProduct } = useProductImport()

  const onSubmit = async (data: ProductFormData) => {
    if (!data.supplier || !data.niche) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fournisseur et une catégorie",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await importProduct(data)
      toast({
        title: "Succès",
        description: "Le produit a été importé avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de l'import du produit:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'import du produit",
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
          <ProductNameField register={register} errors={errors} />
          <ProductDescriptionField register={register} errors={errors} />
          <ProductPriceField register={register} errors={errors} />
          <SupplierField 
            register={register} 
            errors={errors}
            onValueChange={(value) => setValue('supplier', value)} 
          />
          <NicheField 
            register={register} 
            errors={errors}
            onValueChange={(value) => setValue('niche', value)}
          />
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