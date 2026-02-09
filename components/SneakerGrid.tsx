"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../convex/_generated/api";

export function SneakerGrid() {
  const sneakers = useQuery(api.sneakers.listSneakers);

  if (!sneakers) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }

  if (sneakers.length === 0) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">No sneakers yet</p>
          <p className="mt-2 text-sm text-slate-500">Be the first to create a sneaker!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sneakers.map((sneaker) => {
        const avgRating = (
          (sneaker.ratingDesign + sneaker.ratingComfort + sneaker.ratingQuality + sneaker.ratingValue) /
          4
        ).toFixed(1);

        return (
          <div
            key={sneaker._id}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-square bg-slate-50">
              <Image src={sneaker.imageUrl} alt={sneaker.name} fill className="object-cover" />
              <div className="absolute top-3 right-3 rounded-lg bg-slate-900 px-3 py-1 text-sm font-semibold text-white shadow-md">
                ⭐ {avgRating}
              </div>
            </div>
            <div className="p-4">
              <h3 className="mb-1 text-lg font-bold text-slate-900">{sneaker.name}</h3>
              <p className="mb-2 text-sm font-medium text-slate-600">{sneaker.brand}</p>
              <p className="mb-3 line-clamp-2 text-sm text-slate-600">{sneaker.comment}</p>

              {/* Ratings Grid */}
              <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Design:</span>
                  <span className="font-semibold text-slate-900">{sneaker.ratingDesign}/5</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Comfort:</span>
                  <span className="font-semibold text-slate-900">{sneaker.ratingComfort}/5</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Quality:</span>
                  <span className="font-semibold text-slate-900">{sneaker.ratingQuality}/5</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Value:</span>
                  <span className="font-semibold text-slate-900">{sneaker.ratingValue}/5</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">{new Date(sneaker.createdAt).toLocaleDateString("de-DE")}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
