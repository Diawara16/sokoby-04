import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface CustomerTagsManagerProps {
  customerId: string;
  initialTags?: Tag[];
  onTagsUpdate?: () => void;
}

export const CustomerTagsManager = ({ 
  customerId, 
  initialTags = [],
  onTagsUpdate 
}: CustomerTagsManagerProps) => {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [newTagName, setNewTagName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const createTag = async () => {
    try {
      const { data: tag, error } = await supabase
        .from('customer_tags')
        .insert([{ name: newTagName }])
        .select()
        .single();

      if (error) throw error;

      if (tag) {
        await supabase
          .from('customer_tag_relations')
          .insert([{ customer_id: customerId, tag_id: tag.id }]);

        setTags([...tags, tag]);
        setNewTagName('');
        setIsDialogOpen(false);
        
        if (onTagsUpdate) onTagsUpdate();

        toast({
          title: "Tag ajouté",
          description: "Le tag a été créé et associé au client",
        });
      }
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le tag",
        variant: "destructive",
      });
    }
  };

  const removeTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('customer_tag_relations')
        .delete()
        .match({ customer_id: customerId, tag_id: tagId });

      if (error) throw error;

      setTags(tags.filter(tag => tag.id !== tagId));
      
      if (onTagsUpdate) onTagsUpdate();

      toast({
        title: "Tag retiré",
        description: "Le tag a été retiré du client",
      });
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le tag",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="flex items-center gap-1"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
            <button
              onClick={() => removeTag(tag.id)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau tag</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Nom du tag"
              />
              <Button onClick={createTag} disabled={!newTagName.trim()}>
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};