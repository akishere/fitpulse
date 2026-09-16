"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Pill,
  Ruler,
  Target,
  User,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Counter } from "@/components/ui/counter";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { useUserStore } from "@/lib/store/user-store";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { upsertProfile } from "@/lib/supabase/profile";
import type {
  ActivityLevel,
  Gender,
  Goal,
  MedicalCondition,
} from "@/lib/types";
import { bmiCategory, bmiColor, bmiLabel, calcBmi } from "@/lib/utils/bmi";
import {
  calcCalorieTarget,
  calcMacros,
} from "@/lib/utils/calories";

const STEPS = ["Basics", "Body", "Goal", "Medical", "Ready"] as const;

const GOALS: {
  id: Goal;
  title: string;
  desc: string;
  tint: string;
}[] = [
  { id: "weight_loss", title: "Fat loss", desc: "Cut fat, keep muscle", tint: "text-accent-red" },
  { id: "muscle_gain", title: "Muscle gain", desc: "Lean bulk in a calorie surplus", tint: "text-accent-green" },
  { id: "lean_body", title: "Lean & toned", desc: "Slow recomp — losing fat, gaining tone", tint: "text-accent-blue" },
  { id: "strength", title: "Strength", desc: "Focus on getting stronger", tint: "text-accent-purple" },
  { id: "maintenance", title: "Maintain", desc: "Sustain current physique", tint: "text-accent-amber" },
];

const ACTIVITY: { id: ActivityLevel; title: string; desc: string }[] = [
  { id: "sedentary", title: "Sedentary", desc: "Desk-bound, little exercise" },
  { id: "light", title: "Lightly active", desc: "1–3 workouts / week" },
  { id: "moderate", title: "Active", desc: "4–5 workouts / week" },
  { id: "very_active", title: "Very active", desc: "Daily workouts or physical job" },
];

const MEDICAL: { id: MedicalCondition; label: string }[] = [
  { id: "hypothyroidism", label: "Hypothyroidism" },
  { id: "diabetes", label: "Diabetes" },
  { id: "pcos", label: "PCOS" },
  { id: "lactose_intolerant", label: "Lactose intolerant" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile?.name ?? "");
  const [age, setAge] = useState<number | "">(profile?.age || "");
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "male");
  const [heightCm, setHeightCm] = useState<number | "">(profile?.height_cm || "");
  const [weightKg, setWeightKg] = useState<number | "">(
    profile?.current_weight_kg || ""
  );
  const [activity, setActivity] = useState<ActivityLevel>(
    profile?.activity_level ?? "moderate"
  );
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? "weight_loss");
  const [medical, setMedical] = useState<MedicalCondition[]>(
    profile?.medical_conditions ?? []
  );
  const [thyrox, setThyrox] = useState<number | "">(
    profile?.thyrox_dose_mg ?? ""
  );
  const [submitting, setSubmitting] = useState(false);

  const bmi = useMemo(
    () => calcBmi(Number(weightKg), Number(heightCm)),
    [weightKg, heightCm]
  );
  const bmiCat = bmiCategory(bmi);

  const targetCalories = useMemo(() => {
    if (!weightKg || !heightCm || !age) return 0;
    return calcCalorieTarget({
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      age: Number(age),
      gender,
      activity,
      goal,
      hypothyroid: medical.includes("hypothyroidism"),
    });
  }, [weightKg, heightCm, age, gender, activity, goal, medical]);
  const macros = useMemo(
    () => calcMacros(targetCalories, goal),
    [targetCalories, goal]
  );

  function canNext() {
    if (step === 0) return name.trim().length > 1 && Number(age) > 5;
    if (step === 1) return Number(heightCm) > 80 && Number(weightKg) > 20;
    if (step === 2) return !!goal && !!activity;
    if (step === 3) {
      if (medical.includes("hypothyroidism") && !thyrox) return false;
      return true;
    }
    return true;
  }

  function toggleMedical(id: MedicalCondition) {
    setMedical((m) =>
      m.includes(id) ? m.filter((x) => x !== id) : [...m, id]
    );
  }

  async function onFinish() {
    setSubmitting(true);
    const nextProfile = {
      id: profile?.id ?? "local",
      email: profile?.email ?? "",
      name,
      role: profile?.role ?? "user" as const,
      age: Number(age),
      gender,
      height_cm: Number(heightCm),
      current_weight_kg: Number(weightKg),
      bmi,
      goal,
      activity_level: activity,
      medical_conditions: medical,
      daily_calorie_target: targetCalories,
      protein_target_g: macros.protein_g,
      carb_target_g: macros.carbs_g,
      fat_target_g: macros.fat_g,
      thyrox_dose_mg: thyrox ? Number(thyrox) : undefined,
    };

    // Persist to Supabase (source of truth for future logins).
    const supabase = getSupabaseBrowser();
    if (supabase) {
      const result = await upsertProfile(supabase, nextProfile);
      if (!result.ok) {
        setSubmitting(false);
        toast.error(`Couldn't save profile: ${result.error ?? "unknown"}`);
        return;
      }
    }

    setProfile(nextProfile);
    completeOnboarding();
    setSubmitting(false);
    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-hero-glow">
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-6 py-6">
        <header className="flex items-center justify-between">
          <Logo />
          <div className="text-xs text-text-tertiary">
            Step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
          </div>
        </header>

        {/* Progress dots */}
        <div className="mt-6 flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                i <= step ? "bg-accent-blue shadow-glow" : "bg-bg-card"
              )}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
              className="flex flex-1 flex-col"
            >
              {step === 0 && (
                <div>
                  <StepHeader
                    icon={User}
                    title="Let's meet you"
                    subtitle="A few basics to personalize your plan."
                  />
                  <div className="mt-8 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="How should we call you?"
                        autoFocus
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={age}
                          onChange={(e) =>
                            setAge(e.target.value ? Number(e.target.value) : "")
                          }
                          placeholder="28"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["male", "female", "other"] as Gender[]).map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setGender(g)}
                              className={cn(
                                "rounded-xl border px-3 py-2 text-xs font-medium capitalize transition-all",
                                gender === g
                                  ? "border-accent-blue/70 bg-accent-blue/10 text-text-primary"
                                  : "border-border/60 text-text-secondary hover:text-text-primary"
                              )}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <StepHeader
                    icon={Ruler}
                    title="Your body right now"
                    subtitle="Height & weight let us compute your BMI and calorie target."
                  />
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="h">Height (cm)</Label>
                      <Input
                        id="h"
                        type="number"
                        value={heightCm}
                        onChange={(e) =>
                          setHeightCm(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        placeholder="170"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="w">Weight (kg)</Label>
                      <Input
                        id="w"
                        type="number"
                        value={weightKg}
                        onChange={(e) =>
                          setWeightKg(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        placeholder="72"
                      />
                    </div>
                  </div>

                  {bmi > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass mt-6 flex items-center justify-between rounded-2xl p-5"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-widest text-text-tertiary">
                          Your BMI
                        </p>
                        <p className={cn("mt-1 text-3xl font-bold num", bmiColor(bmiCat))}>
                          <Counter value={bmi} format={(v) => v.toFixed(1)} />
                        </p>
                      </div>
                      <Badge
                        variant={
                          bmiCat === "normal"
                            ? "green"
                            : bmiCat === "obese"
                            ? "red"
                            : "amber"
                        }
                      >
                        {bmiLabel(bmiCat)}
                      </Badge>
                    </motion.div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <StepHeader
                    icon={Target}
                    title="What are we aiming for?"
                    subtitle="Pick a primary goal and activity — we'll do the math."
                  />
                  <div className="mt-6">
                    <Label className="mb-2 block">Goal</Label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {GOALS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGoal(g.id)}
                          className={cn(
                            "group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                            goal === g.id
                              ? "border-accent-blue/70 bg-accent-blue/10 shadow-glow"
                              : "border-border/60 hover:bg-bg-card-hover/50"
                          )}
                        >
                          <Target className={cn("mt-0.5 h-5 w-5", g.tint)} />
                          <div>
                            <p className="text-sm font-semibold">{g.title}</p>
                            <p className="text-xs text-text-secondary">{g.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <Label className="mb-2 block">Activity level</Label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {ACTIVITY.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setActivity(a.id)}
                          className={cn(
                            "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                            activity === a.id
                              ? "border-accent-purple/70 bg-accent-purple/10"
                              : "border-border/60 hover:bg-bg-card-hover/50"
                          )}
                        >
                          <Activity className="mt-0.5 h-5 w-5 text-accent-purple" />
                          <div>
                            <p className="text-sm font-semibold">{a.title}</p>
                            <p className="text-xs text-text-secondary">{a.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <StepHeader
                    icon={Pill}
                    title="Anything we should watch for?"
                    subtitle="Optional — helps us tune your plan and warnings."
                  />
                  <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {MEDICAL.map((m) => {
                      const active = medical.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleMedical(m.id)}
                          className={cn(
                            "flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-all",
                            active
                              ? "border-accent-blue/70 bg-accent-blue/10"
                              : "border-border/60 hover:bg-bg-card-hover/50"
                          )}
                        >
                          <span className="text-xs font-semibold">
                            {m.label}
                          </span>
                          {active && (
                            <Check className="h-3.5 w-3.5 text-accent-blue" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {medical.includes("hypothyroidism") && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 space-y-2"
                    >
                      <Label htmlFor="thyrox">Thyrox dose (mg)</Label>
                      <Input
                        id="thyrox"
                        type="number"
                        value={thyrox}
                        onChange={(e) =>
                          setThyrox(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        placeholder="e.g. 50"
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {step === 4 && (
                <ReadyReveal
                  name={name}
                  calories={targetCalories}
                  macros={macros}
                  bmi={bmi}
                  bmiCat={bmiCat}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="sticky bottom-0 mt-8 flex items-center justify-between gap-3 pb-6">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              size="lg"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={onFinish}
              disabled={submitting}
              variant="success"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  Start tracking <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>
      </div>
    </div>
  );
}

function ReadyReveal({
  name,
  calories,
  macros,
  bmi,
  bmiCat,
}: {
  name: string;
  calories: number;
  macros: { protein_g: number; carbs_g: number; fat_g: number };
  bmi: number;
  bmiCat: ReturnType<typeof bmiCategory>;
}) {
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-accent-green/15 text-accent-green shadow-glow-green"
      >
        <Check className="h-7 w-7" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl font-bold tracking-tight"
      >
        You're set, {name.split(" ")[0] || "friend"}.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-1.5 text-sm text-text-secondary"
      >
        Here's your daily target — swap meals freely, we'll keep the math.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass mt-8 w-full max-w-md rounded-3xl p-8"
      >
        <p className="text-xs uppercase tracking-widest text-text-tertiary">
          Daily calorie target
        </p>
        <p className="mt-2 text-6xl font-bold num text-accent-blue">
          <Counter value={calories} duration={1.2} />
        </p>
        <p className="mt-1 text-xs text-text-tertiary">kcal / day</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <MacroTile label="Protein" value={macros.protein_g} tint="text-accent-red" />
          <MacroTile label="Carbs" value={macros.carbs_g} tint="text-accent-amber" />
          <MacroTile label="Fat" value={macros.fat_g} tint="text-accent-green" />
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-border/50 bg-bg-card/50 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-text-tertiary">
              BMI
            </p>
            <p className={cn("text-lg font-semibold num", bmiColor(bmiCat))}>
              {bmi.toFixed(1)}
            </p>
          </div>
          <Badge variant={bmiCat === "normal" ? "green" : "amber"}>
            {bmiLabel(bmiCat)}
          </Badge>
        </div>
      </motion.div>
    </div>
  );
}

function MacroTile({
  label,
  value,
  tint,
}: {
  label: string;
  value: number;
  tint: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-bg-card/50 p-3">
      <p className="text-[10px] uppercase tracking-widest text-text-tertiary">
        {label}
      </p>
      <p className={cn("mt-1 text-xl font-semibold num", tint)}>
        {value}
        <span className="ml-0.5 text-[10px] text-text-tertiary">g</span>
      </p>
    </div>
  );
}
