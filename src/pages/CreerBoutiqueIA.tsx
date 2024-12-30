import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { applications } from "@/data/applications";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { supabase } from "@/lib/supabase";

interface NicheOption {
  name: string;
  icon: string;
  description: string;
  products: number;
  price: number;
}

const niches: NicheOption[] = [
  {
    name: "Fitness Store",
    icon: "🏋️",
    description: "Équipement et accessoires de fitness",
    products: 30,
    price: 20
  },
  {
    name: "Clothing Store",
    icon: "👕",
    description: "Vêtements et accessoires de mode",
    products: 30,
    price: 20
  },
  {
    name: "Pets Store",
    icon: "🐕",
    description: "Produits pour animaux de compagnie",
    products: 30,
    price: 20
  },
  {
    name: "Cosmetics Store",
    icon: "💄",
    description: "Produits de beauté et cosmétiques",
    products: 30,
    price: 20
  },
  {
    name: "Home Goods Store",
    icon: "🏠",
    description: "Articles pour la maison",
    products: 30,
    price: 20
  },
  {
    name: "Electronics Store",
    icon: "🎧",
    description: "Produits électroniques",
    products: 30,
    price: 20
  },
  {
    name: "Babies Store",
    icon: "👶",
    description: "Produits pour bébés",
    products: 30,
    price: 20
  },
  {
    name: "Jewelry Store",
    icon: "💍",
    description: "Bijoux et accessoires",
    products: 30,
    price: 20
  }
];

const CreerBoutiqueIA = () => {
  const [step, setStep] = useState<'supplier' | 'niche' | 'creating' | 'done'>('supplier');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleSupplierSelect = async (supplierId: string) => {
    setSelectedSupplier(supplierId);
    setStep('niche');
  };

  const handleNicheSelect = async (nicheName: string) => {
    setSelectedNiche(nicheName);
    setIsCreating(true);
    setStep('creating');

    try {
      // Simuler la création de la boutique (à remplacer par l'appel à l'API IA)
      await new Promise(resolve => setTimeout(resolve, 3000));

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      // Mettre à jour les paramètres de la boutique
      const { error } = await supabase
        .from('store_settings')
        .update({
          store_name: `${nicheName}`,
          store_email: user.email,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setStep('done');
      toast({
        title: "Boutique créée avec succès !",
        description: "Votre boutique a été configurée avec les produits sélectionnés.",
      });
    } catch (error) {
      console.error('Erreur lors de la création de la boutique:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la boutique.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Créer votre boutique par IA</h1>
          <p className="text-muted-foreground">
            Notre IA va créer votre boutique en ligne en quelques minutes
          </p>
        </div>

        {step === 'supplier' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              Choisissez votre fournisseur de dropshipping
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  name={app.name}
                  description={app.description}
                  icon={app.icon}
                  isConnected={selectedSupplier === app.name}
                  onConnect={() => handleSupplierSelect(app.name)}
                  onDisconnect={() => setSelectedSupplier(null)}
                  isLoading={false}
                  price={app.price}
                />
              ))}
            </div>
          </div>
        )}

        {step === 'niche' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              Choisissez votre niche
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {niches.map((niche) => (
                <Card 
                  key={niche.name}
                  className="p-6 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleNicheSelect(niche.name)}
                >
                  <div className="text-4xl mb-4">{niche.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{niche.name}</h3>
                  <p className="text-muted-foreground mb-4">{niche.description}</p>
                  <div className="flex justify-between items-center">
                    <span>{niche.products} produits</span>
                    <span className="font-semibold">${niche.price}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'creating' && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Création de votre boutique en cours...
            </h2>
            <p className="text-muted-foreground">
              Notre IA sélectionne les meilleurs produits pour votre boutique
            </p>
          </div>
        )}

        {step === 'done' && (
          <Card className="p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Félicitations ! 🎉
            </h2>
            <p className="mb-6">
              Votre boutique a été créée avec succès. Vous pouvez maintenant commencer à personnaliser votre boutique et à vendre vos produits.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Aller au tableau de bord
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;