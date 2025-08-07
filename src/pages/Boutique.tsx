import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { AppSidebar } from "@/components/AppSidebar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { SupplierApps } from "@/components/products/SupplierApps";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { AddProductDemo } from "@/components/products/AddProductDemo";

export default function Boutique() {
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState("price-asc");
  const { toast } = useToast();

  const [user, setUser] = React.useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  React.useEffect(() => {
    const checkUser = async () => {
      console.log("Checking user auth...");
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log("Auth check result:", { user, error });
      setUser(user);
      setIsCheckingAuth(false);
    };
    checkUser();
  }, []);

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products', user?.id],
    queryFn: async () => {
      console.log("Fetching products for current user...");
      
      if (!user) {
        console.log("No user found, returning empty array");
        return [];
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits. Veuillez réessayer.",
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Products fetched for user:", data);
      return data || [];
    },
    enabled: !!user
  });

  if (error) {
    console.error('Query error:', error);
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-8">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Ma Boutique</h1>
            </div>
            <div className="text-center space-y-6 py-16">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-muted-foreground">
                  Connectez-vous pour accéder à votre boutique
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Vous devez être connecté pour voir et gérer vos produits. 
                  Créez un compte gratuit ou connectez-vous pour commencer.
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Link to="/connexion">
                  <Button size="lg">
                    Se connecter
                  </Button>
                </Link>
                <Link to="/inscription">
                  <Button variant="outline" size="lg">
                    Créer un compte
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Ma Boutique</h1>
            <Link to="/products/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un produit
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
            <aside>
              <ProductFilters
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </aside>

            <div className="space-y-8">
              <SupplierApps />
              
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500">
                  Une erreur est survenue lors du chargement des produits.
                </div>
              ) : products && products.length > 0 ? (
                <ProductGrid products={products} />
              ) : (
                <div className="space-y-8">
                  <div className="text-center space-y-4 py-8">
                    <div className="text-muted-foreground">
                      Aucun produit trouvé dans votre boutique.
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Commencez par ajouter des produits à votre catalogue pour les voir apparaître ici.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <AddProductDemo />
                    
                    <div className="space-y-4">
                      <Link to="/products/add" className="block">
                        <Button className="w-full" size="lg">
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter un produit manuellement
                        </Button>
                      </Link>
                      
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-2">
                          Ou utilisez nos applications partenaires
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Elles se trouvent dans la section ci-dessus
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}