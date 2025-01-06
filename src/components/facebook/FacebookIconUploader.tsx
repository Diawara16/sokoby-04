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

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error("Impossible de créer le contexte canvas"));
          return;
        }

        // Remplir le fond en blanc
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculer les dimensions pour conserver le ratio
        const scale = Math.min(1024 / img.width, 1024 / img.height);
        const x = (1024 - img.width * scale) / 2;
        const y = (1024 - img.height * scale) / 2;

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Échec de la conversion en blob"));
          }
        }, 'image/png');
      };
      img.onerror = () => reject(new Error("Erreur lors du chargement de l'image"));
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

    setIsLoading(true);
    try {
      // Redimensionner l'image
      const resizedBlob = await resizeImage(file);
      const resizedFile = new File([resizedBlob], file.name, { type: 'image/png' });

      // Upload du logo redimensionné
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("brand_assets")
        .upload("facebook-icon.png", resizedFile, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from("brand_assets")
        .getPublicUrl("facebook-icon.png");

      toast({
        title: "Succès",
        description: "L'icône a été redimensionnée et téléchargée avec succès",
      });

      // Ouvrir l'URL de l'image redimensionnée dans un nouvel onglet
      window.open(publicUrl, '_blank');
      
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
          Sélectionnez une image au format JPG, PNG ou GIF. Elle sera automatiquement redimensionnée à 1024x1024 pixels.
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