import { NextResponse } from "next/server";
import { analyzeImage } from "@/lib/ai/provider";
import { ANALYZE_MEAL_SYSTEM_PROMPT } from "@/lib/prompts/analyze-meal";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { image_base64 } = (await req.json()) as { image_base64?: string };
    if (!image_base64) {
      return NextResponse.json({ error: "image_base64 required" }, { status: 400 });
    }
    const data = await analyzeImage(image_base64, ANALYZE_MEAL_SYSTEM_PROMPT);
    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
