export type TimePeriod = "morning" | "afternoon" | "evening" | "night";

export function getTimePeriod(date = new Date()): TimePeriod {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 22) return "evening";
  return "night";
}

export function getTimeGreeting(date = new Date()): string {
  const period = getTimePeriod(date);
  const labels: Record<TimePeriod, string> = {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    night: "Good night",
  };
  return labels[period];
}

export function getTimePeriodLabel(date = new Date()): string {
  const period = getTimePeriod(date);
  const labels: Record<TimePeriod, string> = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
  };
  return labels[period];
}
