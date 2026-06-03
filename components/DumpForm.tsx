"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GreetingHero from "@/components/GreetingHero";
import Spinner from "@/components/Spinner";
import { useToast } from "@/components/Toast";
import { getTodayDateString } from "@/lib/utils";
import type { AppUser } from "@/lib/user";

interface DumpFormProps {
  user: AppUser;
  displayDate: string;
  hasEntry: boolean;
  showReviewLink: boolean;
}

export default function DumpForm({
  user,
  displayDate,
  hasEntry,
  showReviewLink,
}: DumpFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [rawDump, setRawDump] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePlan() {
    if (!rawDump.trim()) return;
    setLoading(true);

    try {
      const date = getTodayDateString();
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_dump: rawDump,
          user_id: user.id,
          date,
        }),
      });

      if (!res.ok) {
        showToast("Something went wrong. Try again.");
        return;
      }

      router.push("/plan");
      router.refresh();
    } catch {
      showToast("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <GreetingHero
        firstName={user.firstName}
        displayDate={displayDate}
        profileEmoji={user.profileEmoji}
      />

      {hasEntry ? (
        <div className="card relative overflow-hidden space-y-4 p-8 text-center">
          <p className="font-body text-lg text-text">
            You&apos;ve already planned today.
          </p>
          <Link href="/plan" prefetch className="btn-primary">
            View My Day →
          </Link>
          {showReviewLink && (
            <Link href="/review" prefetch className="btn-secondary">
              Jump to Review →
            </Link>
          )}
        </div>
      ) : (
        <div className="card relative overflow-hidden">
          <div className="relative p-4 pb-8">
            <textarea
              value={rawDump}
              onChange={(e) => setRawDump(e.target.value)}
              placeholder="What's on your mind today? Meetings, tasks, deadlines, worries — anything."
              className="input-premium min-h-[200px] border-0 shadow-none focus:ring-0"
            />
            <span className="absolute bottom-4 right-4 font-body text-[13px] tabular-nums text-muted">
              {rawDump.length}
            </span>
          </div>
          <div className="border-t border-border p-4">
            <button
              type="button"
              onClick={handlePlan}
              disabled={loading || !rawDump.trim()}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <Spinner />
                  Thinking...
                </>
              ) : (
                "Plan My Day"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
