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
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg md:p-8">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {isEditMode ? "Deine Bewertung bearbeiten" : "Bewerte diesen Sneaker"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {isEditMode ? "Aktualisiere deine Bewertung" : "Teile deine Erfahrungen mit diesem Sneaker"}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Rating Grid */}
        <div className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 p-6">
          <h3 className="mb-4 text-sm font-bold tracking-wide text-slate-700 uppercase">Bewertungskriterien</h3>
          <div className="space-y-5">
            <RatingSlider label="Design" value={ratingDesign} onChange={setRatingDesign} />
            <RatingSlider label="Komfort" value={ratingComfort} onChange={setRatingComfort} />
            <RatingSlider label="Qualität" value={ratingQuality} onChange={setRatingQuality} />
            <RatingSlider label="Preis-Leistung" value={ratingValue} onChange={setRatingValue} />
          </div>
        </div>

        {/* Sizing */}
        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-white p-6">
          <label className="mb-4 block text-sm font-bold tracking-wide text-slate-700 uppercase">Größenangabe</label>
          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => setSizing(Math.max(-2, sizing - 1))}
              className="flex size-12 items-center justify-center rounded-full bg-slate-900 text-white transition-all hover:scale-110 hover:bg-slate-800 disabled:opacity-30 disabled:hover:scale-100"
              disabled={sizing === -2}
              aria-label="Größe verkleinern"
            >
              <MinusIcon className="size-5" />
            </button>
            <div className="min-w-[200px] rounded-lg bg-slate-50 px-6 py-4 text-center">
              <div className="text-4xl font-bold text-slate-900">{sizing > 0 ? `+${sizing}` : sizing}</div>
              <div className="mt-1 text-sm font-medium text-slate-600">{SIZING_LABELS[sizing]}</div>
            </div>
            <button
              type="button"
              onClick={() => setSizing(Math.min(2, sizing + 1))}
              className="flex size-12 items-center justify-center rounded-full bg-slate-900 text-white transition-all hover:scale-110 hover:bg-slate-800 disabled:opacity-30 disabled:hover:scale-100"
              disabled={sizing === 2}
              aria-label="Größe vergrößern"
            >
              <PlusIcon className="size-5" />
            </button>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="mb-3 block text-sm font-bold tracking-wide text-slate-700 uppercase">
            Kommentar <span className="font-normal text-slate-500 normal-case">(Optional)</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-slate-900 transition-all focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
            placeholder="Teile deine Meinung zu diesem Sneaker..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-900 px-6 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md"
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
