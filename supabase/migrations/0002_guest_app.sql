-- Experiences Guest App: server-side config + storage on Supabase

create table if not exists public.tenant_configs (
  tenant_id text primary key,
  config jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.tenant_configs enable row level security;

drop policy if exists "tenant config read" on public.tenant_configs;
create policy "tenant config read"
  on public.tenant_configs
  for select
  using (true);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null references public.tenant_configs(tenant_id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists notifications_tenant_created_idx
  on public.notifications (tenant_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "notifications read" on public.notifications;
create policy "notifications read"
  on public.notifications
  for select
  using (true);

insert into storage.buckets (id, name, public)
values ('guest-assets', 'guest-assets', true)
on conflict (id) do nothing;
