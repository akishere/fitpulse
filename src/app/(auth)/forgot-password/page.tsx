"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Enter your email");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="glass rounded-3xl p-8">
      {!sent ? (
        <>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
            <p className="mt-1.5 text-sm text-text-secondary">
              Enter your email and we'll send you a reset link.
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
                  className="pl-10"
                  autoFocus
                />
              </div>
            </div>
            <Button size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center py-4 text-center"
        >
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent-green/15 text-accent-green shadow-glow-green">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">Check your inbox</h1>
          <p className="mt-1 text-sm text-text-secondary">
            We sent a reset link to <span className="text-text-primary">{email}</span>.
          </p>
        </motion.div>
      )}

      <p className="mt-6 text-center text-xs text-text-tertiary">
        <Link href="/login" className="text-accent-blue hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
