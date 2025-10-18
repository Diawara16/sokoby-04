import { useState, useEffect } from "react";
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

// Fonction pour générer un nom de domaine unique
async function generateUniqueDomainName(userId: string, storeName: string) {
  const cleanName = storeName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${cleanName}-${randomSuffix}`;
}

export default function CreerBoutiqueManuelle() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    category: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b"
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Charger les données existantes si la boutique existe déjà
  useEffect(() => {
    const loadExistingStore = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setInitialLoading(false);
          return;
        }

        // Vérifier si l'utilisateur a déjà une boutique
        const { data: existingStore } = await supabase
          .from('store_settings')
          .select('store_name, store_description, category')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingStore) {
          // User already has a store: skip edit step and go to the editor
          navigate('/store-editor');
          return;
        }

        // Charger les paramètres de marque existants
        const { data: existingBrand } = await supabase
          .from('brand_settings')
          .select('primary_color, secondary_color')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingBrand) {
          setFormData(prev => ({
            ...prev,
            primaryColor: existingBrand.primary_color || "#3b82f6",
            secondaryColor: existingBrand.secondary_color || "#64748b"
          }));
        }

      } catch (error) {
        console.error('Error loading existing store:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadExistingStore();
  }, []);

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

      // Générer un nom de domaine unique
      const uniqueDomainName = await generateUniqueDomainName(user.id, formData.storeName);
      console.log("Nom de domaine généré:", uniqueDomainName);

      // Utiliser upsert pour les paramètres de boutique
      const { error: storeError } = await supabase
        .from('store_settings')
        .upsert({
          user_id: user.id,
          domain_name: uniqueDomainName,
          store_name: formData.storeName,
          store_description: formData.description,
          category: formData.category || 'other',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (storeError) {
        console.error('Error saving store settings:', storeError);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les paramètres de la boutique",
          variant: "destructive"
        });
        return;
      }

      // Check if brand settings exist before updating
      // This ensures we don't overwrite existing logo_url, slogan, or colors
      // Order by created_at to get the most recent record
      const { data: existingBrand } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Only create brand settings if none exist (preserves logo_url, slogan, colors)
      if (!existingBrand) {
        const { error: brandError } = await supabase
          .from('brand_settings')
          .insert({
            user_id: user.id,
            primary_color: formData.primaryColor || '#8B5CF6',
            secondary_color: formData.secondaryColor || '#D6BCFA'
          })
          .select()
          .single();

        if (brandError) {
          console.error('Error saving brand settings:', brandError);
        } else {
          console.log('Created new brand settings with form colors (logo_url can be added later)');
        }
      } else {
        // Explicitly verify logo_url is preserved
        console.log('✓ Brand settings found - ALL fields preserved including logo_url:', {
          logo_url: existingBrand.logo_url || '(not set)',
          primary_color: existingBrand.primary_color,
          secondary_color: existingBrand.secondary_color,
          slogan: existingBrand.slogan || '(not set)'
        });
        
        if (!existingBrand.logo_url) {
          console.warn('⚠️ Brand settings exist but logo_url is not set. Upload a logo in Store Editor to persist it.');
        }
      }

      // Trigger logo refresh after store creation/update
      window.dispatchEvent(new Event('logo-updated'));
      console.log('✓ Logo refresh triggered after store operation');

      toast({
        title: isUpdating ? "Boutique mise à jour !" : "Boutique créée avec succès !",
        description: isUpdating 
          ? "Vos paramètres de boutique ont été mis à jour."
          : "Votre boutique a été créée. Vous pouvez maintenant ajouter des produits.",
      });

      // Informer l'utilisateur de l'URL de sa boutique
      toast({
        title: "Boutique accessible !",
        description: `Votre boutique est accessible via : sokoby.com/${uniqueDomainName}`,
      });
      
      // Rediriger vers l'éditeur de boutique
      navigate('/store-editor');
      
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

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link 
          to="/tableau-de-bord" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au dashboard
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">
            {isUpdating ? "Modifier ma boutique" : "Créer ma boutique manuellement"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isUpdating 
            ? "Modifiez les paramètres de votre boutique existante"
            : "Configurez votre boutique étape par étape selon vos préférences"
          }
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de base</CardTitle>
          <CardDescription>
            {isUpdating 
              ? "Modifiez les informations principales de votre boutique"
              : "Définissez les informations principales de votre boutique"
            }
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
                {loading 
                  ? (isUpdating ? "Mise à jour..." : "Création...") 
                  : (isUpdating ? "Mettre à jour" : "Créer ma boutique")
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}