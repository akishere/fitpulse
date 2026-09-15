import type { ActivityLevel, Gender, Goal } from "@/lib/types";

const activityMultiplier: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
};

const goalModifier: Record<Goal, number> = {
  weight_loss: -400,
  muscle_gain: 200,
  lean_body: -200,
  strength: 100,
  maintenance: 0,
};

export interface CalorieInputs {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
  activity: ActivityLevel;
  goal: Goal;
  hypothyroid?: boolean;
}

export function calcBmr({
  weightKg,
  heightCm,
  age,
  gender,
}: Pick<CalorieInputs, "weightKg" | "heightCm" | "age" | "gender">) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base - 5 : base - 161;
}

export function calcTdee(i: CalorieInputs) {
  let tdee = calcBmr(i) * activityMultiplier[i.activity];
  if (i.hypothyroid) tdee *= 0.88;
  return tdee;
}

export function calcCalorieTarget(i: CalorieInputs) {
  return Math.round(calcTdee(i) + goalModifier[i.goal]);
}

export interface MacroTargets {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export function calcMacros(calories: number, goal: Goal): MacroTargets {
  const split: Record<Goal, { p: number; c: number; f: number }> = {
    weight_loss: { p: 0.4, c: 0.3, f: 0.3 },
    muscle_gain: { p: 0.3, c: 0.45, f: 0.25 },
    lean_body: { p: 0.35, c: 0.35, f: 0.3 },
    strength: { p: 0.3, c: 0.45, f: 0.25 },
    maintenance: { p: 0.3, c: 0.4, f: 0.3 },
  };
  const s = split[goal];
  return {
    protein_g: Math.round((calories * s.p) / 4),
    carbs_g: Math.round((calories * s.c) / 4),
    fat_g: Math.round((calories * s.f) / 9),
  };
}
