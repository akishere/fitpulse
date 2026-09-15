"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Camera,
  ImageIcon,
  Loader2,
  Sparkles,
  RefreshCw,
  Check,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/lib/store/user-store";
import { mealLabel } from "@/lib/utils/format";
import type { MealSlot } from "@/lib/types";

interface AiItem {
  name: string;
  portion: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

const MOCK_RESPONSE: AiItem[] = [
  { name: "Jowar roti", portion: "2 pcs (~90g)", calories: 210, protein_g: 6, carbs_g: 42, fat_g: 2 },
  { name: "Palak paneer", portion: "1 cup (~180g)", calories: 260, protein_g: 15, carbs_g: 8, fat_g: 18 },
  { name: "Kachumber salad", portion: "1 cup", calories: 40, protein_g: 2, carbs_g: 8, fat_g: 0.5 },
];

const SLOTS: MealSlot[] = [
  "breakfast",
  "snack1",
  "lunch",
  "chai",
  "snack2",
  "pre_workout",
  "post_workout",
  "dinner",
];

export default function LogPhotoPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AiItem[] | null>(null);
  const [slot, setSlot] = useState<MealSlot>("lunch");
  const logMeal = useUserStore((s) => s.logMeal);

  function onFile(f: File | null) {
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
    setAnalysis(null);
  }

  async function analyze() {
    setAnalyzing(true);
    // TODO: call /api/analyze-meal with base64 photo → Gemini.
    await new Promise((r) => setTimeout(r, 1600));
    setAnalyzing(false);
    setAnalysis(MOCK_RESPONSE);
  }

  function updateItem(i: number, patch: Partial<AiItem>) {
    if (!analysis) return;
    setAnalysis(analysis.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function confirm() {
    if (!analysis) return;
    const today = new Date().toISOString().slice(0, 10);
    analysis.forEach((a) => {
      logMeal({
        log_date: today,
        meal_slot: slot,
        food_item: `${a.name} (${a.portion})`,
        calories: Number(a.calories) || 0,
        protein_g: Number(a.protein_g) || 0,
        carbs_g: Number(a.carbs_g) || 0,
        fat_g: Number(a.fat_g) || 0,
        photo_url: preview ?? undefined,
        source: "photo_ai",
      });
    });
    toast.success(`Logged to ${mealLabel(slot)}`);
    setAnalysis(null);
    setPreview(null);
  }

  return (
    <PageShell>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-text-tertiary">
          Log meal
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Snap. Log. Done.
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          A single photo becomes a full macro breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/50 bg-bg-primary/60">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Meal"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-text-tertiary">
                <ImageIcon className="h-10 w-10" />
                <p className="text-xs">Your meal preview will appear here</p>
              </div>
            )}
            {analyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg-primary/70 backdrop-blur-sm"
              >
                <Loader2 className="h-6 w-6 animate-spin text-accent-blue" />
                <p className="text-xs text-text-secondary">
                  Analyzing your plate…
                </p>
              </motion.div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border/60 bg-bg-card/50 px-3 py-3 text-sm hover:bg-bg-card-hover">
              <Camera className="h-4 w-4 text-accent-blue" />
              Take photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border/60 bg-bg-card/50 px-3 py-3 text-sm hover:bg-bg-card-hover">
              <ImageIcon className="h-4 w-4 text-accent-purple" />
              From gallery
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <Button
            onClick={analyze}
            disabled={!preview || analyzing}
            className="mt-4 w-full"
            size="lg"
          >
            <Sparkles className="h-4 w-4" />
            {analyzing ? "Analyzing…" : "Analyze with AI"}
          </Button>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Detected items</h3>
            {analysis && (
              <Badge variant="green">
                <Check className="h-3 w-3" />
                {analysis.length} items
              </Badge>
            )}
          </div>

          {!analysis ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center text-text-tertiary">
              <Sparkles className="h-6 w-6" />
              <p className="text-xs">
                Upload a meal photo, then hit analyze to see items
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`rounded-full border px-3 py-1 text-[11px] transition-all ${
                      slot === s
                        ? "border-accent-blue/70 bg-accent-blue/10 text-accent-blue"
                        : "border-border/60 text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {mealLabel(s)}
                  </button>
                ))}
              </div>

              {analysis.map((a, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/50 bg-bg-card/40 p-3"
                >
                  <Input
                    value={a.name}
                    onChange={(e) => updateItem(i, { name: e.target.value })}
                    className="h-9 text-sm font-semibold"
                  />
                  <p className="mt-1 text-[11px] text-text-tertiary">{a.portion}</p>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {(
                      [
                        ["Cal", "calories", "text-accent-blue"],
                        ["P", "protein_g", "text-accent-red"],
                        ["C", "carbs_g", "text-accent-amber"],
                        ["F", "fat_g", "text-accent-green"],
                      ] as const
                    ).map(([label, key, tint]) => (
                      <div key={key}>
                        <span
                          className={`text-[10px] uppercase tracking-widest ${tint}`}
                        >
                          {label}
                        </span>
                        <Input
                          type="number"
                          value={a[key] as number}
                          onChange={(e) =>
                            updateItem(i, { [key]: Number(e.target.value) })
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAnalysis(null);
                    setPreview(null);
                  }}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retake
                </Button>
                <Button onClick={confirm} variant="success">
                  <Check className="h-4 w-4" />
                  Log meal
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
