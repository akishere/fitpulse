"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, Upload } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ImportPlanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  async function onProcess() {
    if (!file) return toast.error("Pick a file first");
    setProcessing(true);
    // TODO: call /api/parse-plan with extracted text (Mammoth.js / pdfjs-dist).
    await new Promise((r) => setTimeout(r, 1500));
    setProcessing(false);
    toast.success("Plan parsed — preview below");
  }

  return (
    <PageShell>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-text-tertiary">
          Import
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Bring your trainer's plan in
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Upload a DOCX or PDF. Gemini turns it into your daily schedule.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <label
            htmlFor="upload"
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-bg-primary/40 p-10 text-center hover:border-accent-blue/50 hover:bg-accent-blue/5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-blue/15 text-accent-blue">
              <Upload className="h-5 w-5" />
            </div>
            {file ? (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-accent-blue" />
                <span className="font-medium">{file.name}</span>
                <Badge variant="blue">
                  {(file.size / 1024).toFixed(0)} KB
                </Badge>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold">
                  Drop a .docx or .pdf here
                </p>
                <p className="text-xs text-text-secondary">
                  Or click to browse
                </p>
              </>
            )}
            <input
              id="upload"
              type="file"
              accept=".docx,.pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <div className="mt-6 flex justify-end">
            <Button onClick={onProcess} disabled={!file || processing}>
              <Sparkles className="h-4 w-4" />
              {processing ? "Parsing…" : "Parse with AI"}
            </Button>
          </div>
        </Card>
      </motion.div>

      <p className="mt-6 text-xs text-text-tertiary">
        We'll show a preview before writing anything to your plan.
      </p>
    </PageShell>
  );
}
