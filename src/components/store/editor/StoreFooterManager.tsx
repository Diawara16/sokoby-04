import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FooterLink {
  id: string;
  title: string;
  url: string;
  category: string;
  display_order: number;
}

const LINK_CATEGORIES = [
  { value: 'custom', label: 'Liens personnalisés' },
  { value: 'legal', label: 'Liens légaux' },
  { value: 'social', label: 'Réseaux sociaux' },
  { value: 'services', label: 'Services' },
];

export const StoreFooterManager = () => {
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    category: "custom"
  });
  const { toast } = useToast();

  useEffect(() => {
    loadFooterLinks();
  }, []);

  const loadFooterLinks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFooterLinks(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les liens du footer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from('footer_links')
        .insert({
          ...newLink,
          user_id: user.id,
          display_order: footerLinks.length
        });

      if (error) throw error;

      setNewLink({ title: "", url: "", category: "custom" });
      setIsDialogOpen(false);
      loadFooterLinks();
      
      toast({
        title: "Succès",
        description: "Lien ajouté au footer",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le lien",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('footer_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      loadFooterLinks();
      toast({
        title: "Succès",
        description: "Lien supprimé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le lien",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement des liens du footer...</div>;
  }

  const groupedLinks = footerLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion du footer</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un lien
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau lien</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-title">Titre du lien</Label>
                <Input
                  id="link-title"
                  placeholder="Ex: Créer un logo"
                  value={newLink.title}
                  onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  placeholder="https://..."
                  value={newLink.url}
                  onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="link-category">Catégorie</Label>
                <Select value={newLink.category} onValueChange={(value) => setNewLink({...newLink, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LINK_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddLink} className="w-full">
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.keys(groupedLinks).length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucun lien dans le footer pour le moment
            </p>
          ) : (
            Object.entries(groupedLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-medium mb-3">
                  {LINK_CATEGORIES.find(cat => cat.value === category)?.label || category}
                </h4>
                <div className="space-y-2">
                  {links.map((link) => (
                    <div key={link.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{link.title}</span>
                        <span className="text-sm text-muted-foreground">({link.url})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};