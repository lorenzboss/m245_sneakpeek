"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home({ preloaded }: { preloaded: Preloaded<typeof api.sneakers.listSneakers> }) {
  const data = usePreloadedQuery(preloaded);
  return (
    <>
      <div className="flex flex-col gap-4 rounded-md bg-slate-200 p-4">
        <h2 className="text-xl font-bold">Reactive client-loaded data (using server data during hydration)</h2>
        <div className="space-y-2">
          <p>
            <strong>Sneakers loaded:</strong> {data.length}
          </p>
          {data.length > 0 && (
            <div>
              <strong>Sneakers:</strong>
              <ul className="mt-2 list-inside list-disc">
                {data.map((sneaker) => (
                  <li key={sneaker._id}>
                    {sneaker.name} ({sneaker.brand})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
