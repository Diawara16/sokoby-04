import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Upload, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AIStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckout: (plan: string) => void;
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

export const AIStoreDialog = ({ open, onOpenChange, onCheckout }: AIStoreDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    niche: "",
    logo: null as File | null,
    plan: "20"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save form data and get checkout URL
      const { data, error } = await supabase.functions.invoke('init-store', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          niche: formData.niche,
          plan: formData.plan === "80" ? "pro" : "starter"
        }
      });

      if (error) throw error;

      // Save to session storage for later retrieval
      sessionStorage.setItem('aiStoreData', JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        niche: formData.niche,
        plan: formData.plan
      }));

      // Redirect to Shopify checkout
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Error initializing AI store:', error);
      toast({
        title: "Erreur",
        description: "Impossible de procéder au paiement. Veuillez réessayer.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Créer une boutique IA (Payant)
          </DialogTitle>
          <DialogDescription>
            Notre IA créera automatiquement votre boutique complète avec produits, design et contenu optimisés.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="ai-name">Nom de la boutique *</Label>
            <Input
              id="ai-name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ma Boutique IA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-email">Email *</Label>
            <Input
              id="ai-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-phone">Téléphone *</Label>
            <Input
              id="ai-phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-niche">Niche *</Label>
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
            <Label htmlFor="ai-logo">Logo</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition">
              <Input
                id="ai-logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })}
              />
              <label htmlFor="ai-logo" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formData.logo ? formData.logo.name : "Cliquez pour télécharger"}
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Label>Choisissez votre plan *</Label>
            <RadioGroup value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
              <div className="flex items-center space-x-2 border-2 rounded-lg p-4 hover:border-primary transition cursor-pointer">
                <RadioGroupItem value="20" id="plan-20" />
                <Label htmlFor="plan-20" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Plan Starter - 20€</div>
                  <div className="text-sm text-muted-foreground">Boutique IA de base avec 10 produits</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border-2 rounded-lg p-4 hover:border-primary transition cursor-pointer">
                <RadioGroupItem value="80" id="plan-80" />
                <Label htmlFor="plan-80" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Plan Pro - 80€</div>
                  <div className="text-sm text-muted-foreground">Boutique IA complète avec 50 produits + support prioritaire</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-red-50 border border-primary rounded-lg p-4 text-sm">
            <p className="font-medium text-primary mb-1">💳 Paiement via Shopify Checkout</p>
            <p className="text-muted-foreground">
              Après validation, vous serez redirigé vers notre page de paiement sécurisé. 
              Votre boutique sera générée automatiquement après le paiement.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-primary">
              {loading ? "Redirection..." : "Procéder au paiement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
