
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Eye, ExternalLink, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface StoreExample {
  id: string;
  name: string;
  niche: string;
  description: string;
  image: string;
  previewImages: string[];
  rating: number;
  features: string[];
  price: number;
  monthlyRevenue: string;
  conversionRate: string;
}

interface StoreExampleCardProps {
  store: StoreExample;
}

export const StoreExampleCard = ({ store }: StoreExampleCardProps) => {
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={store.image} 
          alt={`Boutique ${store.name}`}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <Badge className="absolute top-4 right-4 bg-primary/90 text-white">
          {store.niche}
        </Badge>
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
          Créé par IA en 3 min
        </div>
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
        
        <div className="grid grid-cols-2 gap-4 py-3 bg-gray-50 rounded-lg px-3">
          <div className="text-center">
            <div className="text-sm font-semibold text-green-600">{store.monthlyRevenue}</div>
            <div className="text-xs text-gray-500">CA mensuel</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-blue-600">{store.conversionRate}</div>
            <div className="text-xs text-gray-500">Conversion</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {store.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {store.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{store.features.length - 3} autres
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Prix de création:</span>
            <span className="font-semibold text-primary">${store.price} USD</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Aperçu de {store.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {store.previewImages.map((img, index) => (
                    <div key={index} className="aspect-video relative overflow-hidden rounded-lg border">
                      <img 
                        src={img}
                        alt={`Aperçu ${index + 1} de ${store.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Fonctionnalités incluses :</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {store.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button size="sm" className="flex-1" asChild>
            <Link to="/creer-boutique-ia">
              <Wand2 className="w-4 h-4 mr-2" />
              Créer similaire
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
