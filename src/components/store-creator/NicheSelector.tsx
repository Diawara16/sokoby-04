
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { NicheCard } from "./NicheCard";

const NICHES = [
  {
    name: "Fitness Store",
    icon: "🏋️",
    description: "Équipement et accessoires de fitness",
    products: 30,
    price: 20,
    features: [
      "Équipements de musculation",
      "Accessoires fitness",
      "Nutrition sportive",
      "Vêtements de sport"
    ]
  },
  {
    name: "Fashion Store",
    icon: "👗",
    description: "Vêtements et accessoires de mode",
    products: 30,
    price: 20,
    features: [
      "Vêtements tendance",
      "Accessoires mode",
      "Chaussures",
      "Bijoux fantaisie"
    ]
  },
  {
    name: "Beauty Store",
    icon: "💄",
    description: "Produits de beauté et cosmétiques",
    products: 30,
    price: 20,
    features: [
      "Maquillage",
      "Soins de la peau",
      "Parfums",
      "Accessoires beauté"
    ]
  },
  {
    name: "Tech Store",
    icon: "📱",
    description: "Gadgets et accessoires électroniques",
    products: 30,
    price: 20,
    features: [
      "Smartphones",
      "Accessoires tech",
      "Écouteurs",
      "Gadgets innovants"
    ]
  },
  {
    name: "Home & Decor",
    icon: "🏠",
    description: "Articles pour la maison et décoration",
    products: 30,
    price: 20,
    features: [
      "Décoration intérieure",
      "Accessoires cuisine",
      "Rangement",
      "Éclairage"
    ]
  },
  {
    name: "Pet Store",
    icon: "🐕",
    description: "Produits pour animaux de compagnie",
    products: 30,
    price: 20,
    features: [
      "Accessoires chiens/chats",
      "Jouets pour animaux",
      "Alimentation",
      "Soins vétérinaires"
    ]
  },
  {
    name: "Jewelry Store",
    icon: "💍",
    description: "Bijoux et accessoires précieux",
    products: 30,
    price: 20,
    features: [
      "Bijoux fantaisie",
      "Montres",
      "Pierres précieuses",
      "Accessoires"
    ]
  },
  {
    name: "Wigs Store",
    icon: "💇",
    description: "Perruques et extensions capillaires",
    products: 30,
    price: 20,
    features: [
      "Perruques naturelles",
      "Extensions",
      "Accessoires capillaires",
      "Produits d'entretien"
    ]
  },
  {
    name: "General Store",
    icon: "🏪",
    description: "Boutique multi-niches avec large catalogue",
    products: 100,
    price: 80,
    popular: true,
    features: [
      "100+ produits variés",
      "Multi-catégories",
      "Fournisseurs intégrés",
      "Boutique complète",
      "Design premium",
      "SEO optimisé"
    ]
  }
];

interface NicheSelectorProps {
  selectedNiche: string;
  onSelectNiche: (niche: string) => void;
}

export const NicheSelector = ({ selectedNiche, onSelectNiche }: NicheSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNiches = NICHES.filter(niche =>
    niche.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    niche.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Choisissez votre type de boutique</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Sélectionnez une niche pour votre boutique. Notre IA générera automatiquement 
          tous les produits et intégrera les meilleurs fournisseurs.
        </p>
      </div>

      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher une niche..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNiches.map((niche) => (
          <NicheCard
            key={niche.name}
            name={niche.name}
            icon={niche.icon}
            description={niche.description}
            price={niche.price}
            products={niche.products}
            popular={niche.popular}
            features={niche.features}
            onSelect={() => onSelectNiche(niche.name)}
          />
        ))}
      </div>

      {filteredNiches.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <p className="text-lg">Aucune niche trouvée</p>
          <p className="text-sm">Essayez de modifier votre recherche</p>
        </div>
      )}
    </div>
  );
};
