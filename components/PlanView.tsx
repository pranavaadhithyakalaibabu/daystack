"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import StreakBanner from "@/components/StreakBanner";
import TaskList from "@/components/TaskList";
import TaskProgress from "@/components/TaskProgress";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/Toast";
import { getTimeGreeting } from "@/lib/greetings";
import type { AppUser } from "@/lib/user";
import type { DayPlan, PlannedTask } from "@/lib/types";

interface PlanViewProps {
  user: AppUser;
  plan: DayPlan;
  tasks: PlannedTask[];
  completedTasks: string[];
  entryId: string;
  displayDate: string;
  streak: number;
  showReviewButton: boolean;
}

export default function PlanView({
  user,
  plan,
  tasks: initialTasks,
  completedTasks: initialCompleted,
  entryId,
  displayDate,
  streak,
  showReviewButton,
}: PlanViewProps) {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<PlannedTask[]>(initialTasks);
  const [completedTasks, setCompletedTasks] =
    useState<string[]>(initialCompleted);

  const persist = useCallback(
    async (
      nextTasks: PlannedTask[],
      nextCompleted: string[]
    ): Promise<boolean> => {
      const validCompleted = nextCompleted.filter((t) =>
        nextTasks.some((item) => item.task === t)
      );
      const updatedPlan: DayPlan = {
        ...plan,
        tasks: nextTasks,
        total_tasks: nextTasks.length,
      };

      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase
        .from("day_entries")
        .update({
          tasks: nextTasks,
          ai_plan: updatedPlan,
          completed_tasks: validCompleted,
        })
        .eq("id", entryId);

      if (error) {
        showToast("Something went wrong. Try again.");
        return false;
      }
      return true;
    },
    [entryId, plan, showToast]
  );

  const onToggle = useCallback(
    async (taskId: string) => {
      const previous = completedTasks;
      const next = previous.includes(taskId)
        ? previous.filter((t) => t !== taskId)
        : [...previous, taskId];

      setCompletedTasks(next);
      const ok = await persist(tasks, next);
      if (!ok) setCompletedTasks(previous);
    },
    [completedTasks, persist, tasks]
  );

  const onRemove = useCallback(
    async (index: number) => {
      const previousTasks = tasks;
      const previousCompleted = completedTasks;
      const removed = tasks[index];
      const nextTasks = tasks.filter((_, i) => i !== index);
      const nextCompleted = completedTasks.filter((t) => t !== removed?.task);

      setTasks(nextTasks);
      setCompletedTasks(nextCompleted);

      const ok = await persist(nextTasks, nextCompleted);
      if (!ok) {
        setTasks(previousTasks);
        setCompletedTasks(previousCompleted);
      }
    },
    [completedTasks, persist, tasks]
  );

  const onReorder = useCallback(
    async (fromIndex: number, toIndex: number) => {
      const previousTasks = tasks;
      const nextTasks = [...tasks];
      const [moved] = nextTasks.splice(fromIndex, 1);
      nextTasks.splice(toIndex, 0, moved);

      setTasks(nextTasks);
      const ok = await persist(nextTasks, completedTasks);
      if (!ok) setTasks(previousTasks);
    },
    [completedTasks, persist, tasks]
  );

  const onAdd = useCallback(
    async (task: PlannedTask) => {
      const previousTasks = tasks;
      const nextTasks = [...tasks, task];

      setTasks(nextTasks);
      const ok = await persist(nextTasks, completedTasks);
      if (!ok) setTasks(previousTasks);
    },
    [completedTasks, persist, tasks]
  );

  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-[28px] font-semibold leading-tight tracking-tight text-text">
            {getTimeGreeting()}, {user.firstName}
          </h1>
          <p className="mt-0.5 font-body text-[15px] text-text-secondary">
            {displayDate}
          </p>
        </div>
        {user.profileEmoji && (
          <span className="shrink-0 text-[28px] leading-none" aria-hidden>
            {user.profileEmoji}
          </span>
        )}
      </div>

      <TaskProgress completed={completedTasks.length} total={tasks.length} />

      <StreakBanner streak={streak} />

      <section className="mb-10">
        <h2 className="section-title mb-1">Top 3</h2>
        <p className="section-label mb-4">Today&apos;s priorities</p>
        <div className="grid gap-3 md:grid-cols-3">
          {plan.top3.map((item, i) => (
            <div key={item} className="top3-card">
              <span className="mb-2 block font-body text-[13px] font-medium text-brand">
                {i + 1}
              </span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="section-title mb-1">Tasks</h2>
        <p className="section-label mb-4">
          Drag to reorder · tap circle to complete
        </p>
        <TaskList
          tasks={tasks}
          completedTasks={completedTasks}
          onToggle={onToggle}
          onRemove={onRemove}
          onReorder={onReorder}
          onAdd={onAdd}
        />
      </section>

      {plan.meetings.length > 0 && (
        <section className="mb-10">
          <h2 className="section-title mb-1">Meetings</h2>
          <p className="section-label mb-4">On your calendar</p>
          <ul className="list-group">
            {plan.meetings.map((m) => (
              <li
                key={`${m.time}-${m.title}`}
                className="list-row flex items-center gap-4 px-4 py-3.5 font-body text-[17px]"
              >
                <span className="min-w-[4rem] font-medium tabular-nums text-brand">
                  {m.time}
                </span>
                <span className="text-text">{m.title}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card mb-10 p-5">
        <h2 className="font-heading text-[17px] font-semibold text-text">
          Drop today
        </h2>
        <p className="mt-2 font-body text-[17px] leading-relaxed text-text-secondary">
          {plan.drop}
        </p>
      </section>

      <p className="mb-10 text-center font-body text-[15px] text-text-secondary">
        Finish by{" "}
        <span className="font-medium text-text">{plan.finish_time}</span>
      </p>

      <div className="text-center">
        {showReviewButton ? (
          <Link href="/review" prefetch className="btn-primary mx-auto max-w-md">
            End of Day Review
          </Link>
        ) : (
          <p className="font-body text-[15px] text-muted">
            Review unlocks at 5:00 PM
          </p>
        )}
      </div>
    </>
  );
}
