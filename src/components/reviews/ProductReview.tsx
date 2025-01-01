import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsUp, Image as ImageIcon, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface ProductReviewProps {
  id: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  photos: { id: string; photo_url: string }[];
  createdAt: string;
  onDelete?: () => void;
  isOwner: boolean;
}

export const ProductReview = ({
  id,
  userId,
  rating,
  title,
  content,
  photos,
  createdAt,
  onDelete,
  isOwner
}: ProductReviewProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Avis supprimé",
        description: "Votre avis a été supprimé avec succès",
      });

      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'avis",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{userId.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        {isOwner && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{content}</p>
        {photos.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((photo) => (
              <img
                key={photo.id}
                src={photo.photo_url}
                alt="Review photo"
                className="rounded-lg object-cover aspect-square"
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        {new Date(createdAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};