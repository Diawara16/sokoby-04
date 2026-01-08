import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Package, 
  Plus, 
  Search, 
  Upload, 
  ShoppingCart, 
  TrendingUp,
  AlertCircle,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  status: string;
  niche: string;
  supplier: string;
}

export function StoreProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Query the products table (the source of truth for LIVE stores)
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Map products to expected shape
      setProducts((products || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        price: p.price,
        image_url: p.image,
        status: p.status || 'active',
        niche: p.category || 'general',
        supplier: 'Manual',
      })));
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'demo': { label: 'Démo', variant: 'secondary' as const },
      'pending': { label: 'En attente', variant: 'outline' as const },
      'active': { label: 'Actif', variant: 'default' as const },
      'inactive': { label: 'Inactif', variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-sm text-muted-foreground">Total produits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{products.filter(p => p.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Produits actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">€{products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Valeur totale</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{products.filter(p => p.status === 'demo').length}</p>
                <p className="text-sm text-muted-foreground">Produits démo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions et recherche */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gestion des produits
              </CardTitle>
              <CardDescription>
                Gérez votre catalogue de produits
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/products/import">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/products/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>

          {/* Liste des produits */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Aucun produit ne correspond à votre recherche." : "Commencez par ajouter des produits à votre boutique."}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link to="/products/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter votre premier produit
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{product.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {product.description || "Aucune description"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(product.status)}
                      <Badge variant="outline" className="text-xs">
                        {product.niche}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold">€{product.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{product.supplier}</p>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/products/add">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-1">Ajouter manuellement</h3>
              <p className="text-sm text-muted-foreground">Créez un nouveau produit depuis zéro</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/products/import">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="p-6 text-center">
              <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-1">Importer un produit</h3>
              <p className="text-sm text-muted-foreground">Importez un produit rapidement</p>
            </CardContent>
          </Card>
        </Link>
        
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-medium mb-1">Générer avec l'IA</h3>
            <p className="text-sm text-muted-foreground">Laissez l'IA créer des produits pour vous</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}