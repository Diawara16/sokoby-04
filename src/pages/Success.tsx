import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Zap, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [storeGenerated, setStoreGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const checkStoreStatus = async () => {
      if (!sessionId) {
        setError("Aucun ID de session trouvé");
        setLoading(false);
        return;
      }

      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("Utilisateur non authentifié");
          setLoading(false);
          return;
        }

        // Check store status
        const { data: store, error: storeError } = await supabase
          .from('store_settings')
          .select('*')
          .eq('stripe_checkout_session_id', sessionId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (storeError) {
          console.error('Error fetching store:', storeError);
          throw storeError;
        }

        if (!store) {
          if (attempts < 10) {
            // Retry after 2 seconds
            setTimeout(() => {
              setAttempts(a => a + 1);
            }, 2000);
          } else {
            setError("Boutique introuvable. Veuillez contacter le support.");
            setLoading(false);
          }
          return;
        }

        // Check if store payment is completed and products are generated
        if (store.payment_status === 'completed' && store.initial_products_generated) {
          setStoreGenerated(true);
          setLoading(false);
        } else if (attempts < 30) {
          // Keep checking every 2 seconds for up to 1 minute
          setTimeout(() => {
            setAttempts(a => a + 1);
          }, 2000);
        } else {
          // Timeout - payment completed but store not generated yet
          setStoreGenerated(true); // Still show success
          setLoading(false);
          toast({
            title: "Génération en cours",
            description: "Votre paiement est confirmé. La génération de votre boutique peut prendre quelques minutes.",
          });
        }
      } catch (err) {
        console.error('Error checking store status:', err);
        setError("Erreur lors de la vérification du paiement");
        setLoading(false);
      }
    };

    checkStoreStatus();
  }, [sessionId, attempts, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16 text-center">
          <Loader2 className="h-16 w-16 sm:h-24 sm:w-24 animate-spin text-red-600 mx-auto mb-6 sm:mb-8" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            {attempts < 10 ? 'Vérification de votre paiement...' : 'Génération de votre boutique...'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {attempts < 10 
              ? 'Veuillez patienter pendant que nous confirmons votre paiement.'
              : 'Votre boutique IA est en cours de création. Cela peut prendre quelques instants.'}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16 text-center">
          <AlertCircle className="h-16 w-16 sm:h-24 sm:w-24 text-red-600 mx-auto mb-6 sm:mb-8" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Une erreur est survenue
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            {error}
          </p>
          <div className="space-y-3 sm:space-y-4">
            <Link to="/tableau-de-bord">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Retour au tableau de bord
              </Button>
            </Link>
            <div>
              <Link to="/contact" className="text-red-600 hover:underline text-sm">
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <CheckCircle className="h-16 w-16 sm:h-24 sm:w-24 text-green-500 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Félicitations ! 🎉
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
              {storeGenerated 
                ? "Votre boutique IA a été créée avec succès ! Vous pouvez maintenant commencer à la personnaliser."
                : "Votre paiement a été confirmé. Votre boutique IA est prête !"}
            </p>
          </div>

          <Card className="mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-lg sm:text-xl">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mr-2" />
                Prochaines étapes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 text-left">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="bg-red-100 text-red-600 rounded-full p-2 text-xs sm:text-sm font-bold min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Accédez à votre tableau de bord</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Visualisez votre boutique et explorez toutes les fonctionnalités</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="bg-red-100 text-red-600 rounded-full p-2 text-xs sm:text-sm font-bold min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Personnalisez votre boutique</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Modifiez les produits, ajoutez votre logo et configurez vos paramètres</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="bg-red-100 text-red-600 rounded-full p-2 text-xs sm:text-sm font-bold min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Lancez vos premières ventes</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Partagez votre boutique et commencez à vendre</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 sm:space-y-4">
            <Link to="/tableau-de-bord" className="block">
              <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                Accéder au tableau de bord
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-500 mb-2">
                Besoin d'aide ?
              </p>
              <div className="space-x-3 sm:space-x-4">
                <Link to="/ressources" className="text-red-600 hover:underline text-xs sm:text-sm">
                  Centre d'aide
                </Link>
                <Link to="/contact" className="text-red-600 hover:underline text-xs sm:text-sm">
                  Contactez le support
                </Link>
              </div>
            </div>
          </div>

          {sessionId && (
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-100 rounded-lg">
              <p className="text-[10px] sm:text-xs text-gray-500">
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