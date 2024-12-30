import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { niches } from "@/data/niches";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface NicheSelectorProps {
  selectedNiche: string;
  onSelectNiche: (niche: string) => void;
}

export const NicheSelector = ({ selectedNiche, onSelectNiche }: NicheSelectorProps) => {
  const { toast } = useToast();

  const handlePurchaseNiche = async (niche: string, price: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour acheter une niche",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { niche, price }
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
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {niches.map((niche) => (
          <Card 
            key={niche.name}
            className={`relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
              selectedNiche === niche.name 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:ring-1 hover:ring-primary/50'
            }`}
          >
            <div className="p-6">
              <div className="flex flex-col h-full">
                <div className="text-5xl mb-4">{niche.icon}</div>
                <h3 className="text-xl font-bold mb-2">{niche.name}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{niche.description}</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{niche.products} produits</span>
                    <span className="text-lg font-bold text-primary">${niche.price}</span>
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchaseNiche(niche.name, niche.price);
                    }}
                  >
                    Choisir cette niche
                  </Button>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              {niche.price > 20 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                  Premium
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};