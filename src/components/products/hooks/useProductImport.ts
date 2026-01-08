import { supabase } from "@/integrations/supabase/client"
import { ProductFormData } from "../types"

// Generate deterministic placeholder image based on category
const getPlaceholderImage = (category: string): string => {
  const categoryImages: Record<string, string> = {
    fashion: 'photo-1445205170230-053b83016050',
    electronics: 'photo-1518770660439-4636190af475',
    beauty: 'photo-1596462502278-27bfdc403348',
    home: 'photo-1556909114-f6e7ad7d3136',
    sports: 'photo-1461896836934-fffcbf554e00',
    fitness: 'photo-1534438327276-14e5300c3a48',
    general: 'photo-1472851294608-062f824d29cc',
  };
  const baseImage = categoryImages[category?.toLowerCase()] || categoryImages.general;
  return `https://images.unsplash.com/${baseImage}?w=400&h=400&fit=crop&q=80`;
};

export function useProductImport() {
  const importProduct = async (data: ProductFormData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Non authentifié")

    // First check if user owns a store directly
    let storeData = null;
    let storeOwnerId = user.id;
    
    const { data: ownedStore, error: ownedStoreError } = await supabase
      .from('store_settings')
      .select('id, user_id, is_production')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (ownedStoreError) {
      console.error("Erreur lors de la récupération de la boutique:", ownedStoreError)
    }

    if (ownedStore) {
      storeData = ownedStore;
      storeOwnerId = ownedStore.user_id;
    } else {
      // Check if user is staff member of a store
      const { data: staffData, error: staffError } = await supabase
        .from('staff_members')
        .select('store_id, store_settings:store_id(id, user_id, is_production)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()

      if (!staffError && staffData?.store_settings) {
        const storeSettings = staffData.store_settings as any;
        storeData = {
          id: storeSettings.id,
          user_id: storeSettings.user_id,
          is_production: storeSettings.is_production,
        };
        storeOwnerId = storeSettings.user_id;
      }
    }

    if (!storeData) throw new Error("Aucune boutique trouvée")

    // Insert product with all LIVE flags and store linkage
    const { error } = await supabase.from("products").insert({
      user_id: storeOwnerId, // Always use store owner's ID
      store_id: storeData.id, // CRITICAL: Link to store for LIVE queries
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.niche,
      status: 'active',
      is_visible: true, // LIVE: Always visible
      published: true, // LIVE: Always published
      image: getPlaceholderImage(data.niche), // LIVE: Never null
      stock: 100
    })

    if (error) {
      console.error("Erreur lors de l'import du produit:", error)
      throw error
    }
  }

  return { importProduct }
}