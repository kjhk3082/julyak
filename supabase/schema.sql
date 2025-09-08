-- Enable Row Level Security
alter database postgres set "app.settings.jwt_secret" to 'your-jwt-secret';

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Goals table
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  goal_name text not null,
  goal_amount numeric(12,2) not null,
  current_amount numeric(12,2) default 0,
  goal_period integer not null, -- in months
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  is_active boolean default true
);

-- Enable RLS on goals
alter table public.goals enable row level security;

-- Create policies for goals
create policy "Users can view their own goals." on goals
  for select using (auth.uid() = user_id);

create policy "Users can insert their own goals." on goals
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own goals." on goals
  for update using (auth.uid() = user_id);

create policy "Users can delete their own goals." on goals
  for delete using (auth.uid() = user_id);

-- Savings plans table
create table public.savings_plans (
  id uuid default gen_random_uuid() primary key,
  goal_id uuid references public.goals on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  monthly_amount numeric(10,2) not null,
  weekly_amount numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on savings_plans
alter table public.savings_plans enable row level security;

-- Create policies for savings_plans
create policy "Users can view their own savings plans." on savings_plans
  for select using (auth.uid() = user_id);

create policy "Users can insert their own savings plans." on savings_plans
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own savings plans." on savings_plans
  for update using (auth.uid() = user_id);

create policy "Users can delete their own savings plans." on savings_plans
  for delete using (auth.uid() = user_id);

-- Weekly missions table
create table public.weekly_missions (
  id uuid default gen_random_uuid() primary key,
  goal_id uuid references public.goals on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  week_number integer not null,
  mission_text text not null,
  is_completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on weekly_missions
alter table public.weekly_missions enable row level security;

-- Create policies for weekly_missions
create policy "Users can view their own weekly missions." on weekly_missions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own weekly missions." on weekly_missions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own weekly missions." on weekly_missions
  for update using (auth.uid() = user_id);

create policy "Users can delete their own weekly missions." on weekly_missions
  for delete using (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_goals_updated_at before update on goals
  for each row execute procedure update_updated_at_column();

create trigger update_savings_plans_updated_at before update on savings_plans
  for each row execute procedure update_updated_at_column();

create trigger update_weekly_missions_updated_at before update on weekly_missions
  for each row execute procedure update_updated_at_column();