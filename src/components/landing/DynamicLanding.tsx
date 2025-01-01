import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface LandingPageData {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  cta_text: string;
  store_id: string;
}

export const DynamicLanding = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const { data: storeSettings } = await supabase
          .from("store_settings")
          .select("*")
          .eq("domain_name", slug)
          .maybeSingle();

        if (storeSettings) {
          setPageData({
            id: storeSettings.id,
            title: storeSettings.store_name || "Boutique en ligne",
            description: "Découvrez notre sélection de produits",
            hero_image: "/placeholder.svg",
            cta_text: "Découvrir",
            store_id: storeSettings.id
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la page:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la page d'atterrissage",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchLandingPage();
    }
  }, [slug, toast]);

  if (loading) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-12 w-40" />
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">Page non trouvée</h1>
        <p className="text-gray-600 mb-8">
          Désolé, cette page n'existe pas ou n'est plus disponible.
        </p>
        <Button variant="default" onClick={() => window.location.href = "/"}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-24 px-4">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px]" />
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold animate-fadeIn">
                {pageData.title}
              </h1>
              <p className="text-lg sm:text-xl text-red-100 max-w-2xl mx-auto">
                {pageData.description}
              </p>
              <Button 
                size="lg"
                className="bg-white text-red-600 hover:bg-red-50"
              >
                {pageData.cta_text}
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Nos avantages
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Livraison rapide",
                  description: "Recevez vos commandes en temps record"
                },
                {
                  title: "Service client",
                  description: "Une équipe à votre écoute 7j/7"
                },
                {
                  title: "Garantie satisfait",
                  description: "Ou remboursé sous 30 jours"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-lg bg-gray-50 text-center hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};