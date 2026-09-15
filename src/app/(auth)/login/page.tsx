"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  MailWarning,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/lib/store/user-store";
import { getSupabaseBrowser } from "@/lib/supabase/client";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const profile = useUserStore((s) => s.profile);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const setAuthed = useUserStore((s) => s.setAuthed);

  useEffect(() => {
    const err = params.get("error");
    if (err) toast.error(err);
  }, [params]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter your email and password");
      return;
    }
    setLoading(true);
    setNeedsConfirm(false);

    const supabase = getSupabaseBrowser();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        const msg = error.message.toLowerCase();
        if (
          msg.includes("email not confirmed") ||
          msg.includes("not confirmed") ||
          msg.includes("confirm your email")
        ) {
          setNeedsConfirm(true);
        } else {
          toast.error(error.message);
        }
        return;
      }
      setAuthed(true);
      if (data.user?.email_confirmed_at) {
        if (profile?.goal) {
          completeOnboarding();
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      }
      return;
    }

    // Local demo path (no Supabase configured)
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setAuthed(true);
    if (profile?.name) {
      completeOnboarding();
      toast.success(`Welcome back, ${profile.name}`);
      router.push("/dashboard");
    } else {
      router.push("/onboarding");
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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Pick up where you left off.
        </p>
      </motion.div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
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
              autoFocus
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-accent-blue hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10"
            />
          </div>
        </div>

        <AnimatePresence>
          {needsConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border border-accent-amber/40 bg-accent-amber/10 p-4">
                <div className="flex items-start gap-3">
                  <MailWarning className="mt-0.5 h-5 w-5 shrink-0 text-accent-amber" />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-text-primary">
                      Please verify your email first.
                    </p>
                    <p className="text-xs text-text-secondary">
                      Check your inbox for the confirmation link, or resend it
                      below.
                    </p>
                    <button
                      type="button"
                      onClick={onResend}
                      disabled={resendIn > 0}
                      className="mt-1 flex items-center gap-1.5 text-xs font-medium text-accent-amber hover:underline disabled:opacity-60"
                    >
                      <RefreshCw className="h-3 w-3" />
                      {resendIn > 0
                        ? `Resend in ${resendIn}s`
                        : "Resend confirmation"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-text-tertiary">
        No account yet?{" "}
        <Link
          href="/signup"
          className="text-accent-blue hover:underline font-medium"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
