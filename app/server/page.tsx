import { api } from "@/convex/_generated/api";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import Home from "./inner";

export default async function ServerPage() {
  const { accessToken } = await withAuth();
  const preloaded = await preloadQuery(api.sneakers.listSneakers, {}, { token: accessToken });

  const data = preloadedQueryResult(preloaded);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8">
      <h1 className="text-center text-4xl font-bold">Convex + Next.js</h1>
      <div className="flex flex-col gap-4 rounded-md bg-slate-200 p-4">
        <h2 className="text-xl font-bold">Non-reactive server-loaded data</h2>
        <code>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </code>
      </div>
      <Home preloaded={preloaded} />
    </main>
  );
}
