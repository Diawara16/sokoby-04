import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { NotepadText, Trash2, Clock } from "lucide-react";
import { format } from 'date-fns';

interface CustomerNote {
  id: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface CustomerNotesTabProps {
  customerId: string;
}

const noteCategories = [
  { value: 'general', label: 'Général' },
  { value: 'support', label: 'Support' },
  { value: 'sales', label: 'Ventes' },
  { value: 'complaint', label: 'Réclamation' },
];

export const CustomerNotesTab = ({ customerId }: CustomerNotesTabProps) => {
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [category, setCategory] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_notes')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notes",
        variant: "destructive",
      });
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('customer_notes')
        .insert([
          {
            customer_id: customerId,
            content: newNote.trim(),
            category,
            created_by: user.id
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Note ajoutée avec succès",
      });

      setNewNote('');
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la note",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('customer_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Note supprimée avec succès",
      });

      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la note",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchNotes();
    }
  }, [customerId]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {noteCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-4">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Ajouter une nouvelle note..."
            className="flex-1"
          />
          <Button 
            onClick={addNote} 
            disabled={isLoading || !newNote.trim()}
          >
            Ajouter
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <NotepadText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium capitalize">
                      {noteCategories.find(cat => cat.value === note.category)?.label || note.category}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(note.created_at), 'dd/MM/yyyy HH:mm')}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteNote(note.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};