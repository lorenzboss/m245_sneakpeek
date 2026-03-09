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
  "-2": "Viel zu klein",
  "-1": "Etwas klein",
  "1": "Etwas groß",
  "2": "Viel zu groß",
};

export function RatingCard({ rating }: RatingCardProps) {
  // avgRating is now calculated in the backend (business logic)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-1 font-semibold text-slate-900">{rating.creatorName || "Anonymer Nutzer"}</div>
          <div className="text-xs text-slate-500">{new Date(rating.createdAt).toLocaleDateString("de-DE")}</div>
        </div>
        <div className="flex items-center gap-1 text-xl font-bold text-slate-900">
          <StarIcon fill="currentColor" className="size-5 text-yellow-500" />
          {(rating.avgRating ?? 0).toFixed(1)}
        </div>
      </div>

      {rating.comment && <p className="mb-4 text-slate-700">{rating.comment}</p>}

      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <CategoryBadge label="Design" value={rating.ratingDesign} />
        <CategoryBadge label="Komfort" value={rating.ratingComfort} />
        <CategoryBadge label="Qualität" value={rating.ratingQuality} />
        <CategoryBadge label="Preis-Leistung" value={rating.ratingValue} />
      </div>

      {rating.sizing !== 0 && <div className="mt-3 text-xs text-slate-600">Größe: {SIZING_LABELS[rating.sizing]}</div>}
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
