"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  ChevronRight,
  Dumbbell,
  Footprints,
  Utensils,
  Weight,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/ui/counter";
import { CalorieRing } from "@/components/dashboard/calorie-ring";
import { MacroBars } from "@/components/dashboard/macro-bars";
import { WaterTracker } from "@/components/dashboard/water-tracker";
import { StreakBadge } from "@/components/dashboard/streak-badge";
import { useUserStore } from "@/lib/store/user-store";
import { bmiCategory, bmiColor, bmiLabel } from "@/lib/utils/bmi";
import { cn } from "@/lib/utils/cn";
import {
  dayIndexToday,
  fmtDay,
  greetingFor,
  mealLabel,
  mealSortIndex,
} from "@/lib/utils/format";

export default function DashboardPage() {
  const profile = useUserStore((s) => s.profile);
  const mealLogs = useUserStore((s) => s.mealLogs);
  const dailyLog = useUserStore((s) => s.dailyLog);
  const addWater = useUserStore((s) => s.addWater);
  const streak = useUserStore((s) => s.streak);
  const dietPlan = useUserStore((s) => s.dietPlan);
  const exercisePlan = useUserStore((s) => s.exercisePlan);
  const exerciseLogs = useUserStore((s) => s.exerciseLogs);
  const toggleExerciseComplete = useUserStore((s) => s.toggleExerciseComplete);
  const markPlanSeen = useUserStore((s) => s.markPlanSeen);
  const planUpdatedAt = useUserStore((s) => s.planUpdatedAt);
  const lastSeenPlanAt = useUserStore((s) => s.lastSeenPlanAt);

  useEffect(() => {
    if (planUpdatedAt && (!lastSeenPlanAt || planUpdatedAt > lastSeenPlanAt)) {
      // Keep banner shown until user dismisses; auto-mark seen after 5s.
      const t = setTimeout(markPlanSeen, 5000);
      return () => clearTimeout(t);
    }
  }, [planUpdatedAt, lastSeenPlanAt, markPlanSeen]);

  const today = dayIndexToday();
  const todayMeals = useMemo(
    () =>
      dietPlan
        .filter((d) => d.day_of_week === today)
        .sort(
          (a, b) =>
            mealSortIndex(a.meal_slot) - mealSortIndex(b.meal_slot) ||
            a.sort_order - b.sort_order
        ),
    [dietPlan, today]
  );
  const todayExercises = useMemo(
    () =>
      exercisePlan
        .filter((e) => e.day_of_week === today)
        .sort((a, b) => a.sort_order - b.sort_order),
    [exercisePlan, today]
  );

  const consumed = useMemo(
    () => mealLogs.reduce((s, m) => s + (m.calories ?? 0), 0),
    [mealLogs]
  );
  const protein = useMemo(
    () => mealLogs.reduce((s, m) => s + (m.protein_g ?? 0), 0),
    [mealLogs]
  );
  const carbs = useMemo(
    () => mealLogs.reduce((s, m) => s + (m.carbs_g ?? 0), 0),
    [mealLogs]
  );
  const fat = useMemo(
    () => mealLogs.reduce((s, m) => s + (m.fat_g ?? 0), 0),
    [mealLogs]
  );

  const targetCals = profile?.daily_calorie_target ?? 2000;
  const proteinTarget = profile?.protein_target_g ?? 130;
  const carbTarget = profile?.carb_target_g ?? 220;
  const fatTarget = profile?.fat_target_g ?? 60;
  const cat = bmiCategory(profile?.bmi ?? 0);

  const exercisesDone = exerciseLogs.filter((e) => e.is_completed).length;
  const workoutPct =
    todayExercises.length > 0
      ? Math.round((exercisesDone / todayExercises.length) * 100)
      : 0;

  return (
    <PageShell>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-widest text-text-tertiary">
            {fmtDay()}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {greetingFor()},{" "}
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              {profile?.name.split(" ")[0] ?? "friend"}
            </span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StreakBadge days={streak} />
          {profile?.bmi ? (
            <Badge
              variant={cat === "normal" ? "green" : cat === "obese" ? "red" : "amber"}
              className="gap-1.5"
            >
              <Weight className="h-3 w-3" /> BMI {profile.bmi.toFixed(1)} ·{" "}
              {bmiLabel(cat)}
            </Badge>
          ) : null}
        </div>
      </motion.div>

      {planUpdatedAt && (!lastSeenPlanAt || planUpdatedAt > lastSeenPlanAt) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between rounded-2xl border border-accent-purple/40 bg-accent-purple/10 px-4 py-3 text-sm"
        >
          <span className="text-text-primary">
            <span className="font-semibold">Your plan has been updated.</span>{" "}
            <span className="text-text-secondary">
              Fresh meals and workouts are ready for you.
            </span>
          </span>
          <Button size="sm" variant="ghost" onClick={markPlanSeen}>
            Got it
          </Button>
        </motion.div>
      )}

      {/* Row 1: Ring + Macros + Water */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <Card className="md:col-span-1">
          <p className="mb-2 text-xs uppercase tracking-widest text-text-tertiary">
            Today's fuel
          </p>
          <CalorieRing consumed={consumed} target={targetCals} />
        </Card>

        <Card className="md:col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-text-tertiary">
              Macros
            </p>
            <Badge variant="outline">Goal: {profile?.goal ?? "—"}</Badge>
          </div>
          <MacroBars
            protein={{
              key: "p",
              label: "Protein",
              consumed: protein,
              target: proteinTarget,
              color: "#FF4D6A",
            }}
            carbs={{
              key: "c",
              label: "Carbs",
              consumed: carbs,
              target: carbTarget,
              color: "#FFB830",
            }}
            fat={{
              key: "f",
              label: "Fat",
              consumed: fat,
              target: fatTarget,
              color: "#00D68F",
            }}
          />
          <div className="mt-6 grid grid-cols-2 gap-3">
            <MiniStat
              icon={Footprints}
              label="Steps"
              value={dailyLog.step_count || 0}
              target={10000}
            />
            <MiniStat
              icon={Weight}
              label="Weight"
              value={dailyLog.weight_kg ?? profile?.current_weight_kg ?? 0}
              unit="kg"
              precision={1}
            />
          </div>
        </Card>

        <Card className="md:col-span-1">
          <WaterTracker
            glasses={dailyLog.water_glasses}
            onAdd={() => addWater()}
          />
        </Card>
      </motion.div>

      {/* Row 2: Today's meals */}
      <SectionHeader
        title="Today's meals"
        actionLabel="View diet plan"
        href="/plan/diet"
        icon={Utensils}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {todayMeals.map((m, i) => {
          const logged = mealLogs.some(
            (l) => l.meal_slot === m.meal_slot && l.food_item === m.food_item
          );
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card className="glass-hover">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-text-tertiary">
                      {mealLabel(m.meal_slot)}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-snug">
                      {m.food_item}
                    </p>
                  </div>
                  {logged ? (
                    <Badge variant="green">Logged</Badge>
                  ) : (
                    <Badge variant="outline">Planned</Badge>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
                  <span className="num">
                    <span className="text-text-primary">{m.calories}</span> kcal
                  </span>
                  <span className="num">
                    <span className="text-accent-red">{m.protein_g}g</span>{" "}
                    protein
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
        {todayMeals.length === 0 && (
          <Card>
            <p className="text-sm text-text-secondary">
              No meals planned for today. Enjoy a rest day!
            </p>
          </Card>
        )}
      </div>

      {/* Row 3: Today's workout */}
      <SectionHeader
        title={`Today's workout — ${workoutPct}%`}
        actionLabel="Open workout"
        href="/plan/exercise"
        icon={Dumbbell}
      />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {todayExercises.map((ex, i) => {
          const done = exerciseLogs.find(
            (e) => e.exercise_name === ex.exercise_name
          )?.is_completed;
          return (
            <motion.button
              key={ex.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}
              onClick={() => toggleExerciseComplete(ex.exercise_name)}
              className={cn(
                "glass glass-hover flex items-center justify-between rounded-2xl p-4 text-left transition-all",
                done && "border-accent-green/40 bg-accent-green/5"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold uppercase",
                    ex.category === "warmup" && "bg-accent-amber/15 text-accent-amber",
                    ex.category === "main" && "bg-accent-blue/15 text-accent-blue",
                    ex.category === "hiit" && "bg-accent-red/15 text-accent-red",
                    ex.category === "abs" && "bg-accent-purple/15 text-accent-purple",
                    ex.category === "cooldown" && "bg-accent-green/15 text-accent-green",
                    ex.category === "forearm" && "bg-accent-purple/15 text-accent-purple"
                  )}
                >
                  {ex.category.slice(0, 3)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{ex.exercise_name}</p>
                  <p className="text-xs text-text-secondary">
                    {ex.sets} sets × {ex.reps}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                  done
                    ? "border-accent-green bg-accent-green shadow-glow-green"
                    : "border-border/60"
                )}
              >
                {done && <span className="text-[10px] text-black">✓</span>}
              </div>
            </motion.button>
          );
        })}
        {todayExercises.length === 0 && (
          <Card>
            <p className="text-sm text-text-secondary">
              Rest day. Take a walk and stretch — see you tomorrow.
            </p>
          </Card>
        )}
      </div>

      {/* FAB */}
      <Link
        href="/log/photo"
        className="fixed bottom-24 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-accent-blue text-white shadow-glow transition-transform active:scale-90 md:bottom-8 md:right-8"
      >
        <Camera className="h-6 w-6" />
      </Link>
    </PageShell>
  );
}

function SectionHeader({
  title,
  actionLabel,
  href,
  icon: Icon,
}: {
  title: string;
  actionLabel: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-4 mt-8 flex items-end justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-text-secondary" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1 text-xs text-accent-blue hover:underline"
      >
        {actionLabel}
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  target,
  unit,
  precision = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  target?: number;
  unit?: string;
  precision?: number;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-bg-card/50 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-text-tertiary">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="mt-1 num text-lg font-semibold">
        <Counter
          value={value}
          format={(v) =>
            precision > 0 ? v.toFixed(precision) : Math.round(v).toLocaleString()
          }
        />
        {unit && <span className="ml-1 text-xs text-text-tertiary">{unit}</span>}
      </p>
      {target && (
        <p className="mt-0.5 text-[10px] text-text-tertiary num">
          / {target.toLocaleString()}
        </p>
      )}
    </div>
  );
}
