

-- ---------- 1. PROFILES ----------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role_title text default 'Member',          
  department text,
  batch_session text,                      
  student_id text,
  bio text,
  avatar_url text,
  email_public text,                          
  phone_public text,
  github_url text,
  linkedin_url text,
  facebook_url text,
  skills text[],                              
  achievements text,                          
  is_admin boolean not null default false,
  is_active boolean not null default true,   
  joined_at date default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Public member directory profiles, one per authenticated club member.';

-- ---------- 2. APPLICATIONS ----------


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


-- ROW LEVEL SECURITY


alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.notices enable row level security;

-- ---- profiles ----


create policy "Public can view active profiles"
on public.profiles for select
using (is_active = true);


create policy "Members can view their own profile"
on public.profiles for select
using (auth.uid() = id);


create policy "Members can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id and is_admin = (select is_admin from public.profiles where id = auth.uid()));

.
create policy "Admins can update any profile"
on public.profiles for update
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- ---- applications ----


create policy "Anyone can submit an application"
on public.applications for insert
with check (true);



create policy "Public can check accepted applications by email"
on public.applications for select
using (status = 'accepted');


create policy "Admins can view applications"
on public.applications for select
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));


create policy "Admins can update applications"
on public.applications for update
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));


create policy "Anyone can view notices"
on public.notices for select
using (true);


create policy "Admins can create notices"
on public.notices for insert
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

create policy "Admins can update notices"
on public.notices for update
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));


create policy "Admins can delete notices"
on public.notices for delete
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));


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

-- or find your row by full_name and set is_admin = true there.
-- ============================================================
