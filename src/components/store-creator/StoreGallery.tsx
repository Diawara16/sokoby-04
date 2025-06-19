
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Wand2, TrendingUp, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { StoreExampleCard } from "./StoreExampleCard";
import { storeExamples } from "@/data/storeExamples";

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

  const totalRevenue = storeExamples.reduce((sum, store) => {
    const revenue = parseInt(store.monthlyRevenue.replace(/[€,]/g, ''));
    return sum + revenue;
  }, 0);

  const averageConversion = storeExamples.reduce((sum, store) => {
    const conversion = parseFloat(store.conversionRate.replace('%', ''));
    return sum + conversion;
  }, 0) / storeExamples.length;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 font-heading">
          Boutiques créées par notre IA
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez des exemples réels de boutiques générées automatiquement par notre IA. 
          Chaque boutique est unique, optimisée et génère des revenus réels.
        </p>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-8">
          <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">€{(totalRevenue/1000).toFixed(0)}K</div>
            <div className="text-sm text-green-600">CA mensuel total</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
            <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{averageConversion.toFixed(1)}%</div>
            <div className="text-sm text-blue-600">Conversion moyenne</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <Wand2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">3 min</div>
            <div className="text-sm text-purple-600">Temps de création</div>
          </Card>
        </div>
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
          <StoreExampleCard key={store.id} store={store} />
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          <p className="text-lg">Aucune boutique trouvée</p>
          <p className="text-sm">Essayez de modifier vos critères de recherche</p>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Prêt à créer votre boutique IA ?</h3>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Rejoignez ces entrepreneurs qui génèrent des revenus avec des boutiques créées par notre IA en quelques minutes.
        </p>
        <Link to="/creer-boutique-ia">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Wand2 className="w-5 h-5 mr-2" />
            Créer ma boutique maintenant
          </Button>
        </Link>
      </div>
    </div>
  );
};
