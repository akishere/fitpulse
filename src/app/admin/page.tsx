"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Users } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const MOCK_USERS = [
  {
    id: "u-1",
    name: "Niharika",
    email: "niharika@example.com",
    weight: 68.4,
    bmi: 25.1,
    goal: "weight_loss",
    last_active: "2h ago",
    medical: ["hypothyroidism"],
  },
  {
    id: "u-2",
    name: "Mother-in-law",
    email: "mil@example.com",
    weight: 74.2,
    bmi: 28.6,
    goal: "lean_body",
    last_active: "yesterday",
    medical: [],
  },
];

export default function AdminDashboard() {
  const [q, setQ] = useState("");
  const filtered = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <PageShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent-purple" />
            <p className="text-xs uppercase tracking-widest text-accent-purple">
              Admin
            </p>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Manage users
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="purple" className="gap-1.5">
            <Users className="h-3 w-3" /> {filtered.length} users
          </Badge>
        </div>
      </div>

      <div className="mb-4 relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search users…"
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filtered.map((u, i) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/admin/users/${u.id}`}>
              <Card className="glass-hover cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-purple/15 text-accent-purple font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{u.name}</p>
                    <p className="text-xs text-text-secondary">{u.email}</p>
                  </div>
                  <Badge variant="outline">{u.last_active}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <StatMini label="Weight" value={`${u.weight} kg`} />
                  <StatMini label="BMI" value={u.bmi.toFixed(1)} />
                  <StatMini label="Goal" value={u.goal.replace("_", " ")} />
                </div>

                {u.medical.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {u.medical.map((m) => (
                      <Badge key={m} variant="amber">
                        {m}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="mt-4 text-center">
          <p className="text-sm text-text-secondary">No users match "{q}"</p>
        </Card>
      )}
    </PageShell>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-bg-card/50 p-2">
      <p className="text-[9px] uppercase tracking-widest text-text-tertiary">
        {label}
      </p>
      <p className="mt-0.5 num text-sm font-semibold capitalize">{value}</p>
    </div>
  );
}
