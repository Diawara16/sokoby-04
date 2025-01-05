import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const TwitterTest = () => {
  const [tweet, setTweet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('test-twitter', {
        body: { text: tweet }
      });

      if (error) throw error;

      console.log("Réponse Twitter:", data);
      
      toast({
        title: "Tweet envoyé avec succès !",
        description: "L'intégration Twitter fonctionne correctement.",
      });
      
      setTweet("");
    } catch (error: any) {
      console.error("Erreur lors de l'envoi du tweet:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi du tweet.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Test de l'intégration Twitter</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            placeholder="Écrivez votre tweet ici..."
            maxLength={280}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            {tweet.length}/280 caractères
          </p>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || tweet.length === 0}
          className="w-full"
        >
          {isLoading ? "Envoi en cours..." : "Envoyer le tweet"}
        </Button>
      </form>
    </div>
  );
};