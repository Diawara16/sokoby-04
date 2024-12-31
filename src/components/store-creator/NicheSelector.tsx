import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { niches } from "@/data/niches";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface NicheSelectorProps {
  selectedNiche: string;
  onSelectNiche: (niche: string) => void;
}

export const NicheSelector = ({ selectedNiche, onSelectNiche }: NicheSelectorProps) => {
  const { toast } = useToast();
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [selectedNicheForPricing, setSelectedNicheForPricing] = useState("");

  const handleNicheSelect = (niche: string) => {
    setSelectedNicheForPricing(niche);
    setShowPricingDialog(true);
  };

  const handlePurchaseNiche = async (planType: 'starter' | 'pro' | 'enterprise') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour créer une boutique",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-store-checkout', {
        body: { 
          planType,
          niche: selectedNicheForPricing
        }
      });

      if (error) {
        console.error('Erreur lors de la création de la session:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de la session de paiement",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Impossible de créer la session de paiement");
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'achat",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {niches.map((niche) => (
            <Card 
              key={niche.name}
              className={`relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                selectedNiche === niche.name 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:ring-1 hover:ring-primary/50'
              }`}
              onClick={() => handleNicheSelect(niche.name)}
            >
              <div className="p-6">
                <div className="flex flex-col h-full">
                  <div className="text-5xl mb-4">{niche.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{niche.name}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{niche.description}</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{niche.products} produits</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Choisissez votre plan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 mt-4">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Plan Démarrage</h3>
              <p className="text-2xl font-bold mb-4">$11.00 <span className="text-sm text-gray-500">/mois</span></p>
              <ul className="space-y-2 mb-4">
                <li>✓ Jusqu'à 100 produits</li>
                <li>✓ Support par email</li>
                <li>✓ Analyses de base</li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => handlePurchaseNiche('starter')}
              >
                Choisir le plan Démarrage
              </Button>
            </Card>

            <Card className="p-6 border-2 border-primary">
              <div className="absolute -top-3 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                Populaire
              </div>
              <h3 className="text-xl font-bold mb-2">Plan Pro</h3>
              <p className="text-2xl font-bold mb-4">$19.00 <span className="text-sm text-gray-500">/mois</span></p>
              <ul className="space-y-2 mb-4">
                <li>✓ Produits illimités</li>
                <li>✓ Support prioritaire</li>
                <li>✓ Analyses avancées</li>
                <li>✓ Personnalisation complète</li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => handlePurchaseNiche('pro')}
              >
                Choisir le plan Pro
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Plan Entreprise</h3>
              <p className="text-2xl font-bold mb-4">$49.00 <span className="text-sm text-gray-500">/mois</span></p>
              <ul className="space-y-2 mb-4">
                <li>✓ Tout dans Pro</li>
                <li>✓ Support dédié 24/7</li>
                <li>✓ API personnalisée</li>
                <li>✓ Formation sur mesure</li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => handlePurchaseNiche('enterprise')}
              >
                Choisir le plan Entreprise
              </Button>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};