
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Star, Users, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const EssaiGratuit = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simuler l'inscription
    setTimeout(() => {
      toast({
        title: "Inscription réussie !",
        description: "Votre essai gratuit de 14 jours commence maintenant.",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const features = [
    "14 jours d'essai gratuit",
    "Création de boutique avec IA",
    "Thèmes professionnels illimités",
    "Support client 24/7",
    "100 produits inclus",
    "Analytics de base",
    "Intégrations e-commerce",
    "Formation et tutoriels"
  ];

  const testimonials = [
    {
      name: "Marie Dupont",
      business: "Boutique Mode",
      rating: 5,
      comment: "J'ai créé ma boutique en 10 minutes ! L'IA m'a tout configuré parfaitement."
    },
    {
      name: "Pierre Martin",
      business: "Artisanat Local",
      rating: 5,
      comment: "Interface intuitive et résultats professionnels. Je recommande !"
    },
    {
      name: "Sophie Leclerc",
      business: "Produits Bio",
      rating: 5,
      comment: "Le support client est exceptionnel. Ma boutique est en ligne depuis 2 jours."
    }
  ];

  const handleFocusEmailInput = () => {
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    if (emailInput) {
      emailInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            Offre limitée - 14 jours gratuits
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Créez votre boutique en ligne
            <span className="text-red-600"> gratuitement</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Lancez votre business e-commerce en quelques minutes avec notre IA. 
            Aucune carte bancaire requise pour commencer.
          </p>

          {/* Sign Up Form */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Commencer l'essai gratuit</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-center"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Création en cours..." : "Créer ma boutique gratuite"}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  En vous inscrivant, vous acceptez nos{" "}
                  <Link to="/conditions" className="text-red-600 hover:underline">
                    conditions d'utilisation
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tout ce dont vous avez besoin pour réussir
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Plus de 10 000 boutiques créées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Rejoignez des milliers d'entrepreneurs qui ont fait confiance 
                  à Sokoby pour lancer leur business.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Mise en ligne en 10 minutes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Notre IA configure automatiquement votre boutique. 
                  Vous n'avez qu'à personnaliser et publier.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Sécurisé et fiable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Hébergement sécurisé, paiements cryptés et sauvegarde 
                  automatique de vos données.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Ce que disent nos clients
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.business}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center bg-red-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à transformer votre idée en business ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Commencez votre essai gratuit de 14 jours maintenant. 
            Aucun engagement, annulation à tout moment.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-3"
            onClick={handleFocusEmailInput}
          >
            Démarrer maintenant
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EssaiGratuit;
