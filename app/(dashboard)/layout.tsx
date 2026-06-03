import DashboardLayout from "@/components/DashboardLayout";
import { getDashboardContext } from "@/lib/auth";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, streak } = await getDashboardContext();

  return (
    <DashboardLayout user={user} streak={streak}>
      {children}
    </DashboardLayout>
  );
}
