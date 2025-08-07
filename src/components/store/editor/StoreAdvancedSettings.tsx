import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
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

interface Props {
  storeData: StoreData;
  onDataChange: (newData: Partial<StoreData>) => void;
}

export function StoreAdvancedSettings({ storeData, onDataChange }: Props) {
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [cookieConsentEnabled, setCookieConsentEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [customCss, setCustomCss] = useState("");
  const [customJs, setCustomJs] = useState("");
  
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      // Ici vous sauvegarderiez les paramètres avancés
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres avancés ont été mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres avancés",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Référencement (SEO)
          </CardTitle>
          <CardDescription>
            Optimisez votre boutique pour les moteurs de recherche
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo_title">Titre SEO</Label>
            <Input
              id="seo_title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Ma Boutique - Les meilleurs produits en ligne"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">
              {seoTitle.length}/60 caractères recommandés
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_description">Description SEO</Label>
            <Textarea
              id="seo_description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Découvrez notre sélection de produits de qualité avec livraison rapide..."
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">
              {seoDescription.length}/160 caractères recommandés
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_keywords">Mots-clés</Label>
            <Input
              id="seo_keywords"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="boutique en ligne, e-commerce, vente"
            />
            <p className="text-xs text-muted-foreground">
              Séparez les mots-clés par des virgules
            </p>
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
          <CardDescription>
            Configurez le suivi des performances de votre boutique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Google Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Suivez les visites et conversions de votre boutique
              </p>
            </div>
            <Switch
              checked={analyticsEnabled}
              onCheckedChange={setAnalyticsEnabled}
            />
          </div>

          {analyticsEnabled && (
            <div className="space-y-2">
              <Label htmlFor="ga_tracking_id">ID de suivi Google Analytics</Label>
              <Input
                id="ga_tracking_id"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Bandeau de cookies</Label>
              <p className="text-sm text-muted-foreground">
                Affiche un bandeau de consentement aux cookies (RGPD)
              </p>
            </div>
            <Switch
              checked={cookieConsentEnabled}
              onCheckedChange={setCookieConsentEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Domaine et SSL */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domaine personnalisé
          </CardTitle>
          <CardDescription>
            Configurez votre nom de domaine personnalisé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded">
                <ExternalLink className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Domaine actuel</h4>
                <p className="text-sm text-blue-700">
                  {storeData.domain_name ? `${storeData.domain_name}.sokoby.com` : 'Aucun domaine configuré'}
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Configurer un domaine personnalisé
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Certificat SSL</p>
                <p className="text-sm text-muted-foreground">Automatiquement activé</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">CDN Global</p>
                <p className="text-sm text-muted-foreground">Performances optimisées</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code personnalisé */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Code personnalisé
          </CardTitle>
          <CardDescription>
            Ajoutez du CSS et JavaScript personnalisé (utilisateurs avancés)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Attention : un code incorrect peut affecter le fonctionnement de votre boutique.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom_css">CSS personnalisé</Label>
            <Textarea
              id="custom_css"
              value={customCss}
              onChange={(e) => setCustomCss(e.target.value)}
              placeholder="/* Votre CSS personnalisé */
.mon-style {
  color: #333;
}"
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom_js">JavaScript personnalisé</Label>
            <Textarea
              id="custom_js"
              value={customJs}
              onChange={(e) => setCustomJs(e.target.value)}
              placeholder="// Votre JavaScript personnalisé
console.log('Ma boutique personnalisée');"
              rows={8}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Mode maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Maintenance
          </CardTitle>
          <CardDescription>
            Activez le mode maintenance pour effectuer des mises à jour
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Mode maintenance</Label>
              <p className="text-sm text-muted-foreground">
                Votre boutique affichera un message "Site en maintenance"
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>

          {maintenanceMode && (
            <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <p className="font-medium text-orange-900">Mode maintenance activé</p>
              </div>
              <p className="text-sm text-orange-700">
                Vos clients verront une page de maintenance. Seuls les administrateurs peuvent accéder à la boutique.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <Button onClick={handleSave} className="w-full md:w-auto">
        Sauvegarder les paramètres avancés
      </Button>
    </div>
  );
}