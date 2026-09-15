"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export function Logo({
  variant = "full",
  size = "md",
  className,
}: {
  variant?: "icon" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims = {
    sm: { icon: 24, full: { w: 96, h: 24 } },
    md: { icon: 36, full: { w: 140, h: 36 } },
    lg: { icon: 56, full: { w: 200, h: 56 } },
  }[size];

  if (variant === "icon") {
    return (
      <Image
        src="/assets/fitpulse-icon.svg"
        alt="FitPulse"
        width={dims.icon}
        height={dims.icon}
        className={cn("select-none drop-shadow-[0_0_18px_rgba(79,143,255,0.35)]", className)}
        priority
      />
    );
  }
  return (
    <Image
      src="/assets/fitpulse-logo.svg"
      alt="FitPulse"
      width={dims.full.w}
      height={dims.full.h}
      className={cn("select-none", className)}
      priority
    />
  );
}
