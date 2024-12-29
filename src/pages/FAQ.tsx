import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  const faqItems = [
    {
      question: "Comment fonctionne la période d'essai gratuite ?",
      answer: "Vous bénéficiez d'une période d'essai gratuite de 14 jours lors de votre inscription. Durant cette période, vous avez accès à toutes les fonctionnalités de la plateforme. Aucune carte bancaire n'est requise pour commencer l'essai."
    },
    {
      question: "Comment puis-je changer mon abonnement ?",
      answer: "Vous pouvez changer votre abonnement à tout moment depuis votre espace profil. Le changement prendra effet à la fin de votre période de facturation en cours. Si vous passez à un plan supérieur, la différence sera calculée au prorata."
    },
    {
      question: "Comment annuler mon abonnement ?",
      answer: "Vous pouvez annuler votre abonnement à tout moment depuis votre espace profil. L'annulation prendra effet à la fin de votre période de facturation en cours. Vous conserverez l'accès à toutes les fonctionnalités jusqu'à cette date."
    },
    {
      question: "Quels modes de paiement acceptez-vous ?",
      answer: "Nous acceptons les cartes de crédit (Visa, Mastercard, American Express), ainsi que les paiements via Apple Pay et Google Pay. Tous les paiements sont sécurisés et cryptés."
    },
    {
      question: "La facturation est-elle mensuelle ou annuelle ?",
      answer: "Nous proposons une facturation mensuelle par défaut. Des tarifs préférentiels sont disponibles pour les engagements annuels. Contactez notre service commercial pour plus d'informations sur les tarifs annuels."
    },
    {
      question: "Que se passe-t-il à la fin de ma période d'essai ?",
      answer: "À la fin de votre période d'essai de 14 jours, vous serez invité à choisir un plan d'abonnement pour continuer à utiliser la plateforme. Si vous ne souhaitez pas continuer, votre compte passera automatiquement en version limitée."
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Questions fréquentes</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left px-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}