"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExerciseLog, MealLog, MealSlot } from "@/lib/types";

export interface DailyLogRow {
  water_glasses: number;
  step_count: number | null;
  weight_kg: number | null;
}

interface MealLogRow {
  id: string;
  log_date: string;
  meal_slot: MealSlot;
  food_item: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  photo_url: string | null;
  source: "manual" | "photo_ai" | "plan_default" | null;
}

interface ExerciseLogRow {
  id: string;
  log_date: string;
  exercise_name: string;
  actual_sets: number | null;
  actual_reps: string | null;
  weight_used_kg: number | null;
  is_completed: boolean | null;
}

export function todayIso(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

////////////////////////////////////////////////////////////////////////////////
// Reads
////////////////////////////////////////////////////////////////////////////////

export async function fetchMealLogs(
  supabase: SupabaseClient,
  userId: string,
  date: string
): Promise<MealLog[]> {
  const { data, error } = await supabase
    .from("meal_logs")
    .select(
      "id, log_date, meal_slot, food_item, calories, protein_g, carbs_g, fat_g, photo_url, source"
    )
    .eq("user_id", userId)
    .eq("log_date", date)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map((r: MealLogRow) => ({
    id: r.id,
    log_date: r.log_date,
    meal_slot: r.meal_slot,
    food_item: r.food_item,
    calories: r.calories ?? 0,
    protein_g: Number(r.protein_g ?? 0),
    carbs_g: Number(r.carbs_g ?? 0),
    fat_g: Number(r.fat_g ?? 0),
    photo_url: r.photo_url ?? undefined,
    source: r.source ?? "manual",
  }));
}

export async function fetchExerciseLogs(
  supabase: SupabaseClient,
  userId: string,
  date: string
): Promise<ExerciseLog[]> {
  const { data, error } = await supabase
    .from("exercise_logs")
    .select(
      "id, log_date, exercise_name, actual_sets, actual_reps, weight_used_kg, is_completed"
    )
    .eq("user_id", userId)
    .eq("log_date", date);
  if (error || !data) return [];
  return data.map((r: ExerciseLogRow) => ({
    id: r.id,
    log_date: r.log_date,
    exercise_name: r.exercise_name,
    actual_sets: r.actual_sets ?? 0,
    actual_reps: r.actual_reps ?? "",
    weight_used_kg: r.weight_used_kg ?? undefined,
    is_completed: r.is_completed ?? false,
  }));
}

export async function fetchDailyLog(
  supabase: SupabaseClient,
  userId: string,
  date: string
): Promise<DailyLogRow | null> {
  const { data } = await supabase
    .from("daily_logs")
    .select("water_glasses, step_count, weight_kg")
    .eq("user_id", userId)
    .eq("log_date", date)
    .maybeSingle<DailyLogRow>();
  return data ?? null;
}

////////////////////////////////////////////////////////////////////////////////
// Writes
////////////////////////////////////////////////////////////////////////////////

export async function insertMealLog(
  supabase: SupabaseClient,
  userId: string,
  m: Omit<MealLog, "id">
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const { data, error } = await supabase
    .from("meal_logs")
    .insert({
      user_id: userId,
      log_date: m.log_date,
      meal_slot: m.meal_slot,
      food_item: m.food_item,
      calories: m.calories,
      protein_g: m.protein_g,
      carbs_g: m.carbs_g,
      fat_g: m.fat_g,
      photo_url: m.photo_url ?? null,
      source: m.source,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data?.id };
}

export async function deleteMealLog(
  supabase: SupabaseClient,
  id: string
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("meal_logs").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Toggle an exercise's completion for today.
 * If a row exists, flip is_completed. Otherwise insert a completed row.
 */
export async function toggleExerciseLog(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  exerciseName: string,
  patch: {
    actual_sets?: number;
    actual_reps?: string;
    weight_used_kg?: number;
  } = {}
): Promise<{ ok: boolean; is_completed?: boolean; error?: string }> {
  const { data: existing } = await supabase
    .from("exercise_logs")
    .select("id, is_completed")
    .eq("user_id", userId)
    .eq("log_date", date)
    .eq("exercise_name", exerciseName)
    .maybeSingle<{ id: string; is_completed: boolean }>();

  if (existing) {
    const nextDone = !existing.is_completed;
    const { error } = await supabase
      .from("exercise_logs")
      .update({
        is_completed: nextDone,
        actual_sets: patch.actual_sets,
        actual_reps: patch.actual_reps,
        weight_used_kg: patch.weight_used_kg ?? null,
      })
      .eq("id", existing.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, is_completed: nextDone };
  }

  const { error } = await supabase.from("exercise_logs").insert({
    user_id: userId,
    log_date: date,
    exercise_name: exerciseName,
    actual_sets: patch.actual_sets ?? 0,
    actual_reps: patch.actual_reps ?? "",
    weight_used_kg: patch.weight_used_kg ?? null,
    is_completed: true,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, is_completed: true };
}

/** Upsert today's daily log (water / steps / weight). */
export async function upsertDailyLog(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  patch: Partial<{ water_glasses: number; step_count: number; weight_kg: number }>
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("daily_logs")
    .upsert(
      {
        user_id: userId,
        log_date: date,
        ...patch,
      },
      { onConflict: "user_id,log_date" }
    );
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
