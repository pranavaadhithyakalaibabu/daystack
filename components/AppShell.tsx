interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-bg">
      <div className="relative">{children}</div>
    </div>
  );
}
