import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bot, 
  Sparkles, 
  Check, 
  Loader2,
  Shield,
  Wand2,
  Star,
  Shirt,
  Smartphone,
  Sparkle,
  Home,
  Dumbbell,
  Baby,
  BookOpen
} from "lucide-react";

interface Plan {
  id: 'starter' | 'pro';
  name: string;
  price: number;
  productCount: number;
  features: string[];
  badge?: string;
}

interface Niche {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Plan Starter',
    price: 20,
    productCount: 10,
    features: [
      '10 produits générés par IA',
      'Design professionnel',
      'Pages essentielles'
    ]
  },
  {
    id: 'pro',
    name: 'Plan Pro',
    price: 80,
    productCount: 50,
    features: [
      '50 produits premium générés par IA',
      'Images haute qualité exclusives',
      'Support prioritaire',
      'Optimisation SEO avancée',
      'Design premium personnalisé'
    ],
    badge: 'RECOMMANDÉ'
  }
];

const niches: Niche[] = [
  { id: 'fashion', name: 'Mode & Vêtements', icon: <Shirt className="h-5 w-5" />, description: 'Vêtements, accessoires, chaussures' },
  { id: 'electronics', name: 'Électronique', icon: <Smartphone className="h-5 w-5" />, description: 'Gadgets, accessoires tech' },
  { id: 'beauty', name: 'Beauté & Cosmétiques', icon: <Sparkle className="h-5 w-5" />, description: 'Soins, maquillage, parfums' },
  { id: 'home', name: 'Maison & Déco', icon: <Home className="h-5 w-5" />, description: 'Décoration, mobilier, accessoires' },
  { id: 'fitness', name: 'Sport & Fitness', icon: <Dumbbell className="h-5 w-5" />, description: 'Équipements, vêtements sport' },
  { id: 'kids', name: 'Enfants & Bébés', icon: <Baby className="h-5 w-5" />, description: 'Jouets, vêtements, accessoires' },
  { id: 'books', name: 'Livres & Papeterie', icon: <BookOpen className="h-5 w-5" />, description: 'Livres, fournitures, créatif' },
];

const CreerBoutiqueIA = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro'>('starter');
  const [selectedNiche, setSelectedNiche] = useState<string>('fashion');
  const [storeName, setStoreName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Restore checkout data after login redirect
  useEffect(() => {
    const savedCheckoutData = sessionStorage.getItem('checkoutData');
    if (savedCheckoutData) {
      try {
        const data = JSON.parse(savedCheckoutData);
        console.log('[CreerBoutiqueIA] Restoring checkout data:', data);
        if (data.storeName) setStoreName(data.storeName);
        if (data.plan) setSelectedPlan(data.plan);
        if (data.niche) setSelectedNiche(data.niche);
        // Clear the saved data after restoring
        sessionStorage.removeItem('checkoutData');
        toast({
          title: "Données restaurées",
          description: "Vos choix ont été restaurés. Vous pouvez maintenant procéder au paiement.",
        });
      } catch (e) {
        console.error('[CreerBoutiqueIA] Error parsing checkout data:', e);
        sessionStorage.removeItem('checkoutData');
      }
    }
  }, [toast]);

  const handleProceedToPayment = async () => {
    if (!storeName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer un nom pour votre boutique",
        variant: "destructive"
      });
      return;
    }

    if (!selectedNiche) {
      toast({
        title: "Niche requise",
        description: "Veuillez sélectionner une catégorie pour votre boutique",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check authentication first - this helps with incognito/PC sessions
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[CreerBoutiqueIA] Session error:', sessionError);
      }

      if (!session) {
        console.log('[CreerBoutiqueIA] No active session found');
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour créer une boutique. Redirection vers la page de connexion...",
          variant: "destructive"
        });
        // Store intended action for post-login redirect
        sessionStorage.setItem('redirectAfterLogin', '/creer-boutique-ia');
        sessionStorage.setItem('checkoutData', JSON.stringify({
          storeName: storeName.trim(),
          plan: selectedPlan,
          niche: selectedNiche
        }));
        setTimeout(() => navigate('/login'), 1000);
        setIsLoading(false);
        return;
      }

      console.log('[CreerBoutiqueIA] Creating checkout session...', { 
        storeName: storeName.trim(), 
        plan: selectedPlan,
        niche: selectedNiche,
        hasSession: !!session
      });

      // Call the create-store-checkout edge function with niche
      const { data, error } = await supabase.functions.invoke('create-store-checkout', {
        body: {
          storeName: storeName.trim(),
          plan: selectedPlan,
          niche: selectedNiche
        }
      });

      console.log('[CreerBoutiqueIA] Edge function response:', { data, error });

      // Handle authentication errors explicitly
      if (error) {
        console.error('[CreerBoutiqueIA] Checkout error:', error);
        
        // Check if it's an auth error (401/403)
        if (error.message?.includes('401') || error.message?.includes('AUTH_REQUIRED') || error.message?.includes('SESSION_EXPIRED')) {
          toast({
            title: "Session expirée",
            description: "Votre session a expiré. Veuillez vous reconnecter.",
            variant: "destructive"
          });
          sessionStorage.setItem('redirectAfterLogin', '/creer-boutique-ia');
          setTimeout(() => navigate('/login'), 1500);
          setIsLoading(false);
          return;
        }
        
        throw new Error(error.message || 'Erreur lors de la création de la session de paiement');
      }

      // Handle data-level errors (auth required response)
      if (data?.authRequired) {
        console.log('[CreerBoutiqueIA] Auth required from edge function');
        toast({
          title: "Connexion requise",
          description: data.message || "Veuillez vous connecter pour continuer.",
          variant: "destructive"
        });
        sessionStorage.setItem('redirectAfterLogin', '/creer-boutique-ia');
        setTimeout(() => navigate('/login'), 1500);
        setIsLoading(false);
        return;
      }

      if (data?.error) {
        console.error('[CreerBoutiqueIA] Data error:', data.error);
        throw new Error(data.message || data.error);
      }

      if (data?.url) {
        console.log('[CreerBoutiqueIA] Redirecting to Stripe:', data.url);
        toast({
          title: "Redirection vers Stripe",
          description: "Vous allez être redirigé vers la page de paiement sécurisé...",
        });
        // Use direct navigation for more reliable redirect
        window.location.href = data.url;
      } else {
        console.error('[CreerBoutiqueIA] No URL in response:', data);
        throw new Error('URL de paiement non reçue. Veuillez réessayer.');
      }

    } catch (error) {
      console.error('[CreerBoutiqueIA] Payment error:', error);
      setIsLoading(false);
      
      const errorMessage = error instanceof Error ? error.message : "Impossible de créer la session de paiement";
      
      toast({
        title: "Erreur de paiement",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);
  const selectedNicheData = niches.find(n => n.id === selectedNiche);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Badge className="bg-primary/10 text-primary px-4 py-2">
            <Bot className="h-4 w-4 mr-2" />
            Création avec IA
            <Sparkles className="h-4 w-4 ml-2" />
          </Badge>
        </div>
        <Badge variant="outline" className="bg-primary text-primary-foreground mb-4">
          PAYANT
        </Badge>
        <h1 className="text-3xl font-bold mb-4">Créez votre boutique IA</h1>
        <p className="text-muted-foreground">
          Notre IA crée automatiquement votre boutique complète avec des produits de qualité
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Niche Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Niche Selection */}
          <Card>
            <CardHeader>
              <CardTitle>1. Choisissez votre niche</CardTitle>
              <CardDescription>
                Sélectionnez la catégorie de produits pour votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {niches.map((niche) => (
                  <button
                    key={niche.id}
                    onClick={() => setSelectedNiche(niche.id)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedNiche === niche.id
                        ? 'border-2 border-primary bg-primary/5'
                        : 'border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {selectedNiche === niche.id && (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        </div>
                      )}
                      <span className="text-primary">{niche.icon}</span>
                    </div>
                    <p className="font-medium text-sm">{niche.name}</p>
                    <p className="text-xs text-muted-foreground">{niche.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan Selection */}
          <Card>
            <CardHeader>
              <CardTitle>2. Choisissez votre plan</CardTitle>
              <CardDescription>
                Le Plan Pro inclut des produits premium et images exclusives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                      selectedPlan === plan.id 
                        ? 'border-2 border-primary bg-primary/5' 
                        : 'border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.badge && (
                      <Badge className="absolute -top-2 right-2 bg-primary text-primary-foreground text-xs">
                        {plan.badge}
                      </Badge>
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {selectedPlan === plan.id && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                        <h3 className="font-semibold">{plan.name}</h3>
                      </div>
                      <span className="text-2xl font-bold text-primary">{plan.price}€</span>
                    </div>
                    <ul className="space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Store Name */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                3. Nommez votre boutique
              </CardTitle>
              <CardDescription>
                Ce nom apparaîtra sur votre boutique en ligne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="storeName">Nom de la boutique</Label>
                <Input
                  id="storeName"
                  placeholder={`Ma Boutique ${selectedNicheData?.name || ''}`}
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary & Payment */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{selectedPlanData?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Niche</span>
                  <span className="font-medium">{selectedNicheData?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Produits</span>
                  <span className="font-medium">{selectedPlanData?.productCount} produits IA</span>
                </div>
              </div>
              
              <hr />
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Images {selectedPlan === 'pro' ? 'premium exclusives' : 'professionnelles'}</span>
              </div>
              
              <hr />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{selectedPlanData?.price}€</span>
              </div>

              <Button 
                onClick={handleProceedToPayment}
                className="w-full h-12 text-lg"
                disabled={isLoading || !storeName.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    Procéder au paiement
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Paiement sécurisé via Stripe</span>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            <p>
              Après le paiement, votre boutique sera générée automatiquement avec des produits {selectedNicheData?.name.toLowerCase()} de qualité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;
