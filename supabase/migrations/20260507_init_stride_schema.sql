create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  username      text unique,
  display_name  text,
  join_date     date default current_date,
  step_goal     int default 10000,
  metric        boolean default true,
  dark          boolean default true,
  palette       jsonb default '["#0F1B14","#34D399","#F5F1EA","#A8D5A2"]'::jsonb,
  start_weight  numeric,
  goal_weight   numeric,
  updated_at    timestamptz default now()
);

alter table public.profiles enable row level security;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Friends can view profiles" on public.profiles;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);
create policy "Friends can view profiles" on public.profiles
  for select using (
    auth.uid() = id or exists (
      select 1
      from public.friendships
      where status = 'accepted'
        and (
          (requester_id = auth.uid() and addressee_id = id)
          or (addressee_id = auth.uid() and requester_id = id)
        )
    )
  );

create table if not exists public.steps_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade not null,
  date       date not null,
  steps      int not null default 0,
  updated_at timestamptz default now(),
  unique (user_id, date)
);

alter table public.steps_log enable row level security;
drop policy if exists "Users manage own steps" on public.steps_log;
drop policy if exists "Friends can read steps" on public.steps_log;

create policy "Users manage own steps" on public.steps_log
  for all using (auth.uid() = user_id);
create policy "Friends can read steps" on public.steps_log
  for select using (
    auth.uid() = user_id or exists (
      select 1
      from public.friendships
      where status = 'accepted'
        and (
          (requester_id = auth.uid() and addressee_id = user_id)
          or (addressee_id = auth.uid() and requester_id = user_id)
        )
    )
  );

create table if not exists public.weight_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade not null,
  date       date not null default current_date,
  weight_kg  numeric not null,
  created_at timestamptz default now()
);

alter table public.weight_log enable row level security;
drop policy if exists "Users manage own weight" on public.weight_log;
create policy "Users manage own weight" on public.weight_log
  for all using (auth.uid() = user_id);

create table if not exists public.friendships (
  id           uuid primary key default gen_random_uuid(),
  requester_id uuid references auth.users on delete cascade not null,
  addressee_id uuid references auth.users on delete cascade not null,
  status       text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined')),
  created_at   timestamptz default now(),
  unique (requester_id, addressee_id)
);

alter table public.friendships enable row level security;
drop policy if exists "Users see their own friendships" on public.friendships;
drop policy if exists "Users send friend requests" on public.friendships;
drop policy if exists "Addressee can update friendship status" on public.friendships;
drop policy if exists "Users can delete own friendships" on public.friendships;

create policy "Users see their own friendships" on public.friendships
  for select using (auth.uid() = requester_id or auth.uid() = addressee_id);
create policy "Users send friend requests" on public.friendships
  for insert with check (auth.uid() = requester_id);
create policy "Addressee can update friendship status" on public.friendships
  for update using (auth.uid() = addressee_id);
create policy "Users can delete own friendships" on public.friendships
  for delete using (auth.uid() = requester_id or auth.uid() = addressee_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, display_name, join_date)
  values (new.id, new.raw_user_meta_data->>'display_name', current_date)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
