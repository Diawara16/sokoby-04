
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Bot, User, Zap, ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ROICalculator } from "@/components/comparison/ROICalculator";
import { ProcessTimeline } from "@/components/comparison/ProcessTimeline";
import { MythBuster } from "@/components/comparison/MythBuster";
import { PerformanceStats } from "@/components/comparison/PerformanceStats";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ComparisonModeles() {
  const features = [
    {
      feature: "Temps de création",
      aiStore: "5-10 minutes",
      manual: "25-35 heures",
      aiIcon: <Zap className="h-4 w-4 text-green-500" />,
      manualIcon: <X className="h-4 w-4 text-red-500" />
    },
    {
      feature: "Effort requis",
      aiStore: "Minimal (choix de niche)",
      manual: "Important (design, contenu, SEO)",
      aiIcon: <Check className="h-4 w-4 text-green-500" />,
      manualIcon: <X className="h-4 w-4 text-red-500" />
    },
    {
      feature: "Expertise technique",
      aiStore: "Aucune requise",
      manual: "SEO, design, marketing",
      aiIcon: <Check className="h-4 w-4 text-green-500" />,
      manualIcon: <X className="h-4 w-4 text-red-500" />
    },
    {
      feature: "Produits inclus",
      aiStore: "30-100+ produits optimisés",
      manual: "Vous trouvez et ajoutez",
      aiIcon: <Check className="h-4 w-4 text-green-500" />,
      manualIcon: <User className="h-4 w-4 text-blue-500" />
    },
    {
      feature: "SEO optimisé",
      aiStore: "Automatique par IA",
      manual: "Vous configurez tout",
      aiIcon: <Check className="h-4 w-4 text-green-500" />,
      manualIcon: <User className="h-4 w-4 text-blue-500" />
    },
    {
      feature: "Fournisseurs intégrés",
      aiStore: "Automatiquement connectés",
      manual: "Recherche et négociation",
      aiIcon: <Check className="h-4 w-4 text-green-500" />,
      manualIcon: <X className="h-4 w-4 text-red-500" />
    },
    {
      feature: "Personnalisation",
      aiStore: "Modifiable après génération",
      manual: "Contrôle total dès le début",
      aiIcon: <Check className="h-4 w-4 text-green-500" />,
      manualIcon: <Check className="h-4 w-4 text-green-500" />
    },
    {
      feature: "Coût initial",
      aiStore: "$20-80 (une fois)",
      manual: "Gratuit",
      aiIcon: <X className="h-4 w-4 text-red-500" />,
      manualIcon: <Check className="h-4 w-4 text-green-500" />
    }
  ];

  const faqItems = [
    {
      question: "Quelle est vraiment la différence entre les deux approches ?",
      answer: "La Boutique IA est un service premium où notre équipe + IA créent votre boutique complète automatiquement. La création manuelle vous donne tous les outils pour créer vous-même, mais nécessite du temps et des compétences techniques."
    },
    {
      question: "Pourquoi payer 20-80€ quand je peux créer gratuitement ?",
      answer: "Vous payez pour économiser 25-35 heures de travail, avoir une boutique optimisée dès le départ, et bénéficier de notre expertise. Si votre temps vaut 25€/h, vous économisez 600-800€ en frais de main d'œuvre."
    },
    {
      question: "Les boutiques IA sont-elles vraiment performantes ?",
      answer: "Oui ! Nos statistiques montrent un CA moyen de 4 200€/mois vs 2 800€ pour les créations manuelles, car elles sont optimisées dès le départ avec des données de marché réelles."
    },
    {
      question: "Puis-je modifier ma boutique IA après création ?",
      answer: "Absolument ! Une fois générée, vous avez accès à tous les outils Sokoby : ajout de produits, modification du design, gestion des commandes, marketing, etc."
    },
    {
      question: "Que se passe-t-il si je ne suis pas satisfait de ma boutique IA ?",
      answer: "Nous offrons une garantie satisfait ou remboursé de 14 jours. Si la boutique ne correspond pas à vos attentes, nous la modifions ou remboursons intégralement."
    },
    {
      question: "Combien de temps pour voir les premiers résultats ?",
      answer: "Nos clients voient généralement leurs premières ventes dans les 7-14 jours suivant la création, contre 4-8 semaines pour les créations manuelles."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Boutique IA vs Création Manuelle
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comparaison complète pour vous aider à choisir l'approche qui correspond 
            le mieux à vos besoins, votre budget et vos objectifs business.
          </p>
        </div>

        {/* Performance Stats */}
        <PerformanceStats />

        {/* ROI Calculator */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Calculez votre retour sur investissement</h2>
          <p className="text-gray-600 mb-8">Découvrez combien vous économisez vraiment avec la Boutique IA</p>
          <ROICalculator />
        </div>

        {/* Process Timeline */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Comparaison des processus</h2>
          <p className="text-gray-600 mb-8">Visualisez concrètement la différence de temps et d'effort</p>
          <ProcessTimeline />
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* AI Store Card */}
          <Card className="border-2 border-primary relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary">
                <Bot className="h-4 w-4 mr-1" />
                Recommandé pour débuter
              </Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Boutique IA</CardTitle>
              <CardDescription>
                Service "clé en main" - Nous créons votre boutique automatiquement
              </CardDescription>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">$20-80</div>
                <div className="text-sm text-gray-600">Frais unique de génération</div>
                <div className="text-sm text-gray-500">+ Abonnement Sokoby mensuel</div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Boutique créée en 5-10 minutes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">30-100+ produits inclus et optimisés</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">SEO automatiquement configuré</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Design professionnel généré</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Fournisseurs intégrés automatiquement</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Support prioritaire inclus</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/creer-boutique-ia">
                  Créer ma Boutique IA
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Manual Creation Card */}
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Création Manuelle</CardTitle>
              <CardDescription>
                Créez vous-même votre boutique avec nos outils
              </CardDescription>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">Gratuit</div>
                <div className="text-sm text-gray-600">Aucun frais de création</div>
                <div className="text-sm text-gray-500">Seulement l'abonnement Sokoby mensuel</div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Contrôle total du design</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Personnalisation illimitée</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Ajoutez vos propres produits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Évolutif selon vos besoins</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Temps de création plus long</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Compétences techniques requises</span>
                </li>
              </ul>
              <Button variant="outline" asChild className="w-full">
                <Link to="/register">
                  Commencer gratuitement
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Comparison Table */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Comparaison détaillée critère par critère</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-2 font-semibold">Critère</th>
                    <th className="text-center py-4 px-2">
                      <div className="flex items-center justify-center gap-2">
                        <Bot className="h-5 w-5" />
                        <span className="font-semibold">Boutique IA</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-2">
                      <div className="flex items-center justify-center gap-2">
                        <User className="h-5 w-5" />
                        <span className="font-semibold">Création Manuelle</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-2 font-medium">{item.feature}</td>
                      <td className="py-4 px-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {item.aiIcon}
                          <span className="text-sm">{item.aiStore}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {item.manualIcon}
                          <span className="text-sm">{item.manual}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Myth Buster */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Démystifions les idées reçues</h2>
          <p className="text-gray-600 mb-8">La vérité sur l'IA et la création de boutiques e-commerce</p>
          <MythBuster />
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Questions fréquentes sur le choix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-700">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-blue-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-4">Prêt à faire votre choix ?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Que vous choisissiez la rapidité de l'IA ou le contrôle de la création manuelle, 
            Sokoby vous accompagne vers le succès de votre business e-commerce.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/creer-boutique-ia">
                <Bot className="h-5 w-5 mr-2" />
                Créer ma Boutique IA
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">
                <User className="h-5 w-5 mr-2" />
                Création manuelle gratuite
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
