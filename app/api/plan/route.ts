import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { ensureUserProfile } from "@/lib/ensure-user";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { DayPlan } from "@/lib/types";

const SYSTEM_PROMPT =
  "You are a ruthless but kind daily planner. The user has dumped everything on their mind. Extract structure from chaos. Be direct. Be realistic. Never pad the list.";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      raw_dump?: string;
      user_id?: string;
      date?: string;
    };

    const { raw_dump, user_id, date } = body;

    if (!raw_dump?.trim() || !date) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (user_id && user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userPrompt = `Here is everything on my mind today:

${raw_dump}

Return ONLY a valid JSON object with this exact structure, no preamble, no markdown:
{
  "top3": ["string", "string", "string"],
  "tasks": [{ "task": "string", "priority": "high" | "med" | "low", "estimated_minutes": number }],
  "meetings": [{ "title": "string", "time": "string" }],
  "drop": "string",
  "finish_time": "string",
  "total_tasks": number
}`;

    await ensureUserProfile(supabase, user);

    const plan = await callGemini<DayPlan>(SYSTEM_PROMPT, userPrompt, 1500);

    const { error } = await supabase.from("day_entries").upsert(
      {
        user_id: user.id,
        date,
        raw_dump,
        ai_plan: plan,
        tasks: plan.tasks,
        completed_tasks: [],
      },
      { onConflict: "user_id,date" }
    );

    if (error) {
      console.error("[api/plan] db:", error.message, error.code);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json(plan);
  } catch (err) {
    console.error("[api/plan]", err);
    return NextResponse.json({ error: "Planning failed" }, { status: 500 });
  }
}
