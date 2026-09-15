"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Dumbbell,
  Flame,
  Sparkles,
  Upload,
  Utensils,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Upload,
    title: "Upload your trainer's plan",
    desc: "Drop a DOCX or PDF. AI parses it into a daily plan you can track against — free, forever.",
    tint: "text-accent-blue",
  },
  {
    icon: Camera,
    title: "Snap. Log. Done.",
    desc: "Photograph any Indian thali. Gemini identifies each item, portions, and macros — swipe to confirm.",
    tint: "text-accent-green",
  },
  {
    icon: Utensils,
    title: "Flexible diet, on target",
    desc: "Swap meals within your calorie budget. Bi-weekly rotation keeps things fresh.",
    tint: "text-accent-amber",
  },
  {
    icon: Dumbbell,
    title: "Every set, every rep",
    desc: "Log weights, watch progressive-overload arrows nudge you upward, and let the rest timer handle the clock.",
    tint: "text-accent-purple",
  },
];

export default function Landing() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-hero-glow" />
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <header className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </header>

        <section className="mx-auto max-w-3xl pt-16 md:pt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="purple" className="mb-5">
              <Sparkles className="h-3 w-3" /> Your personal fitness OS
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl"
          >
            Your trainer's plan.
            <br />
            <span className="bg-gradient-to-r from-accent-blue via-accent-purple to-accent-green bg-clip-text text-transparent">
              Actually tracked.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-xl text-balance text-base text-text-secondary md:text-lg"
          >
            Upload the diet + workout PDF from your trainer. FitPulse parses it,
            tracks your meals with a photo, and shows you what's left in the
            calorie tank — all on a beautiful PWA you install to your phone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button size="lg" asChild className="min-w-48">
              <Link href="/signup">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-w-48">
              <Link href="/login">I already have an account</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 flex items-center justify-center gap-2 text-xs text-text-tertiary"
          >
            <Flame className="h-3.5 w-3.5 text-accent-red" /> Free · Ad-free ·
            Self-hosted · Your data stays yours
          </motion.p>
        </section>

        <section className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass glass-hover group rounded-2xl p-6"
            >
              <f.icon className={`${f.tint} mb-4 h-6 w-6`} />
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </section>

        <footer className="mt-24 border-t border-border/40 py-8 text-center text-xs text-text-tertiary">
          <p>
            Built for Akshem, Niharika &amp; family — expandable to a real
            community.
          </p>
        </footer>
      </div>
    </div>
  );
}
