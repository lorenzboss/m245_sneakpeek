"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { ArrowLeft, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CategoryRatings } from "../../../components/CategoryRatings";
import { Header } from "../../../components/Header";
import { RatingCard } from "../../../components/RatingCard";
import { RatingForm } from "../../../components/RatingForm";
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
                      {(sneaker.avgRating ?? 0).toFixed(1)}
                    </div>
                    <span className="text-sm text-slate-500">
                      ({sneaker.ratingsCount} {sneaker.ratingsCount === 1 ? "Bewertung" : "Bewertungen"})
                    </span>
                  </div>
                  <CategoryRatings
                    avgDesign={sneaker.avgDesign}
                    avgComfort={sneaker.avgComfort}
                    avgQuality={sneaker.avgQuality}
                    avgValue={sneaker.avgValue}
                  />
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
