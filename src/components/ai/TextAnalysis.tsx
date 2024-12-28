import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function TextAnalysis() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer du texte à analyser",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-text-analysis', {
        body: { text }
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Analyse terminée",
        description: "Le texte a été analysé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'analyse",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Analyse de Sentiment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Entrez votre texte ici..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={analyzeText} 
          disabled={isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? "Analyse en cours..." : "Analyser le texte"}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Résultats de l'analyse :</h3>
            <p>Sentiment : {result.sentiment}</p>
            <p>Score : {result.score}</p>
            <p>Confiance : {(result.confidence * 100).toFixed(2)}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}