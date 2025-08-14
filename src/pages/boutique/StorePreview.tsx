import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { ProductPlaceholder } from "@/components/ui/product-placeholder";

interface StoreData {
  id: string;
  store_name: string;
  store_description?: string;
  store_email?: string;
  store_phone?: string;
  store_address?: string;
}

interface BrandData {
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  slogan?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
}

export default function StorePreview() {
  const { storeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [brandData, setBrandData] = useState<BrandData>({});
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadStoreData();
  }, [storeId]);

  const loadStoreData = async () => {
    if (!storeId) return;

    try {
      setLoading(true);

      // Charger les données de la boutique
      const { data: store, error: storeError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', storeId)
        .maybeSingle();

      if (storeError) {
        console.error('Error loading store:', storeError);
        return;
      }

      if (!store) {
        console.error('Store not found');
        return;
      }

      // Charger les données de marque
      const { data: brand, error: brandError } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('user_id', store.user_id)
        .maybeSingle();

      if (brandError) {
        console.error('Error loading brand:', brandError);
      }

      // Charger les produits
      const { data: productsData, error: productsError } = await supabase
        .from('ai_generated_products')
        .select('*')
        .eq('user_id', store.user_id)
        .limit(8);

      if (productsError) {
        console.error('Error loading products:', productsError);
      }

      setStoreData(store);
      setBrandData(brand || {});
      setProducts(productsData || []);

    } catch (error) {
      console.error('Error loading store data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de l'aperçu...</p>
        </div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Boutique non trouvée</h1>
          <p className="text-muted-foreground mb-6">
            Cette boutique n'existe pas ou n'est pas accessible.
          </p>
          <Button onClick={() => window.close()}>
            Fermer
          </Button>
        </div>
      </div>
    );
  }

  const primaryColor = brandData.primary_color || "#3b82f6";
  const secondaryColor = brandData.secondary_color || "#64748b";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header 
        className="w-full py-6 px-4 text-white shadow-lg"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {brandData.logo_url && (
                <img 
                  src={brandData.logo_url} 
                  alt="Logo" 
                  className="h-12 w-12 rounded-lg object-cover bg-white/10 p-1"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">{storeData.store_name}</h1>
                {brandData.slogan && (
                  <p className="text-white/90 text-sm">{brandData.slogan}</p>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-white border-white/20 hover:bg-white/10"
              onClick={() => window.close()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Fermer l'aperçu
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Store Info */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Bienvenue dans notre boutique</h2>
          {storeData.store_description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {storeData.store_description}
            </p>
          )}
        </section>

        {/* Products Grid */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Nos Produits</h3>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ProductPlaceholder 
                          productName={product.name}
                          primaryColor={primaryColor}
                          className="w-full h-full"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2 line-clamp-2">
                      {product.name}
                    </CardTitle>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-xl font-bold"
                        style={{ color: primaryColor }}
                      >
                        {product.price.toFixed(2)} €
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          style={{ backgroundColor: primaryColor }}
                          className="text-white hover:opacity-90"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🛍️</div>
              <h4 className="text-xl font-semibold mb-2">Aucun produit pour le moment</h4>
              <p className="text-muted-foreground">
                Les produits seront bientôt disponibles dans cette boutique.
              </p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer 
          className="border-t pt-8 text-center"
          style={{ borderColor: secondaryColor + "30" }}
        >
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Contactez-nous</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {storeData.store_email && (
                <p>Email : {storeData.store_email}</p>
              )}
              {storeData.store_phone && (
                <p>Téléphone : {storeData.store_phone}</p>
              )}
              {storeData.store_address && (
                <p>Adresse : {storeData.store_address}</p>
              )}
            </div>
          </div>
          <div 
            className="text-sm opacity-60"
            style={{ color: secondaryColor }}
          >
            © 2025 {storeData.store_name}. Tous droits réservés.
          </div>
        </footer>
      </main>
    </div>
  );
}