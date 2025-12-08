import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Zap, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [storeGenerated, setStoreGenerated] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('verifying');
  const [retryCount, setRetryCount] = useState(0);

  const verifyAndGenerate = useCallback(async () => {
    if (!sessionId) {
      setError("Aucun ID de session trouvé");
      setLoading(false);
      return;
    }

    try {
      setStatus('verifying');
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Utilisateur non authentifié. Veuillez vous connecter.");
        setLoading(false);
        return;
      }

      // Call the verify-and-generate-store function
      console.log('[SUCCESS] Calling verify-and-generate-store...');
      setStatus('processing');
      
      const { data, error: invokeError } = await supabase.functions.invoke('verify-and-generate-store', {
        body: { sessionId },
      });

      console.log('[SUCCESS] Response:', data, invokeError);

      if (invokeError) {
        console.error('[SUCCESS] Error:', invokeError);
        throw invokeError;
      }

      if (data?.success) {
        setStoreGenerated(true);
        setStoreId(data.storeId);
        setLoading(false);
        setStatus('complete');
        
        toast({
          title: "Boutique créée !",
          description: "Votre boutique IA a été générée avec succès.",
        });
      } else if (data?.status === 'payment_pending') {
        // Payment not yet processed, wait and retry
        if (retryCount < 15) {
          setStatus('waiting_payment');
          setTimeout(() => {
            setRetryCount(r => r + 1);
          }, 3000);
        } else {
          setError("Le paiement n'a pas été confirmé. Veuillez contacter le support.");
          setLoading(false);
        }
      } else {
        throw new Error(data?.error || 'Unknown error');
      }
    } catch (err: any) {
      console.error('[SUCCESS] Error:', err);
      
      // Retry a few times before showing error
      if (retryCount < 5) {
        setTimeout(() => {
          setRetryCount(r => r + 1);
        }, 3000);
      } else {
        setError(err.message || "Erreur lors de la génération de la boutique");
        setLoading(false);
      }
    }
  }, [sessionId, retryCount, toast]);

  useEffect(() => {
    verifyAndGenerate();
  }, [verifyAndGenerate]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
    verifyAndGenerate();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16 text-center">
          <Loader2 className="h-16 w-16 sm:h-24 sm:w-24 animate-spin text-primary mx-auto mb-6 sm:mb-8" />
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
            {status === 'verifying' && 'Vérification de votre paiement...'}
            {status === 'waiting_payment' && 'Confirmation du paiement en cours...'}
            {status === 'processing' && 'Génération de votre boutique IA...'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            {status === 'verifying' && 'Veuillez patienter pendant que nous confirmons votre transaction.'}
            {status === 'waiting_payment' && 'Le paiement est en cours de traitement par Stripe.'}
            {status === 'processing' && 'Création de vos produits et configuration de votre boutique...'}
          </p>
          <p className="text-xs text-muted-foreground">
            Tentative {retryCount + 1}/15
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16 text-center">
          <AlertCircle className="h-16 w-16 sm:h-24 sm:w-24 text-destructive mx-auto mb-6 sm:mb-8" />
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
            Une erreur est survenue
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
            {error}
          </p>
          <div className="space-y-3 sm:space-y-4">
            <Button onClick={handleRetry} size="lg" className="bg-primary hover:bg-primary/90">
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
            <div>
              <Link to="/tableau-de-bord">
                <Button variant="outline" size="lg">
                  Retour au tableau de bord
                </Button>
              </Link>
            </div>
            <div>
              <Link to="/contact" className="text-primary hover:underline text-sm">
                Contactez le support
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <CheckCircle className="h-16 w-16 sm:h-24 sm:w-24 text-green-500 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Félicitations ! 🎉
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
              Votre boutique IA a été créée avec succès ! Vous pouvez maintenant commencer à la personnaliser.
            </p>
          </div>

          <Card className="mb-6 sm:mb-8 border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-lg sm:text-xl text-foreground">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-2" />
                Prochaines étapes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 text-left">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="bg-primary/10 text-primary rounded-full p-2 text-xs sm:text-sm font-bold min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Accédez à votre tableau de bord</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">Visualisez votre boutique et explorez toutes les fonctionnalités</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="bg-primary/10 text-primary rounded-full p-2 text-xs sm:text-sm font-bold min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Personnalisez votre boutique</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">Modifiez les produits, ajoutez votre logo et configurez vos paramètres</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="bg-primary/10 text-primary rounded-full p-2 text-xs sm:text-sm font-bold min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Lancez vos premières ventes</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">Partagez votre boutique et commencez à vendre</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 sm:space-y-4">
            <Link to={storeId ? `/dashboard/store/${storeId}` : "/dashboard/store"} className="block">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                Gérer ma boutique
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            
            <Link to="/tableau-de-bord" className="block">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-6 py-4">
                Retour au tableau de bord
              </Button>
            </Link>
            
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                Besoin d'aide ?
              </p>
              <div className="space-x-3 sm:space-x-4">
                <Link to="/ressources" className="text-primary hover:underline text-xs sm:text-sm">
                  Centre d'aide
                </Link>
                <Link to="/contact" className="text-primary hover:underline text-xs sm:text-sm">
                  Contactez le support
                </Link>
              </div>
            </div>
          </div>

          {sessionId && (
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-muted rounded-lg">
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                ID de session : {sessionId}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Success;
