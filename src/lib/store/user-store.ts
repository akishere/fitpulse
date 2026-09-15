"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  UserProfile,
  MealLog,
  ExerciseLog,
  DietPlanItem,
  ExercisePlanItem,
} from "@/lib/types";
import { SEED_DIET, SEED_EXERCISE } from "@/lib/constants/seed-plan";

interface DailyLog {
  water_glasses: number;
  step_count: number;
  weight_kg?: number;
}

interface UserStore {
  profile: UserProfile | null;
  onboardingComplete: boolean;
  authed: boolean;

  dietPlan: DietPlanItem[];
  exercisePlan: ExercisePlanItem[];

  mealLogs: MealLog[]; // today
  exerciseLogs: ExerciseLog[]; // today
  dailyLog: DailyLog;

  streak: number;
  planUpdatedAt: string | null;
  lastSeenPlanAt: string | null;

  setProfile: (p: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  setAuthed: (a: boolean) => void;
  completeOnboarding: () => void;

  logMeal: (m: Omit<MealLog, "id"> & { id?: string }) => void;
  removeMeal: (id: string) => void;
  toggleExerciseComplete: (
    name: string,
    payload?: Partial<ExerciseLog>
  ) => void;
  addWater: () => void;
  setSteps: (n: number) => void;
  logWeight: (kg: number) => void;

  updateDietItem: (id: string, patch: Partial<DietPlanItem>) => void;
  markPlanSeen: () => void;

  reset: () => void;
}

const DEFAULT_LOG: DailyLog = { water_glasses: 0, step_count: 0 };

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: null,
      onboardingComplete: false,
      authed: false,

      dietPlan: SEED_DIET,
      exercisePlan: SEED_EXERCISE,

      mealLogs: [],
      exerciseLogs: [],
      dailyLog: DEFAULT_LOG,

      streak: 3,
      planUpdatedAt: null,
      lastSeenPlanAt: null,

      setProfile: (profile) => set({ profile }),
      updateProfile: (patch) =>
        set((s) => ({ profile: s.profile ? { ...s.profile, ...patch } : s.profile })),
      setAuthed: (authed) => set({ authed }),
      completeOnboarding: () => set({ onboardingComplete: true, authed: true }),

      logMeal: (m) =>
        set((s) => ({
          mealLogs: [
            ...s.mealLogs,
            { ...m, id: m.id ?? `ml-${Date.now()}` } as MealLog,
          ],
        })),

      removeMeal: (id) =>
        set((s) => ({ mealLogs: s.mealLogs.filter((m) => m.id !== id) })),

      toggleExerciseComplete: (name, payload) =>
        set((s) => {
          const existing = s.exerciseLogs.find((e) => e.exercise_name === name);
          if (existing) {
            return {
              exerciseLogs: s.exerciseLogs.map((e) =>
                e.exercise_name === name
                  ? {
                      ...e,
                      is_completed: !e.is_completed,
                      ...(payload ?? {}),
                    }
                  : e
              ),
            };
          }
          const today = new Date().toISOString().slice(0, 10);
          return {
            exerciseLogs: [
              ...s.exerciseLogs,
              {
                id: `ex-${Date.now()}`,
                log_date: today,
                exercise_name: name,
                actual_sets: payload?.actual_sets ?? 0,
                actual_reps: payload?.actual_reps ?? "",
                weight_used_kg: payload?.weight_used_kg,
                is_completed: true,
              },
            ],
          };
        }),

      addWater: () =>
        set((s) => ({
          dailyLog: {
            ...s.dailyLog,
            water_glasses: Math.min(20, s.dailyLog.water_glasses + 1),
          },
        })),

      setSteps: (n) =>
        set((s) => ({ dailyLog: { ...s.dailyLog, step_count: n } })),

      logWeight: (kg) =>
        set((s) => ({
          dailyLog: { ...s.dailyLog, weight_kg: kg },
          profile: s.profile
            ? { ...s.profile, current_weight_kg: kg }
            : s.profile,
        })),

      updateDietItem: (id, patch) =>
        set((s) => ({
          dietPlan: s.dietPlan.map((d) =>
            d.id === id ? { ...d, ...patch } : d
          ),
        })),

      markPlanSeen: () =>
        set(() => ({ lastSeenPlanAt: new Date().toISOString() })),

      reset: () =>
        set({
          profile: null,
          onboardingComplete: false,
          authed: false,
          mealLogs: [],
          exerciseLogs: [],
          dailyLog: DEFAULT_LOG,
        }),
    }),
    {
      name: "fitpulse-user",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        profile: s.profile,
        onboardingComplete: s.onboardingComplete,
        authed: s.authed,
        mealLogs: s.mealLogs,
        exerciseLogs: s.exerciseLogs,
        dailyLog: s.dailyLog,
        streak: s.streak,
      }),
    }
  )
);
