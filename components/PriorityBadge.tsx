import type { Priority } from "@/lib/types";

const styles: Record<Priority, string> = {
  high: "bg-red/10 text-red",
  med: "bg-brand/10 text-brand",
  low: "bg-surface-secondary text-text-secondary",
};

const labels: Record<Priority, string> = {
  high: "High",
  med: "Med",
  low: "Low",
};

interface PriorityBadgeProps {
  priority: Priority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 font-body text-[11px] font-medium ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
}
