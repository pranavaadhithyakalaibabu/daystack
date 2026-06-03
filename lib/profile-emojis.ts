export const PROFILE_EMOJIS = [
  { id: "star", emoji: "✦", label: "Focused", mood: "Champagne clarity" },
  { id: "sun", emoji: "☀️", label: "Radiant", mood: "Morning energy" },
  { id: "bolt", emoji: "⚡", label: "Driven", mood: "Peak output" },
  { id: "moon", emoji: "🌙", label: "Calm", mood: "Steady focus" },
  { id: "fire", emoji: "🔥", label: "Streak", mood: "On a roll" },
] as const;

export type ProfileEmojiId = (typeof PROFILE_EMOJIS)[number]["id"];

export const DEFAULT_PROFILE_EMOJI = PROFILE_EMOJIS[0].emoji;

export function isValidProfileEmoji(value: unknown): value is string {
  return (
    typeof value === "string" &&
    PROFILE_EMOJIS.some((item) => item.emoji === value)
  );
}

export function getProfileEmojiMeta(emoji: string) {
  return PROFILE_EMOJIS.find((item) => item.emoji === emoji) ?? PROFILE_EMOJIS[0];
}
