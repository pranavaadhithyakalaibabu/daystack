"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/Toast";
import {
  DEFAULT_PROFILE_EMOJI,
  getProfileEmojiMeta,
  PROFILE_EMOJIS,
} from "@/lib/profile-emojis";

interface ProfileEmojiPickerProps {
  currentEmoji: string;
}

export default function ProfileEmojiPicker({
  currentEmoji,
}: ProfileEmojiPickerProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [selected, setSelected] = useState(currentEmoji || DEFAULT_PROFILE_EMOJI);
  const [saving, setSaving] = useState(false);

  async function handleSelect(emoji: string) {
    if (emoji === selected || saving) return;
    setSelected(emoji);
    setSaving(true);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      data: { profile_emoji: emoji },
    });

    setSaving(false);

    if (error) {
      setSelected(currentEmoji);
      showToast("Something went wrong. Try again.");
      return;
    }

    router.refresh();
  }

  const meta = getProfileEmojiMeta(selected);

  return (
    <section className="mt-10">
      <h2 className="section-title mb-1">Badge</h2>
      <p className="section-label mb-4">Shown on your profile and greetings</p>

      <div className="card p-5">
        <div className="mb-5 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary text-2xl">
            {selected}
          </span>
          <div>
            <p className="font-body text-[17px] font-medium text-text">
              {meta.label}
            </p>
            <p className="font-body text-[13px] text-text-secondary">
              {meta.mood}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {PROFILE_EMOJIS.map((item) => {
            const active = selected === item.emoji;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.emoji)}
                disabled={saving}
                aria-label={`${item.label} — ${item.mood}`}
                aria-pressed={active}
                className={`flex flex-col items-center gap-1 rounded-apple py-2.5 transition-colors ${
                  active
                    ? "bg-brand/10 ring-2 ring-brand"
                    : "bg-surface-secondary hover:bg-bg-subtle"
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
