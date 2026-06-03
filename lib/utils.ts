export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getFirstName(
  fullName: string | null | undefined,
  email: string | null | undefined
): string {
  if (fullName?.trim()) {
    return fullName.trim().split(/\s+/)[0] ?? "there";
  }
  if (email) {
    return email.split("@")[0] ?? "there";
  }
  return "there";
}

export function isAfter5PM(date = new Date()): boolean {
  return date.getHours() >= 17;
}

export function computeStreak(
  currentStreak: number,
  lastActive: string | null,
  today: string
): number {
  if (!lastActive) {
    return 1;
  }
  if (lastActive === today) {
    return currentStreak;
  }

  const last = new Date(`${lastActive}T12:00:00`);
  const now = new Date(`${today}T12:00:00`);
  const diffDays = Math.round(
    (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 1) {
    return currentStreak + 1;
  }
  return 1;
}
