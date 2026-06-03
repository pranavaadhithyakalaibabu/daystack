import ReviewView from "@/components/ReviewView";
import EmptyState from "@/components/EmptyState";
import { getDashboardContext } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getTodayDateString, isAfter5PM } from "@/lib/utils";
import type { DayReview } from "@/lib/types";

function ReviewPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center py-10 md:min-h-[55vh]">
      {children}
    </div>
  );
}

export default async function ReviewPage() {
  const { user, streak } = await getDashboardContext();
  const supabase = await createServerSupabaseClient();
  const today = getTodayDateString();

  const { data: entry } = await supabase
    .from("day_entries")
    .select("id, ai_plan, review")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  if (!entry?.ai_plan) {
    return (
      <ReviewPageShell>
        <EmptyState
          title="Nothing to review yet"
          description="You need to plan your day first. After you complete tasks, come back here for your end-of-day review."
          primaryLabel="Plan My Day →"
          primaryHref="/dump"
          secondaryLabel="View My Day"
          secondaryHref="/plan"
        />
      </ReviewPageShell>
    );
  }

  if (!isAfter5PM()) {
    return (
      <ReviewPageShell>
        <EmptyState
          title="Review unlocks at 5:00 PM"
          description="Finish your tasks on My Day first. Your AI coach will summarize wins, carries, and reflection after 5pm."
          primaryLabel="Go to My Day →"
          primaryHref="/plan"
          secondaryLabel="Back to Morning Dump"
          secondaryHref="/dump"
        />
      </ReviewPageShell>
    );
  }

  return (
    <ReviewPageShell>
      <ReviewView
        user={user}
        date={today}
        initialReview={(entry.review as DayReview | null) ?? null}
        initialStreak={streak}
      />
    </ReviewPageShell>
  );
}
