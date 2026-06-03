-- Run this in Supabase SQL Editor if Plan My Day fails with database errors

create policy "Users insert own profile"
  on users for insert
  with check (auth.uid() = id);
