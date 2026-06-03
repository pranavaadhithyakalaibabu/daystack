import PlanView from "@/components/PlanView";
import EmptyState from "@/components/EmptyState";
import { getDashboardContext } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  formatDisplayDate,
  getTodayDateString,
  isAfter5PM,
} from "@/lib/utils";
import type { DayPlan, PlannedTask } from "@/lib/types";

export default async function PlanPage() {
  const { user, streak } = await getDashboardContext();
  const supabase = await createServerSupabaseClient();
  const today = getTodayDateString();

  const { data: entry } = await supabase
    .from("day_entries")
    .select("id, ai_plan, tasks, completed_tasks")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  if (!entry?.ai_plan) {
    return (
      <EmptyState
        title="No plan for today yet"
        description="Start with a morning brain dump. DayStack will turn it into your Top 3, tasks, and meetings."
        primaryLabel="Go to Morning Dump →"
        primaryHref="/dump"
      />
    );
  }

  const plan = entry.ai_plan as DayPlan;
  const tasks = (entry.tasks ?? plan.tasks) as PlannedTask[];
  const completed = (entry.completed_tasks ?? []) as string[];

  return (
    <PlanView
      user={user}
      plan={plan}
      tasks={tasks}
      completedTasks={completed}
      entryId={entry.id}
      displayDate={formatDisplayDate()}
      streak={streak}
      showReviewButton={isAfter5PM()}
    />
  );
}
