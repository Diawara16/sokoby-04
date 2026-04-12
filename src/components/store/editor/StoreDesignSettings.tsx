import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { useAutosave } from "@/hooks/useAutosave";
import { AutosaveIndicator } from "./AutosaveIndicator";
import { Upload, Palette, Type, Image } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { uploadLogo, fetchBrandSettings } = useBrandSettings();

  const saveToDb = useCallback(async (data: Partial<BrandData>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const existing = await fetchBrandSettings();
    let error;
    if (existing?.id) {
      const result = await supabase.from("brand_settings").update({
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        logo_url: data.logo_url,
        slogan: data.slogan,
        updated_at: new Date().toISOString(),
      }).eq("id", existing.id);
      error = result.error;
    } else {
      const result = await supabase.from("brand_settings").insert({
        user_id: user.id,
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        logo_url: data.logo_url,
        slogan: data.slogan,
      });
      error = result.error;
    }
    return !error;
  }, [fetchBrandSettings]);

  const { status, debouncedSave } = useAutosave({ onSave: saveToDb, debounceMs: 1000 });

  // Trigger autosave when brand data changes
  useEffect(() => {
    if (brandData.primary_color || brandData.secondary_color || brandData.slogan) {
      debouncedSave(brandData);
    }
  }, [brandData.primary_color, brandData.secondary_color, brandData.slogan, debouncedSave]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un fichier image", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const logoUrl = await uploadLogo(file);
      if (logoUrl) {
        const freshData = await fetchBrandSettings();
        if (freshData) {
          onDataChange({
            primary_color: freshData.primary_color || undefined,
            secondary_color: freshData.secondary_color || undefined,
            logo_url: freshData.logo_url || undefined,
            slogan: freshData.slogan || undefined,
          });
        }
        window.dispatchEvent(new CustomEvent('logo-updated'));
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Design</h2>
        <AutosaveIndicator status={status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Image className="h-5 w-5" />Logo et Identité</CardTitle>
            <CardDescription>Personnalisez l'apparence de votre marque</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logo de la boutique</Label>
              <div className="flex items-center gap-4">
                {brandData.logo_url ? (
                  <div className="w-20 h-20 border rounded-lg overflow-hidden bg-muted">
                    <img src={brandData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 border rounded-lg flex items-center justify-center bg-muted">
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Upload..." : "Télécharger"}
                  </Button>
                  <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 2MB</p>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slogan" className="flex items-center gap-2"><Type className="h-4 w-4" />Slogan</Label>
              <Textarea id="slogan" value={brandData.slogan || ""} onChange={(e) => onDataChange({ slogan: e.target.value })} placeholder="Votre slogan accrocheur..." rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Couleurs du thème</CardTitle>
            <CardDescription>Choisissez les couleurs de votre boutique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Couleur principale</Label>
              <div className="flex items-center gap-2">
                <Input type="color" value={brandData.primary_color || "#3b82f6"} onChange={(e) => onDataChange({ primary_color: e.target.value })} className="w-16 h-10 p-1 rounded" />
                <Input value={brandData.primary_color || "#3b82f6"} onChange={(e) => onDataChange({ primary_color: e.target.value })} placeholder="#3b82f6" className="flex-1" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Couleur secondaire</Label>
              <div className="flex items-center gap-2">
                <Input type="color" value={brandData.secondary_color || "#64748b"} onChange={(e) => onDataChange({ secondary_color: e.target.value })} className="w-16 h-10 p-1 rounded" />
                <Input value={brandData.secondary_color || "#64748b"} onChange={(e) => onDataChange({ secondary_color: e.target.value })} placeholder="#64748b" className="flex-1" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Couleurs prédéfinies</Label>
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map((c) => (
                  <Button key={c.color} variant="outline" size="sm" className="h-10 p-1" onClick={() => onDataChange({ primary_color: c.color })}>
                    <div className="w-full h-full rounded" style={{ backgroundColor: c.color }} />
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Aperçu</Label>
              <div className="border rounded-lg p-4 text-center text-white" style={{ backgroundColor: brandData.primary_color || "#3b82f6", border: `2px solid ${brandData.secondary_color || "#64748b"}` }}>
                <p className="font-medium">Ma Boutique</p>
                <p className="text-sm opacity-90">{brandData.slogan || "Votre slogan ici"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
