import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ManualStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const niches = [
  "Mode & Accessoires",
  "Électronique",
  "Maison & Décoration",
  "Beauté & Soins",
  "Sport & Fitness",
  "Jouets & Enfants",
  "Alimentation & Boissons",
  "Livres & Média",
  "Jardin & Extérieur",
  "Animaux"
];

export const ManualStoreDialog = ({ open, onOpenChange, onSuccess }: ManualStoreDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    niche: "",
    logo: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-manual-store', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          niche: formData.niche
        }
      });

      if (error) throw error;

      toast({
        title: "✅ Boutique créée avec succès",
        description: "Votre boutique gratuite est prête à être utilisée.",
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating manual store:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la boutique. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">🆓 Créer une boutique manuelle (Gratuit)</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour créer votre boutique gratuite en quelques minutes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la boutique *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ma Boutique"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="niche">Niche *</Label>
            <Select value={formData.niche} onValueChange={(value) => setFormData({ ...formData, niche: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une niche" />
              </SelectTrigger>
              <SelectContent>
                {niches.map((niche) => (
                  <SelectItem key={niche} value={niche}>
                    {niche}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo (optionnel)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })}
              />
              <label htmlFor="logo" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formData.logo ? formData.logo.name : "Cliquez pour télécharger"}
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-primary">
              {loading ? "Création..." : "Créer gratuitement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
