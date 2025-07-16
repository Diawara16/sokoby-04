import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Zap } from "lucide-react";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le temps de vérification de la session
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-8"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Vérification de votre paiement...
          </h1>
          <p className="text-gray-600">
            Veuillez patienter pendant que nous confirmons votre abonnement.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Félicitations ! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Votre abonnement a été activé avec succès. Votre essai gratuit de 14 jours commence maintenant !
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Zap className="h-6 w-6 text-red-600 mr-2" />
                Prochaines étapes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 text-red-600 rounded-full p-2 text-sm font-bold min-w-[2rem] h-8 flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Accédez à votre tableau de bord</h3>
                  <p className="text-gray-600 text-sm">Configurez votre boutique et explorez toutes les fonctionnalités</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 text-red-600 rounded-full p-2 text-sm font-bold min-w-[2rem] h-8 flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Créez votre première boutique</h3>
                  <p className="text-gray-600 text-sm">Utilisez notre IA pour générer votre boutique en quelques minutes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 text-red-600 rounded-full p-2 text-sm font-bold min-w-[2rem] h-8 flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ajoutez vos produits</h3>
                  <p className="text-gray-600 text-sm">Importez ou créez vos produits avec l'assistance de l'IA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Link to="/tableau-de-bord">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3">
                Accéder au tableau de bord
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                Besoin d'aide ? Consultez notre
              </p>
              <div className="space-x-4">
                <Link to="/ressources" className="text-red-600 hover:underline text-sm">
                  Centre d'aide
                </Link>
                <Link to="/contact" className="text-red-600 hover:underline text-sm">
                  Contactez le support
                </Link>
              </div>
            </div>
          </div>

          {sessionId && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-500">
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