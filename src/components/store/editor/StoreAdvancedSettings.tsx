import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAutosave } from "@/hooks/useAutosave";
import { AutosaveIndicator } from "./AutosaveIndicator";
import {
  Settings,
  Search,
  BarChart3,
  Shield,
  Globe,
  Code,
  AlertTriangle,
  ExternalLink
} from "lucide-react";

interface StoreData {
  id: string;
  store_name: string;
  store_description?: string;
  domain_name?: string;
}

interface AdvancedData {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  analytics_enabled: boolean;
  ga_tracking_id: string;
  cookie_consent_enabled: boolean;
  maintenance_mode: boolean;
  custom_css: string;
  custom_js: string;
}

interface Props {
  storeData: StoreData;
  onDataChange: (newData: Partial<StoreData>) => void;
}

export function StoreAdvancedSettings({ storeData, onDataChange }: Props) {
  const [data, setData] = useState<AdvancedData>({
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    analytics_enabled: false,
    ga_tracking_id: "",
    cookie_consent_enabled: true,
    maintenance_mode: false,
    custom_css: "",
    custom_js: "",
  });
  const [loaded, setLoaded] = useState(false);

  // Load from DB on mount
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: store } = await supabase
          .from("store_settings")
          .select("seo_title, seo_description, seo_keywords, analytics_enabled, ga_tracking_id, cookie_consent_enabled, maintenance_mode, custom_css, custom_js")
          .eq("user_id", user.id)
          .maybeSingle();

        if (store) {
          setData({
            seo_title: (store as any).seo_title || "",
            seo_description: (store as any).seo_description || "",
            seo_keywords: (store as any).seo_keywords || "",
            analytics_enabled: (store as any).analytics_enabled || false,
            ga_tracking_id: (store as any).ga_tracking_id || "",
            cookie_consent_enabled: (store as any).cookie_consent_enabled ?? true,
            maintenance_mode: (store as any).maintenance_mode || false,
            custom_css: (store as any).custom_css || "",
            custom_js: (store as any).custom_js || "",
          });
        }
      } catch (err) {
        console.error("Failed to load advanced settings:", err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const saveToDb = useCallback(async (saveData: AdvancedData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from("store_settings")
      .update({
        seo_title: saveData.seo_title || null,
        seo_description: saveData.seo_description || null,
        seo_keywords: saveData.seo_keywords || null,
        analytics_enabled: saveData.analytics_enabled,
        ga_tracking_id: saveData.ga_tracking_id || null,
        cookie_consent_enabled: saveData.cookie_consent_enabled,
        maintenance_mode: saveData.maintenance_mode,
        custom_css: saveData.custom_css || null,
        custom_js: saveData.custom_js || null,
        updated_at: new Date().toISOString(),
      } as any)
      .eq("user_id", user.id);

    return !error;
  }, []);

  const { status, debouncedSave } = useAutosave({ onSave: saveToDb });

  const update = (patch: Partial<AdvancedData>) => {
    const next = { ...data, ...patch };
    setData(next);
    if (loaded) debouncedSave(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Paramètres avancés</h2>
        <AutosaveIndicator status={status} />
      </div>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Référencement (SEO)
          </CardTitle>
          <CardDescription>Optimisez votre boutique pour les moteurs de recherche</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo_title">Titre SEO</Label>
            <Input
              id="seo_title"
              value={data.seo_title}
              onChange={(e) => update({ seo_title: e.target.value })}
              placeholder="Ma Boutique - Les meilleurs produits en ligne"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">{data.seo_title.length}/60 caractères recommandés</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo_description">Description SEO</Label>
            <Textarea
              id="seo_description"
              value={data.seo_description}
              onChange={(e) => update({ seo_description: e.target.value })}
              placeholder="Découvrez notre sélection de produits de qualité avec livraison rapide..."
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">{data.seo_description.length}/160 caractères recommandés</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo_keywords">Mots-clés</Label>
            <Input
              id="seo_keywords"
              value={data.seo_keywords}
              onChange={(e) => update({ seo_keywords: e.target.value })}
              placeholder="boutique en ligne, e-commerce, vente"
            />
            <p className="text-xs text-muted-foreground">Séparez les mots-clés par des virgules</p>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics et suivi
          </CardTitle>
          <CardDescription>Configurez le suivi des performances de votre boutique</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Google Analytics</Label>
              <p className="text-sm text-muted-foreground">Suivez les visites et conversions de votre boutique</p>
            </div>
            <Switch checked={data.analytics_enabled} onCheckedChange={(v) => update({ analytics_enabled: v })} />
          </div>
          {data.analytics_enabled && (
            <div className="space-y-2">
              <Label htmlFor="ga_tracking_id">ID de suivi Google Analytics</Label>
              <Input id="ga_tracking_id" placeholder="G-XXXXXXXXXX" value={data.ga_tracking_id} onChange={(e) => update({ ga_tracking_id: e.target.value })} />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Bandeau de cookies</Label>
              <p className="text-sm text-muted-foreground">Affiche un bandeau de consentement aux cookies (RGPD)</p>
            </div>
            <Switch checked={data.cookie_consent_enabled} onCheckedChange={(v) => update({ cookie_consent_enabled: v })} />
          </div>
        </CardContent>
      </Card>

      {/* Domain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Domaine personnalisé</CardTitle>
          <CardDescription>Configurez votre nom de domaine personnalisé</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded"><ExternalLink className="h-4 w-4 text-blue-600" /></div>
              <div>
                <h4 className="font-medium text-blue-900">Domaine actuel</h4>
                <p className="text-sm text-blue-700">{storeData.domain_name ? `${storeData.domain_name}.sokoby.com` : "Aucun domaine configuré"}</p>
                <Button variant="outline" size="sm" className="mt-2">Configurer un domaine personnalisé</Button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 border rounded-lg"><Shield className="h-5 w-5 text-green-600" /><div><p className="font-medium">Certificat SSL</p><p className="text-sm text-muted-foreground">Automatiquement activé</p></div></div>
            <div className="flex items-center gap-3 p-3 border rounded-lg"><Shield className="h-5 w-5 text-green-600" /><div><p className="font-medium">CDN Global</p><p className="text-sm text-muted-foreground">Performances optimisées</p></div></div>
          </div>
        </CardContent>
      </Card>

      {/* Custom code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Code className="h-5 w-5" />Code personnalisé</CardTitle>
          <CardDescription>Ajoutez du CSS et JavaScript personnalisé (utilisateurs avancés)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">Attention : un code incorrect peut affecter le fonctionnement de votre boutique.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom_css">CSS personnalisé</Label>
            <Textarea id="custom_css" value={data.custom_css} onChange={(e) => update({ custom_css: e.target.value })} placeholder="/* Votre CSS personnalisé */ .mon-style { color: #333; }" rows={8} className="font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom_js">JavaScript personnalisé</Label>
            <Textarea id="custom_js" value={data.custom_js} onChange={(e) => update({ custom_js: e.target.value })} placeholder="// Votre JavaScript personnalisé console.log('Ma boutique personnalisée');" rows={8} className="font-mono text-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Maintenance</CardTitle>
          <CardDescription>Activez le mode maintenance pour effectuer des mises à jour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Mode maintenance</Label>
              <p className="text-sm text-muted-foreground">Votre boutique affichera un message "Site en maintenance"</p>
            </div>
            <Switch checked={data.maintenance_mode} onCheckedChange={(v) => update({ maintenance_mode: v })} />
          </div>
          {data.maintenance_mode && (
            <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-orange-600" /><p className="font-medium text-orange-900">Mode maintenance activé</p></div>
              <p className="text-sm text-orange-700">Vos clients verront une page de maintenance. Seuls les administrateurs peuvent accéder à la boutique.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
