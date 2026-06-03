import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { ensureUserProfile } from "@/lib/ensure-user";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { computeStreak, getTodayDateString } from "@/lib/utils";
import type { DayReview } from "@/lib/types";

const SYSTEM_PROMPT =
  "You are an honest end-of-day coach. Be direct, warm, and never preachy. Max 15 words per reflection sentence.";

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
      user_id?: string;
      date?: string;
    };

    const { user_id, date } = body;

    if (!date) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (user_id && user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: entry, error: fetchError } = await supabase
      .from("day_entries")
      .select("tasks, completed_tasks")
      .eq("user_id", user.id)
      .eq("date", date)
      .single();

    if (fetchError || !entry) {
      return NextResponse.json({ error: "No entry found" }, { status: 404 });
    }

    await ensureUserProfile(supabase, user);

    const tasks = entry.tasks ?? [];
    const completed_tasks = entry.completed_tasks ?? [];

    const userPrompt = `Here is what the user planned and what they completed today.

Planned tasks: ${JSON.stringify(tasks)}
Completed tasks: ${JSON.stringify(completed_tasks)}

Return ONLY a valid JSON object, no preamble, no markdown:
{
  "wins": ["string"],
  "carries": [{ "task": "string", "priority": "high" | "med" | "low" }],
  "reflection": "string",
  "completion_rate": number,
  "encouragement": "string"
}`;

    const review = await callGemini<DayReview>(SYSTEM_PROMPT, userPrompt, 800);

    const { error: updateError } = await supabase
      .from("day_entries")
      .update({ review })
      .eq("user_id", user.id)
      .eq("date", date);

    if (updateError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const today = getTodayDateString();
    const { data: profile } = await supabase
      .from("users")
      .select("streak, last_active")
      .eq("id", user.id)
      .single();

    const currentStreak = profile?.streak ?? 0;
    const lastActive = profile?.last_active ?? null;
    const newStreak = computeStreak(currentStreak, lastActive, today);

    await supabase
      .from("users")
      .update({ streak: newStreak, last_active: today })
      .eq("id", user.id);

    return NextResponse.json({ ...review, streak: newStreak });
  } catch (err) {
    console.error("[api/review]", err);
    return NextResponse.json({ error: "Review failed" }, { status: 500 });
  }
}
