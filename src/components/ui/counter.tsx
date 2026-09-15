"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface CounterProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

export function Counter({
  value,
  duration = 0.9,
  format,
  className,
}: CounterProps) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    format ? format(v) : Math.round(v).toLocaleString()
  );

  useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [value, duration, mv]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
