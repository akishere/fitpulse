"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";

const MONOGRAM_SRC = "/assets/fitpulse-fp-monogram.svg";
// intrinsic viewBox is 1000 × 1040 (~0.9615)
const MONOGRAM_RATIO = 1000 / 1040;

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const HEIGHT: Record<Size, number> = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 72,
};

const WORDMARK_TEXT: Record<Size, string> = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-3xl",
};

interface LogoProps {
  variant?: "icon" | "full";
  size?: Size;
  className?: string;
  /** When true, adds a soft blue glow behind the monogram. Defaults on. */
  glow?: boolean;
  /** Extra classes for the wordmark text. */
  wordmarkClassName?: string;
}

export function Logo({
  variant = "full",
  size = "md",
  className,
  glow = true,
  wordmarkClassName,
}: LogoProps) {
  const h = HEIGHT[size];
  const w = Math.round(h * MONOGRAM_RATIO);

  const monogram = (
    <Image
      src={MONOGRAM_SRC}
      alt="FitPulse"
      width={w}
      height={h}
      priority
      className={cn(
        "select-none",
        glow && "drop-shadow-[0_0_18px_hsla(218_100%_66%_/_0.35)]"
      )}
    />
  );

  if (variant === "icon") {
    return <span className={cn("inline-flex", className)}>{monogram}</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {monogram}
      <span
        className={cn(
          "font-bold tracking-tight leading-none",
          WORDMARK_TEXT[size],
          wordmarkClassName
        )}
      >
        FitPulse
      </span>
    </span>
  );
}
