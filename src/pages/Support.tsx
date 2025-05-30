
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, HelpCircle, Book, MessageCircle, Mail } from "lucide-react";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqData = [
    {
      question: "Comment créer ma première boutique ?",
      answer: "Pour créer votre première boutique, cliquez sur 'Créer Boutique IA' depuis votre tableau de bord. Notre assistant IA vous guidera étape par étape dans la configuration de votre boutique."
    },
    {
      question: "Puis-je personnaliser le design de ma boutique ?",
      answer: "Oui, vous pouvez entièrement personnaliser votre boutique avec nos outils de design. Modifiez les couleurs, les polices, les layouts et ajoutez votre logo depuis l'éditeur de thème."
    },
    {
      question: "Comment ajouter des produits à ma boutique ?",
      answer: "Vous pouvez ajouter des produits manuellement ou utiliser notre système d'import en masse. Allez dans 'Produits' > 'Ajouter un produit' depuis votre tableau de bord."
    },
    {
      question: "Quels moyens de paiement sont supportés ?",
      answer: "Nous supportons les cartes bancaires, PayPal, Apple Pay, Google Pay et les virements bancaires selon votre région."
    },
    {
      question: "Comment configurer les frais de livraison ?",
      answer: "Dans les paramètres de votre boutique, allez dans 'Expédition' pour configurer vos zones de livraison et tarifs."
    },
    {
      question: "Comment suivre mes ventes et analytics ?",
      answer: "Votre tableau de bord contient toutes les statistiques de vente, le comportement des visiteurs et des rapports détaillés."
    }
  ];

  const filteredFaq = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Centre d'aide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Trouvez rapidement les réponses à vos questions ou contactez notre équipe support.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-lg"
            />
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Book className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Guides détaillés pour utiliser toutes les fonctionnalités de Sokoby.
              </p>
              <Button variant="outline" className="w-full">
                Voir la documentation
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Chat en direct</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Discutez directement avec notre équipe support pour une aide immédiate.
              </p>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Démarrer un chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Mail className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Créer un ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Créez un ticket pour des questions complexes ou des problèmes techniques.
              </p>
              <Button variant="outline" className="w-full">
                Créer un ticket
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Questions fréquentes</h2>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {filteredFaq.length} résultat(s)
            </Badge>
          </div>

          {filteredFaq.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600">
                  Essayez avec d'autres mots-clés ou contactez notre support.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaq.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Contact Section */}
        <section className="bg-white rounded-lg p-12 shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Notre équipe support est disponible 24/7 pour vous aider à résoudre 
            tous vos problèmes.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              Contacter le support
            </Button>
            <Button variant="outline" size="lg">
              Planifier un appel
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
