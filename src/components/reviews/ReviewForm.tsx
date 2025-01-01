import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Star, Loader2, ImagePlus } from "lucide-react";

const reviewSchema = z.object({
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
  content: z.string().min(10, "L'avis doit faire au moins 10 caractères"),
  rating: z.number().min(1).max(5),
});

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: "",
      content: "",
      rating: 0,
    },
  });

  const uploadPhotos = async (reviewId: string) => {
    const uploadPromises = selectedFiles.map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const filePath = `${reviewId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("review_photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("review_photos")
        .getPublicUrl(filePath);

      await supabase.from("review_photos").insert({
        review_id: reviewId,
        photo_url: publicUrl,
      });
    });

    await Promise.all(uploadPromises);
  };

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    try {
      setIsSubmitting(true);

      const { data: review, error } = await supabase
        .from("product_reviews")
        .insert({
          product_id: productId,
          title: values.title,
          content: values.content,
          rating: values.rating,
        })
        .select()
        .single();

      if (error) throw error;

      if (selectedFiles.length > 0) {
        await uploadPhotos(review.id);
      }

      toast({
        title: "Avis publié",
        description: "Votre avis a été publié avec succès",
      });

      form.reset();
      setRating(0);
      setSelectedFiles([]);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Erreur",
        description: "Impossible de publier l'avis",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 4));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center space-x-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-6 w-6 cursor-pointer transition-colors ${
                (hoveredRating || rating) > i
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => {
                setRating(i + 1);
                form.setValue("rating", i + 1);
              }}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Résumez votre expérience" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre avis</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Partagez votre expérience avec ce produit"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Photos (optionnel)</FormLabel>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("photo-upload")?.click()}
              disabled={selectedFiles.length >= 4}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Ajouter des photos
            </Button>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={selectedFiles.length >= 4}
            />
            <span className="text-sm text-gray-500">
              {selectedFiles.length}/4 photos
            </span>
          </div>
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="rounded-lg object-cover w-full h-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1"
                    onClick={() =>
                      setSelectedFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Publier l'avis
        </Button>
      </form>
    </Form>
  );
};