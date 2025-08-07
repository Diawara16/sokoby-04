import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Truck, MapPin, Clock, Euro, Plus, Trash2 } from "lucide-react";

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  methods: ShippingMethod[];
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  enabled: boolean;
}

export function StoreShippingSettings() {
  const [zones, setZones] = useState<ShippingZone[]>([
    {
      id: '1',
      name: 'France métropolitaine',
      countries: ['FR'],
      methods: [
        { id: '1', name: 'Livraison standard', price: 4.90, estimatedDays: '3-5 jours', enabled: true },
        { id: '2', name: 'Livraison express', price: 9.90, estimatedDays: '1-2 jours', enabled: true },
        { id: '3', name: 'Livraison gratuite', price: 0, estimatedDays: '5-7 jours', enabled: false },
      ]
    },
    {
      id: '2',
      name: 'Europe',
      countries: ['DE', 'IT', 'ES', 'BE', 'NL'],
      methods: [
        { id: '4', name: 'Livraison standard', price: 12.90, estimatedDays: '5-10 jours', enabled: true },
        { id: '5', name: 'Livraison express', price: 24.90, estimatedDays: '3-5 jours', enabled: false },
      ]
    }
  ]);

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(50);
  const [freeShippingEnabled, setFreeShippingEnabled] = useState(true);
  const { toast } = useToast();

  const countries = [
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Allemagne' },
    { code: 'IT', name: 'Italie' },
    { code: 'ES', name: 'Espagne' },
    { code: 'BE', name: 'Belgique' },
    { code: 'NL', name: 'Pays-Bas' },
    { code: 'CH', name: 'Suisse' },
    { code: 'UK', name: 'Royaume-Uni' },
  ];

  const addShippingZone = () => {
    const newZone: ShippingZone = {
      id: Date.now().toString(),
      name: 'Nouvelle zone',
      countries: [],
      methods: []
    };
    setZones([...zones, newZone]);
  };

  const addShippingMethod = (zoneId: string) => {
    const newMethod: ShippingMethod = {
      id: Date.now().toString(),
      name: 'Nouvelle méthode',
      price: 0,
      estimatedDays: '3-5 jours',
      enabled: true
    };

    setZones(zones.map(zone => 
      zone.id === zoneId 
        ? { ...zone, methods: [...zone.methods, newMethod] }
        : zone
    ));
  };

  const updateShippingMethod = (zoneId: string, methodId: string, updates: Partial<ShippingMethod>) => {
    setZones(zones.map(zone => 
      zone.id === zoneId 
        ? {
            ...zone, 
            methods: zone.methods.map(method => 
              method.id === methodId ? { ...method, ...updates } : method
            )
          }
        : zone
    ));
  };

  const deleteShippingMethod = (zoneId: string, methodId: string) => {
    setZones(zones.map(zone => 
      zone.id === zoneId 
        ? { ...zone, methods: zone.methods.filter(method => method.id !== methodId) }
        : zone
    ));
  };

  const handleSave = async () => {
    try {
      // Ici, vous sauvegarderiez les paramètres de livraison
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres de livraison ont été mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres de livraison",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Livraison gratuite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Livraison gratuite
          </CardTitle>
          <CardDescription>
            Configurez le seuil pour la livraison gratuite
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Activer la livraison gratuite</Label>
              <p className="text-sm text-muted-foreground">
                Offrez la livraison gratuite à partir d'un certain montant
              </p>
            </div>
            <Switch
              checked={freeShippingEnabled}
              onCheckedChange={setFreeShippingEnabled}
            />
          </div>

          {freeShippingEnabled && (
            <div className="space-y-2">
              <Label htmlFor="free_shipping_threshold">Seuil de livraison gratuite (€)</Label>
              <Input
                id="free_shipping_threshold"
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                placeholder="50"
              />
              <p className="text-sm text-muted-foreground">
                Commandes de {freeShippingThreshold}€ et plus = livraison gratuite
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Zones de livraison */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Zones de livraison
              </CardTitle>
              <CardDescription>
                Configurez les zones géographiques et leurs méthodes de livraison
              </CardDescription>
            </div>
            <Button onClick={addShippingZone} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une zone
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {zones.map((zone) => (
              <div key={zone.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Input
                      value={zone.name}
                      onChange={(e) => {
                        setZones(zones.map(z => 
                          z.id === zone.id ? { ...z, name: e.target.value } : z
                        ));
                      }}
                      className="font-medium"
                    />
                    <div className="flex flex-wrap gap-1">
                      {zone.countries.map(countryCode => {
                        const country = countries.find(c => c.code === countryCode);
                        return (
                          <Badge key={countryCode} variant="secondary" className="text-xs">
                            {country?.name || countryCode}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addShippingMethod(zone.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Méthode
                  </Button>
                </div>

                {/* Méthodes de livraison */}
                <div className="space-y-3">
                  {zone.methods.map((method) => (
                    <div key={method.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <Switch
                        checked={method.enabled}
                        onCheckedChange={(checked) => 
                          updateShippingMethod(zone.id, method.id, { enabled: checked })
                        }
                      />
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          value={method.name}
                          onChange={(e) => 
                            updateShippingMethod(zone.id, method.id, { name: e.target.value })
                          }
                          placeholder="Nom de la méthode"
                        />
                        
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={method.price}
                            onChange={(e) => 
                              updateShippingMethod(zone.id, method.id, { price: Number(e.target.value) })
                            }
                            placeholder="0.00"
                          />
                          <span className="text-sm text-muted-foreground">€</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input
                            value={method.estimatedDays}
                            onChange={(e) => 
                              updateShippingMethod(zone.id, method.id, { estimatedDays: e.target.value })
                            }
                            placeholder="3-5 jours"
                          />
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteShippingMethod(zone.id, method.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {zone.methods.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune méthode de livraison configurée pour cette zone
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intégrations transporteurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Transporteurs
          </CardTitle>
          <CardDescription>
            Connectez votre boutique avec des transporteurs pour automatiser les envois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  📦
                </div>
                <div>
                  <p className="font-medium">Colissimo</p>
                  <p className="text-sm text-muted-foreground">La Poste</p>
                </div>
              </div>
              <Badge variant="secondary">Bientôt</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  🚚
                </div>
                <div>
                  <p className="font-medium">Chronopost</p>
                  <p className="text-sm text-muted-foreground">Livraison express</p>
                </div>
              </div>
              <Badge variant="secondary">Bientôt</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brown-100 rounded-lg flex items-center justify-center">
                  📮
                </div>
                <div>
                  <p className="font-medium">UPS</p>
                  <p className="text-sm text-muted-foreground">International</p>
                </div>
              </div>
              <Badge variant="secondary">Bientôt</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  📦
                </div>
                <div>
                  <p className="font-medium">DHL</p>
                  <p className="text-sm text-muted-foreground">Express mondial</p>
                </div>
              </div>
              <Badge variant="secondary">Bientôt</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <Button onClick={handleSave} className="w-full md:w-auto">
        Sauvegarder les paramètres de livraison
      </Button>
    </div>
  );
}