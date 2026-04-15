import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Package, Edit, Save, X, ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_active: boolean;
}

interface ProductCardProps {
  product: Product;
  onProductUpdate: (updated: Product) => void;
}

export function ProductCard({ product, onProductUpdate }: ProductCardProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(product);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: draft.name,
          description: draft.description,
          price: draft.price,
          image: draft.image_url || null,
        })
        .eq("id", product.id);

      if (error) throw error;

      onProductUpdate(draft);
      setEditing(false);
      toast({ title: "Produit mis à jour" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de sauvegarder", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(product);
    setEditing(false);
  };

  if (editing) {
    return (
      <Card className="overflow-hidden border-primary/50 shadow-lg">
        <div className="aspect-square bg-muted flex items-center justify-center relative">
          {draft.image_url ? (
            <img src={draft.image_url} alt={draft.name} className="w-full h-full object-cover" />
          ) : (
            <Package className="h-12 w-12 text-muted-foreground" />
          )}
          <div className="absolute bottom-2 left-2 right-2">
            <Input
              placeholder="URL de l'image..."
              value={draft.image_url || ""}
              onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
              className="text-xs bg-background/90 backdrop-blur-sm"
            />
          </div>
        </div>
        <CardContent className="p-3 space-y-2">
          <Input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="font-medium text-sm"
            placeholder="Nom du produit"
          />
          <div className="relative">
            <Input
              type="number"
              step="0.01"
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: parseFloat(e.target.value) || 0 })}
              className="font-bold text-primary pl-6"
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
          </div>
          <Textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="Description..."
            className="text-xs min-h-[60px] resize-none"
          />
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={handleSave} disabled={saving}>
              <Save className="h-3 w-3 mr-1" />
              {saving ? "..." : "Sauver"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} disabled={saving}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <div className="aspect-square bg-muted flex items-center justify-center">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Package className="h-12 w-12 text-muted-foreground" />
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <p className="text-primary font-bold">{product.price.toFixed(2)}€</p>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={() => { setDraft(product); setEditing(true); }}
        >
          <Edit className="h-3 w-3 mr-1" />
          Modifier
        </Button>
      </CardContent>
    </Card>
  );
}
