import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const VendorAssistant = () => {
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['vendor-suggestions'],
    queryFn: async () => {
      const { data: products } = await supabase
        .from('ai_generated_products')
        .select('name, price, description')
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        pricing: "Optimisez vos prix en fonction des tendances du marché",
        marketing: "Créez des campagnes marketing ciblées",
        inventory: "Gérez votre inventaire efficacement",
        suggestions: products || []
      };
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Assistant IA pour vendeurs
          <Sparkles className="h-4 w-4 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-muted">
                <h3 className="font-medium mb-2">Prix optimisés</h3>
                <p className="text-sm text-muted-foreground">{suggestions?.pricing}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <h3 className="font-medium mb-2">Marketing</h3>
                <p className="text-sm text-muted-foreground">{suggestions?.marketing}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Suggestions de produits</h3>
              <div className="space-y-3">
                {suggestions?.suggestions.map((product: any, index: number) => (
                  <div key={index} className="p-3 rounded-lg bg-accent/10">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {product.description}
                    </div>
                    <div className="text-sm font-medium text-primary mt-2">
                      Prix suggéré: {product.price}€
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}