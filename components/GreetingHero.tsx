"use client";

import { useEffect, useState } from "react";
import { getTimeGreeting, getTimePeriodLabel } from "@/lib/greetings";

interface GreetingHeroProps {
  firstName: string;
  displayDate: string;
  profileEmoji?: string | null;
}

export default function GreetingHero({
  firstName,
  displayDate,
  profileEmoji,
}: GreetingHeroProps) {
  const [greeting, setGreeting] = useState(getTimeGreeting);
  const [periodLabel, setPeriodLabel] = useState(getTimePeriodLabel);

  useEffect(() => {
    function refresh() {
      setGreeting(getTimeGreeting());
      setPeriodLabel(getTimePeriodLabel());
    }
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mb-8">
      <p className="section-label">{periodLabel}</p>
      <div className="mt-1 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[34px] font-semibold leading-tight tracking-tight text-text">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 font-body text-[17px] text-text-secondary">
            {displayDate}
          </p>
        </div>
        {profileEmoji && (
          <span className="shrink-0 text-[32px] leading-none" aria-hidden>
            {profileEmoji}
          </span>
        )}
      </div>
    </div>
  );
}
