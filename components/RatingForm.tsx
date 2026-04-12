import { useMutation, useQuery } from "convex/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { RatingSlider } from "./RatingSlider";

interface RatingFormProps {
  sneakerId: Id<"sneakers">;
}

const SIZING_LABELS: Record<number, string> = {
  "-2": "Way too small",
  "-1": "Slightly small",
  "0": "Perfect",
  "1": "Slightly large",
  "2": "Way too large",
};

export function RatingForm({ sneakerId }: RatingFormProps) {
  const addRating = useMutation(api.ratings.addRating);
  const updateRating = useMutation(api.ratings.updateRating);
  const existingRating = useQuery(api.ratings.getMyRatingForSneaker, { sneakerId });

  const [ratingDesign, setRatingDesign] = useState(5);
  const [ratingComfort, setRatingComfort] = useState(5);
  const [ratingQuality, setRatingQuality] = useState(5);
  const [ratingValue, setRatingValue] = useState(5);
  const [sizing, setSizing] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const hasLoadedRating = useRef(false);

  // Load existing rating into form when it's available (only once)
  useEffect(() => {
    if (existingRating && !hasLoadedRating.current) {
      // Batch state updates to avoid cascading renders
      hasLoadedRating.current = true;
      queueMicrotask(() => {
        setRatingDesign(existingRating.ratingDesign);
        setRatingComfort(existingRating.ratingComfort);
        setRatingQuality(existingRating.ratingQuality);
        setRatingValue(existingRating.ratingValue);
        setSizing(existingRating.sizing);
        setComment(existingRating.comment);
      });
    }
  }, [existingRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    try {
      if (existingRating) {
        await updateRating({
          ratingId: existingRating._id,
          comment,
          ratingDesign,
          ratingComfort,
          ratingQuality,
          ratingValue,
          sizing,
        });
      } else {
        await addRating({
          sneakerId,
          comment,
          ratingDesign,
          ratingComfort,
          ratingQuality,
          ratingValue,
          sizing,
        });
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error saving rating:", error);
      setError("Error saving rating. Please try again.");
      setIsSubmitting(false);
    }
  };

  const isEditMode = existingRating !== null && existingRating !== undefined;

  const hasChanged =
    !isEditMode ||
    ratingDesign !== existingRating.ratingDesign ||
    ratingComfort !== existingRating.ratingComfort ||
    ratingQuality !== existingRating.ratingQuality ||
    ratingValue !== existingRating.ratingValue ||
    sizing !== existingRating.sizing ||
    comment !== existingRating.comment;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6 md:p-8">
      <div className="mb-6 border-b border-slate-100 pb-4 sm:mb-8 sm:pb-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {isEditMode ? "Edit Your Rating" : "Rate this Sneaker"}
        </h2>
        <p className="mt-2 text-xs text-slate-600 sm:text-sm">
          {isEditMode ? "Update your rating" : "Share your experience with this sneaker"}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Rating Grid */}
        <div className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 sm:p-6">
          <h3 className="mb-3 text-xs font-bold tracking-wide text-slate-700 uppercase sm:mb-4 sm:text-sm">
            Rating Criteria
          </h3>
          <div className="space-y-5">
            <RatingSlider label="Design" value={ratingDesign} onChange={setRatingDesign} />
            <RatingSlider label="Comfort" value={ratingComfort} onChange={setRatingComfort} />
            <RatingSlider label="Quality" value={ratingQuality} onChange={setRatingQuality} />
            <RatingSlider label="Value for Money" value={ratingValue} onChange={setRatingValue} />
          </div>
        </div>

        {/* Sizing */}
        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-white p-4 sm:p-6">
          <label className="mb-3 block text-xs font-bold tracking-wide text-slate-700 uppercase sm:mb-4 sm:text-sm">
            Size Feedback
          </label>
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() => setSizing(Math.max(-2, sizing - 1))}
              className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-white transition-all hover:scale-110 hover:bg-slate-800 disabled:opacity-30 disabled:hover:scale-100 sm:size-12"
              disabled={sizing === -2}
              aria-label="Decrease size"
            >
              <MinusIcon className="size-4 sm:size-5" />
            </button>
            <div className="min-w-[140px] rounded-lg bg-slate-50 px-3 py-3 text-center sm:min-w-[200px] sm:px-6 sm:py-4">
              <div className="text-2xl font-bold text-slate-900 sm:text-4xl">{sizing > 0 ? `+${sizing}` : sizing}</div>
              <div className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">{SIZING_LABELS[sizing]}</div>
            </div>
            <button
              type="button"
              onClick={() => setSizing(Math.min(2, sizing + 1))}
              className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-white transition-all hover:scale-110 hover:bg-slate-800 disabled:opacity-30 disabled:hover:scale-100 sm:size-12"
              disabled={sizing === 2}
              aria-label="Increase size"
            >
              <PlusIcon className="size-4 sm:size-5" />
            </button>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="mb-2 block text-xs font-bold tracking-wide text-slate-700 uppercase sm:mb-3 sm:text-sm"
          >
            Comment <span className="font-normal text-slate-500 normal-case">(Optional)</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-slate-900 transition-all focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
            placeholder="Share your thoughts about this sneaker..."
          />
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={isSubmitting || !hasChanged}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md sm:px-6 sm:py-4 sm:text-lg"
        >
          {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update Rating" : "Submit Rating"}
        </button>
      </form>
    </div>
  );
}
