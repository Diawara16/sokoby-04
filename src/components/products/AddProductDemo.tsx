import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

const demoProducts = [
  { 
    name: "T-shirt Basique", 
    description: "T-shirt en coton bio, coupe classique", 
    price: 29.99, 
    category: "Mode",
    stock: 50 
  },
  { 
    name: "Sneakers Tendance", 
    description: "Baskets urbaines design moderne", 
    price: 89.99, 
    category: "Mode",
    stock: 25 
  },
  { 
    name: "Casque Bluetooth", 
    description: "Casque sans fil haute qualité", 
    price: 79.99, 
    category: "Électronique",
    stock: 15 
  },
  { 
    name: "Carnet de Notes", 
    description: "Carnet recyclé format A5", 
    price: 12.99, 
    category: "Papeterie",
    stock: 100 
  },
  { 
    name: "Bouteille Isotherme", 
    description: "Bouteille inox 500ml", 
    price: 24.99, 
    category: "Accessoires",
    stock: 30 
  }
];

export function AddProductDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddDemoProducts = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter des produits",
          variant: "destructive"
        });
        return;
      }

      const productsToInsert = demoProducts.map(product => ({
        ...product,
        user_id: user.id,
        status: 'active'
      }));

      const { error } = await supabase
        .from('products')
        .insert(productsToInsert);

      if (error) {
        throw error;
      }

      toast({
        title: "Produits ajoutés !",
        description: `${demoProducts.length} produits de démonstration ont été ajoutés à votre boutique.`,
      });

      // Rafraîchir la page pour voir les nouveaux produits
      window.location.reload();

    } catch (error) {
      console.error('Error adding demo products:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les produits de démonstration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-dashed border-2">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Démarrage rapide</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          Ajoutez quelques produits de démonstration pour commencer à explorer votre boutique
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            {demoProducts.length} produits
          </div>
          <div className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Plusieurs catégories
          </div>
        </div>

        <Button 
          onClick={handleAddDemoProducts}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Ajout en cours..." : "Ajouter des produits de démonstration"}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Vous pourrez les modifier ou supprimer plus tard
        </p>
      </CardContent>
    </Card>
  );
}