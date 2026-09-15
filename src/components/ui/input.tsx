"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl border border-border/60 bg-bg-card/70 px-4 py-2 text-sm text-text-primary shadow-inner transition-all",
          "placeholder:text-text-tertiary",
          "focus-visible:outline-none focus-visible:border-accent-blue/70 focus-visible:ring-2 focus-visible:ring-accent-blue/25",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
