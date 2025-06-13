
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const VerifyEmail = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/inscription');
        return;
      }
      
      if (session.user.email_confirmed_at) {
        navigate('/tableau-de-bord');
        return;
      }
      
      setEmail(session.user.email);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/inscription');
      }
      if (session?.user.email_confirmed_at) {
        toast({
          title: "Email vérifié !",
          description: "Votre compte a été activé avec succès.",
        });
        navigate('/tableau-de-bord');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/tableau-de-bord`,
        }
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Email renvoyé",
        description: "Un nouveau lien de vérification a été envoyé à votre adresse email.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de renvoyer l'email. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Vérifiez votre email</CardTitle>
          <CardDescription className="text-base">
            Nous avons envoyé un lien de confirmation à <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Étape 1 : Vérifiez votre boîte de réception</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Étape 2 : Cliquez sur le lien de vérification</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
              <span>Étape 3 : Accédez à votre tableau de bord</span>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">
              Si vous ne trouvez pas l'email, vérifiez votre dossier spam/courrier indésirable.
            </p>
            
            <Button 
              variant="outline" 
              onClick={handleResendEmail}
              disabled={isResending || emailSent}
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : emailSent ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Email renvoyé
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Renvoyer l'email
                </>
              )}
            </Button>

            <div className="text-xs text-gray-400 space-y-2">
              <p>Vous n'arrivez toujours pas à accéder à votre compte ?</p>
              <Button 
                variant="link" 
                size="sm"
                onClick={() => navigate('/contact')}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Contactez notre support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
