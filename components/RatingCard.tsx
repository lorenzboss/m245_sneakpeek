import { StarIcon } from "lucide-react";
import type { Id } from "../convex/_generated/dataModel";

interface RatingCardProps {
  rating: {
    _id: Id<"ratings">;
    creatorName: string | null;
    comment: string;
    ratingDesign: number;
    ratingComfort: number;
    ratingQuality: number;
    ratingValue: number;
    avgRating: number;
    sizing: number;
    createdAt: number;
  };
}

const SIZING_LABELS: Record<number, string> = {
  "-2": "Way too small",
  "-1": "Slightly small",
  "0": "Perfect fit",
  "1": "Slightly large",
  "2": "Way too large",
};

export function RatingCard({ rating }: RatingCardProps) {
  // avgRating is now calculated in the backend (business logic)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <div>
          <div className="mb-1 text-sm font-semibold text-slate-900 sm:text-base">
            {rating.creatorName || "Anonymous User"}
          </div>
          <div className="text-xs text-slate-500">{new Date(rating.createdAt).toLocaleDateString("en-US")}</div>
        </div>
        <div className="flex items-center gap-1 text-lg font-bold text-slate-900 sm:text-xl">
          <StarIcon fill="currentColor" className="size-4 text-yellow-500 sm:size-5" />
          {(rating.avgRating ?? 0).toFixed(1)}
        </div>
      </div>

      {rating.comment && <p className="mb-3 text-sm text-slate-700 sm:mb-4 sm:text-base">{rating.comment}</p>}

      <div className="grid grid-cols-2 gap-2 text-sm sm:gap-3 md:grid-cols-4">
        <CategoryBadge label="Design" value={rating.ratingDesign} />
        <CategoryBadge label="Comfort" value={rating.ratingComfort} />
        <CategoryBadge label="Quality" value={rating.ratingQuality} />
        <CategoryBadge label="Value for Money" value={rating.ratingValue} />
      </div>

      {rating.sizing != null && (
        <div className="mt-2 text-xs text-slate-600 sm:mt-3">Size: {SIZING_LABELS[rating.sizing]}</div>
      )}
    </div>
  );
}

function CategoryBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <div className="text-xs font-medium text-slate-600">{label}</div>
      <div className="flex items-center gap-1">
        <StarIcon fill="currentColor" className="size-3 text-yellow-500" />
        <span className="font-bold text-slate-900">{value}</span>
      </div>
    </div>
  );
}
