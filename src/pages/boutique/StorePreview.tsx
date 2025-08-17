import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Search, 
  User, 
  Star,
  Plus,
  Minus,
  X,
  CheckCircle
} from "lucide-react";
import { ProductPlaceholder } from "@/components/ui/product-placeholder";
import { useToast } from "@/hooks/use-toast";

interface StoreData {
  id: string;
  store_name: string;
  store_description?: string;
  store_email?: string;
  store_phone?: string;
  store_address?: string;
}

interface BrandData {
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  slogan?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function StorePreview() {
  const { storeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [brandData, setBrandData] = useState<BrandData>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postal: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadStoreData();
  }, [storeId]);

  const loadStoreData = async () => {
    if (!storeId) return;

    try {
      setLoading(true);

      const { data: store, error: storeError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', storeId)
        .maybeSingle();

      if (storeError || !store) {
        console.error('Error loading store:', storeError);
        return;
      }

      const { data: brand, error: brandError } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('user_id', store.user_id)
        .maybeSingle();

      if (brandError) {
        console.error('Error loading brand:', brandError);
      }

      const { data: productsData, error: productsError } = await supabase
        .from('ai_generated_products')
        .select('*')
        .eq('user_id', store.user_id)
        .limit(12);

      if (productsError) {
        console.error('Error loading products:', productsError);
      }

      setStoreData(store);
      setBrandData(brand || {});
      setProducts(productsData || []);

    } catch (error) {
      console.error('Error loading store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté au panier`,
    });
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
    setIsCartOpen(false);
  };

  const processCheckout = () => {
    // Demo checkout - just show success
    toast({
      title: "Commande confirmée !",
      description: `Merci ${checkoutForm.name} ! Votre commande démo de ${getCartTotal().toFixed(2)}€ a été enregistrée.`,
    });
    setCart([]);
    setShowCheckout(false);
    setCheckoutForm({ name: '', email: '', address: '', city: '', postal: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de votre boutique...</p>
        </div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Boutique non trouvée</h1>
          <p className="text-muted-foreground mb-6">Cette boutique n'existe pas ou n'est pas accessible.</p>
          <Button onClick={() => window.close()}>Fermer</Button>
        </div>
      </div>
    );
  }

  const primaryColor = brandData.primary_color || "#ea384c";
  const secondaryColor = brandData.secondary_color || "#64748b";

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4">
              {brandData.logo_url ? (
                <img 
                  src={brandData.logo_url} 
                  alt="Logo" 
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  {storeData.store_name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold font-display">{storeData.store_name}</h1>
                {brandData.slogan && (
                  <p className="text-sm text-muted-foreground">{brandData.slogan}</p>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#accueil" className="text-sm font-medium hover:text-primary transition-colors">Accueil</a>
              <a href="#boutique" className="text-sm font-medium hover:text-primary transition-colors">Boutique</a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-4 w-4" />
                {getCartItemsCount() > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.close()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Fermer
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="accueil"
        className="relative py-20 text-white overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` 
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
              Bienvenue chez {storeData.store_name}
            </h1>
            {storeData.store_description && (
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                {storeData.store_description}
              </p>
            )}
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-3"
              onClick={() => document.getElementById('boutique')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Découvrir nos produits
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="boutique" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display mb-4">Nos Produits</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection de produits exceptionnels, choisis avec soin pour vous
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <div className="bg-white rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Product Image */}
                    <div className="aspect-square bg-muted overflow-hidden">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <ProductPlaceholder 
                          productName={product.name}
                          primaryColor={primaryColor}
                          className="w-full h-full"
                        />
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                          {product.price.toFixed(2)} €
                        </span>
                        <div className="flex text-yellow-400">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          J'aime
                        </Button>
                        <Button 
                          size="sm"
                          className="flex-1 font-semibold"
                          style={{ backgroundColor: primaryColor }}
                          onClick={() => addToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🛍️</div>
              <h3 className="text-2xl font-semibold mb-4">Bientôt disponible</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Nos produits sont en cours de préparation. Revenez bientôt pour découvrir notre catalogue !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display mb-8">Contactez-nous</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {storeData.store_email && (
              <div>
                <h4 className="font-semibold mb-2">Email</h4>
                <p className="text-muted-foreground">{storeData.store_email}</p>
              </div>
            )}
            {storeData.store_phone && (
              <div>
                <h4 className="font-semibold mb-2">Téléphone</h4>
                <p className="text-muted-foreground">{storeData.store_phone}</p>
              </div>
            )}
            {storeData.store_address && (
              <div>
                <h4 className="font-semibold mb-2">Adresse</h4>
                <p className="text-muted-foreground">{storeData.store_address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 {storeData.store_name}. Tous droits réservés. | Boutique créée avec ❤️
          </p>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">Panier ({getCartItemsCount()})</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Votre panier est vide</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <ProductPlaceholder productName={item.name} primaryColor={primaryColor} className="w-full h-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-1">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} €</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="border-t p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold" style={{ color: primaryColor }}>
                      {getCartTotal().toFixed(2)} €
                    </span>
                  </div>
                  <Button 
                    className="w-full font-semibold"
                    style={{ backgroundColor: primaryColor }}
                    onClick={handleCheckout}
                  >
                    Passer la commande
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCheckout(false)}></div>
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Finaliser la commande</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCheckout(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet</label>
                <input 
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email"
                  className="w-full p-3 border rounded-lg"
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="jean@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <input 
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Rue de la Paix"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ville</label>
                  <input 
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    value={checkoutForm.city}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Code postal</label>
                  <input 
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    value={checkoutForm.postal}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, postal: e.target.value }))}
                    placeholder="75001"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total à payer:</span>
                <span className="text-xl font-bold" style={{ color: primaryColor }}>
                  {getCartTotal().toFixed(2)} €
                </span>
              </div>
              <Button 
                className="w-full font-semibold"
                style={{ backgroundColor: primaryColor }}
                onClick={processCheckout}
                disabled={!checkoutForm.name || !checkoutForm.email}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmer la commande (Démo)
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                * Ceci est une commande de démonstration - aucun paiement réel ne sera effectué
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}