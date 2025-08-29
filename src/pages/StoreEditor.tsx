import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Store, 
  Settings, 
  Palette, 
  Package, 
  CreditCard, 
  Truck, 
  Eye,
  Globe,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";

// Import des composants de configuration
import { StoreGeneralSettings } from "@/components/store/editor/StoreGeneralSettings";
import { StoreDesignSettings } from "@/components/store/editor/StoreDesignSettings";
import { StoreProductsManager } from "@/components/store/editor/StoreProductsManager";
import { StorePaymentSettings } from "@/components/store/editor/StorePaymentSettings";
import { StoreShippingSettings } from "@/components/store/editor/StoreShippingSettings";
import { StoreAdvancedSettings } from "@/components/store/editor/StoreAdvancedSettings";
import { ThemeGallery } from "@/components/store/editor/ThemeGallery";

interface StoreData {
  id: string;
  store_name: string;
  store_description?: string;
  domain_name?: string;
  category?: string;
  store_email?: string;
  store_phone?: string;
  store_address?: string;
  is_custom_domain: boolean;
}

interface BrandData {
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  slogan?: string;
}

export default function StoreEditor() {
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [brandData, setBrandData] = useState<BrandData>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial tab from URL params or localStorage
  const getInitialTab = () => {
    const urlTab = searchParams.get('tab');
    if (urlTab && ['general', 'design', 'products', 'payments', 'shipping', 'settings'].includes(urlTab)) {
      return urlTab;
    }
    const savedTab = localStorage.getItem('storeEditor_activeTab');
    return savedTab && ['general', 'design', 'products', 'payments', 'shipping', 'settings'].includes(savedTab) 
      ? savedTab 
      : 'general';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Update URL and localStorage when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    localStorage.setItem('storeEditor_activeTab', tab);
  };

  useEffect(() => {
    loadStoreData();
  }, []);

  // Update tab from URL changes
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour accéder à l'éditeur",
          variant: "destructive"
        });
        navigate('/connexion');
        return;
      }

      // Charger les données de la boutique
      const { data: store, error: storeError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (storeError) {
        console.error('Error loading store:', storeError);
        throw storeError;
      }

      // Charger les données de marque
      const { data: brand, error: brandError } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (brandError) {
        console.error('Error loading brand:', brandError);
        // Continue même si les données de marque ne sont pas trouvées
      }

      if (!store) {
        // Créer une boutique de base si elle n'existe pas
        const { data: newStore, error: createError } = await supabase
          .from('store_settings')
          .insert({
            user_id: user.id,
            store_name: 'Ma Boutique',
            store_email: user.email,
            is_custom_domain: false
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating store:', createError);
          throw createError;
        }

        setStoreData(newStore);
      } else {
        setStoreData(store);
      }

      setBrandData(brand || {});

    } catch (error) {
      console.error('Error loading store data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de la boutique",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewStore = () => {
    if (!storeData) return;
    
    // Créer l'URL d'aperçu locale
    const previewUrl = `/boutique-apercu/${storeData.id}`;
    window.open(previewUrl, '_blank');
  };

  const handlePublishStore = async () => {
    if (!storeData) return;

    try {
      // Logique de publication de la boutique
      toast({
        title: "Boutique publiée",
        description: "Votre boutique est maintenant en ligne !",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de publier la boutique",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement de l'éditeur...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Aucune boutique trouvée</h1>
          <p className="text-muted-foreground mb-6">
            Vous devez d'abord créer une boutique pour accéder à l'éditeur.
          </p>
          <Button onClick={() => navigate('/creer-boutique-manuelle')}>
            Créer ma boutique
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/tableau-de-bord" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au dashboard
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{storeData.store_name}</h1>
              <p className="text-muted-foreground">Éditeur de boutique</p>
            </div>
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="ml-2">
                Modifications non sauvegardées
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handlePreviewStore}>
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/parametres/domaine')}>
              <Globe className="h-4 w-4 mr-2" />
              Domaine
            </Button>
            <Button size="sm" onClick={handlePublishStore}>
              Publier
            </Button>
          </div>
        </div>
      </div>

      {/* Onglets de configuration */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produits
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Livraison
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <StoreGeneralSettings 
            storeData={storeData}
            onDataChange={(newData) => {
              setStoreData({ ...storeData, ...newData });
              setHasUnsavedChanges(true);
            }}
          />
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <ThemeGallery 
            onThemeSelect={(theme) => {
              setBrandData(prev => ({
                ...prev,
                primary_color: theme.config.colors.primary,
                secondary_color: theme.config.colors.secondary
              }));
              setHasUnsavedChanges(true);
            }}
            selectedTheme={brandData.primary_color === '#000000' ? 'minimal' : undefined}
          />
          
          <StoreDesignSettings 
            brandData={brandData}
            onDataChange={(newData) => {
              setBrandData({ ...brandData, ...newData });
              // Don't set unsaved changes for auto-saved items (colors, slogan, logo)
              if (!newData.primary_color && !newData.secondary_color && !newData.slogan && !newData.logo_url) {
                setHasUnsavedChanges(true);
              }
            }}
          />
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <StoreProductsManager />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <StorePaymentSettings />
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <StoreShippingSettings />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <StoreAdvancedSettings 
            storeData={storeData}
            onDataChange={(newData) => {
              setStoreData({ ...storeData, ...newData });
              setHasUnsavedChanges(true);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Actions rapides flottantes */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Button size="sm" className="rounded-full shadow-lg">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}