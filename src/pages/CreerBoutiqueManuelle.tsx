import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Store } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreerBoutiqueManuelle() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    category: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b"
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = [
    { value: "fashion", label: "Mode et vêtements" },
    { value: "electronics", label: "Électronique" },
    { value: "home", label: "Maison et jardin" },
    { value: "beauty", label: "Beauté et cosmétiques" },
    { value: "sports", label: "Sports et loisirs" },
    { value: "books", label: "Livres et médias" },
    { value: "food", label: "Alimentation" },
    { value: "health", label: "Santé et bien-être" },
    { value: "automotive", label: "Automobile" },
    { value: "other", label: "Autre" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.storeName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la boutique est requis",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une boutique",
          variant: "destructive"
        });
        return;
      }

      // Créer les paramètres de boutique
      const { error: storeError } = await supabase
        .from('store_settings')
        .insert({
          user_id: user.id,
          store_name: formData.storeName,
          description: formData.description,
          category: formData.category || 'other'
        });

      if (storeError) {
        console.error('Error creating store settings:', storeError);
        toast({
          title: "Erreur",
          description: "Impossible de créer les paramètres de la boutique",
          variant: "destructive"
        });
        return;
      }

      // Créer les paramètres de marque
      const { error: brandError } = await supabase
        .from('brand_settings')
        .insert({
          user_id: user.id,
          primary_color: formData.primaryColor,
          secondary_color: formData.secondaryColor
        });

      if (brandError) {
        console.error('Error creating brand settings:', brandError);
        // Continuer même si l'erreur de marque échoue
      }

      toast({
        title: "Boutique créée avec succès !",
        description: "Votre boutique a été créée. Vous pouvez maintenant ajouter des produits.",
      });

      // Rediriger vers la page boutique
      navigate('/boutique');
      
    } catch (error) {
      console.error('Error creating store:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link 
          to="/tableau-de-bord" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Créer ma boutique manuellement</h1>
        </div>
        <p className="text-muted-foreground">
          Configurez votre boutique étape par étape selon vos préférences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de base</CardTitle>
          <CardDescription>
            Définissez les informations principales de votre boutique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nom de la boutique *</Label>
              <Input
                id="storeName"
                placeholder="Ma Super Boutique"
                value={formData.storeName}
                onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre boutique et ce que vous vendez..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Couleur principale</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    placeholder="#64748b"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tableau-de-bord')}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Création..." : "Créer ma boutique"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}