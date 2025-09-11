import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSettings } from "../hooks/useStoreSettings";

export const StoreBannerEditor = () => {
  const { settings, setSettings } = useStoreSettings();
  const [bannerUrl, setBannerUrl] = useState(settings?.banner_url || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive",
      });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const fileExt = file.name.split('.').pop();
      const fileName = `banner_${user.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('brand_assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('brand_assets')
        .getPublicUrl(fileName);

      setBannerUrl(publicUrl);
      
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from('store_settings')
        .update({ banner_url: bannerUrl || null })
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings({ ...settings, banner_url: bannerUrl || null });
      toast({
        title: "Succès",
        description: "Bannière mise à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la bannière",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBanner = () => {
    setBannerUrl("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bannière de la boutique</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Taille recommandée : 1920x400 pixels</Label>
        </div>

        {bannerUrl && (
          <div className="relative">
            <img
              src={bannerUrl}
              alt="Bannière de la boutique"
              className="w-full h-32 object-cover rounded-lg border"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemoveBanner}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div>
          <Label htmlFor="banner-url">URL de l'image</Label>
          <Input
            id="banner-url"
            placeholder="https://exemple.com/banniere.jpg"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="flex items-center gap-4">
          <div>
            <Label htmlFor="banner-upload" className="cursor-pointer">
              <Button
                variant="outline"
                disabled={isUploading}
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Téléchargement..." : "Télécharger une image"}
                </span>
              </Button>
            </Label>
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
          <span className="text-sm text-muted-foreground">ou</span>
        </div>

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </CardContent>
    </Card>
  );
};