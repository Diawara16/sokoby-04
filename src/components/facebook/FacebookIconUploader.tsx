import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function FacebookIconUploader() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateImage = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const isValid = img.width === 1024 && img.height === 1024;
        if (!isValid) {
          setError(`L'image doit être exactement de 1024x1024 pixels. Dimensions actuelles: ${img.width}x${img.height}`);
        } else {
          setError(null);
        }
        resolve(isValid);
      };
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive",
      });
      return;
    }

    // Valider la taille du fichier
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError("La taille du fichier ne doit pas dépasser 5MB");
      return;
    }

    // Valider les dimensions
    const isValidDimensions = await validateImage(file);
    if (!isValidDimensions) {
      return;
    }

    setIsLoading(true);
    try {
      // Upload original logo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("brand_assets")
        .upload("logo.png", file);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from("brand_assets")
        .getPublicUrl(uploadData.path);

      // Call the resize function
      const { data, error } = await supabase.functions
        .invoke("resize-logo", {
          body: { imageUrl: publicUrl }
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'icône a été redimensionnée avec succès",
      });

      // Ouvrir l'URL de l'image redimensionnée dans un nouvel onglet
      window.open(data.url, '_blank');
      
    } catch (error: any) {
      console.error("Erreur lors du redimensionnement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de redimensionner l'image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          L'image doit être au format JPG, PNG ou GIF et faire exactement 1024x1024 pixels. 
          Taille maximale : 5MB.
        </p>
        <Input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isLoading}
        />
      </div>
      {isLoading && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Redimensionnement en cours...</span>
        </div>
      )}
    </div>
  );
}