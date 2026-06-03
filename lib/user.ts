import type { User } from "@supabase/supabase-js";
import { getFirstName } from "@/lib/utils";
import {
  DEFAULT_PROFILE_EMOJI,
  isValidProfileEmoji,
} from "@/lib/profile-emojis";

export interface AppUser {
  id: string;
  email: string | null;
  fullName: string | null;
  firstName: string;
  avatarUrl: string | null;
  profileEmoji: string;
  initials: string;
}

function pickAvatarUrl(meta: Record<string, unknown>): string | null {
  const candidates = [
    meta.avatar_url,
    meta.picture,
    meta.avatar,
    meta.profile_image,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.startsWith("http")) {
      return value;
    }
  }

  const identity = meta.custom_claims as Record<string, unknown> | undefined;
  if (identity && typeof identity.picture === "string") {
    return identity.picture;
  }

  return null;
}

function pickFullName(meta: Record<string, unknown>): string | null {
  const candidates = [meta.full_name, meta.name, meta.display_name];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

export function getInitials(
  fullName: string | null,
  email: string | null
): string {
  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "DS";
}

export function getUserProfile(user: User): AppUser {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;

  let avatarUrl = pickAvatarUrl(meta);

  if (!avatarUrl && user.identities?.length) {
    for (const identity of user.identities) {
      const data = identity.identity_data as Record<string, unknown>;
      const url = pickAvatarUrl(data);
      if (url) {
        avatarUrl = url;
        break;
      }
    }
  }

  const fullName = pickFullName(meta);
  const email = user.email ?? null;
  const rawEmoji = meta.profile_emoji;
  const profileEmoji = isValidProfileEmoji(rawEmoji)
    ? rawEmoji
    : DEFAULT_PROFILE_EMOJI;

  return {
    id: user.id,
    email,
    fullName,
    firstName: getFirstName(fullName, email),
    avatarUrl,
    profileEmoji,
    initials: getInitials(fullName, email),
  };
}
