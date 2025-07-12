import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload } from "lucide-react";

export function VirtualTryOn({ productId }: { productId: string }) {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserImage(file);
    }
  };

  const generateVirtualTryOn = async () => {
    if (!userImage) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord télécharger une photo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Upload user image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("virtual-try-ons")
        .upload(`${Date.now()}-${userImage.name}`, userImage);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from("virtual-try-ons")
        .getPublicUrl(uploadData.path);

      // Generate AI image using edge function
      const { data: aiData, error: aiError } = await supabase.functions
        .invoke("generate-virtual-try-on", {
          body: { userImageUrl: publicUrl, productId }
        });

      if (aiError) throw aiError;

      // Save the result to the database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: dbError } = await supabase
        .from("virtual_try_ons")
        .insert({
          product_id: productId,
          user_image: publicUrl,
          generated_image: aiData.generatedImageUrl,
          user_id: user.id
        });

      if (dbError) throw dbError;

      setGeneratedImage(aiData.generatedImageUrl);
      toast({
        title: "Succès",
        description: "L'image a été générée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'essayage virtuel",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Essayage Virtuel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="cursor-pointer"
          />
          <Button
            onClick={generateVirtualTryOn}
            disabled={!userImage || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Générer l'essayage virtuel
              </>
            )}
          </Button>
        </div>

        {generatedImage && (
          <div className="mt-4">
            <img
              src={generatedImage}
              alt="Essayage virtuel"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}