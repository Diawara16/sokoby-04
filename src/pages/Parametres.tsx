import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Settings, Store, Globe, Clock } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const Parametres = () => {
  const form = useForm({
    defaultValues: {
      storeName: "",
      billingAddress: "",
      currency: "EUR",
      measurementSystem: "metric",
      timezone: "Europe/Paris",
      orderPrefix: "CMD",
      autoArchive: false
    }
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configuration de la boutique</h1>
        <Button>Sauvegarder les modifications</Button>
      </div>

      <div className="grid gap-6">
        {/* Informations de base */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Store className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Informations générales</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Nom de la boutique</Label>
                <Input placeholder="Ma boutique en ligne" />
              </div>
              <div>
                <Label>Adresse de facturation</Label>
                <Input placeholder="123 rue du Commerce" />
              </div>
            </div>
          </div>
        </Card>

        {/* Paramètres régionaux */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Globe className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Paramètres régionaux</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label>Devise principale</Label>
                <Select>
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar américain ($)</option>
                  <option value="GBP">Livre sterling (£)</option>
                </Select>
              </div>
              
              <div>
                <Label>Système de mesure</Label>
                <Select>
                  <option value="metric">Métrique (kg, cm)</option>
                  <option value="imperial">Impérial (lb, in)</option>
                </Select>
              </div>

              <div>
                <Label>Fuseau horaire</Label>
                <Select>
                  <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                  <option value="America/New_York">America/New_York (UTC-5)</option>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Gestion des commandes */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Clock className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Gestion des commandes</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label>Préfixe des commandes</Label>
              <div className="flex gap-2 items-center mt-2">
                <Input placeholder="CMD" className="w-32" />
                <span className="text-sm text-muted-foreground">
                  Ex: CMD-001, CMD-002
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Traitement automatique</Label>
              <RadioGroup defaultValue="none">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">Traiter automatiquement toutes les commandes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid">Traiter uniquement les commandes payées</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">Traitement manuel uniquement</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="autoArchive" className="rounded border-gray-300" />
              <Label htmlFor="autoArchive">
                Archiver automatiquement les commandes complétées
              </Label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Parametres;