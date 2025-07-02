import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, Download, Zap, ShoppingCart, BarChart3, Mail } from "lucide-react";
import { T } from "@/components/translation/T";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const plugins = [
    {
      id: 1,
      name: "Zapier Pro Connect",
      description: "Connectez votre boutique à plus de 6000 applications via Zapier",
      category: "Intégrations",
      price: "Gratuit",
      rating: 4.8,
      downloads: 12500,
      icon: <Zap className="h-8 w-8 text-primary" />,
      featured: true
    },
    {
      id: 2,
      name: "Email Marketing Pro",
      description: "Campagnes email automatisées avec segmentation avancée",
      category: "Marketing",
      price: "29€/mois",
      rating: 4.6,
      downloads: 8300,
      icon: <Mail className="h-8 w-8 text-primary" />
    },
    {
      id: 3,
      name: "Analytics Dashboard",
      description: "Tableaux de bord avancés avec métriques personnalisées",
      category: "Analytics",
      price: "19€/mois",
      rating: 4.9,
      downloads: 15600,
      icon: <BarChart3 className="h-8 w-8 text-primary" />
    },
    {
      id: 4,
      name: "Advanced Cart",
      description: "Panier intelligent avec recommandations et up-selling",
      category: "E-commerce",
      price: "39€/mois",
      rating: 4.7,
      downloads: 9200,
      icon: <ShoppingCart className="h-8 w-8 text-primary" />
    }
  ];

  const categories = ["Tous", "Intégrations", "Marketing", "Analytics", "E-commerce", "Paiement", "Design"];

  const filteredPlugins = plugins.filter(plugin =>
    plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <T as="h1" className="text-4xl font-bold mb-4">Marketplace d'Extensions</T>
          <T as="p" className="text-xl text-muted-foreground">
            Étendez les capacités de votre boutique avec nos plugins et intégrations
          </T>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des extensions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="tous" className="mb-8">
          <TabsList className="grid w-full grid-cols-7">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category.toLowerCase()}>
                <T>{category}</T>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="tous" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlugins.map((plugin) => (
                <Card key={plugin.id} className={`relative ${plugin.featured ? 'ring-2 ring-primary' : ''}`}>
                  {plugin.featured && (
                    <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                      <T>Recommandé</T>
                    </Badge>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {plugin.icon}
                      <div>
                        <CardTitle className="text-lg">{plugin.name}</CardTitle>
                        <Badge variant="secondary">{plugin.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="mb-4">
                      {plugin.description}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{plugin.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Download className="h-4 w-4" />
                        {plugin.downloads.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">{plugin.price}</span>
                      <Button>
                        <T>Installer</T>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;