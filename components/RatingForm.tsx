import { useMutation, useQuery } from "convex/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { RatingSlider } from "./RatingSlider";

interface RatingFormProps {
  sneakerId: Id<"sneakers">;
}

const SIZING_LABELS: Record<number, string> = {
  "-2": "Viel zu klein",
  "-1": "Etwas klein",
  "0": "Perfekt",
  "1": "Etwas groß",
  "2": "Viel zu groß",
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

  // Load existing rating into form when it's available
  useEffect(() => {
    if (existingRating) {
      setRatingDesign(existingRating.ratingDesign);
      setRatingComfort(existingRating.ratingComfort);
      setRatingQuality(existingRating.ratingQuality);
      setRatingValue(existingRating.ratingValue);
      setSizing(existingRating.sizing);
      setComment(existingRating.comment);
    }
  }, [existingRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
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
        alert("Bewertung erfolgreich aktualisiert!");
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
        alert("Bewertung erfolgreich hinzugefügt!");
      }
    } catch (error) {
      console.error("Error saving rating:", error);
      alert("Fehler beim Speichern der Bewertung");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = existingRating !== null && existingRating !== undefined;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-900">
        {isEditMode ? "Deine Bewertung bearbeiten" : "Bewerte diesen Sneaker"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <RatingSlider label="Design" value={ratingDesign} onChange={setRatingDesign} />
        <RatingSlider label="Komfort" value={ratingComfort} onChange={setRatingComfort} />
        <RatingSlider label="Qualität" value={ratingQuality} onChange={setRatingQuality} />
        <RatingSlider label="Preis-Leistung" value={ratingValue} onChange={setRatingValue} />

        {/* Sizing */}
        <div>
          <label className="mb-3 block text-sm font-bold text-slate-900">Größe</label>
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setSizing(Math.max(-2, sizing - 1))}
              className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 disabled:opacity-50"
              disabled={sizing === -2}
              aria-label="Größe verkleinern"
            >
              <MinusIcon className="size-5" />
            </button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-slate-900">{sizing}</div>
              <div className="text-xs text-slate-600">{SIZING_LABELS[sizing]}</div>
            </div>
            <button
              type="button"
              onClick={() => setSizing(Math.min(2, sizing + 1))}
              className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 disabled:opacity-50"
              disabled={sizing === 2}
              aria-label="Größe vergrößern"
            >
              <PlusIcon className="size-5" />
            </button>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="mb-3 block text-sm font-bold text-slate-900">
            Kommentar
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 transition-colors focus:border-slate-900 focus:outline-none"
            placeholder="Teile deine Meinung zu diesem Sneaker..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          {isSubmitting
            ? isEditMode
              ? "Wird aktualisiert..."
              : "Wird gespeichert..."
            : isEditMode
              ? "Bewertung aktualisieren"
              : "Bewertung abgeben"}
        </button>
      </form>
    </div>
  );
}
