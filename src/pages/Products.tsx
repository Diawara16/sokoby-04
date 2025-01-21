import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductGrid } from "@/components/products/ProductGrid";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) throw error;

      setProducts(data || []);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Produits</h1>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucun produit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Vous n'avez pas encore ajouté de produits à votre boutique.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}