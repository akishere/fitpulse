"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signOut } from "@/lib/auth/sign-out";
import {
  Home,
  UtensilsCrossed,
  Dumbbell,
  Camera,
  LineChart,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUserStore } from "@/lib/store/user-store";

const NAV = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/plan/diet", icon: UtensilsCrossed, label: "Diet plan" },
  { href: "/plan/exercise", icon: Dumbbell, label: "Workout plan" },
  { href: "/log/photo", icon: Camera, label: "Log meal" },
  { href: "/progress", icon: LineChart, label: "Progress" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const isAdmin = profile?.role === "admin";

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border/50 bg-bg-primary/60 backdrop-blur-xl px-4 py-6">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
        <Image
          src="/assets/fitpulse-fp-monogram.svg"
          alt="FitPulse"
          width={35}
          height={36}
          priority
          className="shrink-0 drop-shadow-[0_0_18px_hsla(218_100%_66%_/_0.35)]"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold tracking-tight">FitPulse</span>
          <span className="text-[10px] uppercase tracking-widest text-text-tertiary">
            Personal fitness
          </span>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card-hover/50"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-accent-blue/15 border border-accent-blue/25"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="my-3 divider-soft" />
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                pathname.startsWith("/admin")
                  ? "text-accent-purple"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card-hover/50"
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin panel
            </Link>
          </>
        )}
      </nav>

      {profile && (
        <div className="mt-6 rounded-2xl border border-border/50 bg-bg-card/50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-blue/20 text-sm font-semibold text-accent-blue">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">{profile.name}</span>
              <span className="truncate text-xs text-text-tertiary">
                {profile.email}
              </span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-bg-card-hover px-3 py-2 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
