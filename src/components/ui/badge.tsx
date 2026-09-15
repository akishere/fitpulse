import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-bg-card-hover text-text-primary border border-border/60",
        blue: "bg-accent-blue/15 text-accent-blue border border-accent-blue/30",
        green:
          "bg-accent-green/15 text-accent-green border border-accent-green/30",
        amber:
          "bg-accent-amber/15 text-accent-amber border border-accent-amber/30",
        red: "bg-accent-red/15 text-accent-red border border-accent-red/30",
        purple:
          "bg-accent-purple/15 text-accent-purple border border-accent-purple/30",
        outline: "border border-border/60 text-text-secondary",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);
