import { supabase } from "@/lib/supabase"
import { ProductFormData } from "../types"

export function useProductImport() {
  const importProduct = async (data: ProductFormData) => {
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
  }

  return { importProduct }
}