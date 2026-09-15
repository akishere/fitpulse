"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  UtensilsCrossed,
  Camera,
  LineChart,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/plan/diet", icon: UtensilsCrossed, label: "Plan" },
  { href: "/log/photo", icon: Camera, label: "Log", accent: true },
  { href: "/progress", icon: LineChart, label: "Progress" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="mx-auto max-w-md px-4 pb-[env(safe-area-inset-bottom)] pt-2">
        <div className="glass flex items-center justify-between rounded-2xl px-2 py-1.5">
          {NAV.map(({ href, icon: Icon, label, accent }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium",
                  active ? "text-text-primary" : "text-text-secondary"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className={cn(
                      "absolute inset-0 rounded-xl",
                      accent
                        ? "bg-accent-blue shadow-glow"
                        : "bg-bg-card-hover"
                    )}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    "relative z-10 h-5 w-5",
                    accent && !active && "text-accent-blue"
                  )}
                />
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
