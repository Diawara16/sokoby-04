import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditProductDialogProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    niche: string;
  } | null;
  storeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function EditProductDialog({ product, storeId, open, onOpenChange, onSaved }: EditProductDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [niche, setNiche] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setPrice(String(product.price));
      setImageUrl(product.image_url || "");
      setNiche(product.niche);
    }
  }, [product]);

  const handleSave = async () => {
    if (!product) return;
    setLoading(true);

    const updateData: Record<string, any> = {
      name,
      description,
      price: parseFloat(price),
      category: niche,
      image: imageUrl || null,
      images: imageUrl ? [imageUrl] : [],
    };

    console.log("[EditProduct] Updating product:", product.id, updateData);

    const { error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", product.id)
      .eq("store_id", storeId);

    setLoading(false);

    if (error) {
      console.error("[EditProduct] Update failed:", error);
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }

    console.log("[EditProduct] Product updated successfully");
    toast({ title: "Produit mis à jour" });
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nom</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} className="h-24" />
          </div>
          <div>
            <Label>Prix (€)</Label>
            <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div>
            <Label>Catégorie</Label>
            <Input value={niche} onChange={e => setNiche(e.target.value)} />
          </div>
          <div>
            <Label>URL de l'image</Label>
            <Input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
