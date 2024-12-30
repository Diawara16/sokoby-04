export const niches = [
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
  },
  {
    name: "Premium Supplements Store",
    icon: "💪",
    description: "Suppléments et produits premium",
    products: 30,
    price: 50
  },
  {
    name: "General Store",
    icon: "🏪",
    description: "Plus de 100 produits variés",
    products: 100,
    price: 147
  }
];

<lov-write file_path="src/components/store-creator/NicheSelector.tsx">
import { Card } from "@/components/ui/card";
import { niches } from "@/data/niches";

interface NicheSelectorProps {
  onNicheSelect: (niche: string) => void;
}

export const NicheSelector = ({ onNicheSelect }: NicheSelectorProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">
        Choisissez votre niche
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {niches.map((niche) => (
          <Card 
            key={niche.name}
            className="p-6 cursor-pointer hover:border-primary transition-colors"
            onClick={() => onNicheSelect(niche.name)}
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
  );
};