import { StarRating } from "./StarRating";

interface CategoryRatingsProps {
  avgDesign: number;
  avgComfort: number;
  avgQuality: number;
  avgValue: number;
}

export function CategoryRatings({ avgDesign, avgComfort, avgQuality, avgValue }: CategoryRatingsProps) {
  return (
    <div className="space-y-2 rounded-lg bg-slate-50 px-4 py-3 text-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-slate-700">Design:</span>
        <StarRating rating={avgDesign} size="sm" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-slate-700">Comfort:</span>
        <StarRating rating={avgComfort} size="sm" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-slate-700">Quality:</span>
        <StarRating rating={avgQuality} size="sm" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-slate-700">Value for Money:</span>
        <StarRating rating={avgValue} size="sm" />
      </div>
    </div>
  );
}
