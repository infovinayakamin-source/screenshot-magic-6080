create policy "Admins manage product images" on storage.objects for all to authenticated
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins read inventory history" on public.inventory_history for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
grant select on public.inventory_history to authenticated;