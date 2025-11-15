
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { NicheSelector } from "@/components/store-creator/NicheSelector";
import { supabase } from "@/integrations/supabase/client";
import { getShopifyAuthUrl } from "@/integrations/shopify";

const CreerBoutiqueIA = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthAndProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedNiche, setSelectedNiche] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro'>('starter');
  const [shopifyConnected, setShopifyConnected] = useState(false);
  const [shopifyDomain, setShopifyDomain] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour créer votre boutique IA personnalisée.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/register">Créer un compte</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleShopifyConnect = async () => {
    if (!selectedNiche) {
      toast({
        title: "Sélectionnez une niche",
        description: "Veuillez d'abord choisir le type de boutique",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Prompt for Shopify domain
      const domain = prompt("Entrez votre domaine Shopify (ex: votre-boutique.myshopify.com):");
      if (!domain) {
        setIsConnecting(false);
        return;
      }

      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
      
      // Save preliminary data before OAuth
      await supabase.from('store_settings').upsert({
        user_id: user.id,
        store_name: selectedNiche,
        niche: selectedNiche,
        status: 'pending',
        plan: selectedPlan,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Redirect to Shopify OAuth
      const authUrl = getShopifyAuthUrl(cleanDomain);
      sessionStorage.setItem('shopify_flow_data', JSON.stringify({
        niche: selectedNiche,
        plan: selectedPlan,
        shopDomain: cleanDomain
      }));
      
      window.location.href = authUrl;
    } catch (error) {
      console.error("Shopify connection error:", error);
      toast({
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Impossible de connecter Shopify",
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };

  const handleStripeCheckout = async () => {
    if (!shopifyConnected) {
      toast({
        title: "Connectez Shopify d'abord",
        description: "Veuillez connecter votre boutique Shopify avant de procéder au paiement",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Save form data server-side
      const { error: saveError } = await supabase.from('ai_store_orders' as any).insert({
        user_id: user.id,
        niche: selectedNiche,
        plan: selectedPlan,
        shopify_domain: shopifyDomain,
        status: 'pending_payment',
        created_at: new Date().toISOString()
      });

      if (saveError) throw saveError;

      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          planType: selectedPlan,
          paymentMethod: 'card',
          billingPeriod: 'monthly'
        }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Erreur de paiement",
        description: error instanceof Error ? error.message : "Impossible de créer la session de paiement",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  // Check if returning from Shopify OAuth
  useState(() => {
    const flowData = sessionStorage.getItem('shopify_flow_data');
    if (flowData) {
      const { niche, plan, shopDomain } = JSON.parse(flowData);
      setSelectedNiche(niche);
      setSelectedPlan(plan);
      setShopifyDomain(shopDomain);
      setShopifyConnected(true);
      sessionStorage.removeItem('shopify_flow_data');
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/tableau-de-bord">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Créer votre boutique IA</h1>
        </div>

        {/* Store Creation Form */}
        <div className="space-y-8">
          {/* Step 1: Niche Selection */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-xl font-semibold">Choisissez votre type de boutique</h2>
            </div>
            <NicheSelector 
              onSelectNiche={setSelectedNiche}
              selectedNiche={selectedNiche}
            />
          </div>

          {/* Step 2: Plan Selection */}
          {selectedNiche && (
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-xl font-semibold">Choisissez votre plan *</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedPlan('starter')}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    selectedPlan === 'starter'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">Plan Starter</h3>
                    {selectedPlan === 'starter' && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <p className="text-3xl font-bold text-primary mb-2">20€</p>
                  <p className="text-sm text-muted-foreground">
                    Basic AI shop with 10 products
                  </p>
                </button>

                <button
                  onClick={() => setSelectedPlan('pro')}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    selectedPlan === 'pro'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">Plan Pro</h3>
                    {selectedPlan === 'pro' && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <p className="text-3xl font-bold text-primary mb-2">80€</p>
                  <p className="text-sm text-muted-foreground">
                    Complete AI shop with 50 products + priority support
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Shopify Connection & Payment */}
          {selectedNiche && (
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-xl font-semibold">Connexion et paiement</h2>
              </div>
              
              <div className="space-y-4">
                {/* Shopify Connection Button */}
                <Button
                  onClick={handleShopifyConnect}
                  disabled={isConnecting || !selectedNiche}
                  size="lg"
                  className="w-full"
                  variant={shopifyConnected ? "secondary" : "default"}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {isConnecting ? "Connexion en cours..." : "Connecter ma boutique Shopify"}
                </Button>

                {/* Connected Badge */}
                {shopifyConnected && shopifyDomain && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Boutique connectée : {shopifyDomain}
                    </span>
                  </div>
                )}

                {/* Stripe Payment Button */}
                <Button
                  onClick={handleStripeCheckout}
                  disabled={!shopifyConnected || isProcessing}
                  size="lg"
                  className="w-full"
                >
                  {isProcessing ? "Redirection vers Stripe..." : "Procéder au paiement (Stripe)"}
                </Button>

                {!shopifyConnected && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Vous devez connecter votre boutique Shopify avant de procéder au paiement.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;
