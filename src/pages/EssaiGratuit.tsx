import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Apple, Facebook } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthForm } from "@/components/auth/AuthForm";
import { useState } from "react";

const EssaiGratuit = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailSignup = () => {
    setShowAuthForm(true);
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`
      }
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion avec Google",
        variant: "destructive",
      });
    }
  };

  const handleAppleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/onboarding`
      }
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion avec Apple",
        variant: "destructive",
      });
    }
  };

  const handleFacebookSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/onboarding`
      }
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion avec Facebook",
        variant: "destructive",
      });
    }
  };

  if (showAuthForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
        <AuthForm 
          defaultIsSignUp={true}
          onCancel={() => setShowAuthForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Commencez votre essai gratuit
          </h1>
          <p className="text-gray-500">
            Obtenez 14 jours gratuits
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-center gap-2"
            onClick={handleEmailSignup}
          >
            <Mail className="h-5 w-5" />
            Inscrivez-vous par e-mail
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-center gap-2"
            onClick={handleGoogleSignup}
          >
            <FcGoogle className="h-5 w-5" />
            S'inscrire avec Google
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-center gap-2"
            onClick={handleAppleSignup}
          >
            <Apple className="h-5 w-5" />
            S'inscrire avec Apple
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-center gap-2"
            onClick={handleFacebookSignup}
          >
            <Facebook className="h-5 w-5 text-blue-600" />
            S'inscrire avec Facebook
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">ou</span>
          </div>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-600">Vous avez déjà un compte ? </span>
          <Button 
            variant="link" 
            className="p-0 text-blue-600 hover:text-blue-800"
            onClick={() => navigate("/login")}
          >
            S'identifier
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500">
          En continuant, vous acceptez les{' '}
          <Button variant="link" className="p-0 text-blue-600 hover:text-blue-800 text-xs h-auto">
            conditions générales
          </Button>{' '}
          et la{' '}
          <Button variant="link" className="p-0 text-blue-600 hover:text-blue-800 text-xs h-auto">
            politique de confidentialité
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EssaiGratuit;