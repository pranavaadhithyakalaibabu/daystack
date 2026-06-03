interface TaskProgressProps {
  completed: number;
  total: number;
}

export default function TaskProgress({ completed, total }: TaskProgressProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="card mb-8 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-body text-[15px] text-text-secondary">
          <span className="font-medium text-text">{completed}</span> of {total}{" "}
          completed
        </p>
        <span className="font-body text-[15px] font-medium text-brand">
          {pct}%
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-secondary">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
