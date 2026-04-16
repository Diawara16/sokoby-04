import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Store, Package, Palette, Settings, ExternalLink, ArrowLeft,
  Plus, Eye, Loader2, ShoppingCart, BarChart3, Globe, Bell,
  Video, CheckCircle, Copy, Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StoreNotificationsPanel } from "@/components/notifications/StoreNotificationsPanel";
import { StoreVideosPanel } from "@/components/store/StoreVideosPanel";
import { ProductCard } from "@/components/store/dashboard/ProductCard";
import { PremiumStorePreview } from "@/components/store/dashboard/PremiumStorePreview";
import { ThemePresets } from "@/components/store/dashboard/ThemePresets";

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
  const [isPublished, setIsPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTheme, setActiveTheme] = useState("minimal-luxury");
  const [savingTheme, setSavingTheme] = useState(false);
  const [editPrimary, setEditPrimary] = useState("#E53935");
  const [editSecondary, setEditSecondary] = useState("#1976D2");

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({ title: "Erreur", description: "Vous devez être connecté", variant: "destructive" });
          return;
        }

        let storeQuery = supabase.from('store_settings').select('*').eq('user_id', user.id);
        if (storeId) storeQuery = storeQuery.eq('id', storeId);
        let { data: storeData, error: storeError } = await storeQuery.maybeSingle();
        if (storeError) throw storeError;

        if (!storeData) {
          let storesQuery = supabase.from('stores').select('*').eq('owner_id', user.id);
          if (storeId) storesQuery = storesQuery.eq('id', storeId);
          const { data: altStore, error: altError } = await storesQuery.maybeSingle();
          if (altError) throw altError;
          if (altStore) {
            storeData = {
              id: altStore.id, store_name: altStore.store_name || 'Ma Boutique',
              domain_name: '', store_type: 'ai', payment_status: altStore.billing_status || 'active',
              initial_products_generated: true, created_at: altStore.created_at, user_id: user.id,
            } as any;
          }
        }

        if (!storeData) return;

        setStore(storeData);
        setIsPublished(!!(storeData as any).published_at || (storeData as any).store_status === 'active');

        const { data: productsData } = await supabase
          .from('products').select('*').eq('user_id', user.id)
          .order('created_at', { ascending: false }).limit(50);

        if (productsData?.length) {
          setProducts(productsData.map(p => ({
            id: p.id, name: p.name, description: p.description || '',
            price: p.price, image_url: p.image, is_active: p.status === 'active' && p.is_visible === true,
          })));
        }

        const { data: brandData } = await supabase
          .from('brand_settings').select('*').eq('user_id', user.id).maybeSingle();
        if (brandData) {
          setBrandSettings(brandData);
          setEditPrimary(brandData.primary_color || '#E53935');
          setEditSecondary(brandData.secondary_color || '#1976D2');
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
        toast({ title: "Erreur", description: "Impossible de charger les données", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [storeId, toast]);

  const handlePublish = async () => {
    if (!store) return;
    setPublishing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");
      await supabase.from("store_settings").update({
        published_at: new Date().toISOString(),
        store_status: "active",
        updated_at: new Date().toISOString(),
      } as any).eq("user_id", user.id);
      setIsPublished(true);
      toast({ title: "🎉 Boutique publiée !", description: "Votre boutique est maintenant en ligne" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de publier", variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  const handleProductUpdate = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleProductDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveTheme = async () => {
    setSavingTheme(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");

      const payload = { primary_color: editPrimary, secondary_color: editSecondary, updated_at: new Date().toISOString() };

      if (brandSettings) {
        await supabase.from('brand_settings').update(payload).eq('user_id', user.id);
      } else {
        await supabase.from('brand_settings').insert({ ...payload, user_id: user.id });
      }

      setBrandSettings(prev => ({ ...(prev || { logo_url: '', slogan: '' }), primary_color: editPrimary, secondary_color: editSecondary }));
      toast({ title: "Thème sauvegardé" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setSavingTheme(false);
    }
  };

  const shareUrl = store ? `${window.location.origin}/boutique-apercu/${store.id}` : '';

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Lien copié !", description: shareUrl });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto px-4 py-8 text-center space-y-4">
        <h1 className="text-2xl font-bold">Aucune boutique trouvée</h1>
        <p className="text-muted-foreground">Créez-en une pour commencer.</p>
        <div className="flex justify-center gap-3">
          <Button asChild><Link to="/generer-boutique-ia"><Plus className="w-4 h-4 mr-2" />Créer une boutique IA</Link></Button>
          <Button variant="outline" asChild><Link to="/tableau-de-bord"><ArrowLeft className="w-4 h-4 mr-2" />Tableau de bord</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
      <Helmet>
        <title>{store.store_name} - Dashboard | Sokoby</title>
        <meta name="description" content={`Gérez votre boutique ${store.store_name}`} />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/tableau-de-bord"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{store.store_name}</h1>
              {isPublished && (
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" /> En ligne
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{store.domain_name || "Boutique Sokoby"}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {isPublished && (
            <Button variant="outline" size="sm" onClick={copyShareLink}>
              <Share2 className="h-4 w-4 mr-2" />Partager
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link to={`/boutique-apercu/${store.id}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />Aperçu
            </Link>
          </Button>
          {isPublished ? (
            <Button size="sm" variant="outline" className="text-green-700 border-green-300 bg-green-50">
              <CheckCircle className="h-4 w-4 mr-2" />Publiée
            </Button>
          ) : (
            <Button size="sm" onClick={handlePublish} disabled={publishing}>
              {publishing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Globe className="h-4 w-4 mr-2" />}
              {publishing ? "Publication…" : "Publier"}
            </Button>
          )}
        </div>
      </div>

      {/* Published banner */}
      {isPublished && (
        <Card className="mb-6 border-green-200 bg-green-50/50">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Votre boutique est en ligne !</p>
                <p className="text-sm text-green-600 truncate max-w-md">{shareUrl}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={copyShareLink} className="border-green-300">
              <Copy className="h-4 w-4 mr-2" />Copier le lien
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { icon: Package, value: products.length, label: "Produits", color: "bg-primary/10 text-primary" },
          { icon: ShoppingCart, value: 0, label: "Commandes", color: "bg-green-100 text-green-600" },
          { icon: BarChart3, value: "0€", label: "Ventes", color: "bg-blue-100 text-blue-600" },
          { icon: Eye, value: 0, label: "Visiteurs", color: "bg-purple-100 text-purple-600" },
        ].map(({ icon: Icon, value, label, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${color.split(' ')[0]}`}>
                  <Icon className={`h-5 w-5 ${color.split(' ')[1]}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 h-auto">
          {[
            { value: "products", icon: Package, label: "Produits" },
            { value: "preview", icon: Store, label: "Aperçu" },
            { value: "videos", icon: Video, label: "Vidéos" },
            { value: "theme", icon: Palette, label: "Thème" },
            { value: "notifications", icon: Bell, label: "Notifs" },
            { value: "settings", icon: Settings, label: "Paramètres" },
          ].map(({ value, icon: Icon, label }) => (
            <TabsTrigger key={value} value={value} className="text-xs sm:text-sm py-2">
              <Icon className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Products */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Vos produits</h2>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Ajouter un produit</Button>
          </div>
          {products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun produit</h3>
                <p className="text-muted-foreground mb-4">Ajoutez votre premier produit pour commencer.</p>
                <Button><Plus className="h-4 w-4 mr-2" />Ajouter un produit</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onProductUpdate={handleProductUpdate} onProductDelete={handleProductDelete} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Preview */}
        <TabsContent value="preview">
          <PremiumStorePreview
            storeName={store.store_name}
            products={products}
            brandSettings={brandSettings}
            activeTheme={activeTheme}
          />
        </TabsContent>

        {/* Videos */}
        <TabsContent value="videos">
          <StoreVideosPanel storeId={store.id} />
        </TabsContent>

        {/* Theme */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Personnaliser le thème</CardTitle>
              <CardDescription>Choisissez un thème et personnalisez les couleurs</CardDescription>
            </CardHeader>
            <CardContent>
              <ThemePresets
                activeTheme={activeTheme}
                onThemeChange={setActiveTheme}
                primaryColor={editPrimary}
                secondaryColor={editSecondary}
                onColorChange={(field, value) => {
                  if (field === "primary") setEditPrimary(value);
                  else setEditSecondary(value);
                }}
                onSave={handleSaveTheme}
                saving={savingTheme}
              />
            </CardContent>
          </Card>

          {/* Live mini preview */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Aperçu en direct</h3>
            <PremiumStorePreview
              storeName={store.store_name}
              products={products.slice(0, 4)}
              brandSettings={{ ...(brandSettings || { logo_url: '', slogan: '' }), primary_color: editPrimary, secondary_color: editSecondary }}
              activeTheme={activeTheme}
            />
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <StoreNotificationsPanel storeId={store.id} />
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de la boutique</CardTitle>
              <CardDescription>Informations et configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nom de la boutique</label>
                <input type="text" value={store.store_name} className="w-full p-2 border rounded-md" readOnly />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Domaine</label>
                <input type="text" value={store.domain_name || ''} className="w-full p-2 border rounded-md bg-muted" readOnly />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Type de boutique</label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{store.store_type === 'ai' ? 'Boutique IA' : 'Boutique Manuelle'}</Badge>
                  {store.payment_status === 'completed' && <Badge className="bg-green-100 text-green-800">Payé</Badge>}
                  {isPublished && <Badge className="bg-green-100 text-green-800">En ligne</Badge>}
                </div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Zone de danger</h3>
                <Button variant="destructive" size="sm">Supprimer la boutique</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreDashboard;
