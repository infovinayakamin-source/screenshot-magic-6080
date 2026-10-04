-- Role lookup is only ever called by trusted server code (service role).
-- Keep it out of reach of the public Data API so signed-in visitors cannot probe it.
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role) to service_role;