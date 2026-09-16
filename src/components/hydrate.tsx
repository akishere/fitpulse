"use client";

import { useEffect, useRef } from "react";
import { useUserStore } from "@/lib/store/user-store";

/**
 * Runs once when the authed layout mounts.
 * Pulls the user's profile, active plans, and today's logs from Supabase and
 * overwrites the local Zustand cache. Silent no-op if Supabase env is missing.
 */
export function HydrateOnMount() {
  const hydrate = useUserStore((s) => s.hydrate);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    hydrate().catch(() => {
      /* hydrate() already swallows errors; nothing to surface here */
    });
  }, [hydrate]);

  return null;
}
