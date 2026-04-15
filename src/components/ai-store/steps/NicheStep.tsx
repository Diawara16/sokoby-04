import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface NicheOption {
  id: string;
  label: string;
  emoji: string;
  keywords: string[];
}

interface NicheStepProps {
  niches: NicheOption[];
  onSelect: (nicheId: string) => void;
}

export function NicheStep({ niches, onSelect }: NicheStepProps) {
  const [search, setSearch] = useState("");

  const filtered = niches.filter(
    (n) =>
      n.label.toLowerCase().includes(search.toLowerCase()) ||
      n.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          IA recommande votre niche
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Quel type de boutique voulez-vous créer ?
        </h2>
        <p className="text-muted-foreground">
          Choisissez un marché ou tapez votre propre idée
        </p>
      </div>

      <Input
        placeholder="🔍 Rechercher un marché..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md mx-auto"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((niche) => (
          <Card
            key={niche.id}
            className="p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all group"
            onClick={() => onSelect(niche.id)}
          >
            <div className="text-center space-y-3">
              <span className="text-4xl block group-hover:scale-110 transition-transform">{niche.emoji}</span>
              <h3 className="font-semibold text-foreground">{niche.label}</h3>
              <div className="flex flex-wrap gap-1 justify-center">
                {niche.keywords.map((k) => (
                  <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {search && filtered.length === 0 && (
        <Card
          className="p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all text-center border-dashed border-2"
          onClick={() => onSelect(search.toLowerCase().replace(/\s+/g, "-"))}
        >
          <span className="text-3xl block mb-2">✨</span>
          <h3 className="font-semibold text-foreground">Créer "{search}"</h3>
          <p className="text-sm text-muted-foreground">Niche personnalisée</p>
        </Card>
      )}
    </div>
  );
}
