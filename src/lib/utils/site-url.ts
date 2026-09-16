/**
 * Canonical site origin, no trailing slash.
 *
 * Order of precedence:
 *  1. `NEXT_PUBLIC_SITE_URL` (set this in Netlify to your production URL)
 *  2. `window.location.origin` (client-only fallback for local dev)
 *
 * Never use `window.location.origin` for anything that gets emailed or
 * persisted — Netlify serves the same code from deploy-preview URLs like
 * `<hash>--yoursite.netlify.app`, and links captured from those previews
 * stay pointed at that specific deploy forever.
 */
export function getSiteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
