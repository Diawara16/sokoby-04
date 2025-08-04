import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function CreateFlashSale() {
  const [productId, setProductId] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price");
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !discountPercent || !startTime || !endTime) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const selectedProduct = products?.find(p => p.id === productId);
    if (!selectedProduct) return;

    const discount = Number(discountPercent);
    const originalPrice = selectedProduct.price;
    const salePrice = originalPrice * (1 - discount / 100);

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("flash_sales")
        .insert([
          {
            product_id: productId,
            discount_percent: discount,
            original_price: originalPrice,
            sale_price: salePrice,
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            user_id: user.id
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La vente flash a été créée avec succès",
      });

      // Reset form
      setProductId("");
      setDiscountPercent("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error creating flash sale:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la vente flash",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une vente flash</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Produit</label>
            <Select
              value={productId}
              onValueChange={setProductId}
              disabled={isLoadingProducts}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un produit" />
              </SelectTrigger>
              <SelectContent>
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {product.price}€
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Réduction (%)</label>
            <Input
              type="number"
              min="1"
              max="99"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="Ex: 30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date de début</label>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date de fin</label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer la vente flash"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}