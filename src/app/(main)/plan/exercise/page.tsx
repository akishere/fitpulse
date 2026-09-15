"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Dumbbell,
  Flame,
  Snowflake,
  Timer,
  TrendingDown,
  TrendingUp,
  Wind,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";
import { useUserStore } from "@/lib/store/user-store";
import { dayIndexToday, dayShort } from "@/lib/utils/format";
import type { ExerciseCategory, ExercisePlanItem } from "@/lib/types";

const DAYS = [0, 1, 2, 3, 4, 5, 6];

const CATEGORY_META: Record<
  ExerciseCategory,
  { icon: React.ComponentType<{ className?: string }>; label: string; tint: string }
> = {
  warmup: { icon: Wind, label: "Warm-up", tint: "text-accent-amber" },
  main: { icon: Dumbbell, label: "Strength", tint: "text-accent-blue" },
  hiit: { icon: Flame, label: "HIIT", tint: "text-accent-red" },
  cooldown: { icon: Snowflake, label: "Cool-down", tint: "text-accent-green" },
  abs: { icon: Dumbbell, label: "Core", tint: "text-accent-purple" },
  forearm: { icon: Dumbbell, label: "Grip", tint: "text-accent-purple" },
};

const CATEGORY_ORDER: ExerciseCategory[] = [
  "warmup",
  "main",
  "abs",
  "hiit",
  "forearm",
  "cooldown",
];

export default function ExercisePlanPage() {
  const exercisePlan = useUserStore((s) => s.exercisePlan);
  const [day, setDay] = useState(String(dayIndexToday()));

  const grouped = useMemo(() => {
    const byDay: Record<string, Record<string, ExercisePlanItem[]>> = {};
    for (const d of DAYS) {
      byDay[d] = {};
      for (const item of exercisePlan.filter((e) => e.day_of_week === d)) {
        (byDay[d][item.category] ??= []).push(item);
      }
    }
    return byDay;
  }, [exercisePlan]);

  return (
    <PageShell>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-text-tertiary">
          Workout plan
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Move with intent
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Log every set. Watch the arrows push you upward.
        </p>
      </div>

      <Tabs value={day} onValueChange={setDay}>
        <div className="mb-5 overflow-x-auto scrollbar-hide">
          <TabsList className="w-max">
            {DAYS.map((d) => (
              <TabsTrigger key={d} value={String(d)}>
                {dayShort(d)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {DAYS.map((d) => {
          const byCategory = grouped[d];
          const isRest = Object.keys(byCategory).length === 0;
          return (
            <TabsContent key={d} value={String(d)} className="mt-0">
              {isRest ? (
                <Card className="text-center py-16">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent-green/10 text-accent-green">
                    <Snowflake className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">Rest day</h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    Take a walk, mobilize, and refuel.
                  </p>
                </Card>
              ) : (
                <div className="space-y-6">
                  {CATEGORY_ORDER.filter((c) => byCategory[c]).map((cat) => {
                    const meta = CATEGORY_META[cat];
                    return (
                      <section key={cat}>
                        <div className="mb-3 flex items-center gap-2">
                          <meta.icon className={cn("h-4 w-4", meta.tint)} />
                          <h2 className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
                            {meta.label}
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {byCategory[cat].map((ex) => (
                            <ExerciseRow key={ex.id} ex={ex} />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </PageShell>
  );
}

function ExerciseRow({ ex }: { ex: ExercisePlanItem }) {
  const toggleExerciseComplete = useUserStore((s) => s.toggleExerciseComplete);
  const exerciseLogs = useUserStore((s) => s.exerciseLogs);
  const done = exerciseLogs.find(
    (e) => e.exercise_name === ex.exercise_name
  )?.is_completed;

  const [expanded, setExpanded] = useState(false);
  const [weight, setWeight] = useState(String(ex.last_weight_kg ?? ""));
  const [reps, setReps] = useState(ex.reps);
  const [restRunning, setRestRunning] = useState(false);
  const [restLeft, setRestLeft] = useState(90);

  const overload =
    ex.last_weight_kg && Number(weight) > ex.last_weight_kg
      ? "up"
      : ex.last_weight_kg && Number(weight) < ex.last_weight_kg
      ? "down"
      : "same";

  function startRest(secs: number) {
    setRestLeft(secs);
    setRestRunning(true);
    const start = Date.now();
    const tick = setInterval(() => {
      const passed = Math.floor((Date.now() - start) / 1000);
      const left = secs - passed;
      if (left <= 0) {
        clearInterval(tick);
        setRestRunning(false);
        if ("vibrate" in navigator) navigator.vibrate(120);
      } else {
        setRestLeft(left);
      }
    }, 200);
  }

  function markSet() {
    toggleExerciseComplete(ex.exercise_name, {
      actual_reps: reps,
      weight_used_kg: Number(weight) || undefined,
      actual_sets: ex.sets,
    });
    startRest(90);
  }

  return (
    <Card className="p-0 overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className={cn(
          "flex w-full items-center justify-between gap-3 p-4 text-left",
          done && "bg-accent-green/5"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-all",
              done
                ? "border-accent-green bg-accent-green shadow-glow-green"
                : "border-border/60"
            )}
          >
            {done ? (
              <span className="text-sm font-bold text-black">✓</span>
            ) : (
              <span className="text-[10px] text-text-tertiary">{ex.sets}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">{ex.exercise_name}</p>
            <p className="text-xs text-text-secondary">
              {ex.sets} × {ex.reps}
              {ex.last_weight_kg && (
                <>
                  {" · "}
                  <span className="num text-text-tertiary">
                    prev {ex.last_weight_kg}kg
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {overload === "up" && (
            <TrendingUp className="h-4 w-4 text-accent-green" />
          )}
          {overload === "down" && (
            <TrendingDown className="h-4 w-4 text-accent-red" />
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-text-tertiary transition-transform",
              expanded && "rotate-180"
            )}
          />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/40"
          >
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="text-[10px] uppercase tracking-widest text-text-tertiary">
                    Weight (kg)
                  </span>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="mt-1 h-10"
                    placeholder={ex.last_weight_kg ? String(ex.last_weight_kg) : "—"}
                  />
                </label>
                <label>
                  <span className="text-[10px] uppercase tracking-widest text-text-tertiary">
                    Reps
                  </span>
                  <Input
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="mt-1 h-10"
                  />
                </label>
              </div>
              {ex.notes && (
                <p className="rounded-xl bg-bg-primary/50 p-3 text-xs text-text-secondary">
                  {ex.notes}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Timer className="h-4 w-4" />
                  {restRunning ? (
                    <span className="num text-accent-blue">Rest {restLeft}s</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      {[60, 90, 120].map((s) => (
                        <button
                          key={s}
                          onClick={() => startRest(s)}
                          className="rounded-md bg-bg-card-hover px-2 py-1 text-[10px] hover:bg-accent-blue/20 hover:text-accent-blue"
                        >
                          {s}s
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button size="sm" onClick={markSet} variant={done ? "outline" : "success"}>
                  {done ? "Undo" : "Mark done"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
