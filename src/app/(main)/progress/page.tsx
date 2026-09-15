"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Camera, ImagePlus, LineChart, Ruler } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/lib/store/user-store";
import { Counter } from "@/components/ui/counter";

const WEIGHT_HISTORY = [
  { d: "M", w: 72.4 },
  { d: "T", w: 72.1 },
  { d: "W", w: 71.9 },
  { d: "T", w: 72.0 },
  { d: "F", w: 71.6 },
  { d: "S", w: 71.5 },
  { d: "S", w: 71.2 },
];

const CALORIE_HISTORY = [
  { d: "M", c: 1820 },
  { d: "T", c: 1740 },
  { d: "W", c: 2050 },
  { d: "T", c: 1690 },
  { d: "F", c: 1780 },
  { d: "S", c: 1900 },
  { d: "S", c: 1620 },
];

export default function ProgressPage() {
  const profile = useUserStore((s) => s.profile);
  const [tab, setTab] = useState("charts");

  return (
    <PageShell>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-text-tertiary">
          Progress
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Watch it move
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Weight, calories, photos, measurements — all here.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="This week" value="-0.9" unit="kg" tint="text-accent-green" hint="weight" />
        <StatCard label="Adherence" value="86" unit="%" tint="text-accent-blue" hint="calories" />
        <StatCard label="Workouts" value="4" unit="/5" tint="text-accent-purple" hint="completed" />
        <StatCard label="Streak" value="7" unit="days" tint="text-accent-red" hint="logging" />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="charts">
            <LineChart className="mr-1.5 h-3.5 w-3.5" /> Charts
          </TabsTrigger>
          <TabsTrigger value="photos">
            <Camera className="mr-1.5 h-3.5 w-3.5" /> Photos
          </TabsTrigger>
          <TabsTrigger value="measurements">
            <Ruler className="mr-1.5 h-3.5 w-3.5" /> Measurements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="mt-6 space-y-5">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Weight (kg)</h3>
              <Badge variant="green">-1.2kg / 30d</Badge>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer>
                <AreaChart data={WEIGHT_HISTORY}>
                  <defs>
                    <linearGradient id="w-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F8FFF" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#4F8FFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#2D2D44" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="d" stroke="#555570" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#555570"
                    tick={{ fontSize: 11 }}
                    domain={["dataMin - 0.3", "dataMax + 0.3"]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1A1A2E",
                      border: "1px solid #2D2D44",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="w"
                    stroke="#4F8FFF"
                    strokeWidth={2.5}
                    fill="url(#w-grad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Calories consumed</h3>
              <Badge variant="blue">avg 1,800</Badge>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer>
                <BarChart data={CALORIE_HISTORY}>
                  <CartesianGrid stroke="#2D2D44" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="d" stroke="#555570" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#555570" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#1A1A2E",
                      border: "1px solid #2D2D44",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="c"
                    fill="#A855F7"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <Card className="text-center py-16">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
              <ImagePlus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Add your first photo</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Front · Side · Back. We'll build the timeline as you go.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="mt-6">
          <Card>
            <p className="text-sm text-text-secondary">
              Measurements logging coming in the next phase — waist, chest, hips, arms, thighs.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function StatCard({
  label,
  value,
  unit,
  tint,
  hint,
}: {
  label: string;
  value: string;
  unit: string;
  tint: string;
  hint: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4"
    >
      <p className="text-[10px] uppercase tracking-widest text-text-tertiary">
        {label}
      </p>
      <p className={`mt-1 num text-2xl font-bold ${tint}`}>
        {value}
        <span className="ml-1 text-xs text-text-tertiary">{unit}</span>
      </p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-text-tertiary">
        {hint}
      </p>
    </motion.div>
  );
}
