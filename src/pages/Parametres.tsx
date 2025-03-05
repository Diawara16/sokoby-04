
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Palette, Settings, Rocket, Wand, Store, Globe, Users, CreditCard, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConfigurationStep {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
  link: string;
}

const Parametres = () => {
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
      title: "Paramètres généraux",
      description: "Configurez les informations de base de votre boutique comme le nom, l'adresse et les coordonnées.",
      icon: Store,
      action: "Configurer",
      link: "/parametres"
    },
    {
      title: "Nom de domaine",
      description: "Configurez votre domaine personnalisé pour votre boutique en ligne.",
      icon: Globe,
      action: "Configurer",
      link: "/parametres/domaine"
    },
    {
      title: "Gestion des utilisateurs",
      description: "Gérez les accès et les permissions des utilisateurs de votre boutique.",
      icon: Users,
      action: "Configurer",
      link: "/parametres/utilisateurs"
    },
    {
      title: "Méthodes de paiement",
      description: "Configurez les méthodes de paiement acceptées par votre boutique.",
      icon: CreditCard,
      action: "Configurer",
      link: "/parametres/paiements"
    },
    {
      title: "Options d'expédition",
      description: "Définissez les options d'expédition et les tarifs pour vos clients.",
      icon: ShoppingBag,
      action: "Configurer",
      link: "/parametres/expedition"
    },
    {
      title: "Sécurité",
      description: "Renforcez la sécurité de votre boutique et protégez vos données.",
      icon: Shield,
      action: "Configurer",
      link: "/parametres/securite"
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
        <h1 className="text-3xl font-bold mb-2">Paramètres de la boutique</h1>
        <p className="text-muted-foreground">
          Configurez tous les aspects de votre boutique en ligne.
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

export default Parametres;
