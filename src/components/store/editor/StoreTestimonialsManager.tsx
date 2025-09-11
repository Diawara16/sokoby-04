import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Testimonial {
  id: string;
  customer_name: string;
  customer_photo_url: string | null;
  rating: number;
  message: string;
  is_featured: boolean;
}

export const StoreTestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    customer_name: "",
    customer_photo_url: "",
    rating: 5,
    message: "",
    is_featured: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les témoignages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTestimonial = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from('testimonials')
        .insert({
          ...newTestimonial,
          user_id: user.id
        });

      if (error) throw error;

      setNewTestimonial({
        customer_name: "",
        customer_photo_url: "",
        rating: 5,
        message: "",
        is_featured: false
      });
      setIsDialogOpen(false);
      loadTestimonials();
      
      toast({
        title: "Succès",
        description: "Témoignage ajouté",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le témoignage",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      loadTestimonials();
      toast({
        title: "Succès",
        description: "Témoignage supprimé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le témoignage",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
      />
    ));
  };

  if (isLoading) {
    return <div>Chargement des témoignages...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Témoignages clients</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un témoignage
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau témoignage</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer_name">Nom du client</Label>
                <Input
                  id="customer_name"
                  value={newTestimonial.customer_name}
                  onChange={(e) => setNewTestimonial({...newTestimonial, customer_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="customer_photo">URL de la photo (optionnel)</Label>
                <Input
                  id="customer_photo"
                  value={newTestimonial.customer_photo_url}
                  onChange={(e) => setNewTestimonial({...newTestimonial, customer_photo_url: e.target.value})}
                />
              </div>
              <div>
                <Label>Note</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                    >
                      <Star
                        className={`h-6 w-6 ${star <= newTestimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newTestimonial.message}
                  onChange={(e) => setNewTestimonial({...newTestimonial, message: e.target.value})}
                  rows={3}
                />
              </div>
              <Button onClick={handleAddTestimonial} className="w-full">
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testimonials.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucun témoignage pour le moment
            </p>
          ) : (
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {testimonial.customer_photo_url && (
                      <img 
                        src={testimonial.customer_photo_url} 
                        alt={testimonial.customer_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="font-medium">{testimonial.customer_name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-sm text-muted-foreground">{testimonial.message}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};