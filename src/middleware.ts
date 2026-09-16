import { NextResponse, type NextRequest } from "next/server";

/**
 * If any route (other than /auth/callback itself) receives a Supabase PKCE
 * `?code=` param, forward it to /auth/callback for a proper session exchange.
 * This makes us resilient to misconfigured Site URL / Redirect URLs in the
 * Supabase dashboard — the user still lands somewhere useful.
 */
export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname === "/auth/callback") return NextResponse.next();

  const code = searchParams.get("code");
  if (!code) return NextResponse.next();

  const url = new URL("/auth/callback", req.url);
  url.searchParams.set("code", code);
  if (pathname !== "/" && pathname !== "/auth/callback") {
    url.searchParams.set("next", pathname);
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Run on everything except static assets & Next internals.
    "/((?!_next/static|_next/image|favicon.ico|assets/|manifest.json).*)",
  ],
};
