import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const NICHES = [
  "Mode",
  "Beauté",
  "Maison & Déco",
  "High-Tech",
  "Sport & Fitness",
  "Bijoux",
  "Animaux",
  "Enfants",
  "Jardin",
  "Cuisine",
  "Bien-être",
  "Art & Collection"
];

interface NicheSelectorProps {
  selectedNiche: string;
  onSelectNiche: (niche: string) => void;
}

export const NicheSelector = ({ selectedNiche, onSelectNiche }: NicheSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNiches = NICHES.filter(niche =>
    niche.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher une niche..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNiches.map((niche) => (
          <Card
            key={niche}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedNiche === niche ? "border-primary" : ""
            }`}
            onClick={() => onSelectNiche(niche)}
          >
            <div className="text-center">
              <h3 className="font-medium">{niche}</h3>
            </div>
          </Card>
        ))}
      </div>

      {filteredNiches.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          Aucune niche trouvée pour "{searchTerm}"
        </div>
      )}
    </div>
  );
};