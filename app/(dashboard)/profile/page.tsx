import ProfileView from "@/components/ProfileView";
import { getDashboardContext } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function ProfilePage() {
  const { user, streak } = await getDashboardContext();
  const supabase = await createServerSupabaseClient();

  const [{ data: profile }, { count }] = await Promise.all([
    supabase
      .from("users")
      .select("last_active, created_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("day_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  return (
    <ProfileView
      user={user}
      streak={streak}
      lastActive={profile?.last_active ?? null}
      memberSince={profile?.created_at ?? null}
      entriesCount={count ?? 0}
    />
  );
}
