"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { BottomNav } from "./bottom-nav";
import { Sidebar } from "./sidebar";

export function PageShell({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <main
        className={cn(
          "md:pl-64",
          padded && "pb-24 md:pb-8",
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-5xl px-4 pt-6 md:px-8 md:pt-10"
        >
          {children}
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
