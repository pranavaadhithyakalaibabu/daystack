export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-8 pt-2">
      <div className="space-y-3">
        <div className="h-3 w-20 rounded bg-surface-secondary" />
        <div className="h-9 w-3/4 max-w-md rounded-apple bg-surface-secondary" />
        <div className="h-4 w-40 rounded bg-surface-secondary" />
      </div>
      <div className="card h-64 rounded-apple-lg" />
    </div>
  );
}
