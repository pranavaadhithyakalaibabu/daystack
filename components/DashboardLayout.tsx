"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import AppShell from "@/components/AppShell";
import SiteFooter from "@/components/SiteFooter";
import type { AppUser } from "@/lib/user";

const PREFETCH_ROUTES = ["/dump", "/plan", "/review", "/profile"];

interface DashboardLayoutProps {
  user: AppUser;
  streak: number;
  children: React.ReactNode;
}

export default function DashboardLayout({
  user,
  streak,
  children,
}: DashboardLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    for (const route of PREFETCH_ROUTES) {
      router.prefetch(route);
    }
  }, [router]);

  return (
    <AppShell>
      <div className="flex min-h-screen w-full flex-col px-5 pt-6 pb-6 md:px-10 md:pt-8 md:pb-8 lg:px-12">
        <AppHeader user={user} streak={streak} />
        <main className="page-enter w-full flex-1">{children}</main>
        <SiteFooter />
      </div>
    </AppShell>
  );
}
