import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { niches } from "@/data/niches";
import { applications } from "@/data/applications";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function AddProduct() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    compareAtPrice: "",
    sku: "",
    barcode: "",
    quantity: "0",
    niche: "",
    trackQuantity: true,
    continueSellingWhenOutOfStock: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase.from("products").insert({
        name: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
      });

      if (error) throw error;

      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du produit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Ajouter un produit</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nom du produit"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du produit"
                  className="mt-1 h-32"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Prix</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="compareAtPrice">Prix de comparaison</Label>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Organisation</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="niche">Catégorie</Label>
                <Select 
                  value={formData.niche}
                  onValueChange={(value) => setFormData({ ...formData, niche: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {niches.map((niche) => (
                      <SelectItem key={niche.name} value={niche.name}>
                        {niche.icon} {niche.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Inventaire</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU (Code produit)</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="barcode">Code-barres</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="trackQuantity"
                  checked={formData.trackQuantity}
                  onCheckedChange={(checked) => setFormData({ ...formData, trackQuantity: checked })}
                />
                <Label htmlFor="trackQuantity">Suivre la quantité</Label>
              </div>

              {formData.trackQuantity && (
                <div>
                  <Label htmlFor="quantity">Quantité disponible</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="mt-1"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="continueSellingWhenOutOfStock"
                  checked={formData.continueSellingWhenOutOfStock}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, continueSellingWhenOutOfStock: checked })
                  }
                />
                <Label htmlFor="continueSellingWhenOutOfStock">
                  Continuer les ventes lorsque le stock est épuisé
                </Label>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Applications</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {applications
                .filter(app => app.type === "sales_channel")
                .map((app) => (
                  <div 
                    key={app.id}
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <app.icon className="h-6 w-6 mr-3 text-gray-600" />
                    <span>{app.name}</span>
                  </div>
                ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Ajout en cours..." : "Ajouter le produit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}