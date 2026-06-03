"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/UserMenu";
import type { AppUser } from "@/lib/user";

interface AppHeaderProps {
  user: AppUser;
  streak?: number;
  center?: React.ReactNode;
}

const navItems = [
  { href: "/dump", label: "Dump" },
  { href: "/plan", label: "My Day" },
  { href: "/review", label: "Review" },
];

export default function AppHeader({ user, streak = 0, center }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 -mx-5 mb-8 md:-mx-10 lg:-mx-12">
      <div className="glass-nav px-5 py-3 md:px-10 lg:px-12">
        <div className="flex w-full items-center justify-between gap-4">
          <Link
            href="/dump"
            prefetch
            className="font-heading text-[22px] font-bold tracking-tight text-text transition-opacity hover:opacity-70 md:text-[26px]"
          >
            DayStack
          </Link>

          <nav className="hidden items-center gap-1 md:flex md:ml-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={`rounded-lg px-3 py-1.5 font-body text-[15px] transition-colors ${
                  pathname === item.href
                    ? "nav-pill-active bg-brand/10"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/profile"
              prefetch
              className={`rounded-lg px-3 py-1.5 font-body text-[15px] transition-colors ${
                pathname === "/profile"
                  ? "nav-pill-active bg-brand/10"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              Profile
            </Link>
          </nav>

          {center && (
            <div className="hidden flex-1 text-center font-body text-[13px] text-muted lg:block">
              {center}
            </div>
          )}

          <UserMenu user={user} streak={streak} />
        </div>
      </div>
    </header>
  );
}
