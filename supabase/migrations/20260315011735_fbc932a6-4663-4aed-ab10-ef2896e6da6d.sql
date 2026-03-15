
insert into storage.buckets (id, name, public)
values ('store-videos', 'store-videos', true);

create policy "Users can upload store videos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'store-videos');

create policy "Users can view store videos"
  on storage.objects for select to authenticated
  using (bucket_id = 'store-videos');

create policy "Users can delete their store videos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'store-videos');

create policy "Public can view store videos"
  on storage.objects for select to anon
  using (bucket_id = 'store-videos');
