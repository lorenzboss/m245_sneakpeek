import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

// Log environment at build time
console.log("[Middleware Build] Environment:", {
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL: process.env.VERCEL_URL,
});

// Determine the redirect URI based on the environment
const getRedirectUri = () => {
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_BRANCH_URL) {
    const uri = `https://${process.env.VERCEL_BRANCH_URL}/callback`;
    console.log("[Middleware Build] Using preview redirectUri:", uri);
    return uri;
  }
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    const uri = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/callback`;
    console.log("[Middleware Build] Using production redirectUri:", uri);
    return uri;
  }
  if (process.env.VERCEL_URL) {
    const uri = `https://${process.env.VERCEL_URL}/callback`;
    console.log("[Middleware Build] Using VERCEL_URL redirectUri:", uri);
    return uri;
  }
  // Fallback for local development
  console.log("[Middleware Build] No Vercel environment detected, using default redirectUri");
  return undefined;
};

const redirectUri = getRedirectUri();

export default authkitMiddleware({
  eagerAuth: true,
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ["/", "/sign-in", "/sign-up"],
  },
  redirectUri,
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
