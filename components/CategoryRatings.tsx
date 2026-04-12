import { StarRating } from "./StarRating";

const SIZING_LABELS: Record<number, string> = {
  "-2": "Way too small",
  "-1": "Slightly small",
  "0": "Perfect fit",
  "1": "Slightly large",
  "2": "Way too large",
};

interface CategoryRatingsProps {
  avgDesign: number;
  avgComfort: number;
  avgQuality: number;
  avgValue: number;
  avgSizing: number;
}

export function CategoryRatings({ avgDesign, avgComfort, avgQuality, avgValue, avgSizing }: CategoryRatingsProps) {
  const sizingLabel = SIZING_LABELS[Math.round(avgSizing)];
  return (
    <div className="space-y-2">
      <div className="w-fit space-y-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs sm:space-y-2 sm:px-4 sm:py-3 sm:text-sm">
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 sm:gap-x-4 sm:gap-y-2">
          <span className="font-medium text-slate-700">Design:</span>
          <StarRating rating={avgDesign} size="sm" />
          <span className="font-medium text-slate-700">Comfort:</span>
          <StarRating rating={avgComfort} size="sm" />
          <span className="font-medium text-slate-700">Quality:</span>
          <StarRating rating={avgQuality} size="sm" />
          <span className="font-medium text-slate-700">Value for Money:</span>
          <StarRating rating={avgValue} size="sm" />
        </div>
      </div>
      <div className="text-xs text-slate-600 sm:text-sm">
        Size: <span className="font-semibold text-slate-900">{sizingLabel}</span>
      </div>
    </div>
  );
}
