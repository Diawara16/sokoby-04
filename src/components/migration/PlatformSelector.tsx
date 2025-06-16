
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Wordpress, Box, Palette, Layers, Zap } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  marketShare: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  estimatedTime: string;
}

const platforms: Platform[] = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Plateforme e-commerce hébergée leader mondial',
    icon: <ShoppingCart className="h-8 w-8" />,
    marketShare: '10.3%',
    difficulty: 'Easy',
    estimatedTime: '5-7 jours'
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Plugin WordPress le plus populaire pour l\'e-commerce',
    icon: <Wordpress className="h-8 w-8" />,
    marketShare: '28.24%',
    difficulty: 'Medium',
    estimatedTime: '7-10 jours'
  },
  {
    id: 'bigcommerce',
    name: 'BigCommerce',
    description: 'Plateforme e-commerce pour entreprises en croissance',
    icon: <Box className="h-8 w-8" />,
    marketShare: '3.1%',
    difficulty: 'Easy',
    estimatedTime: '5-7 jours'
  },
  {
    id: 'squarespace',
    name: 'Squarespace',
    description: 'Constructeur de sites avec fonctionnalités e-commerce',
    icon: <Palette className="h-8 w-8" />,
    marketShare: '2.8%',
    difficulty: 'Medium',
    estimatedTime: '7-10 jours'
  },
  {
    id: 'magento',
    name: 'Magento 2',
    description: 'Plateforme e-commerce open source puissante',
    icon: <Layers className="h-8 w-8" />,
    marketShare: '2.4%',
    difficulty: 'Advanced',
    estimatedTime: '10-14 jours'
  },
  {
    id: 'volusion',
    name: 'Volusion',
    description: 'Solution e-commerce pour PME depuis 1999',
    icon: <Zap className="h-8 w-8" />,
    marketShare: '0.8%',
    difficulty: 'Medium',
    estimatedTime: '7-10 jours'
  }
];

interface PlatformSelectorProps {
  selectedPlatform: string;
  onPlatformSelect: (platformId: string) => void;
}

export const PlatformSelector = ({ selectedPlatform, onPlatformSelect }: PlatformSelectorProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Choisissez votre plateforme actuelle</h2>
        <p className="text-gray-600">Nous supportons la migration depuis toutes les principales plateformes e-commerce</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <Card 
            key={platform.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedPlatform === platform.id 
                ? 'ring-2 ring-red-500 border-red-500' 
                : 'border-gray-200 hover:border-red-300'
            }`}
            onClick={() => onPlatformSelect(platform.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-red-600">
                  {platform.icon}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(platform.difficulty)}`}>
                  {platform.difficulty}
                </span>
              </div>
              <CardTitle className="text-lg">{platform.name}</CardTitle>
              <CardDescription className="text-sm">{platform.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Part de marché:</span>
                  <span className="font-medium">{platform.marketShare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durée estimée:</span>
                  <span className="font-medium">{platform.estimatedTime}</span>
                </div>
              </div>
              
              {selectedPlatform === platform.id && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    Plateforme sélectionnée
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
