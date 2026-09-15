export type Gender = "male" | "female" | "other";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very_active";

export type Goal =
  | "weight_loss"
  | "muscle_gain"
  | "lean_body"
  | "strength"
  | "maintenance";

export type MedicalCondition =
  | "none"
  | "hypothyroidism"
  | "diabetes"
  | "pcos"
  | "lactose_intolerant";

export type Role = "user" | "admin";

export type MealSlot =
  | "detox_water"
  | "breakfast"
  | "snack1"
  | "lunch"
  | "chai"
  | "snack2"
  | "pre_workout"
  | "post_workout"
  | "dinner";

export type ExerciseCategory =
  | "warmup"
  | "main"
  | "hiit"
  | "cooldown"
  | "abs"
  | "forearm";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  age: number;
  gender: Gender;
  height_cm: number;
  current_weight_kg: number;
  target_weight_kg?: number;
  bmi: number;
  goal: Goal;
  activity_level: ActivityLevel;
  medical_conditions: MedicalCondition[];
  daily_calorie_target: number;
  protein_target_g: number;
  carb_target_g: number;
  fat_target_g: number;
  thyrox_dose_mg?: number;
  avatar_url?: string;
  streak_days?: number;
}

export interface DietPlanItem {
  id: string;
  day_of_week: number; // 0-6, 0 = Monday
  meal_slot: MealSlot;
  food_item: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  notes?: string;
  sort_order: number;
}

export interface ExercisePlanItem {
  id: string;
  day_of_week: number;
  exercise_name: string;
  category: ExerciseCategory;
  sets: number;
  reps: string;
  notes?: string;
  sort_order: number;
  last_weight_kg?: number;
}

export interface MealLog {
  id: string;
  log_date: string;
  meal_slot: MealSlot;
  food_item: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  photo_url?: string;
  source: "manual" | "photo_ai" | "plan_default";
}

export interface ExerciseLog {
  id: string;
  log_date: string;
  exercise_name: string;
  actual_sets: number;
  actual_reps: string;
  weight_used_kg?: number;
  is_completed: boolean;
}
