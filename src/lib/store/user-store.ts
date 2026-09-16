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
import { getSupabaseBrowser } from "@/lib/supabase/client";
import {
  dbRowToProfile,
  fetchProfile,
} from "@/lib/supabase/profile";
import {
  fetchActiveDietItems,
  fetchActiveExerciseItems,
  updateDietItemRow,
} from "@/lib/supabase/plans";
import {
  deleteMealLog,
  fetchDailyLog,
  fetchExerciseLogs,
  fetchMealLogs,
  insertMealLog,
  todayIso,
  toggleExerciseLog,
  upsertDailyLog,
} from "@/lib/supabase/logs";

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
  logDate: string; // ISO date the logs above belong to

  streak: number;
  planUpdatedAt: string | null;
  lastSeenPlanAt: string | null;

  hydrating: boolean;
  hydratedAt: string | null;

  // Local-only setters
  setProfile: (p: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  setAuthed: (a: boolean) => void;
  completeOnboarding: () => void;
  markPlanSeen: () => void;
  reset: () => void;

  // Hydration
  hydrate: () => Promise<void>;

  // Actions (persist to Supabase where possible, optimistic locally)
  logMeal: (m: Omit<MealLog, "id"> & { id?: string }) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
  toggleExerciseComplete: (
    name: string,
    payload?: Partial<ExerciseLog>
  ) => Promise<void>;
  addWater: () => Promise<void>;
  setSteps: (n: number) => Promise<void>;
  logWeight: (kg: number) => Promise<void>;
  updateDietItem: (id: string, patch: Partial<DietPlanItem>) => Promise<void>;
}

const DEFAULT_LOG: DailyLog = { water_glasses: 0, step_count: 0 };

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: null,
      onboardingComplete: false,
      authed: false,

      dietPlan: SEED_DIET, // local fallback — replaced on hydrate
      exercisePlan: SEED_EXERCISE,

      mealLogs: [],
      exerciseLogs: [],
      dailyLog: DEFAULT_LOG,
      logDate: todayIso(),

      streak: 0,
      planUpdatedAt: null,
      lastSeenPlanAt: null,

      hydrating: false,
      hydratedAt: null,

      setProfile: (profile) => set({ profile }),
      updateProfile: (patch) =>
        set((s) => ({ profile: s.profile ? { ...s.profile, ...patch } : s.profile })),
      setAuthed: (authed) => set({ authed }),
      completeOnboarding: () => set({ onboardingComplete: true, authed: true }),

      markPlanSeen: () =>
        set(() => ({ lastSeenPlanAt: new Date().toISOString() })),

      reset: () =>
        set({
          profile: null,
          onboardingComplete: false,
          authed: false,
          dietPlan: SEED_DIET,
          exercisePlan: SEED_EXERCISE,
          mealLogs: [],
          exerciseLogs: [],
          dailyLog: DEFAULT_LOG,
          hydrating: false,
          hydratedAt: null,
        }),

      hydrate: async () => {
        if (get().hydrating) return;
        set({ hydrating: true });
        const supabase = getSupabaseBrowser();
        if (!supabase) {
          set({ hydrating: false });
          return;
        }
        try {
          const { data: userRes } = await supabase.auth.getUser();
          const user = userRes.user;
          if (!user) {
            set({ hydrating: false, authed: false });
            return;
          }
          set({ authed: true });

          // Profile — DB is source of truth. Fall back silently if empty.
          const dbProfile = await fetchProfile(supabase);
          if (dbProfile) {
            set({ profile: dbRowToProfile(dbProfile) });
          }

          // Plans
          const [diet, workout] = await Promise.all([
            fetchActiveDietItems(supabase, user.id),
            fetchActiveExerciseItems(supabase, user.id),
          ]);
          if (diet.length) set({ dietPlan: diet });
          if (workout.length) set({ exercisePlan: workout });

          // Today's logs
          const date = todayIso();
          const [mealLogs, exerciseLogs, dailyRow] = await Promise.all([
            fetchMealLogs(supabase, user.id, date),
            fetchExerciseLogs(supabase, user.id, date),
            fetchDailyLog(supabase, user.id, date),
          ]);
          set({
            mealLogs,
            exerciseLogs,
            dailyLog: dailyRow
              ? {
                  water_glasses: dailyRow.water_glasses ?? 0,
                  step_count: dailyRow.step_count ?? 0,
                  weight_kg: dailyRow.weight_kg ?? undefined,
                }
              : DEFAULT_LOG,
            logDate: date,
            hydratedAt: new Date().toISOString(),
          });
        } finally {
          set({ hydrating: false });
        }
      },

      logMeal: async (m) => {
        const tempId = m.id ?? `tmp-${Date.now()}`;
        const optimistic: MealLog = { ...m, id: tempId } as MealLog;
        set((s) => ({ mealLogs: [...s.mealLogs, optimistic] }));

        const supabase = getSupabaseBrowser();
        const uid = get().profile?.id;
        if (!supabase || !uid || uid === "local") return;

        const result = await insertMealLog(supabase, uid, {
          log_date: m.log_date,
          meal_slot: m.meal_slot,
          food_item: m.food_item,
          calories: m.calories,
          protein_g: m.protein_g,
          carbs_g: m.carbs_g,
          fat_g: m.fat_g,
          photo_url: m.photo_url,
          source: m.source,
        });
        if (!result.ok) {
          // Roll back
          set((s) => ({
            mealLogs: s.mealLogs.filter((x) => x.id !== tempId),
          }));
          throw new Error(result.error ?? "Insert failed");
        }
        // Swap temp id for the real one
        if (result.id) {
          set((s) => ({
            mealLogs: s.mealLogs.map((x) =>
              x.id === tempId ? { ...x, id: result.id! } : x
            ),
          }));
        }
      },

      removeMeal: async (id) => {
        const prev = get().mealLogs;
        set({ mealLogs: prev.filter((m) => m.id !== id) });
        const supabase = getSupabaseBrowser();
        if (!supabase || id.startsWith("tmp-")) return;
        const r = await deleteMealLog(supabase, id);
        if (!r.ok) set({ mealLogs: prev });
      },

      toggleExerciseComplete: async (name, payload) => {
        const s = get();
        const existing = s.exerciseLogs.find((e) => e.exercise_name === name);
        const today = todayIso();
        const optimisticDone = existing ? !existing.is_completed : true;
        if (existing) {
          set({
            exerciseLogs: s.exerciseLogs.map((e) =>
              e.exercise_name === name
                ? { ...e, is_completed: optimisticDone, ...(payload ?? {}) }
                : e
            ),
          });
        } else {
          set({
            exerciseLogs: [
              ...s.exerciseLogs,
              {
                id: `tmp-${Date.now()}`,
                log_date: today,
                exercise_name: name,
                actual_sets: payload?.actual_sets ?? 0,
                actual_reps: payload?.actual_reps ?? "",
                weight_used_kg: payload?.weight_used_kg,
                is_completed: true,
              },
            ],
          });
        }

        const supabase = getSupabaseBrowser();
        const uid = get().profile?.id;
        if (!supabase || !uid || uid === "local") return;

        const r = await toggleExerciseLog(supabase, uid, today, name, {
          actual_sets: payload?.actual_sets,
          actual_reps: payload?.actual_reps,
          weight_used_kg: payload?.weight_used_kg,
        });
        if (!r.ok) {
          // Best-effort refetch — cheaper than juggling rollback state
          const fresh = await fetchExerciseLogs(supabase, uid, today);
          set({ exerciseLogs: fresh });
        }
      },

      addWater: async () => {
        const s = get();
        const next = Math.min(20, s.dailyLog.water_glasses + 1);
        set({ dailyLog: { ...s.dailyLog, water_glasses: next } });
        const supabase = getSupabaseBrowser();
        const uid = s.profile?.id;
        if (!supabase || !uid || uid === "local") return;
        const r = await upsertDailyLog(supabase, uid, todayIso(), {
          water_glasses: next,
        });
        if (!r.ok) set({ dailyLog: s.dailyLog });
      },

      setSteps: async (n) => {
        const s = get();
        const prev = s.dailyLog;
        set({ dailyLog: { ...prev, step_count: n } });
        const supabase = getSupabaseBrowser();
        const uid = s.profile?.id;
        if (!supabase || !uid || uid === "local") return;
        const r = await upsertDailyLog(supabase, uid, todayIso(), {
          step_count: n,
        });
        if (!r.ok) set({ dailyLog: prev });
      },

      logWeight: async (kg) => {
        const s = get();
        const prev = s.dailyLog;
        const prevProfile = s.profile;
        set({
          dailyLog: { ...prev, weight_kg: kg },
          profile: prevProfile ? { ...prevProfile, current_weight_kg: kg } : prevProfile,
        });
        const supabase = getSupabaseBrowser();
        const uid = prevProfile?.id;
        if (!supabase || !uid || uid === "local") return;
        const [dailyR, userR] = await Promise.all([
          upsertDailyLog(supabase, uid, todayIso(), { weight_kg: kg }),
          supabase
            .from("users")
            .update({ current_weight_kg: kg, updated_at: new Date().toISOString() })
            .eq("id", uid),
        ]);
        if (!dailyR.ok || userR.error) {
          set({ dailyLog: prev, profile: prevProfile });
        }
      },

      updateDietItem: async (id, patch) => {
        const s = get();
        const prev = s.dietPlan;
        set({
          dietPlan: prev.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        });
        const supabase = getSupabaseBrowser();
        if (!supabase || id.startsWith("tmp-") || id.startsWith("d-")) return;
        // (Seed items have ids like `d-0-1`; skip DB write for them.)
        const r = await updateDietItemRow(supabase, id, {
          food_item: patch.food_item,
          calories: patch.calories,
          protein_g: patch.protein_g,
          carbs_g: patch.carbs_g,
          fat_g: patch.fat_g,
          notes: patch.notes,
        });
        if (!r.ok) set({ dietPlan: prev });
      },
    }),
    {
      name: "fitpulse-user",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        profile: s.profile,
        onboardingComplete: s.onboardingComplete,
        authed: s.authed,
        streak: s.streak,
        // Do NOT persist logs/plans — those are always refetched on load
        // so a stale localStorage snapshot can't hide fresh DB state.
      }),
    }
  )
);
