import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useProductImport } from "@/components/products/hooks/useProductImport";
import { useToast } from "@/hooks/use-toast";

interface MasterProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  niche: string;
  supplier: string | null;
  category: string | null;
}

export default function ImportProducts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { importFromMaster } = useProductImport();
  const [products, setProducts] = useState<MasterProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);

  useEffect(() => {
    loadMasterProducts();
  }, []);

  const loadMasterProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('master_products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error("[ImportProducts] Failed to load master_products:", error);
      toast({ title: "Erreur", description: "Impossible de charger le catalogue", variant: "destructive" });
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleImport = async (productId: string) => {
    setImporting(productId);
    try {
      await importFromMaster(productId);
      toast({ title: "Succès", description: "Produit importé avec succès" });
    } catch (error) {
      console.error("[ImportProducts] Import error:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec de l'importation",
        variant: "destructive",
      });
    } finally {
      setImporting(null);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/boutique-editeur')} className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'éditeur
            </Button>

            <h1 className="text-2xl font-bold mb-2">Importer depuis le catalogue</h1>
            <p className="text-muted-foreground mb-8">Sélectionnez des produits du catalogue maître à ajouter à votre boutique.</p>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun produit disponible dans le catalogue.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {product.description || "Aucune description"}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold">€{product.price.toFixed(2)}</span>
                        <Badge variant="outline">{product.niche}</Badge>
                      </div>
                      <Button
                        className="w-full mt-3"
                        size="sm"
                        onClick={() => handleImport(product.id)}
                        disabled={importing === product.id}
                      >
                        {importing === product.id ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Importation...</>
                        ) : (
                          <><Download className="h-4 w-4 mr-2" />Importer</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
