import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Ensures public.users row exists (fixes FK errors on day_entries) */
export async function ensureUserProfile(
  supabase: SupabaseClient,
  user: User
): Promise<void> {
  const { error } = await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email ?? null,
    },
    { onConflict: "id", ignoreDuplicates: false }
  );

  if (error) {
    console.error("[ensureUserProfile]", error.message);
    throw new Error("User profile setup failed");
  }
}
