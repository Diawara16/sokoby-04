import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useFavorites } from "@/hooks/useFavorites";
import { ProductReviews } from "@/components/reviews/ProductReviews";
import { VirtualTryOn } from "@/components/virtual-try-on/VirtualTryOn";
import { PreOrderButton } from "@/components/pre-orders/PreOrderButton";

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
  const { addToFavorites, removeFromFavorites, checkIsFavorite, loading: favoritesLoading } = useFavorites();
  const [favoriteStates, setFavoriteStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadFavoriteStates = async () => {
      const states: { [key: string]: boolean } = {};
      for (const product of products) {
        states[product.id] = await checkIsFavorite(product.id);
      }
      setFavoriteStates(states);
    };

    loadFavoriteStates();
  }, [products]);

  const handleAddToCart = (productId: string) => {
    if (onAddToCart) {
      onAddToCart(productId);
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre panier",
      });
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (favoritesLoading) return;

    const isFavorite = favoriteStates[productId];
    if (isFavorite) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
    setFavoriteStates(prev => ({
      ...prev,
      [productId]: !isFavorite
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 rounded-full ${
                favoriteStates[product.id] ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-600'
              }`}
              onClick={() => toggleFavorite(product.id)}
            >
              <Heart className={`w-5 h-5 ${favoriteStates[product.id] ? 'fill-current' : ''}`} />
            </Button>
          </div>
          <div className="p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-lg font-bold mt-2">{formatPrice(product.price)}</p>
            
            <div className="space-y-2 mt-4">
              <Button
                onClick={() => handleAddToCart(product.id)}
                className="w-full"
                variant="outline"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ajouter au panier
              </Button>
              
              <PreOrderButton productId={product.id} />
            </div>

            <div className="mt-4">
              <VirtualTryOn productId={product.id} />
            </div>
          </div>
          
          <div className="border-t p-4">
            <ProductReviews productId={product.id} />
          </div>
        </Card>
      ))}
    </div>
  );
};