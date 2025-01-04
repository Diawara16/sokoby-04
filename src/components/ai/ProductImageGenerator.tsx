import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const ProductImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une description du produit",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: { prompt, description }
      });

      if (error) throw error;

      setGeneratedImage(data.imageUrl);
      toast({
        title: "Succès",
        description: "L'image a été générée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'image",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Générateur d'images IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Nom du produit"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mb-2"
            />
            <Textarea
              placeholder="Description détaillée du produit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={generateImage} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              "Générer l'image"
            )}
          </Button>

          {generatedImage && (
            <div className="mt-4">
              <img
                src={generatedImage}
                alt="Produit généré"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}