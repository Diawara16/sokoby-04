import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const PriceOptimizer = () => {
  const { data: optimizations, isLoading } = useQuery({
    queryKey: ['price-optimizations'],
    queryFn: async () => {
      const { data: products } = await supabase
        .from('ai_generated_products')
        .select('price')
        .order('created_at', { ascending: false })
        .limit(10);

      // Simuler des optimisations basées sur les données
      return {
        suggestions: [
          { category: "Produits tendance", current: "29.99€", suggested: "34.99€", growth: "+16%" },
          { category: "Produits classiques", current: "49.99€", suggested: "44.99€", growth: "-10%" },
          { category: "Nouveautés", current: "19.99€", suggested: "24.99€", growth: "+25%" }
        ]
      };
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Optimisation des prix
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {optimizations?.suggestions.map((opt, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div>
                  <h3 className="font-medium">{opt.category}</h3>
                  <p className="text-sm text-muted-foreground">Prix actuel: {opt.current}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">{opt.suggested}</p>
                  <p className={`text-sm ${opt.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {opt.growth}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}