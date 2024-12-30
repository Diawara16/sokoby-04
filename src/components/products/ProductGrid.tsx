import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category?: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
}

export const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  const { toast } = useToast();

  const handleAddToCart = (productId: string) => {
    if (onAddToCart) {
      onAddToCart(productId);
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre panier",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="aspect-square relative">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-lg font-bold mt-2">{product.price}€</p>
            <Button
              onClick={() => handleAddToCart(product.id)}
              className="w-full mt-4"
              variant="outline"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ajouter au panier
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};