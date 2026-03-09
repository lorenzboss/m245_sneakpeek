"use client";

import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { ChevronLeft, Edit2, StarIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryRatings } from "../../../components/CategoryRatings";
import { Header } from "../../../components/Header";
import { RatingCard } from "../../../components/RatingCard";
import { RatingForm } from "../../../components/RatingForm";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function SneakerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sneakerId = params.id as Id<"sneakers">;

  const sneaker = useQuery(api.sneakers.getSneakerById, { sneakerId });
  const ratings = useQuery(api.ratings.getRatingsForSneaker, { sneakerId });
  const currentUser = useQuery(api.users.getCurrentUser);
  const deleteSneaker = useMutation(api.sneakers.deleteSneaker);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isCreator = currentUser && sneaker && sneaker.creatorId === currentUser._id;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSneaker({ sneakerId });
      router.push("/");
    } catch (error) {
      console.error("Error deleting sneaker:", error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (sneaker === undefined || ratings === undefined) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header
          actionButton={{
            label: "Back",
            icon: ChevronLeft,
            href: "/",
          }}
        />
        <main className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
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
        <Header
          actionButton={{
            label: "Back",
            icon: ChevronLeft,
            href: "/",
          }}
        />
        <main className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-lg text-slate-600">Sneaker not found</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        actionButton={{
          label: "Back",
          icon: ChevronLeft,
          href: "/",
        }}
      />
      <main className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {isCreator && (
          <div className="mb-4 flex justify-end gap-2 sm:mb-6">
            <Link
              href={`/sneakers/${sneakerId}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 sm:gap-2 sm:px-4"
            >
              <Edit2 className="size-4" />
              <span className="hidden sm:inline">Edit</span>
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-600 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 sm:gap-2 sm:px-4"
            >
              <Trash2 className="size-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Delete Sneaker?</h3>
              <p className="mb-6 text-slate-600">
                Do you really want to delete this sneaker? All ratings will also be deleted. This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:bg-red-400"
                >
                  {isDeleting ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-50 disabled:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sneaker Info Card */}
        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-md sm:mb-8">
          <div className="grid gap-4 p-4 sm:gap-6 sm:p-6 lg:grid-cols-2 lg:p-8">
            {/* Sneaker Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-50">
              <Image src={sneaker.imageUrl} alt={sneaker.name} fill className="object-cover" />
            </div>

            {/* Sneaker Details */}
            <div className="flex flex-col justify-center">
              <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:mb-3 sm:text-3xl lg:text-4xl">{sneaker.name}</h1>
              <p className="mb-3 text-lg font-semibold text-slate-600 sm:mb-4 sm:text-xl">{sneaker.brand}</p>
              {sneaker.description && (
                <p className="mb-4 text-sm whitespace-pre-wrap text-slate-700 sm:mb-6 sm:text-base">
                  {sneaker.description}
                </p>
              )}
              {sneaker.ratingsCount > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
                    <div className="flex items-center gap-1.5 text-2xl font-bold text-slate-900 sm:gap-2 sm:text-3xl">
                      <StarIcon fill="currentColor" className="size-6 text-yellow-500 sm:size-8" />
                      {(sneaker.avgRating ?? 0).toFixed(1)}
                    </div>
                    <span className="text-xs text-slate-500 sm:text-sm">
                      ({sneaker.ratingsCount} {sneaker.ratingsCount === 1 ? "Rating" : "Ratings"})
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

        {/* Two-column layout: Rating Form and Ratings List */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-5">
          {/* Rating Form - Left Column */}
          <div className="lg:col-span-2">
            <Authenticated>
              <div className="lg:sticky lg:top-8">
                <RatingForm sneakerId={sneakerId} />
              </div>
            </Authenticated>
            <Unauthenticated>
              <div className="lg:sticky lg:top-8">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                  <h2 className="mb-2 text-xl font-bold text-slate-900 sm:mb-3 sm:text-2xl">Rate this Sneaker</h2>
                  <p className="mb-4 text-sm text-slate-600 sm:mb-6 sm:text-base">
                    You must be signed in to submit a rating.
                  </p>
                  <Link href="/sign-in">
                    <button className="w-full rounded-lg bg-slate-900 px-6 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg">
                      Sign In
                    </button>
                  </Link>
                </div>
              </div>
            </Unauthenticated>
          </div>

          {/* Ratings List - Right Column */}
          <div className="lg:col-span-3">
            {ratings.length > 0 ? (
              <div>
                <h2 className="mb-4 text-xl font-bold text-slate-900 sm:mb-6 sm:text-2xl">
                  Ratings <span className="text-slate-500">({ratings.length})</span>
                </h2>
                <div className="space-y-4">
                  {ratings.map((rating) => (
                    <RatingCard key={rating._id} rating={rating} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center sm:p-12">
                <p className="text-base text-slate-600 sm:text-lg">No ratings available yet</p>
                <p className="mt-2 text-xs text-slate-500 sm:text-sm">Be the first to rate this sneaker!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
