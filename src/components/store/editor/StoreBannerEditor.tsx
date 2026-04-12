import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSettings } from "../hooks/useStoreSettings";
import { useAutosave } from "@/hooks/useAutosave";
import { AutosaveIndicator } from "./AutosaveIndicator";

export const StoreBannerEditor = () => {
  const { settings, setSettings } = useStoreSettings();
  const [bannerUrl, setBannerUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Sync local state when settings load asynchronously
  useEffect(() => {
    if (settings?.banner_url != null) {
      setBannerUrl(settings.banner_url);
    }
  }, [settings?.banner_url]);

  const saveToDb = useCallback(async (url: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !settings) return false;
    const { error } = await supabase
      .from("store_settings")
      .update({ banner_url: url || null })
      .eq("user_id", user.id);
    if (!error) {
      setSettings({ ...settings, banner_url: url || null });
    }
    return !error;
  }, [settings, setSettings]);

  const { status, debouncedSave, saveNow } = useAutosave({ onSave: saveToDb });

  const handleUrlChange = (value: string) => {
    setBannerUrl(value);
    debouncedSave(value);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une image", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erreur", description: "L'image ne doit pas dépasser 5MB", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const fileExt = file.name.split('.').pop();
      const fileName = `banner_${user.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('brand_assets').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('brand_assets').getPublicUrl(fileName);
      setBannerUrl(publicUrl);
      saveNow(publicUrl);
    } catch {
      toast({ title: "Erreur", description: "Impossible de télécharger l'image", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveBanner = () => {
    setBannerUrl("");
    saveNow("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Bannière de la boutique</CardTitle>
          <AutosaveIndicator status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div><Label>Taille recommandée : 1920x400 pixels</Label></div>

        {bannerUrl && (
          <div className="relative">
            <img src={bannerUrl} alt="Bannière de la boutique" className="w-full h-32 object-cover rounded-lg border" />
            <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={handleRemoveBanner}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div>
          <Label htmlFor="banner-url">URL de l'image</Label>
          <Input id="banner-url" placeholder="https://exemple.com/banniere.jpg" value={bannerUrl} onChange={(e) => handleUrlChange(e.target.value)} className="mt-2" />
        </div>

        <div className="flex items-center gap-4">
          <div>
            <Label htmlFor="banner-upload" className="cursor-pointer">
              <Button variant="outline" disabled={isUploading} asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Téléchargement..." : "Télécharger une image"}
                </span>
              </Button>
            </Label>
            <input id="banner-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
          <span className="text-sm text-muted-foreground">ou</span>
        </div>
      </CardContent>
    </Card>
  );
};
