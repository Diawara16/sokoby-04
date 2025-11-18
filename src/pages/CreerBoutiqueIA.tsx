import { useState } from "react";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Store, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const CreerBoutiqueIA = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthAndProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro'>('starter');
  const [storeName, setStoreName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateManualStore = async () => {
    if (!storeName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom de boutique",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);

      const { error } = await supabase
        .from('store_settings')
        .insert({
          user_id: user.id,
          store_name: storeName,
          store_type: 'manual',
          trial_start_date: trialStartDate.toISOString(),
          trial_end_date: trialEndDate.toISOString(),
          domain_name: `${storeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${user.id.substring(0, 8)}.sokoby.com`,
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre boutique a été créée avec succès ! Vous avez 14 jours d'essai gratuit.",
      });

      navigate('/tableau-de-bord');
    } catch (error) {
      console.error('Error creating manual store:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la boutique",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAIStore = async () => {
    if (!storeName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom de boutique",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('create-store-checkout', {
        body: {
          storeName,
          plan: selectedPlan,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating AI store:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

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
          <p className="text-muted-foreground mb-6">
            Vous devez être connecté pour créer votre boutique.
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/tableau-de-bord">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Créer votre boutique</h1>
        </div>

        {/* Store Name Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nom de votre boutique</CardTitle>
            <CardDescription>
              Choisissez un nom unique pour votre boutique en ligne
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Ma Boutique"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Manual Store Option */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              GRATUIT
            </div>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Création Manuelle</CardTitle>
              </div>
              <CardDescription>
                Créez votre boutique étape par étape avec notre interface intuitive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>14 jours d'essai gratuit</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Ajoutez vos produits manuellement</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Personnalisez votre design</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Configuration complète</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={handleCreateManualStore}
                disabled={isLoading || !storeName.trim()}
              >
                {isLoading ? "Création..." : "Créer Gratuitement"}
              </Button>
            </CardContent>
          </Card>

          {/* AI Store Option */}
          <Card className="relative overflow-hidden border-2 hover:border-primary transition-colors">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              PAYANT
            </div>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Création avec IA</CardTitle>
              </div>
              <CardDescription>
                Notre IA crée automatiquement votre boutique complète en quelques minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Plan Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Choisissez votre plan :</p>
                
                <button
                  onClick={() => setSelectedPlan('starter')}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedPlan === 'starter' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">Plan Starter</span>
                    <span className="text-xl font-bold text-primary">20€</span>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      10 produits générés par IA
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      Design professionnel
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      Pages essentielles
                    </li>
                  </ul>
                </button>

                <button
                  onClick={() => setSelectedPlan('pro')}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedPlan === 'pro' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">Plan Pro</span>
                    <span className="text-xl font-bold text-primary">80€</span>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      50 produits générés par IA
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      Support prioritaire
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      Optimisation SEO avancée
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      Design premium
                    </li>
                  </ul>
                </button>
              </div>

              <Button 
                className="w-full" 
                onClick={handleCreateAIStore}
                disabled={isLoading || !storeName.trim()}
              >
                {isLoading ? "Redirection..." : "Procéder au paiement"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Paiement sécurisé avec Stripe
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;
