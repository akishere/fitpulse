import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next");

  if (errorDescription) {
    const url = new URL("/login", origin);
    url.searchParams.set("error", errorDescription);
    return NextResponse.redirect(url);
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const url = new URL("/login", origin);
      url.searchParams.set("error", error.message);
      return NextResponse.redirect(url);
    }

    // Decide where to send them: onboarding if their public.users row has no
    // goal set yet, otherwise dashboard. Fail open to /onboarding on any
    // lookup error so first-time users aren't stranded.
    let destination = next && next.startsWith("/") ? next : "/onboarding";
    const userId = data.session?.user.id;
    if (!next && userId) {
      const { data: profile } = await supabase
        .from("users")
        .select("goal, daily_calorie_target")
        .eq("id", userId)
        .maybeSingle();
      if (profile?.goal && profile?.daily_calorie_target) {
        destination = "/dashboard";
      }
    }

    return NextResponse.redirect(new URL(destination, origin));
  } catch (err) {
    const url = new URL("/login", origin);
    url.searchParams.set(
      "error",
      err instanceof Error ? err.message : "Auth callback failed"
    );
    return NextResponse.redirect(url);
  }
}
