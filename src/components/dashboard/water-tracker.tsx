"use client";

import { motion } from "framer-motion";
import { Droplets, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function WaterTracker({
  glasses,
  target = 14,
  onAdd,
}: {
  glasses: number;
  target?: number;
  onAdd: () => void;
}) {
  const pct = Math.min(100, (glasses / target) * 100);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-text-tertiary">
            Water
          </p>
          <p className="mt-1 text-2xl font-semibold num">
            {glasses}
            <span className="text-sm text-text-tertiary">
              /{target} glasses
            </span>
          </p>
        </div>
        <button
          onClick={onAdd}
          className={cn(
            "group relative flex h-12 w-12 items-center justify-center rounded-full border border-accent-blue/30 bg-accent-blue/10 text-accent-blue transition-all active:scale-90",
            "hover:bg-accent-blue hover:text-white hover:shadow-glow"
          )}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="relative mt-4 flex-1 overflow-hidden rounded-2xl border border-border/50 bg-bg-primary/60">
        <motion.div
          initial={{ height: "0%" }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-accent-blue via-accent-blue/70 to-accent-blue/30"
        >
          <div className="absolute inset-x-0 top-0 h-2 bg-white/20 blur-sm" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Droplets className="h-8 w-8 text-white/80 drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
}
