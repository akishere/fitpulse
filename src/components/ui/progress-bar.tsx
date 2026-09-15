"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number;
  max: number;
  colorClass?: string;
  trackClass?: string;
  className?: string;
  heightClass?: string;
}

export function ProgressBar({
  value,
  max,
  colorClass = "bg-accent-blue",
  trackClass = "bg-white/5",
  className,
  heightClass = "h-2",
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full",
        heightClass,
        trackClass,
        className
      )}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn("h-full rounded-full", colorClass)}
      />
    </div>
  );
}
