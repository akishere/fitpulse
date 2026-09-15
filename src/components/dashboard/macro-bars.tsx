"use client";

import { motion } from "framer-motion";
import { Counter } from "@/components/ui/counter";

interface Macro {
  key: string;
  label: string;
  consumed: number;
  target: number;
  color: string; // hex/hsl
}

export function MacroBars({
  protein,
  carbs,
  fat,
}: {
  protein: Macro;
  carbs: Macro;
  fat: Macro;
}) {
  return (
    <div className="space-y-4">
      {[protein, carbs, fat].map((m) => {
        const pct = Math.min(100, Math.round((m.consumed / Math.max(1, m.target)) * 100));
        return (
          <div key={m.key}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: m.color, boxShadow: `0 0 12px ${m.color}` }}
                />
                <span className="text-text-secondary">{m.label}</span>
              </div>
              <div className="num text-text-secondary">
                <span className="text-text-primary">
                  <Counter value={m.consumed} />
                </span>
                <span className="mx-1">/</span>
                <span>{m.target}g</span>
                <span className="ml-2 text-text-tertiary">{pct}%</span>
              </div>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${m.color}bb, ${m.color})`,
                  boxShadow: `0 0 12px ${m.color}66`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
