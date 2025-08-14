import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { Save, Upload, Palette, Type, Image, Check } from "lucide-react";

interface BrandData {
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  slogan?: string;
}

interface Props {
  brandData: BrandData;
  onDataChange: (newData: Partial<BrandData>) => void;
}

export function StoreDesignSettings({ brandData, onDataChange }: Props) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { uploadLogo, autoSave, fetchBrandSettings } = useBrandSettings();

  // Auto-save avec debounce pour les couleurs et slogan
  const debouncedAutoSave = useCallback(
    debounce(async (data: Partial<BrandData>) => {
      setAutoSaving(true);
      const success = await autoSave(data);
      if (success) {
        setLastSaved(new Date());
      }
      setAutoSaving(false);
    }, 1000),
    [autoSave]
  );

  // Function debounce helper
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Reload brand data from database
  const reloadBrandData = async () => {
    try {
      const freshData = await fetchBrandSettings();
      if (freshData) {
        onDataChange(freshData);
      }
    } catch (error) {
      console.error('Error reloading brand data:', error);
    }
  };

  // Auto-save when colors or slogan change
  useEffect(() => {
    if (brandData.primary_color || brandData.secondary_color || brandData.slogan) {
      debouncedAutoSave({
        primary_color: brandData.primary_color,
        secondary_color: brandData.secondary_color,
        slogan: brandData.slogan,
      });
    }
  }, [brandData.primary_color, brandData.secondary_color, brandData.slogan, debouncedAutoSave]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour sauvegarder le design",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('brand_settings')
        .upsert({
          user_id: user.id,
          primary_color: brandData.primary_color,
          secondary_color: brandData.secondary_color,
          logo_url: brandData.logo_url,
          slogan: brandData.slogan,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: "Design sauvegardé",
        description: "Les paramètres de design ont été mis à jour avec succès",
      });

    } catch (error) {
      console.error('Error saving brand settings:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder le design",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const logoUrl = await uploadLogo(file);
      if (logoUrl) {
        // Reload all brand data to ensure consistency
        await reloadBrandData();
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
    } finally {
      setUploading(false);
    }
  };

  const predefinedColors = [
    { name: "Bleu", color: "#3b82f6" },
    { name: "Violet", color: "#8b5cf6" },
    { name: "Rose", color: "#ec4899" },
    { name: "Vert", color: "#10b981" },
    { name: "Orange", color: "#f59e0b" },
    { name: "Rouge", color: "#ef4444" },
    { name: "Indigo", color: "#6366f1" },
    { name: "Cyan", color: "#06b6d4" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Logo et Marque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Logo et Identité
          </CardTitle>
          <CardDescription>
            Personnalisez l'apparence de votre marque
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo de la boutique</Label>
            <div className="flex items-center gap-4">
              {brandData.logo_url ? (
                <div className="w-20 h-20 border rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={brandData.logo_url} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 border rounded-lg flex items-center justify-center bg-muted">
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Upload..." : "Télécharger"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG jusqu'à 2MB
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slogan" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Slogan
            </Label>
            <Textarea
              id="slogan"
              value={brandData.slogan || ""}
              onChange={(e) => onDataChange({ slogan: e.target.value })}
              placeholder="Votre slogan accrocheur..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Couleurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Couleurs du thème
          </CardTitle>
          <CardDescription>
            Choisissez les couleurs de votre boutique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary_color">Couleur principale</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={brandData.primary_color || "#3b82f6"}
                onChange={(e) => onDataChange({ primary_color: e.target.value })}
                className="w-16 h-10 p-1 rounded"
              />
              <Input
                value={brandData.primary_color || "#3b82f6"}
                onChange={(e) => onDataChange({ primary_color: e.target.value })}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary_color">Couleur secondaire</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={brandData.secondary_color || "#64748b"}
                onChange={(e) => onDataChange({ secondary_color: e.target.value })}
                className="w-16 h-10 p-1 rounded"
              />
              <Input
                value={brandData.secondary_color || "#64748b"}
                onChange={(e) => onDataChange({ secondary_color: e.target.value })}
                placeholder="#64748b"
                className="flex-1"
              />
            </div>
          </div>

          {/* Couleurs prédéfinies */}
          <div className="space-y-2">
            <Label>Couleurs prédéfinies</Label>
            <div className="grid grid-cols-4 gap-2">
              {predefinedColors.map((colorOption) => (
                <Button
                  key={colorOption.color}
                  variant="outline"
                  size="sm"
                  className="h-10 p-1"
                  onClick={() => onDataChange({ primary_color: colorOption.color })}
                >
                  <div 
                    className="w-full h-full rounded"
                    style={{ backgroundColor: colorOption.color }}
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* Aperçu */}
          <div className="space-y-2">
            <Label>Aperçu</Label>
            <div 
              className="border rounded-lg p-4 text-center text-white"
              style={{ 
                backgroundColor: brandData.primary_color || "#3b82f6",
                border: `2px solid ${brandData.secondary_color || "#64748b"}`
              }}
            >
              <p className="font-medium">Ma Boutique</p>
              <p className="text-sm opacity-90">{brandData.slogan || "Votre slogan ici"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicateurs de sauvegarde et bouton */}
      <div className="md:col-span-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {autoSaving && (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              <span>Sauvegarde automatique...</span>
            </>
          )}
          {lastSaved && !autoSaving && (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span>Sauvegardé à {lastSaved.toLocaleTimeString()}</span>
            </>
          )}
        </div>
        
        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Sauvegarde..." : "Sauvegarder le design"}
        </Button>
      </div>
    </div>
  );
}