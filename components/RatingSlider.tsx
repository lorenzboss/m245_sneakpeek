import { StarIcon } from "lucide-react";

interface RatingSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function RatingSlider({ label, value, onChange }: RatingSliderProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-bold text-slate-900">{label}</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="transition-transform hover:scale-110"
              aria-label={`Rate ${star} stars`}
            >
              <StarIcon className={`size-6 ${star <= value ? "fill-yellow-500 text-yellow-500" : "text-slate-300"}`} />
            </button>
          ))}
          <span className="ml-2 text-sm font-bold text-slate-900">{value}</span>
        </div>
      </div>
    </div>
  );
}
