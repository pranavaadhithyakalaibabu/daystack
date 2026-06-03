"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CompletionRing from "@/components/CompletionRing";
import PriorityBadge from "@/components/PriorityBadge";
import Spinner from "@/components/Spinner";
import StreakBanner from "@/components/StreakBanner";
import { useToast } from "@/components/Toast";
import type { AppUser } from "@/lib/user";
import type { DayReview } from "@/lib/types";

interface ReviewViewProps {
  user: AppUser;
  date: string;
  initialReview: DayReview | null;
  initialStreak: number;
}

export default function ReviewView({
  user,
  date,
  initialReview,
  initialStreak,
}: ReviewViewProps) {
  const { showToast } = useToast();
  const [review, setReview] = useState<DayReview | null>(initialReview);
  const [streak, setStreak] = useState(initialStreak);
  const [loading, setLoading] = useState(!initialReview);

  useEffect(() => {
    if (initialReview) return;

    async function fetchReview() {
      try {
        const res = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, date }),
        });

        if (!res.ok) {
          showToast("Something went wrong. Try again.");
          return;
        }

        const data = (await res.json()) as DayReview & { streak?: number };
        setReview({
          wins: data.wins,
          carries: data.carries,
          reflection: data.reflection,
          completion_rate: data.completion_rate,
          encouragement: data.encouragement,
        });
        if (typeof data.streak === "number") {
          setStreak(data.streak);
        }
      } catch {
        showToast("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    }

    void fetchReview();
  }, [initialReview, user.id, date, showToast]);

  if (loading || !review) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Spinner className="h-8 w-8" />
        <p className="font-body text-[15px] text-text-secondary">
          Reviewing your day…
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <StreakBanner streak={streak} />

      <h1 className="mb-8 text-center font-heading text-[34px] font-semibold tracking-tight text-text">
        Day complete
      </h1>

      <CompletionRing rate={review.completion_rate} />

      <section className="card mb-6 p-5">
        <h2 className="font-heading text-[17px] font-semibold text-sage">
          What you shipped
        </h2>
        <ul className="mt-4 space-y-3">
          {review.wins.map((win) => (
            <li
              key={win}
              className="flex items-start gap-3 font-body text-[17px] text-text"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/15 text-[11px] text-sage">
                ✓
              </span>
              {win}
            </li>
          ))}
        </ul>
      </section>

      {review.carries.length > 0 && (
        <section className="mb-6">
          <h2 className="section-title mb-1">Tomorrow</h2>
          <p className="section-label mb-4">Carry forward</p>
          <ul className="list-group">
            {review.carries.map((item) => (
              <li
                key={item.task}
                className="list-row flex items-center justify-between gap-3 px-4 py-3.5"
              >
                <span className="font-body text-[17px] text-text">
                  {item.task}
                </span>
                <PriorityBadge priority={item.priority} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <blockquote className="mb-6 px-2 text-center font-body text-[19px] leading-relaxed text-text-secondary">
        &ldquo;{review.reflection}&rdquo;
      </blockquote>

      <p className="mb-8 text-center font-body text-[15px] text-muted">
        {review.encouragement}
      </p>

      <p className="mb-8 text-center font-body text-[17px] font-medium text-brand">
        {streak} day streak
      </p>

      <Link href="/dump" prefetch className="btn-primary">
        Plan tomorrow
      </Link>
    </div>
  );
}
