
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

interface NicheCardProps {
  name: string;
  icon: string;
  description: string;
  price: number;
  products: number;
  popular?: boolean;
  features: string[];
  onSelect: () => void;
}

export const NicheCard = ({ 
  name, 
  icon, 
  description, 
  price, 
  products, 
  popular, 
  features, 
  onSelect 
}: NicheCardProps) => {
  return (
    <Card className={`relative p-6 hover:shadow-lg transition-shadow cursor-pointer ${
      popular ? 'border-primary shadow-md' : ''
    }`}>
      {popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
          <Star className="w-3 h-3 mr-1" />
          Populaire
        </Badge>
      )}
      
      <div className="text-center space-y-4">
        <div className="text-4xl mb-3">{icon}</div>
        
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-primary">
            ${price}
            <span className="text-sm text-gray-600 font-normal"> USD</span>
          </div>
          <p className="text-sm text-gray-500">{products} produits inclus</p>
        </div>
        
        <div className="space-y-2 text-left">
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={onSelect}
          className="w-full mt-4"
          size="lg"
        >
          Créer cette boutique
        </Button>
      </div>
    </Card>
  );
};
