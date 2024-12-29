import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Palette, Settings, Rocket, Wand, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConfigurationStep {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
  link: string;
}

const Configuration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/');
          return;
        }

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        setHasSubscription(!!subscription);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'abonnement:', error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier votre abonnement",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [navigate, toast]);

  const configurationSteps: ConfigurationStep[] = [
    {
      title: "Trouver des produits à vendre",
      description: "Parcourez notre catalogue de produits dropshipping et importez-les directement dans votre boutique.",
      icon: ShoppingBag,
      action: "Parcourir les produits",
      link: "/boutique"
    },
    {
      title: "Personnaliser votre boutique",
      description: "Choisissez parmi nos thèmes professionnels et personnalisez l'apparence de votre boutique.",
      icon: Palette,
      action: "Personnaliser",
      link: "/themes"
    },
    {
      title: "Configurer les paramètres",
      description: "Définissez vos préférences de paiement, d'expédition et autres paramètres importants.",
      icon: Settings,
      action: "Configurer",
      link: "/parametres"
    },
    {
      title: "Connecter des applications",
      description: "Améliorez votre boutique avec nos applications partenaires pour le marketing, la gestion des stocks et plus encore.",
      icon: Rocket,
      action: "Explorer les apps",
      link: "/applications"
    },
    {
      title: "Assistant IA",
      description: "Utilisez notre assistant IA pour générer des descriptions de produits uniques et optimisées.",
      icon: Wand,
      action: "Essayer l'assistant",
      link: "/assistant"
    },
    {
      title: "Lancer votre boutique",
      description: "Vérifiez votre configuration et lancez votre boutique en ligne.",
      icon: Store,
      action: "Lancer",
      link: "/lancement"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Accès restreint</CardTitle>
            <CardDescription>
              Cette section est réservée aux utilisateurs avec un abonnement actif.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/plan-tarifaire')}>
              Voir les plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Guide de configuration</h1>
        <p className="text-muted-foreground">
          Utilisez ce guide personnalisé pour rendre votre boutique opérationnelle.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {configurationSteps.map((step) => (
          <Card key={step.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <step.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </div>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate(step.link)}
                className="w-full"
              >
                {step.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Configuration;