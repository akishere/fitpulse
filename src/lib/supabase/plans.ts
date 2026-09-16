"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DietPlanItem,
  ExerciseCategory,
  ExercisePlanItem,
  MealSlot,
} from "@/lib/types";

interface DietPlanItemRow {
  id: string;
  day_of_week: number;
  meal_slot: MealSlot;
  food_item: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  notes: string | null;
  sort_order: number | null;
}

interface ExercisePlanItemRow {
  id: string;
  day_of_week: number;
  exercise_name: string;
  category: ExerciseCategory;
  sets: number | null;
  reps: string | null;
  notes: string | null;
  sort_order: number | null;
}

function toDietItem(r: DietPlanItemRow): DietPlanItem {
  return {
    id: r.id,
    day_of_week: r.day_of_week,
    meal_slot: r.meal_slot,
    food_item: r.food_item,
    calories: r.calories ?? 0,
    protein_g: Number(r.protein_g ?? 0),
    carbs_g: Number(r.carbs_g ?? 0),
    fat_g: Number(r.fat_g ?? 0),
    notes: r.notes ?? undefined,
    sort_order: r.sort_order ?? 0,
  };
}

function toExerciseItem(r: ExercisePlanItemRow): ExercisePlanItem {
  return {
    id: r.id,
    day_of_week: r.day_of_week,
    exercise_name: r.exercise_name,
    category: r.category,
    sets: r.sets ?? 0,
    reps: r.reps ?? "",
    notes: r.notes ?? undefined,
    sort_order: r.sort_order ?? 0,
  };
}

/**
 * Fetch every meal item for the user's active diet plan.
 * Prefers `week_1_2` — bi-weekly rotation is a Phase-2 enhancement.
 * Returns [] if the user has no plan yet.
 */
export async function fetchActiveDietItems(
  supabase: SupabaseClient,
  userId: string
): Promise<DietPlanItem[]> {
  const { data: plans, error: planErr } = await supabase
    .from("diet_plans")
    .select("id, week_group")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("plan_updated_at", { ascending: false });
  if (planErr || !plans || plans.length === 0) return [];

  const preferred =
    plans.find((p) => p.week_group === "week_1_2") ?? plans[0];

  const { data, error } = await supabase
    .from("diet_plan_items")
    .select(
      "id, day_of_week, meal_slot, food_item, calories, protein_g, carbs_g, fat_g, notes, sort_order"
    )
    .eq("plan_id", preferred.id)
    .order("day_of_week", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data.map(toDietItem);
}

/** Fetch every exercise for the user's active workout plan. */
export async function fetchActiveExerciseItems(
  supabase: SupabaseClient,
  userId: string
): Promise<ExercisePlanItem[]> {
  const { data: plans, error: planErr } = await supabase
    .from("exercise_plans")
    .select("id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("plan_updated_at", { ascending: false })
    .limit(1);
  if (planErr || !plans || plans.length === 0) return [];

  const { data, error } = await supabase
    .from("exercise_plan_items")
    .select(
      "id, day_of_week, exercise_name, category, sets, reps, notes, sort_order"
    )
    .eq("plan_id", plans[0].id)
    .order("day_of_week", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data.map(toExerciseItem);
}

/** Update a single diet plan item (user-level edit). */
export async function updateDietItemRow(
  supabase: SupabaseClient,
  itemId: string,
  patch: Partial<Pick<DietPlanItem, "food_item" | "calories" | "protein_g" | "carbs_g" | "fat_g" | "notes">>
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("diet_plan_items")
    .update(patch)
    .eq("id", itemId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
