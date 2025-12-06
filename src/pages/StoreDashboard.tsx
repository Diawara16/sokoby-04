import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Store, 
  Package, 
  Palette, 
  Settings, 
  ExternalLink, 
  ArrowLeft,
  Plus,
  Edit,
  Eye,
  Loader2,
  ShoppingCart,
  BarChart3,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StoreData {
  id: string;
  store_name: string;
  domain_name: string;
  store_type: string;
  payment_status: string;
  initial_products_generated: boolean;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_active: boolean;
}

interface BrandSettings {
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  slogan: string;
}

const StoreDashboard = () => {
  const { storeId } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<StoreData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [brandSettings, setBrandSettings] = useState<BrandSettings | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté",
            variant: "destructive",
          });
          return;
        }

        // Fetch store
        let storeQuery = supabase
          .from('store_settings')
          .select('*')
          .eq('user_id', user.id);
        
        if (storeId) {
          storeQuery = storeQuery.eq('id', storeId);
        }
        
        const { data: storeData, error: storeError } = await storeQuery.maybeSingle();
        
        if (storeError) throw storeError;
        if (!storeData) {
          toast({
            title: "Boutique introuvable",
            description: "Aucune boutique trouvée pour cet utilisateur",
            variant: "destructive",
          });
          return;
        }
        
        setStore(storeData);

        // Fetch products
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (productsData && productsData.length > 0) {
          setProducts(productsData.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            price: p.price,
            image_url: p.image,
            is_active: p.status === 'active',
          })));
        } else {
          // Fallback to ai_generated_products
          const { data: aiProducts } = await supabase
            .from('ai_generated_products')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);
          
          if (aiProducts) {
            setProducts(aiProducts.map(p => ({
              id: p.id,
              name: p.name,
              description: p.description || '',
              price: p.price,
              image_url: p.image_url,
              is_active: true,
            })));
          }
        }

        // Fetch brand settings
        const { data: brandData } = await supabase
          .from('brand_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (brandData) {
          setBrandSettings(brandData);
        }

      } catch (error) {
        console.error('Error fetching store data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de la boutique",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Aucune boutique trouvée</h1>
          <p className="text-muted-foreground">
            Vous n'avez pas encore de boutique. Créez-en une pour commencer.
          </p>
          <Button asChild>
            <Link to="/creer-boutique-ia">
              <Plus className="w-4 h-4 mr-2" />
              Créer une boutique
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <Helmet>
        <title>{store.store_name} - Tableau de bord | Sokoby</title>
        <meta name="description" content={`Gérez votre boutique ${store.store_name}`} />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/tableau-de-bord">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{store.store_name}</h1>
            <p className="text-sm text-muted-foreground">{store.domain_name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Globe className="h-4 w-4 mr-2" />
            Publier
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-xs text-muted-foreground">Produits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Commandes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">0€</p>
                <p className="text-xs text-muted-foreground">Ventes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Visiteurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="products" className="text-xs sm:text-sm py-2">
            <Package className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Produits</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-xs sm:text-sm py-2">
            <Store className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Aperçu</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="text-xs sm:text-sm py-2">
            <Palette className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Thème</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm py-2">
            <Settings className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Paramètres</span>
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Vos produits</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </div>
          
          {products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun produit</h3>
                <p className="text-muted-foreground mb-4">
                  Ajoutez votre premier produit pour commencer à vendre.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                    <p className="text-primary font-bold">{product.price.toFixed(2)}€</p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Store Preview Tab */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu de votre boutique</CardTitle>
              <CardDescription>
                Voici comment vos clients verront votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border rounded-lg overflow-hidden"
                style={{ 
                  '--store-primary': brandSettings?.primary_color || '#E53935',
                  '--store-secondary': brandSettings?.secondary_color || '#1976D2',
                } as React.CSSProperties}
              >
                {/* Store Header Preview */}
                <div 
                  className="p-4 text-white"
                  style={{ backgroundColor: brandSettings?.primary_color || '#E53935' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {brandSettings?.logo_url ? (
                        <img 
                          src={brandSettings.logo_url} 
                          alt="Logo" 
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-white/20 rounded flex items-center justify-center">
                          <Store className="h-6 w-6" />
                        </div>
                      )}
                      <span className="font-bold text-lg">{store.store_name}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-white border-white/50 hover:bg-white/10"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ouvrir
                    </Button>
                  </div>
                  {brandSettings?.slogan && (
                    <p className="text-white/80 text-sm mt-2">{brandSettings.slogan}</p>
                  )}
                </div>
                
                {/* Products Grid Preview */}
                <div className="p-4 bg-muted/30">
                  <h3 className="font-medium mb-3">Produits en vedette</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {products.slice(0, 4).map((product) => (
                      <div key={product.id} className="bg-background rounded-lg p-2 shadow-sm">
                        <div className="aspect-square bg-muted rounded mb-2 flex items-center justify-center">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-xs font-medium truncate">{product.name}</p>
                        <p className="text-xs text-primary font-bold">{product.price.toFixed(2)}€</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Personnaliser le thème</CardTitle>
              <CardDescription>
                Modifiez les couleurs et le style de votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Couleur principale</label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg border shadow-sm"
                      style={{ backgroundColor: brandSettings?.primary_color || '#E53935' }}
                    />
                    <input 
                      type="color" 
                      value={brandSettings?.primary_color || '#E53935'}
                      className="h-10"
                      onChange={() => {}}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Couleur secondaire</label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg border shadow-sm"
                      style={{ backgroundColor: brandSettings?.secondary_color || '#1976D2' }}
                    />
                    <input 
                      type="color" 
                      value={brandSettings?.secondary_color || '#1976D2'}
                      className="h-10"
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Logo</label>
                <div className="flex items-center gap-4">
                  {brandSettings?.logo_url ? (
                    <img 
                      src={brandSettings.logo_url} 
                      alt="Logo"
                      className="h-16 w-16 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground">
                      <Store className="h-6 w-6" />
                    </div>
                  )}
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Télécharger un logo
                  </Button>
                </div>
              </div>

              <Button className="w-full sm:w-auto">
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de la boutique</CardTitle>
              <CardDescription>
                Gérez les informations et paramètres de votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nom de la boutique</label>
                <input 
                  type="text"
                  value={store.store_name}
                  className="w-full p-2 border rounded-md"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Domaine</label>
                <input 
                  type="text"
                  value={store.domain_name || ''}
                  className="w-full p-2 border rounded-md bg-muted"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Type de boutique</label>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    store.store_type === 'ai' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {store.store_type === 'ai' ? 'Boutique IA' : 'Boutique Manuelle'}
                  </span>
                  {store.payment_status === 'completed' && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Payé
                    </span>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Zone de danger</h3>
                <Button variant="destructive" size="sm">
                  Supprimer la boutique
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreDashboard;