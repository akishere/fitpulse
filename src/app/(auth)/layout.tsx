"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-hero-glow">
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-6 py-6">
        <header className="flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
          >
            ← Back home
          </Link>
        </header>
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-1 items-center justify-center"
        >
          <div className="w-full max-w-md">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
