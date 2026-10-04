-- ============================================================
-- Admin access: roles stored in their own table (never on a profile)
-- ============================================================

create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamp with time zone not null default now(),
  unique (user_id, role)
);

-- Grants (auth-only table: no anon access)
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Users can read their own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

-- Security-definer role lookup (avoids recursive RLS checks)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- One-time owner bootstrap: the first account may claim admin while none exists.
-- Runs only through trusted server code (service role), never from the browser.
create or replace function public.claim_admin(_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.user_roles where role = 'admin') then
    return false;
  end if;
  insert into public.user_roles (user_id, role) values (_user_id, 'admin')
    on conflict (user_id, role) do nothing;
  return true;
end $$;

revoke execute on function public.claim_admin(uuid) from public, anon, authenticated;
grant execute on function public.claim_admin(uuid) to service_role;

-- ============================================================
-- Orders: tidy status values, admin notes, fast listing
-- ============================================================

alter table public.orders
  add constraint orders_status_check
  check (status in ('created', 'paid', 'cod', 'shipped', 'cancelled', 'refunded'));

alter table public.orders add column notes text;

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);