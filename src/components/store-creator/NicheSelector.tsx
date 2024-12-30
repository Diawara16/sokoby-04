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

      // Créer une session de paiement Stripe via notre fonction Edge
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          niche,
          price,
          mode: 'payment'
        }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">
        Choisissez votre niche
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {niches.map((niche) => (
          <Card 
            key={niche.name}
            className={`p-6 cursor-pointer transition-colors ${
              selectedNiche === niche.name ? 'border-primary' : 'hover:border-primary'
            }`}
            onClick={() => onSelectNiche(niche.name)}
          >
            <div className="text-4xl mb-4">{niche.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{niche.name}</h3>
            <p className="text-muted-foreground mb-4">{niche.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span>{niche.products} produits</span>
              <span className="font-semibold">${niche.price}</span>
            </div>
            <Button 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handlePurchaseNiche(niche.name, niche.price);
              }}
            >
              Acheter cette niche
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};