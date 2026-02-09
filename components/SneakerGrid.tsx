'use client';

import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export function SneakerGrid() {
  const sneakers = useQuery(api.sneakers.listSneakers);

  if (!sneakers) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Lädt...</div>
      </div>
    );
  }

  if (sneakers.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-slate-500">Noch keine Sneaker vorhanden</p>
          <p className="text-sm text-slate-400 mt-2">
            Klicke auf "Hinzufügen" um deinen ersten Sneaker hochzuladen
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sneakers.map((sneaker) => {
        const avgRating = (
          (sneaker.ratingDesign + sneaker.ratingComfort + sneaker.ratingQuality + sneaker.ratingValue) / 4
        ).toFixed(1);
        
        return (
          <div
            key={sneaker._id}
            className="border-2 border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square relative bg-slate-100 dark:bg-slate-900">
              <img
                src={sneaker.imageUrl}
                alt={sneaker.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-foreground text-background px-2 py-1 rounded-md text-sm font-bold">
                ⭐ {avgRating}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{sneaker.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{sneaker.brand}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                {sneaker.comment}
              </p>
              
              {/* Ratings Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200 dark:border-slate-800 pt-3">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Design:</span>
                  <span className="font-semibold">{sneaker.ratingDesign}/5</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Comfort:</span>
                  <span className="font-semibold">{sneaker.ratingComfort}/5</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Quality:</span>
                  <span className="font-semibold">{sneaker.ratingQuality}/5</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Value:</span>
                  <span className="font-semibold">{sneaker.ratingValue}/5</span>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 mt-3">
                {new Date(sneaker.createdAt).toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
