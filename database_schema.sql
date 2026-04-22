-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles (Extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('admin', 'student')) default 'student',
  full_name text not null,
  student_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Security Definer function to check admin role while bypassing RLS (prevents infinite recursion)
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer 
set search_path = public
as $$
begin
  return exists (
    select 1 
    from public.profiles 
    where id = auth.uid() and role = 'admin'
  );
end;
$$;

-- Drop existing policies before recreating (safe re-run)
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Admin can view all profiles
create policy "Admins can view all profiles" on public.profiles for select using (
  public.is_admin()
);
-- Users can view their own profile
create policy "Users can view own profile" on public.profiles for select using (
  auth.uid() = id
);
-- Users can update their own profile
create policy "Users can update own profile" on public.profiles for update using (
  auth.uid() = id
);

-- Trigger: auto-create profile on signup, reading role from metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Events
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date timestamp with time zone not null,
  location text not null,
  created_by uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for events
alter table public.events enable row level security;

drop policy if exists "Anyone can view events" on public.events;
drop policy if exists "Admins can manage events" on public.events;

-- Anyone can view events
create policy "Anyone can view events" on public.events for select using (true);
-- Only admins can insert/update/delete events
create policy "Admins can manage events" on public.events for all using (
  public.is_admin()
);

-- 3. Registrations
create table if not exists public.registrations (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  qr_code_data text unique not null,
  status text check (status in ('registered', 'cancelled')) default 'registered',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(event_id, student_id)
);

-- Enable RLS for registrations
alter table public.registrations enable row level security;

drop policy if exists "Admins can view all registrations" on public.registrations;
drop policy if exists "Students can view own registrations" on public.registrations;
drop policy if exists "Students can create own registrations" on public.registrations;
drop policy if exists "Students can update own registrations" on public.registrations;

-- Admins can view all registrations
create policy "Admins can view all registrations" on public.registrations for select using (
  public.is_admin()
);
-- Students can view and create their own registrations
create policy "Students can view own registrations" on public.registrations for select using (
  auth.uid() = student_id
);
create policy "Students can create own registrations" on public.registrations for insert with check (
  auth.uid() = student_id
);
create policy "Students can update own registrations" on public.registrations for update using (
  auth.uid() = student_id
);

-- 4. Attendance
create table if not exists public.attendance (
  id uuid default uuid_generate_v4() primary key,
  registration_id uuid references public.registrations(id) on delete cascade unique not null,
  status text check (status in ('present')) default 'present',
  scanned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  scanned_by uuid references public.profiles(id) not null
);

-- Enable RLS for attendance
alter table public.attendance enable row level security;

drop policy if exists "Admins can manage attendance" on public.attendance;
drop policy if exists "Students can view own attendance" on public.attendance;

-- Admin can view and insert attendance
create policy "Admins can manage attendance" on public.attendance for all using (
  public.is_admin()
);
-- Students can view their own attendance through registration
create policy "Students can view own attendance" on public.attendance for select using (
  auth.uid() IN (SELECT student_id FROM public.registrations WHERE id = registration_id)
);

-- 5. Announcements
create table if not exists public.announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references public.profiles(id) not null
);

-- Enable RLS for announcements
alter table public.announcements enable row level security;

drop policy if exists "Anyone can view announcements" on public.announcements;
drop policy if exists "Admins can manage announcements" on public.announcements;

-- Anyone can view announcements
create policy "Anyone can view announcements" on public.announcements for select using (true);
-- Only admins can manage announcements
create policy "Admins can manage announcements" on public.announcements for all using (
  public.is_admin()
);
