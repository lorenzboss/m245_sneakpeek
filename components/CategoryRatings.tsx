import { StarRating } from "./StarRating";

interface CategoryRatingsProps {
  avgDesign: number;
  avgComfort: number;
  avgQuality: number;
  avgValue: number;
}

export function CategoryRatings({ avgDesign, avgComfort, avgQuality, avgValue }: CategoryRatingsProps) {
  return (
    <div className="space-y-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs sm:space-y-2 sm:px-4 sm:py-3 sm:text-sm">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <span className="font-medium text-slate-700">Design:</span>
        <StarRating rating={avgDesign} size="sm" />
      </div>
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <span className="font-medium text-slate-700">Comfort:</span>
        <StarRating rating={avgComfort} size="sm" />
      </div>
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <span className="font-medium text-slate-700">Quality:</span>
        <StarRating rating={avgQuality} size="sm" />
      </div>
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <span className="font-medium text-slate-700">Value for Money:</span>
        <StarRating rating={avgValue} size="sm" />
      </div>
    </div>
  );
}
