import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin } from "lucide-react";

const LocationSettings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Paramètres de géolocalisation mis à jour",
      description: "Vos paramètres de géolocalisation ont été sauvegardés avec succès.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres de géolocalisation</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Adresse du magasin
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                placeholder="123 rue du Commerce"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  placeholder="Paris"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="postal_code">Code postal</Label>
                <Input
                  id="postal_code"
                  placeholder="75001"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                placeholder="France"
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Zones de livraison</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="delivery_radius">Rayon de livraison (km)</Label>
              <Input
                id="delivery_radius"
                type="number"
                placeholder="10"
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Button onClick={handleSave} className="w-full">
          Sauvegarder les modifications
        </Button>
      </div>
    </div>
  );
};

export default LocationSettings;