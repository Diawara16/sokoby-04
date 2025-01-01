import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Recommendation {
  productId: string;
  score: number;
  reason: string;
}

export function ProductRecommendations({ customerId }: { customerId: string }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-recommendations", {
        body: { customerId }
      });

      if (error) throw error;

      setRecommendations(data.recommendations);
      toast({
        title: "Recommandations générées",
        description: "Les recommandations ont été générées avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la génération des recommandations:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération des recommandations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Charger les recommandations existantes
    const loadRecommendations = async () => {
      const { data, error } = await supabase
        .from("product_recommendations")
        .select("products")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Erreur lors du chargement des recommandations:", error);
        return;
      }

      if (data) {
        setRecommendations(data.products);
      }
    };

    loadRecommendations();
  }, [customerId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Recommandations Produits</span>
          <Button
            onClick={generateRecommendations}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? "Génération..." : "Générer"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold">Produit #{rec.productId}</div>
                <div className="text-sm text-gray-600">
                  Score: {(rec.score * 100).toFixed(1)}%
                </div>
                <div className="text-sm mt-1">{rec.reason}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Aucune recommandation disponible. Cliquez sur "Générer" pour créer des recommandations.
          </p>
        )}
      </CardContent>
    </Card>
  );
}