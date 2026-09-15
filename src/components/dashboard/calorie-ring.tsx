"use client";

import { motion } from "framer-motion";
import { Counter } from "@/components/ui/counter";
import { cn } from "@/lib/utils/cn";

interface CalorieRingProps {
  consumed: number;
  target: number;
  size?: number;
  stroke?: number;
}

export function CalorieRing({
  consumed,
  target,
  size = 220,
  stroke = 14,
}: CalorieRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(1, consumed / Math.max(1, target));
  const dashOffset = circumference * (1 - clampedPct);
  const remaining = Math.max(0, target - consumed);
  const ratio = consumed / Math.max(1, target);

  const stroke1 = ratio > 1 ? "#FF4D6A" : ratio > 0.8 ? "#FFB830" : "#00D68F";
  const stroke2 = ratio > 1 ? "#FFB830" : "#4F8FFF";

  return (
    <div
      className="relative mx-auto flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg] animate-ring-glow"
      >
        <defs>
          <linearGradient id="calorie-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={stroke2} />
            <stop offset="100%" stopColor={stroke1} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--bg-card-hover))"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#calorie-grad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] uppercase tracking-widest text-text-tertiary">
          {ratio > 1 ? "Over by" : "Remaining"}
        </span>
        <span
          className={cn(
            "num text-4xl font-bold leading-none",
            ratio > 1
              ? "text-accent-red"
              : ratio > 0.8
              ? "text-accent-amber"
              : "text-text-primary"
          )}
        >
          <Counter value={ratio > 1 ? consumed - target : remaining} />
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-widest text-text-tertiary">
          kcal
        </span>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary">
          <span className="num text-text-primary">
            <Counter value={consumed} />
          </span>
          <span>/</span>
          <span className="num">
            {target.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
