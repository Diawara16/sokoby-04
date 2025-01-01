import { Star } from "lucide-react";

interface RatingInputProps {
  rating: number;
  setRating: (rating: number) => void;
  hoveredRating: number;
  setHoveredRating: (rating: number) => void;
}

export const RatingInput = ({
  rating,
  setRating,
  hoveredRating,
  setHoveredRating,
}: RatingInputProps) => {
  return (
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
          onClick={() => setRating(i + 1)}
        />
      ))}
    </div>
  );
};