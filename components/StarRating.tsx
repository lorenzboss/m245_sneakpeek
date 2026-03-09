import { StarIcon } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ rating, maxStars = 5, showValue = true, size = "md" }: StarRatingProps) {
  const sizeClasses = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
        <StarIcon
          key={star}
          fill={star <= Math.round(rating ?? 0) ? "currentColor" : "none"}
          className={`${sizeClasses[size]} text-yellow-500`}
        />
      ))}
      {showValue && <span className="ml-2 font-semibold text-slate-900">{(rating ?? 0).toFixed(1)}</span>}
    </div>
  );
}
