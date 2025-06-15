
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ExternalLink, Eye, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface StoreExample {
  id: string;
  name: string;
  niche: string;
  description: string;
  image: string;
  url: string;
  rating: number;
  features: string[];
  price: number;
}

const storeExamples: StoreExample[] = [
  {
    id: "1",
    name: "Elite Fitness Hub",
    niche: "Fitness",
    description: "Boutique complète d'équipements de fitness et nutrition sportive",
    image: "/lovable-uploads/0cf990b9-e838-4f20-9840-c9a568e27967.png",
    url: "https://elite-fitness-hub.sokoby.com",
    rating: 4.8,
    features: ["Design responsive", "Catalogue IA", "SEO optimisé"],
    price: 20
  },
  {
    id: "2",
    name: "Glamour Wigs Studio",
    niche: "Perruques",
    description: "Collection premium de perruques et extensions capillaires",
    image: "/placeholder.svg",
    url: "https://glamour-wigs.sokoby.com",
    rating: 4.9,
    features: ["Visualisateur 3D", "Guide couleurs", "Chat expert"],
    price: 20
  },
  {
    id: "3",
    name: "Fashion Forward",
    niche: "Mode",
    description: "Vêtements tendance et accessoires pour tous styles",
    image: "/placeholder.svg",
    url: "https://fashion-forward.sokoby.com",
    rating: 4.7,
    features: ["Essai virtuel", "Recommandations IA", "Blog mode"],
    price: 20
  },
  {
    id: "4",
    name: "Tech Universe",
    niche: "Electronics",
    description: "Gadgets électroniques et accessoires high-tech",
    image: "/placeholder.svg",
    url: "https://tech-universe.sokoby.com",
    rating: 4.6,
    features: ["Comparateur produits", "Reviews clients", "Support 24/7"],
    price: 19
  },
  {
    id: "5",
    name: "Sparkle Jewelry",
    niche: "Bijoux",
    description: "Bijoux artisanaux et pièces de créateurs uniques",
    image: "/placeholder.svg",
    url: "https://sparkle-jewelry.sokoby.com",
    rating: 4.8,
    features: ["Certification authenticité", "Gravure personnalisée", "Écrin gratuit"],
    price: 19
  },
  {
    id: "6",
    name: "Everything Store",
    niche: "General",
    description: "Boutique généraliste avec plus de 100 produits variés",
    image: "/placeholder.svg",
    url: "https://everything-store.sokoby.com",
    rating: 4.5,
    features: ["Multi-catégories", "Stock illimité", "Livraison express"],
    price: 80
  }
];

const niches = ["Tous", "Fitness", "Perruques", "Mode", "Electronics", "Bijoux", "General"];

export const StoreGallery = () => {
  const [selectedNiche, setSelectedNiche] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStores = storeExamples.filter(store => {
    const matchesNiche = selectedNiche === "Tous" || store.niche === selectedNiche;
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesNiche && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 font-heading">
          Boutiques créées par notre IA
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez des exemples de boutiques générées automatiquement par notre IA. 
          Chaque boutique est unique et optimisée pour sa niche.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher une boutique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedNiche} onValueChange={setSelectedNiche} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
            {niches.map((niche) => (
              <TabsTrigger key={niche} value={niche} className="text-xs">
                {niche}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={store.image} 
                alt={store.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-primary/90">
                {store.niche}
              </Badge>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{store.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{store.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{store.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {store.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Prix de création:</span>
                  <span className="font-semibold text-primary">${store.price} USD</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={store.url} target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4 mr-2" />
                    Aperçu
                  </a>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link to="/creer-boutique-ia">
                    Créer similaire
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          <p className="text-lg">Aucune boutique trouvée</p>
          <p className="text-sm">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
};
