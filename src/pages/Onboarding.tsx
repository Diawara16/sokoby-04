import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, UserCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const Onboarding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/essai-gratuit');
      }
    };
    checkSession();
  }, [navigate]);

  const options = [
    {
      title: "Configurer ma boutique",
      description: "Créez votre première boutique en ligne et commencez à vendre (2 boutiques avec le plan Pro)",
      icon: ShoppingBag,
      path: "/boutique",
    },
    {
      title: "Configurer mon profil",
      description: "Personnalisez votre profil et vos informations",
      icon: UserCircle,
      path: "/profil",
    },
    {
      title: "Paramètres avancés",
      description: "Configurez les paramètres de votre compte",
      icon: Settings,
      path: "/parametres",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Configurez votre compte</h1>
          <p className="text-muted-foreground mb-6">
            Connectez-vous avec un réseau social ou choisissez une option pour commencer
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Connexion rapide</CardTitle>
              <CardDescription>
                Utilisez vos réseaux sociaux pour vous connecter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SocialAuthButtons />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          {options.map((option) => (
            <Card 
              key={option.title} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(option.path)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <option.icon className="h-5 w-5" />
                  <span>{option.title}</span>
                </CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Commencer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;