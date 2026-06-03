-- DayStack schema — run in Supabase SQL Editor

create table users (
  id uuid references auth.users primary key,
  email text,
  streak integer default 0,
  last_active date,
  created_at timestamp default now()
);

create table day_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  date date not null,
  raw_dump text,
  ai_plan jsonb,
  tasks jsonb,
  completed_tasks jsonb default '[]',
  review jsonb,
  created_at timestamp default now(),
  unique(user_id, date)
);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table users enable row level security;
alter table day_entries enable row level security;

create policy "Users read own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on users for update
  using (auth.uid() = id);

create policy "Users insert own profile"
  on users for insert
  with check (auth.uid() = id);

create policy "Users read own entries"
  on day_entries for select
  using (auth.uid() = user_id);

create policy "Users insert own entries"
  on day_entries for insert
  with check (auth.uid() = user_id);

create policy "Users update own entries"
  on day_entries for update
  using (auth.uid() = user_id);
