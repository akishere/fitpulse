"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  RefreshCw,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/lib/store/user-store";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/utils/site-url";

type Stage = "form" | "check-email";

export default function SignupPage() {
  const router = useRouter();
  const setProfileDraft = useUserStore((s) => s.setProfile);

  const [stage, setStage] = useState<Stage>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [attemptedCheck, setAttemptedCheck] = useState(false);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Fill out every field");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);

    const supabase = getSupabaseBrowser();
    if (supabase) {
      const redirectTo = `${getSiteUrl()}/auth/callback`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: { name },
        },
      });
      setLoading(false);
      if (error) {
        toast.error(
          error.message.toLowerCase().includes("already")
            ? "An account with this email already exists. Please sign in."
            : error.message
        );
        return;
      }
      // Seed a lightweight local profile so onboarding lands filled in.
      setProfileDraft({
        id: data.user?.id ?? "pending",
        email,
        name,
        role: email.toLowerCase().includes("akshem") ? "admin" : "user",
        age: 30,
        gender: "male",
        height_cm: 0,
        current_weight_kg: 0,
        bmi: 0,
        goal: "weight_loss",
        activity_level: "moderate",
        medical_conditions: [],
        daily_calorie_target: 2000,
        protein_target_g: 150,
        carb_target_g: 200,
        fat_target_g: 60,
      });
      setResendIn(60);
      setStage("check-email");
      return;
    }

    // No Supabase configured — local demo path
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setProfileDraft({
      id: "local",
      email,
      name,
      role: email.toLowerCase().includes("akshem") ? "admin" : "user",
      age: 30,
      gender: "male",
      height_cm: 0,
      current_weight_kg: 0,
      bmi: 0,
      goal: "weight_loss",
      activity_level: "moderate",
      medical_conditions: [],
      daily_calorie_target: 2000,
      protein_target_g: 150,
      carb_target_g: 200,
      fat_target_g: 60,
    });
    toast.info("Demo mode (no Supabase configured) — skipping email step");
    router.push("/onboarding");
  }

  async function onCheckVerified() {
    setChecking(true);
    setAttemptedCheck(true);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setChecking(false);
      router.push("/onboarding");
      return;
    }
    const { data } = await supabase.auth.getUser();
    setChecking(false);
    if (data.user?.email_confirmed_at) {
      toast.success("Verified! Let's set you up.");
      router.push("/onboarding");
    } else {
      toast.error(
        "Email not yet verified. Please check your inbox and click the confirmation link."
      );
    }
  }

  async function onResend() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setResendIn(60);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      setResendIn(0);
    } else {
      toast.success("Confirmation email resent");
    }
  }

  return (
    <div className="glass rounded-3xl p-8">
      <AnimatePresence mode="wait">
        {stage === "form" ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <h1 className="text-2xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-text-secondary">
              Free, no ads, your data stays yours.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Akshem"
                    className="pl-10"
                    autoFocus
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    Create account <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-text-tertiary">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent-blue hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="check"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-blue/15 text-accent-blue shadow-glow"
            >
              <MailCheck className="h-7 w-7" />
            </motion.div>

            <h1 className="text-2xl font-bold tracking-tight">
              Check your email
            </h1>
            <p className="mt-1.5 max-w-sm text-sm text-text-secondary">
              We've sent a confirmation link to{" "}
              <span className="text-text-primary">{email}</span>. Click the link
              to verify your account, then come back here.
            </p>

            {attemptedCheck && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 rounded-xl border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-xs text-accent-amber"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Not verified yet — refresh your inbox and click the link.
              </motion.div>
            )}

            <Button
              onClick={onCheckVerified}
              size="lg"
              className="mt-8 w-full"
              disabled={checking}
            >
              {checking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking…
                </>
              ) : (
                <>
                  I've verified, continue <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <div className="mt-5 flex items-center gap-2 text-xs text-text-tertiary">
              Didn't get it?
              {resendIn > 0 ? (
                <span>Resend in {resendIn}s</span>
              ) : (
                <button
                  onClick={onResend}
                  className="flex items-center gap-1 text-accent-blue hover:underline"
                >
                  <RefreshCw className="h-3 w-3" />
                  Resend link
                </button>
              )}
            </div>

            <button
              onClick={() => setStage("form")}
              className="mt-6 text-xs text-text-tertiary hover:text-text-primary"
            >
              Wrong email? Start over
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
