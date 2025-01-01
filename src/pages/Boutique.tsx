import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SupplierSelector } from "@/components/store-creator/SupplierSelector";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ShoppingBag, Sparkles, ExternalLink } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

export default function Boutique() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const { toast } = useToast();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("");
  const [storeUrl, setStoreUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchStoreSettings();
    if (selectedSupplier) {
      fetchProducts();
    }
  }, [selectedSupplier]);

  const fetchStoreSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: storeSettings } = await supabase
        .from("store_settings")
        .select("domain_name")
        .eq("user_id", user.id)
        .single();

      if (storeSettings?.domain_name) {
        setStoreUrl(`/${storeSettings.domain_name}`);
      }
    } catch (error) {
      console.error("Error fetching store settings:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) throw error;

      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter au panier",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("cart_items")
        .insert([
          { user_id: user.id, product_id: productId }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Produit ajouté au panier",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter au panier",
        variant: "destructive",
      });
    }
  };

  if (!selectedSupplier) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Choisissez votre fournisseur de dropshipping</h1>
        <SupplierSelector
          selectedSupplier={selectedSupplier}
          onSupplierSelect={setSelectedSupplier}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Ma Boutique</h1>
        <div className="flex gap-4">
          {storeUrl && (
            <Button 
              variant="outline" 
              className="bg-white"
              onClick={() => window.open(storeUrl, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Voir la boutique en ligne
            </Button>
          )}
          <Link to="/creer-boutique-ia">
            <Button variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
              <Sparkles className="mr-2 h-4 w-4" />
              Créer ma boutique IA
            </Button>
          </Link>
          <Button variant="outline">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Panier
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <ProductFilters
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </aside>

        <main className="flex-1">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <ProductGrid
              products={products}
              onAddToCart={handleAddToCart}
            />
          )}
        </main>
      </div>
    </div>
  );
}