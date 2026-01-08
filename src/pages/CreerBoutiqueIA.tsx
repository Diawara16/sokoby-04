import { useState } from "react";
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
  Star
} from "lucide-react";

interface Plan {
  id: 'starter' | 'pro';
  name: string;
  price: number;
  productCount: number;
  features: string[];
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Démarreur de plan',
    price: 20,
    productCount: 10,
    features: [
      '10 produits générés par IA',
      'Professionnel du design',
      'Pages essentielles'
    ]
  },
  {
    id: 'pro',
    name: 'Plan Pro',
    price: 80,
    productCount: 50,
    features: [
      '50 produits générés par IA',
      'Support prioritaire',
      'Optimisation SEO avancée',
      'Prime de conception'
    ]
  }
];

const CreerBoutiqueIA = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro'>('starter');
  const [storeName, setStoreName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProceedToPayment = async () => {
    if (!storeName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer un nom pour votre boutique",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);

      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour créer une boutique",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      // Call the create-store-checkout edge function
      const { data, error } = await supabase.functions.invoke('create-store-checkout', {
        body: {
          storeName: storeName.trim(),
          plan: selectedPlan
        }
      });

      if (error) {
        console.error('Checkout error:', error);
        throw new Error(error.message || 'Erreur lors de la création de la session de paiement');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de créer la session de paiement",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
        <h1 className="text-3xl font-bold mb-4">Création avec IA</h1>
        <p className="text-muted-foreground">
          Notre IA crée automatiquement votre boutique complète en quelques minutes
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Plan Selection */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Choisissez votre plan :</h2>
            
            <div className="space-y-4">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan.id 
                      ? 'border-2 border-primary bg-primary/5' 
                      : 'border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {selectedPlan === plan.id && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                          <h3 className="font-semibold text-lg">{plan.name}</h3>
                        </div>
                        <ul className="space-y-1">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="h-4 w-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {plan.price}€
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Store Name & Payment */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Nommez votre boutique
              </CardTitle>
              <CardDescription>
                Ce nom sera utilisé pour créer votre boutique IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeName">Nom de la boutique</Label>
                <Input
                  id="storeName"
                  placeholder="Ma Boutique Mode"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{selectedPlanData?.name}</span>
                <span className="font-semibold">{selectedPlanData?.price}€</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>{selectedPlanData?.productCount} produits générés par IA</span>
              </div>
              <hr />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{selectedPlanData?.price}€</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Button */}
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
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Après le paiement, votre boutique sera générée automatiquement avec {selectedPlanData?.productCount} produits.
          <br />
          Vous pourrez ensuite modifier et personnaliser votre boutique à votre guise.
        </p>
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;
