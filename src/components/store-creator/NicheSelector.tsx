import { Card } from "@/components/ui/card";
import { niches } from "@/data/niches";

interface NicheSelectorProps {
  selectedNiche: string;
  onSelectNiche: (niche: string) => void;
}

export const NicheSelector = ({ selectedNiche, onSelectNiche }: NicheSelectorProps) => {
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