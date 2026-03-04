import { supabase } from "@/integrations/supabase/client"
import { ProductFormData } from "../types"

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

async function resolveStoreId(userId: string) {
  const { data: ownedStore } = await supabase
    .from('store_settings')
    .select('id, user_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (ownedStore) return { storeId: ownedStore.id, ownerId: ownedStore.user_id };

  const { data: staffData } = await supabase
    .from('staff_members')
    .select('store_id, store_settings:store_id(id, user_id)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  if (staffData?.store_settings) {
    const s = staffData.store_settings as any;
    return { storeId: s.id, ownerId: s.user_id };
  }

  return null;
}

export function useProductImport() {
  const importProduct = async (data: ProductFormData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Non authentifié");

    const store = await resolveStoreId(user.id);
    if (!store) throw new Error("Aucune boutique trouvée");

    const imageUrl = data.imageUrl?.trim() || getPlaceholderImage(data.niche);

    const insertData = {
      user_id: store.ownerId,
      store_id: store.storeId,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.niche,
      image: imageUrl,
      images: [imageUrl],
      supplier_url: data.supplier,
      status: 'active',
      is_visible: true,
      published: true,
      stock: 100,
    };

    console.log("[importProduct] Inserting product:", insertData);

    const { data: result, error } = await supabase.from("products").insert(insertData).select();

    if (error) {
      console.error("[importProduct] Insert failed:", error);
      throw error;
    }

    console.log("[importProduct] Product created:", result);
  };

  const importFromMaster = async (masterProductId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Non authentifié");

    const store = await resolveStoreId(user.id);
    if (!store) throw new Error("Aucune boutique trouvée");

    const { data: master, error: fetchErr } = await supabase
      .from('master_products')
      .select('*')
      .eq('id', masterProductId)
      .single();

    if (fetchErr || !master) {
      console.error("[importFromMaster] Fetch failed:", fetchErr);
      throw fetchErr || new Error("Produit maître introuvable");
    }

    const imageUrl = master.image || getPlaceholderImage(master.niche);

    const insertData = {
      user_id: store.ownerId,
      store_id: store.storeId,
      name: master.name,
      description: master.description,
      price: master.price,
      category: master.niche,
      image: imageUrl,
      images: [imageUrl],
      supplier_url: master.supplier,
      status: 'active',
      is_visible: true,
      published: true,
      stock: 100,
    };

    console.log("[importFromMaster] Inserting:", insertData);

    const { data: result, error } = await supabase.from("products").insert(insertData).select();

    if (error) {
      console.error("[importFromMaster] Insert failed:", error);
      throw error;
    }

    console.log("[importFromMaster] Product imported:", result);
  };

  return { importProduct, importFromMaster };
}
