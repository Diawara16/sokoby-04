import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Store, Settings, Palette, Package, CreditCard, Truck, Eye, Globe, Plus, Loader2, Check, Copy, ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

import { StoreGeneralSettings } from "@/components/store/editor/StoreGeneralSettings";
import { StoreDesignSettings } from "@/components/store/editor/StoreDesignSettings";
import { StoreProductsManager } from "@/components/store/editor/StoreProductsManager";
import { StorePaymentSettings } from "@/components/store/editor/StorePaymentSettings";
import { StoreShippingSettings } from "@/components/store/editor/StoreShippingSettings";
import { StoreAdvancedSettings } from "@/components/store/editor/StoreAdvancedSettings";
import { StoreAboutSettings } from "@/components/store/editor/StoreAboutSettings";
import { StoreTestimonialsManager } from "@/components/store/editor/StoreTestimonialsManager";
import { StoreLanguageSettings } from "@/components/store/editor/StoreLanguageSettings";
import { StoreBannerEditor } from "@/components/store/editor/StoreBannerEditor";
import { StoreFooterManager } from "@/components/store/editor/StoreFooterManager";
import { StorePoliciesEditor } from "@/components/store/editor/StorePoliciesEditor";
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
  const [publishing, setPublishing] = useState(false);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [brandData, setBrandData] = useState<BrandData>({});

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialTab = () => {
    const urlTab = searchParams.get("tab");
    const validTabs = ["general", "about", "testimonials", "languages", "banner", "footer", "policies", "design", "products", "payments", "shipping", "settings"];
    if (urlTab && validTabs.includes(urlTab)) return urlTab;
    const saved = localStorage.getItem("storeEditor_activeTab");
    return saved && validTabs.includes(saved) ? saved : "general";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    localStorage.setItem("storeEditor_activeTab", tab);
  };

  useEffect(() => { loadStoreData(); }, []);

  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && urlTab !== activeTab) setActiveTab(urlTab);
  }, [searchParams]);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Vous devez être connecté"); navigate("/connexion"); return; }

      const { data: store, error: storeError } = await supabase
        .from("store_settings").select("*").eq("user_id", user.id).maybeSingle();
      if (storeError) throw storeError;

      const { data: brand } = await supabase
        .from("brand_settings").select("*").eq("user_id", user.id).maybeSingle();

      if (!store) {
        const { data: newStore, error: createError } = await supabase
          .from("store_settings")
          .insert({ user_id: user.id, store_name: "Ma Boutique", store_email: user.email, is_custom_domain: false })
          .select().single();
        if (createError) throw createError;
        setStoreData(newStore);
      } else {
        setStoreData(store);
      }
      setBrandData(brand || {});
    } catch (error) {
      console.error("Error loading store data:", error);
      toast.error("Impossible de charger les données de la boutique");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewStore = () => {
    if (!storeData) return;
    window.open(`/boutique-apercu/${storeData.id}`, "_blank");
  };

  const handlePublishStore = async () => {
    if (!storeData) return;
    setPublishing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");

      const { error } = await supabase
        .from("store_settings")
        .update({
          published_at: new Date().toISOString(),
          store_status: "active",
          updated_at: new Date().toISOString(),
        } as any)
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Boutique publiée avec succès !");
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Impossible de publier la boutique");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement de l'éditeur...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Aucune boutique trouvée</h1>
        <p className="text-muted-foreground mb-6">Vous devez d'abord créer une boutique.</p>
        <Button onClick={() => navigate("/creer-boutique-manuelle")}>Créer ma boutique</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Link to="/tableau-de-bord" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />Retour au dashboard
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
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handlePreviewStore}>
              <Eye className="h-4 w-4 mr-2" />Aperçu
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/parametres/domaine")}>
              <Globe className="h-4 w-4 mr-2" />Domaine
            </Button>
            <Button size="sm" onClick={handlePublishStore} disabled={publishing}>
              {publishing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {publishing ? "Publication…" : "Publier"}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-12 gap-1">
          <TabsTrigger value="general" className="flex items-center gap-1 text-xs"><Settings className="h-3 w-3" />Général</TabsTrigger>
          <TabsTrigger value="about" className="text-xs">À propos</TabsTrigger>
          <TabsTrigger value="testimonials" className="text-xs">Témoignages</TabsTrigger>
          <TabsTrigger value="languages" className="text-xs">Langues</TabsTrigger>
          <TabsTrigger value="banner" className="text-xs">Bannière</TabsTrigger>
          <TabsTrigger value="footer" className="text-xs">Footer</TabsTrigger>
          <TabsTrigger value="policies" className="text-xs">Sections</TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-1 text-xs"><Palette className="h-3 w-3" />Design</TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-1 text-xs"><Package className="h-3 w-3" />Produits</TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-1 text-xs"><CreditCard className="h-3 w-3" />Paiements</TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-1 text-xs"><Truck className="h-3 w-3" />Livraison</TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1 text-xs"><Settings className="h-3 w-3" />Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="general"><StoreGeneralSettings storeData={storeData} onDataChange={(d) => setStoreData({ ...storeData, ...d })} /></TabsContent>
        <TabsContent value="about"><StoreAboutSettings /></TabsContent>
        <TabsContent value="testimonials"><StoreTestimonialsManager /></TabsContent>
        <TabsContent value="languages"><StoreLanguageSettings /></TabsContent>
        <TabsContent value="banner"><StoreBannerEditor /></TabsContent>
        <TabsContent value="footer"><StoreFooterManager /></TabsContent>
        <TabsContent value="policies"><StorePoliciesEditor /></TabsContent>
        <TabsContent value="design">
          <ThemeGallery
            onThemeSelect={(theme) => {
              setBrandData((prev) => ({ ...prev, primary_color: theme.config.colors.primary, secondary_color: theme.config.colors.secondary }));
            }}
            selectedTheme={brandData.primary_color === "#000000" ? "minimal" : undefined}
          />
          <StoreDesignSettings brandData={brandData} onDataChange={(d) => setBrandData({ ...brandData, ...d })} />
        </TabsContent>
        <TabsContent value="products"><StoreProductsManager /></TabsContent>
        <TabsContent value="payments"><StorePaymentSettings /></TabsContent>
        <TabsContent value="shipping"><StoreShippingSettings /></TabsContent>
        <TabsContent value="settings"><StoreAdvancedSettings storeData={storeData} onDataChange={(d) => setStoreData({ ...storeData, ...d })} /></TabsContent>
      </Tabs>
    </div>
  );
}
