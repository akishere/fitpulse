"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronRight,
  FileUp,
  LogOut,
  Moon,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store/user-store";
import { signOut } from "@/lib/auth/sign-out";

export default function SettingsPage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const isAdmin = profile?.role === "admin";

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    router.replace("/login");
  }

  return (
    <PageShell>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-text-tertiary">
          Settings
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Your profile</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-blue/15 text-lg font-bold text-accent-blue shadow-glow">
              {profile?.name?.charAt(0) ?? "?"}
            </div>
            <div>
              <p className="text-lg font-semibold">{profile?.name ?? "Guest"}</p>
              <p className="text-xs text-text-secondary">{profile?.email}</p>
            </div>
            {isAdmin && (
              <Badge variant="purple" className="ml-auto">
                <ShieldCheck className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <MetricTile label="Weight" value={`${profile?.current_weight_kg ?? "—"} kg`} />
            <MetricTile label="Height" value={`${profile?.height_cm ?? "—"} cm`} />
            <MetricTile label="BMI" value={profile?.bmi ? profile.bmi.toFixed(1) : "—"} />
            <MetricTile
              label="Target kcal"
              value={profile?.daily_calorie_target ?? "—"}
            />
          </div>
        </Card>
      </motion.div>

      <div className="mt-6 space-y-3">
        <SettingRow
          icon={UserIcon}
          title="Edit profile"
          desc="Update age, weight, goal, activity level"
          href="/onboarding"
        />
        <SettingRow
          icon={FileUp}
          title="Import trainer plan"
          desc="Upload a DOCX or PDF — AI parses it for you"
          href="/settings/import"
        />
        {isAdmin && (
          <SettingRow
            icon={ShieldCheck}
            title="Admin panel"
            desc="Manage users, plans, and audit log"
            href="/admin"
            tint="text-accent-purple"
          />
        )}
        <SettingRow
          icon={Moon}
          title="Theme"
          desc="Dark mode is on by default — light coming later"
          disabled
        />
      </div>

      <div className="mt-8">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="text-accent-red hover:text-accent-red"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      <p className="mt-10 text-center text-[10px] uppercase tracking-widest text-text-tertiary">
        FitPulse v0.1 · Built with love
      </p>
    </PageShell>
  );
}

function MetricTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border/50 bg-bg-card/50 p-3">
      <p className="text-[10px] uppercase tracking-widest text-text-tertiary">
        {label}
      </p>
      <p className="mt-1 num text-lg font-semibold">{value}</p>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  desc,
  href,
  disabled,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  href?: string;
  disabled?: boolean;
  tint?: string;
}) {
  const inner = (
    <div className="glass glass-hover flex items-center gap-3 rounded-2xl p-4">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-bg-card-hover ${tint ?? "text-accent-blue"}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-text-secondary">{desc}</p>
      </div>
      {!disabled && <ChevronRight className="h-4 w-4 text-text-tertiary" />}
    </div>
  );
  if (disabled) return <div className="opacity-60">{inner}</div>;
  return <Link href={href!}>{inner}</Link>;
}
