-- Multi-tenant hardening for guest app
-- Keeps existing data and adds a canonical tenant registry.

create table if not exists public.tenants (
  tenant_id text primary key check (tenant_id ~ '^[0-9]+$'),
  slug text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.tenants enable row level security;

drop policy if exists "tenants read" on public.tenants;
create policy "tenants read"
  on public.tenants
  for select
  using (is_active = true);

-- Backfill tenant registry for pre-existing configs.
insert into public.tenants (tenant_id, slug, name)
select tc.tenant_id, 'tenant-' || tc.tenant_id, coalesce(tc.config->>'name', 'Tenant ' || tc.tenant_id)
from public.tenant_configs tc
on conflict (tenant_id) do nothing;

-- Tenant config must map to a valid tenant.
alter table public.tenant_configs
  drop constraint if exists tenant_configs_tenant_id_fkey;

alter table public.tenant_configs
  add constraint tenant_configs_tenant_id_fkey
  foreign key (tenant_id)
  references public.tenants(tenant_id)
  on delete cascade;

-- Notifications also map to canonical tenant table.
alter table public.notifications
  drop constraint if exists notifications_tenant_id_fkey;

alter table public.notifications
  add constraint notifications_tenant_id_fkey
  foreign key (tenant_id)
  references public.tenants(tenant_id)
  on delete cascade;

create index if not exists tenants_slug_idx on public.tenants(slug);
