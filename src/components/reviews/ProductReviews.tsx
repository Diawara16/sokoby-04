import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProductReview } from "./ProductReview";
import { ReviewForm } from "./ReviewForm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);

        const { data, error } = await supabase
          .from("product_reviews")
          .select(`
            *,
            review_photos (
              id,
              photo_url
            )
          `)
          .eq("product_id", productId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleReviewSuccess = () => {
    setShowForm(false);
    // Refresh reviews
    window.location.reload();
  };

  const handleDelete = (reviewId: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Avis clients</h2>
        {currentUserId && !showForm && (
          <Button onClick={() => setShowForm(true)}>Donner mon avis</Button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <ReviewForm productId={productId} onSuccess={handleReviewSuccess} />
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">
          Aucun avis pour le moment. Soyez le premier à donner votre avis !
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ProductReview
              key={review.id}
              id={review.id}
              userId={review.user_id}
              rating={review.rating}
              title={review.title}
              content={review.content}
              photos={review.review_photos}
              createdAt={review.created_at}
              isOwner={currentUserId === review.user_id}
              onDelete={() => handleDelete(review.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};