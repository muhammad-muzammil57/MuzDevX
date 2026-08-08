-- ============================================================
-- Supabase schema for the personal digital hub website.
-- Run this in Supabase Dashboard → SQL Editor (or `supabase db push`).
-- After running, update src/lib/db.ts to query these tables instead
-- of the sample data in src/data/sample-data.ts.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- PROJECTS ----------
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  short_description text not null,
  description text not null,
  purpose text,
  category text not null check (category in
    ('Website','Software','Chrome Extension','AI Tool','Landing Page','Experiment','Open Source')),
  technologies text[] default '{}',
  features text[] default '{}',
  website_url text,
  github_url text,
  cover_image text,
  featured boolean default false,
  status text default 'Live' check (status in ('Live','In Progress','Archived')),
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- BLOG ----------
create table if not exists blogs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image text,
  author text,
  category text,
  tags text[] default '{}',
  reading_time text,
  featured boolean default false,
  status text default 'draft' check (status in ('draft','published')),
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- NEWS ----------
create table if not exists news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  image text,
  category text,
  source_name text,
  source_url text,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- CONTACT MESSAGES (support page form) ----------
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz default now()
);

-- ---------- CHAT LOGS (optional, for the "Chat Logs" admin section) ----------
create table if not exists chat_conversations (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now()
);

create table if not exists chat_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references chat_conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- ---------- SITE SETTINGS ----------
create table if not exists site_settings (
  key text primary key,
  value jsonb not null
);

-- ============================================================
-- Row Level Security
-- Public (anon) visitors: read-only access to published content.
-- Writes only allowed for authenticated admin users via the
-- service-role key on the server (API routes / admin panel).
-- ============================================================

alter table projects enable row level security;
alter table blogs enable row level security;
alter table news enable row level security;
alter table contact_messages enable row level security;
alter table chat_conversations enable row level security;
alter table chat_messages enable row level security;

create policy "Public can read published projects"
  on projects for select using (published = true);

create policy "Public can read published blogs"
  on blogs for select using (status = 'published');

create policy "Public can read news"
  on news for select using (true);

-- Only the service role (server-side, never exposed to the browser) can
-- insert/update/delete — no public write policies are created here.
-- Admin writes should go through API routes that use getServiceClient()
-- from src/lib/supabase.ts.

create policy "Anyone can submit a contact message"
  on contact_messages for insert with check (true);

-- ---------- Indexes ----------
create index if not exists idx_projects_slug on projects(slug);
create index if not exists idx_projects_category on projects(category);
create index if not exists idx_blogs_slug on blogs(slug);
create index if not exists idx_news_slug on news(slug);

-- ============================================================
-- Storage — 'media' bucket for cover images uploaded from the
-- admin panel (projects, blog posts, news). Public read, writes
-- restricted to signed-in (admin) users.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public can view media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Authenticated users can upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "Authenticated users can update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

create policy "Authenticated users can delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
