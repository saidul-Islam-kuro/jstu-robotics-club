-- ============================================================
-- JSTU Robotics Club — Database Schema
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste all -> Run)
-- ============================================================

-- ---------- 1. PROFILES ----------
-- One row per member, linked 1:1 to Supabase Auth users.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role_title text default 'Member',          -- e.g. "President", "Hardware Lead", "Member"
  department text,
  batch_session text,                         -- e.g. "2022-23"
  student_id text,
  bio text,
  avatar_url text,
  email_public text,                          -- optional public contact email (can differ from login email)
  phone_public text,
  github_url text,
  linkedin_url text,
  facebook_url text,
  skills text[],                              -- e.g. {"ROS","Embedded C","CAD"}
  achievements text,                          -- free text, one per line in the UI
  is_admin boolean not null default false,
  is_active boolean not null default true,    -- lets you hide alumni/inactive members from the directory without deleting them
  joined_at date default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Public member directory profiles, one per authenticated club member.';

-- ---------- 2. APPLICATIONS ----------
-- Membership applications submitted from the public "Join" page. No login required to apply.
-- Using an enum gives Supabase's Table Editor a proper dropdown selector for status.
create type public.application_status as enum ('pending', 'accepted', 'rejected');

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  student_id text,
  department text not null,
  batch_session text,
  email text not null,
  phone text,
  why_join text,
  skills_interest text,
  status public.application_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

comment on table public.applications is 'Membership applications from the public join form.';

-- ---------- 3. NOTICES ----------
-- Club announcements / notice board.
create table public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  pinned boolean not null default false,
  author_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

comment on table public.notices is 'Public notice board / announcements.';

-- ---------- 4. updated_at trigger for profiles ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ---------- 5. Auto-create a profile row when someone signs up ----------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'New Member'));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.notices enable row level security;

-- ---- profiles ----

-- Anyone (including logged-out visitors) can view active member profiles.
create policy "Public can view active profiles"
on public.profiles for select
using (is_active = true);

-- A member can always view their own profile even if deactivated.
create policy "Members can view their own profile"
on public.profiles for select
using (auth.uid() = id);

-- A member can update only their own profile, and cannot grant themselves admin.
create policy "Members can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id and is_admin = (select is_admin from public.profiles where id = auth.uid()));

-- Admins can update any profile (e.g. to promote/deactivate members).
create policy "Admins can update any profile"
on public.profiles for update
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- ---- applications ----

-- Anyone can submit an application (no login required).
create policy "Anyone can submit an application"
on public.applications for insert
with check (true);

-- Public can verify whether an email has an accepted membership application.
-- This allows the website to gate signups to accepted applicants without exposing rejected/pending records.
create policy "Public can check accepted applications by email"
on public.applications for select
using (status = 'accepted');

-- Only admins can view all applications.
create policy "Admins can view applications"
on public.applications for select
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- Only admins can update application status.
create policy "Admins can update applications"
on public.applications for update
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- ---- notices ----

-- Anyone can read notices (public notice board).
create policy "Anyone can view notices"
on public.notices for select
using (true);

-- Only admins can create notices.
create policy "Admins can create notices"
on public.notices for insert
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- Only admins can edit notices.
create policy "Admins can update notices"
on public.notices for update
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- Only admins can delete notices.
create policy "Admins can delete notices"
on public.notices for delete
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- ============================================================
-- STORAGE (avatar uploads)
-- Run this part too — creates a public bucket for profile photos.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible"
on storage.objects for select
using (bucket_id = 'avatars');

create policy "Members can upload their own avatar"
on storage.objects for insert
with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Members can update their own avatar"
on storage.objects for update
using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- Done. Next: make your first admin after you sign up once
-- through the website, by running in SQL Editor:
--
--   update public.profiles set is_admin = true where email_public = 'your-email@example.com';
--
-- or find your row by full_name and set is_admin = true there.
-- ============================================================
