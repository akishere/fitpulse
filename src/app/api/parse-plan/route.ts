import { NextResponse } from "next/server";
import { analyzeText } from "@/lib/ai/provider";
import { PARSE_PLAN_SYSTEM_PROMPT } from "@/lib/prompts/parse-plan";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text } = (await req.json()) as { text?: string };
    if (!text || text.length < 20) {
      return NextResponse.json(
        { error: "Text (>= 20 chars) is required" },
        { status: 400 }
      );
    }
    const data = await analyzeText(text, PARSE_PLAN_SYSTEM_PROMPT);
    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
