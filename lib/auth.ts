import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getUserProfile, type AppUser } from "@/lib/user";

export const getAuthUser = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export interface DashboardContext {
  user: AppUser;
  streak: number;
}

export const getDashboardContext = cache(async (): Promise<DashboardContext> => {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("users")
    .select("streak")
    .eq("id", user.id)
    .single();

  return {
    user: getUserProfile(user),
    streak: profile?.streak ?? 0,
  };
});
