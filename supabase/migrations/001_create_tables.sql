-- Sessions table (weekly worship sessions)
create table if not exists public.sessions (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date date not null,
  video_url text not null,
  video_type text not null check (video_type in ('youtube', 'upload')),
  created_at timestamp with time zone default now() not null
);

-- Comments table (timestamped feedback)
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null references public.sessions(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  timestamp_sec integer not null,
  author_name text not null,
  author_part text not null check (author_part in ('vocal', 'guitar', 'bass', 'drum', 'keyboard', 'etc')),
  content text not null,
  created_at timestamp with time zone default now() not null
);

-- Indexes
create index if not exists idx_comments_session_id on public.comments(session_id);
create index if not exists idx_comments_parent_id on public.comments(parent_id);

-- RLS policies (public access for MVP - no auth)
alter table public.sessions enable row level security;
alter table public.comments enable row level security;

create policy "Anyone can read sessions" on public.sessions for select using (true);
create policy "Anyone can insert sessions" on public.sessions for insert with check (true);
create policy "Anyone can read comments" on public.comments for select using (true);
create policy "Anyone can insert comments" on public.comments for insert with check (true);
