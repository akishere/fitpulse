"use client";

import { Flame } from "lucide-react";

export function StreakBadge({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-accent-red/30 bg-accent-red/10 px-3 py-1 text-xs font-semibold text-accent-red">
      <Flame className="h-3.5 w-3.5 animate-flame-pulse" />
      <span>{days} day streak</span>
    </div>
  );
}
