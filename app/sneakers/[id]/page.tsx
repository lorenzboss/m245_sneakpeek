"use client";

import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { ArrowLeft, MinusIcon, PlusIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "../../../components/Header";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function SneakerDetailPage() {
  const params = useParams();
  const sneakerId = params.id as Id<"sneakers">;

  const sneaker = useQuery(api.sneakers.getSneakerById, { sneakerId });
  const ratings = useQuery(api.ratings.getRatingsForSneaker, { sneakerId });

  if (sneaker === undefined || ratings === undefined) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto p-8">
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-lg text-slate-600">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  if (sneaker === null) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto p-8">
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-lg text-slate-600">Sneaker nicht gefunden</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto p-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Zurück zur Übersicht
        </Link>

        {/* Sneaker Info Card */}
        <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
          <div className="grid gap-6 p-8 lg:grid-cols-2">
            {/* Sneaker Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-50">
              <Image src={sneaker.imageUrl} alt={sneaker.name} fill className="object-cover" />
            </div>

            {/* Sneaker Details */}
            <div className="flex flex-col justify-center">
              <h1 className="mb-3 text-4xl font-bold text-slate-900">{sneaker.name}</h1>
              <p className="mb-4 text-xl font-semibold text-slate-600">{sneaker.brand}</p>
              {sneaker.description && <p className="mb-6 text-slate-700">{sneaker.description}</p>}
              {sneaker.ratingsCount > 0 && (
                <div className="space-y-3">
                  <div className="inline-flex w-fit items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-3xl font-bold text-slate-900">
                      <StarIcon fill="currentColor" className="size-8 text-yellow-500" />
                      {sneaker.avgRating.toFixed(1)}
                    </div>
                    <span className="text-sm text-slate-500">
                      ({sneaker.ratingsCount} {sneaker.ratingsCount === 1 ? "Bewertung" : "Bewertungen"})
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-4 py-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-slate-700">Design:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            fill={star <= Math.round(sneaker.avgDesign) ? "currentColor" : "none"}
                            className="size-4 text-yellow-500"
                          />
                        ))}
                        <span className="ml-2 font-semibold text-slate-900">{sneaker.avgDesign.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-slate-700">Komfort:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            fill={star <= Math.round(sneaker.avgComfort) ? "currentColor" : "none"}
                            className="size-4 text-yellow-500"
                          />
                        ))}
                        <span className="ml-2 font-semibold text-slate-900">{sneaker.avgComfort.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-slate-700">Qualität:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            fill={star <= Math.round(sneaker.avgQuality) ? "currentColor" : "none"}
                            className="size-4 text-yellow-500"
                          />
                        ))}
                        <span className="ml-2 font-semibold text-slate-900">{sneaker.avgQuality.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-slate-700">Preis-Leistung:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            fill={star <= Math.round(sneaker.avgValue) ? "currentColor" : "none"}
                            className="size-4 text-yellow-500"
                          />
                        ))}
                        <span className="ml-2 font-semibold text-slate-900">{sneaker.avgValue.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rating Form */}
        <div className="mb-8">
          <Authenticated>
            <RatingForm sneakerId={sneakerId} />
          </Authenticated>
          <Unauthenticated>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Bewerte diesen Sneaker</h2>
              <p className="mb-4 text-slate-600">Du musst angemeldet sein, um eine Bewertung abzugeben.</p>
              <Link href="/sign-in">
                <button className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-slate-800">
                  Anmelden
                </button>
              </Link>
            </div>
          </Unauthenticated>
        </div>

        {/* Ratings List */}
        {ratings.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Bewertungen</h2>
            <div className="space-y-4">
              {ratings.map((rating) => (
                <RatingCard key={rating._id} rating={rating} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function RatingForm({ sneakerId }: { sneakerId: Id<"sneakers"> }) {
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
        // Update existing rating
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
        // Create new rating
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
        {/* Design Rating */}
        <RatingSlider label="Design" value={ratingDesign} onChange={setRatingDesign} />

        {/* Comfort Rating */}
        <RatingSlider label="Komfort" value={ratingComfort} onChange={setRatingComfort} />

        {/* Quality Rating */}
        <RatingSlider label="Qualität" value={ratingQuality} onChange={setRatingQuality} />

        {/* Value Rating */}
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
            >
              <MinusIcon className="size-5" />
            </button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-slate-900">{sizing}</div>
              <div className="text-xs text-slate-600">
                {sizing === -2 && "Viel zu klein"}
                {sizing === -1 && "Etwas klein"}
                {sizing === 0 && "Perfekt"}
                {sizing === 1 && "Etwas groß"}
                {sizing === 2 && "Viel zu groß"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSizing(Math.min(2, sizing + 1))}
              className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 disabled:opacity-50"
              disabled={sizing === 2}
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

function RatingSlider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
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

function RatingCard({
  rating,
}: {
  rating: {
    _id: Id<"ratings">;
    creatorName: string | null;
    comment: string;
    ratingDesign: number;
    ratingComfort: number;
    ratingQuality: number;
    ratingValue: number;
    sizing: number;
    createdAt: number;
  };
}) {
  const avgRating = (rating.ratingDesign + rating.ratingComfort + rating.ratingQuality + rating.ratingValue) / 4;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-1 font-semibold text-slate-900">{rating.creatorName || "Anonymer Nutzer"}</div>
          <div className="text-xs text-slate-500">{new Date(rating.createdAt).toLocaleDateString("de-DE")}</div>
        </div>
        <div className="flex items-center gap-1 text-xl font-bold text-slate-900">
          <StarIcon fill="currentColor" className="size-5 text-yellow-500" />
          {avgRating.toFixed(1)}
        </div>
      </div>

      <p className="mb-4 text-slate-700">{rating.comment}</p>

      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <div className="text-xs font-medium text-slate-600">Design</div>
          <div className="flex items-center gap-1">
            <StarIcon fill="currentColor" className="size-3 text-yellow-500" />
            <span className="font-bold text-slate-900">{rating.ratingDesign}</span>
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <div className="text-xs font-medium text-slate-600">Komfort</div>
          <div className="flex items-center gap-1">
            <StarIcon fill="currentColor" className="size-3 text-yellow-500" />
            <span className="font-bold text-slate-900">{rating.ratingComfort}</span>
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <div className="text-xs font-medium text-slate-600">Qualität</div>
          <div className="flex items-center gap-1">
            <StarIcon fill="currentColor" className="size-3 text-yellow-500" />
            <span className="font-bold text-slate-900">{rating.ratingQuality}</span>
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <div className="text-xs font-medium text-slate-600">Preis-Leistung</div>
          <div className="flex items-center gap-1">
            <StarIcon fill="currentColor" className="size-3 text-yellow-500" />
            <span className="font-bold text-slate-900">{rating.ratingValue}</span>
          </div>
        </div>
      </div>

      {rating.sizing !== 0 && (
        <div className="mt-3 text-xs text-slate-600">
          Größe: {rating.sizing === -2 && "Viel zu klein"}
          {rating.sizing === -1 && "Etwas klein"}
          {rating.sizing === 1 && "Etwas groß"}
          {rating.sizing === 2 && "Viel zu groß"}
        </div>
      )}
    </div>
  );
}
