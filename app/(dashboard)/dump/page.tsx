import DumpForm from "@/components/DumpForm";
import { getDashboardContext } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  formatDisplayDate,
  getTodayDateString,
  isAfter5PM,
} from "@/lib/utils";

export default async function DumpPage() {
  const { user } = await getDashboardContext();
  const supabase = await createServerSupabaseClient();
  const today = getTodayDateString();

  const { data: entry } = await supabase
    .from("day_entries")
    .select("id")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  return (
    <DumpForm
      user={user}
      displayDate={formatDisplayDate()}
      hasEntry={!!entry}
      showReviewLink={isAfter5PM()}
    />
  );
}
