'use client';

import { useQuery } from 'convex/react';
import Image from 'next/image';
import { api } from '../convex/_generated/api';

export function SneakerGrid() {
  const sneakers = useQuery(api.sneakers.listSneakers);

  if (!sneakers) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }

  if (sneakers.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="text-center">
          <p className="text-lg text-slate-600">No sneakers yet</p>
          <p className="text-sm text-slate-500 mt-2">Be the first to create a sneaker!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sneakers.map((sneaker) => {
        const avgRating = (
          (sneaker.ratingDesign + sneaker.ratingComfort + sneaker.ratingQuality + sneaker.ratingValue) /
          4
        ).toFixed(1);

        return (
          <div
            key={sneaker._id}
            className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square relative bg-slate-50">
              <Image src={sneaker.imageUrl} alt={sneaker.name} fill className="object-cover" />
              <div className="absolute top-3 right-3 bg-slate-900 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md">
                ⭐ {avgRating}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 text-slate-900">{sneaker.name}</h3>
              <p className="text-sm text-slate-600 mb-2 font-medium">{sneaker.brand}</p>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">{sneaker.comment}</p>

              {/* Ratings Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200 pt-3">
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

              <p className="text-xs text-slate-500 mt-3">{new Date(sneaker.createdAt).toLocaleDateString('de-DE')}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
