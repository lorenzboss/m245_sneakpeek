import { convexAuthNextjsProxy, nextjsProxyRedirect } from "@/lib/convexAuth";

const publicPaths = new Set([
  "/",
  "/sign-in",
  "/sign-up",
  "/validate-email",
  "/confirm-email-change",
  "/reset-password",
]);

export default convexAuthNextjsProxy(async (request, { isAuthenticated }) => {
  if (publicPaths.has(request.nextUrl.pathname)) {
    return;
  }

  if (!(await isAuthenticated())) {
    return nextjsProxyRedirect(request, "/sign-in");
  }
});

export const config = {
  matcher: [
    "/((?!auth(?:/|$)|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpe?g|gif|webp|avif|woff2?|ttf|otf|eot)$).*)",
  ],
};
