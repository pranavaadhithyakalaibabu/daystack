"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { AppUser } from "@/lib/user";

interface UserMenuProps {
  user: AppUser;
  streak?: number;
}

export default function UserMenu({ user, streak = 0 }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-2 transition-opacity hover:opacity-80"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <UserAvatar
          src={user.avatarUrl}
          initials={user.initials}
          profileEmoji={user.profileEmoji}
          size="sm"
        />
        <span className="hidden max-w-[100px] truncate font-body text-[15px] font-medium text-text sm:block">
          {user.firstName}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right animate-fade-in overflow-hidden rounded-apple-lg border border-border bg-surface shadow-card">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate font-body text-[15px] font-semibold text-text">
              {user.fullName ?? user.firstName}
            </p>
            <p className="truncate font-body text-[13px] text-text-secondary">
              {user.email}
            </p>
            {streak > 0 && (
              <p className="mt-1 font-body text-[13px] text-brand">
                {streak} day streak
              </p>
            )}
          </div>

          <nav className="py-1">
            <MenuLink
              href="/profile"
              active={pathname === "/profile"}
              onNavigate={() => setOpen(false)}
            >
              Profile
            </MenuLink>
            <MenuLink
              href="/dump"
              active={pathname === "/dump"}
              onNavigate={() => setOpen(false)}
            >
              Morning Dump
            </MenuLink>
            <MenuLink
              href="/plan"
              active={pathname === "/plan"}
              onNavigate={() => setOpen(false)}
            >
              My Day
            </MenuLink>
            <MenuLink
              href="/review"
              active={pathname === "/review"}
              onNavigate={() => setOpen(false)}
            >
              Review
            </MenuLink>
          </nav>

          <div className="border-t border-border py-1">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full px-4 py-2.5 text-left font-body text-[15px] text-brand transition-colors hover:bg-surface-secondary"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  active,
  onNavigate,
  children,
}: {
  href: string;
  active: boolean;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      prefetch
      onClick={onNavigate}
      className={`block px-4 py-2.5 font-body text-[15px] transition-colors ${
        active
          ? "bg-brand/10 font-medium text-brand"
          : "text-text hover:bg-surface-secondary"
      }`}
    >
      {children}
    </Link>
  );
}
