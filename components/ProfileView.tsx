import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import ProfileEmojiPicker from "@/components/ProfileEmojiPicker";
import type { AppUser } from "@/lib/user";

interface ProfileViewProps {
  user: AppUser;
  streak: number;
  lastActive: string | null;
  memberSince: string | null;
  entriesCount: number;
}

export default function ProfileView({
  user,
  streak,
  lastActive,
  memberSince,
  entriesCount,
}: ProfileViewProps) {
  const memberLabel = memberSince
    ? new Date(memberSince).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <>
      <div className="card overflow-hidden">
        <div className="px-8 py-10 text-center">
          <UserAvatar
            src={user.avatarUrl}
            initials={user.initials}
            profileEmoji={user.profileEmoji}
            size="xl"
            className="mx-auto"
          />
          <h1 className="mt-5 font-heading text-[28px] font-semibold tracking-tight text-text">
            {user.fullName ?? user.firstName}
          </h1>
          <p className="mt-1 font-body text-[15px] text-text-secondary">
            {user.email}
          </p>
        </div>

        <div className="grid gap-px bg-border sm:grid-cols-3">
          <StatCard label="Streak" value={`${streak} days`} highlight />
          <StatCard label="Days planned" value={String(entriesCount)} />
          <StatCard
            label="Last active"
            value={
              lastActive
                ? new Date(`${lastActive}T12:00:00`).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" }
                  )
                : "Today"
            }
          />
        </div>

        <div className="border-t border-border px-8 py-4">
          <p className="font-body text-[13px] text-muted">
            Member since {memberLabel}
          </p>
        </div>
      </div>

      <ProfileEmojiPicker currentEmoji={user.profileEmoji} />

      <section className="mt-10">
        <h2 className="section-title mb-1">Quick actions</h2>
        <p className="section-label mb-4">Jump to a page</p>
        <div className="list-group">
          <ActionRow href="/dump" title="Morning Dump" desc="Start your day" />
          <ActionRow href="/plan" title="My Day" desc="View today's plan" />
          <ActionRow href="/review" title="End of Day" desc="Review and reflect" />
        </div>
      </section>
    </>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-surface px-6 py-5 text-center">
      <p className="font-body text-[13px] text-text-secondary">{label}</p>
      <p
        className={`mt-1 font-heading text-xl font-semibold ${
          highlight ? "text-brand" : "text-text"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ActionRow({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      prefetch
      className="list-row flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-surface-secondary/80"
    >
      <div>
        <span className="block font-body text-[17px] text-text">{title}</span>
        <span className="font-body text-[13px] text-text-secondary">{desc}</span>
      </div>
      <span className="text-muted" aria-hidden>
        ›
      </span>
    </Link>
  );
}
