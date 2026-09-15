"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Droplets,
  Pencil,
  Save,
  Utensils,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Counter } from "@/components/ui/counter";
import { cn } from "@/lib/utils/cn";
import { useUserStore } from "@/lib/store/user-store";
import { dayIndexToday, dayShort, mealLabel, mealSortIndex } from "@/lib/utils/format";
import type { DietPlanItem } from "@/lib/types";

const DAYS = [0, 1, 2, 3, 4, 5, 6];

export default function DietPlanPage() {
  const dietPlan = useUserStore((s) => s.dietPlan);
  const updateDietItem = useUserStore((s) => s.updateDietItem);
  const profile = useUserStore((s) => s.profile);
  const [day, setDay] = useState(String(dayIndexToday()));

  const grouped = useMemo(() => {
    const out: Record<string, DietPlanItem[]> = {};
    for (const d of DAYS) {
      out[d] = dietPlan
        .filter((p) => p.day_of_week === d)
        .sort(
          (a, b) =>
            mealSortIndex(a.meal_slot) - mealSortIndex(b.meal_slot) ||
            a.sort_order - b.sort_order
        );
    }
    return out;
  }, [dietPlan]);

  return (
    <PageShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-text-tertiary">
            Diet plan
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Weekly menu
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Tap any item to swap or adjust. Day calories update instantly.
          </p>
        </div>
        {profile && (
          <Badge variant="blue">
            Daily target · {profile.daily_calorie_target} kcal
          </Badge>
        )}
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
          const items = grouped[d];
          const totalCals = items.reduce((s, i) => s + (i.calories ?? 0), 0);
          const totalProtein = items.reduce(
            (s, i) => s + (i.protein_g ?? 0),
            0
          );
          const detox = items.filter((i) => i.meal_slot === "detox_water");
          const meals = items.filter((i) => i.meal_slot !== "detox_water");
          return (
            <TabsContent key={d} value={String(d)} className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Day summary */}
                <div className="glass mb-5 flex items-center justify-between rounded-2xl p-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-text-tertiary">
                      {dayShort(d)} total
                    </p>
                    <p className="mt-1 text-3xl font-bold num text-accent-blue">
                      <Counter value={totalCals} />
                      <span className="ml-1 text-sm text-text-tertiary">kcal</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-text-tertiary">
                      Protein
                    </p>
                    <p className="mt-1 text-lg font-semibold num text-accent-red">
                      <Counter value={totalProtein} />
                      <span className="text-xs text-text-tertiary">g</span>
                    </p>
                  </div>
                </div>

                {detox.length > 0 && (
                  <Card className="mb-4 border-accent-blue/30 bg-accent-blue/5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
                        <Droplets className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-text-tertiary">
                          Start with
                        </p>
                        <p className="text-sm font-semibold">
                          {detox[0].food_item}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {meals.map((item) => (
                    <MealRow
                      key={item.id}
                      item={item}
                      onChange={(patch) => updateDietItem(item.id, patch)}
                      thyroidWarning={
                        profile?.medical_conditions?.includes("hypothyroidism") &&
                        item.meal_slot === "chai"
                      }
                    />
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          );
        })}
      </Tabs>
    </PageShell>
  );
}

function MealRow({
  item,
  onChange,
  thyroidWarning,
}: {
  item: DietPlanItem;
  onChange: (patch: Partial<DietPlanItem>) => void;
  thyroidWarning?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [food, setFood] = useState(item.food_item);
  const [cals, setCals] = useState(String(item.calories));
  const [protein, setProtein] = useState(String(item.protein_g));

  function save() {
    onChange({
      food_item: food,
      calories: Number(cals) || 0,
      protein_g: Number(protein) || 0,
    });
    setExpanded(false);
  }

  return (
    <Card className="p-0 overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-start justify-between gap-3 p-5 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Utensils className="h-3.5 w-3.5 text-text-tertiary" />
            <p className="text-[10px] uppercase tracking-widest text-text-tertiary">
              {mealLabel(item.meal_slot)}
            </p>
            {thyroidWarning && (
              <Badge variant="amber" className="ml-1">
                Thyroid: 4hr after Thyrox
              </Badge>
            )}
          </div>
          <p className="mt-1 truncate text-sm font-semibold">{item.food_item}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
            <span className="num">
              <span className="text-text-primary">{item.calories}</span> kcal
            </span>
            <span className="num">
              <span className="text-accent-red">{item.protein_g}g</span>{" "}
              protein
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-tertiary transition-transform",
            expanded && "rotate-180"
          )}
        />
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
            <div className="space-y-3 p-5">
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-text-tertiary">
                  Food item
                </span>
                <Input
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  className="mt-1 h-10"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="text-[10px] uppercase tracking-widest text-text-tertiary">
                    Calories
                  </span>
                  <Input
                    type="number"
                    value={cals}
                    onChange={(e) => setCals(e.target.value)}
                    className="mt-1 h-10"
                  />
                </label>
                <label>
                  <span className="text-[10px] uppercase tracking-widest text-text-tertiary">
                    Protein (g)
                  </span>
                  <Input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="mt-1 h-10"
                  />
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setExpanded(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={save}>
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
