
create table public.store_videos (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  video_type text not null,
  video_url text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.store_videos enable row level security;

create policy "Users can view their store videos"
  on public.store_videos for select to authenticated
  using (store_id in (select id from public.stores where owner_id = auth.uid()));

create policy "Users can insert their store videos"
  on public.store_videos for insert to authenticated
  with check (store_id in (select id from public.stores where owner_id = auth.uid()));

create policy "Users can update their store videos"
  on public.store_videos for update to authenticated
  using (store_id in (select id from public.stores where owner_id = auth.uid()));

create policy "Users can delete their store videos"
  on public.store_videos for delete to authenticated
  using (store_id in (select id from public.stores where owner_id = auth.uid()));

create trigger set_store_videos_updated_at
  before update on public.store_videos
  for each row execute function public.handle_updated_at();
