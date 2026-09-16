"use client";

import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useUserStore } from "@/lib/store/user-store";

/**
 * Signs the user out of Supabase (if configured), clears local store,
 * and returns — caller is responsible for navigation (usually `router.push("/login")`).
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabaseBrowser();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      /* fall through — still clear local state */
    }
  }
  useUserStore.getState().reset();
}
