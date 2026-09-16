"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserProfile } from "@/lib/types";

export interface DbProfileRow {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
  age: number | null;
  gender: "male" | "female" | "other" | null;
  height_cm: number | null;
  current_weight_kg: number | null;
  target_weight_kg: number | null;
  bmi: number | null;
  goal:
    | "weight_loss"
    | "muscle_gain"
    | "lean_body"
    | "strength"
    | "maintenance"
    | null;
  activity_level:
    | "sedentary"
    | "light"
    | "moderate"
    | "very_active"
    | null;
  medical_conditions: string[] | null;
  daily_calorie_target: number | null;
  protein_target_g: number | null;
  carb_target_g: number | null;
  fat_target_g: number | null;
  thyrox_dose_mg: number | null;
}

/**
 * Fetch the current user's row from public.users.
 * Returns `null` if not signed in or the row does not exist yet.
 */
export async function fetchProfile(
  supabase: SupabaseClient
): Promise<DbProfileRow | null> {
  const { data: userRes } = await supabase.auth.getUser();
  const uid = userRes.user?.id;
  if (!uid) return null;
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, email, name, role, age, gender, height_cm, current_weight_kg, target_weight_kg, bmi, goal, activity_level, medical_conditions, daily_calorie_target, protein_target_g, carb_target_g, fat_target_g, thyrox_dose_mg"
    )
    .eq("id", uid)
    .maybeSingle<DbProfileRow>();
  if (error) return null;
  return data;
}

/** True when the profile is complete enough to route to /dashboard. */
export function isOnboarded(row: DbProfileRow | null | undefined): boolean {
  return Boolean(row?.goal && row?.daily_calorie_target);
}

/**
 * Upsert (insert or update) the caller's public.users row with the given
 * onboarding fields. Requires an authenticated session — id + email are
 * pulled from Supabase auth so a caller can't spoof another user.
 */
export async function upsertProfile(
  supabase: SupabaseClient,
  patch: Omit<UserProfile, "id" | "email" | "role" | "avatar_url" | "streak_days">
): Promise<{ ok: boolean; error?: string }> {
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) return { ok: false, error: "Not signed in" };

  const row = {
    id: user.id,
    email: user.email!,
    name: patch.name,
    age: patch.age,
    gender: patch.gender,
    height_cm: patch.height_cm,
    current_weight_kg: patch.current_weight_kg,
    target_weight_kg: patch.target_weight_kg,
    bmi: patch.bmi,
    goal: patch.goal,
    activity_level: patch.activity_level,
    medical_conditions: patch.medical_conditions,
    daily_calorie_target: patch.daily_calorie_target,
    protein_target_g: patch.protein_target_g,
    carb_target_g: patch.carb_target_g,
    fat_target_g: patch.fat_target_g,
    thyrox_dose_mg: patch.thyrox_dose_mg ?? null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("users").upsert(row);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Convert a DB row into the shape the Zustand store expects. */
export function dbRowToProfile(row: DbProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? "",
    role: row.role,
    age: row.age ?? 0,
    gender: row.gender ?? "other",
    height_cm: row.height_cm ?? 0,
    current_weight_kg: row.current_weight_kg ?? 0,
    target_weight_kg: row.target_weight_kg ?? undefined,
    bmi: row.bmi ?? 0,
    goal: row.goal ?? "maintenance",
    activity_level: row.activity_level ?? "moderate",
    medical_conditions: (row.medical_conditions ?? []) as UserProfile["medical_conditions"],
    daily_calorie_target: row.daily_calorie_target ?? 0,
    protein_target_g: row.protein_target_g ?? 0,
    carb_target_g: row.carb_target_g ?? 0,
    fat_target_g: row.fat_target_g ?? 0,
    thyrox_dose_mg: row.thyrox_dose_mg ?? undefined,
  };
}
