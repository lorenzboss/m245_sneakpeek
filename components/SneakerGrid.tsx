"use client";

import { useQuery } from "convex/react";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
        return (
          <Link
            key={sneaker._id}
            href={`/sneakers/${sneaker._id}`}
            className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-50">
              <Image
                src={sneaker.imageUrl}
                alt={sneaker.name}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
              {sneaker.ratingsCount > 0 && sneaker.avgRating != null && (
                <div className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 font-semibold text-white shadow-md">
                  <StarIcon fill="white" className="size-4" /> {(sneaker.avgRating ?? 0).toFixed(1)}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="mb-1 text-lg font-bold text-slate-900">{sneaker.name}</h3>
              <p className="mb-2 text-sm font-medium text-slate-600">{sneaker.brand}</p>
              <p className="mb-3 line-clamp-2 text-sm text-slate-600">{sneaker.description}</p>

              {sneaker.ratingsCount > 0 && (
                <p className="text-xs text-slate-500">
                  {sneaker.ratingsCount} {sneaker.ratingsCount === 1 ? "Rating" : "Ratings"}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500">{new Date(sneaker.createdAt).toLocaleDateString("en-US")}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
