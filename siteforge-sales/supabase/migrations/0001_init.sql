-- SiteForge Sales — esquema inicial (Supabase / PostgreSQL)
-- Rode no SQL Editor do Supabase ou com `supabase db push`.
--
-- Modelo:
--   profiles          perfil e papel (admin | vendedor) de cada usuário
--   content_items     camada editável do conteúdo comercial (objeções, nichos, serviços…)
--   favorites, history, custom_responses, proposals, followup_plans, training_attempts
--                     dados privados de cada usuário (RLS por dono)
--   usage_events      eventos reais de uso para estatísticas (somente admins leem)

-- ---------------------------------------------------------------------------
-- Perfis e papéis
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  nome text not null default '' check (char_length(nome) <= 120),
  role text not null default 'vendedor' check (role in ('admin', 'vendedor')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- SECURITY DEFINER evita recursão nas políticas que consultam a própria tabela.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nome)
  values (
    new.id,
    coalesce(new.email, ''),
    left(coalesce(nullif(new.raw_user_meta_data ->> 'nome', ''), split_part(coalesce(new.email, ''), '@', 1)), 120)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Usuários comuns só podem alterar o próprio nome. Papel só muda por admin
-- (ou pelo SQL Editor / service role, onde auth.uid() é nulo).
create or replace function public.protect_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.role is distinct from old.role then
      raise exception 'Apenas administradores podem alterar permissões.' using errcode = '42501';
    end if;
    if new.email is distinct from old.email or new.id is distinct from old.id then
      raise exception 'Campo protegido.' using errcode = '42501';
    end if;
  end if;
  if old.role = 'admin' and new.role <> 'admin'
     and not exists (select 1 from public.profiles where role = 'admin' and id <> old.id) then
    raise exception 'É preciso manter ao menos um administrador.' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile
  before update on public.profiles
  for each row execute function public.protect_profile();

drop policy if exists "perfil: ler o próprio ou admin" on public.profiles;
create policy "perfil: ler o próprio ou admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

drop policy if exists "perfil: atualizar o próprio ou admin" on public.profiles;
create policy "perfil: atualizar o próprio ou admin" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) or public.is_admin())
  with check (id = (select auth.uid()) or public.is_admin());

-- Perfis para usuários que já existiam antes da migração.
insert into public.profiles (id, email, nome)
select u.id, coalesce(u.email, ''), split_part(coalesce(u.email, ''), '@', 1)
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Conteúdo comercial editável (camada sobre o conteúdo original do app)
-- ---------------------------------------------------------------------------

create table if not exists public.content_items (
  kind text not null check (kind in ('objection', 'niche', 'service', 'scenario', 'followup', 'prospect', 'quick')),
  id text not null check (char_length(id) between 1 and 120),
  data jsonb,
  deleted boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  primary key (kind, id),
  check (deleted or data is not null),
  check (pg_column_size(data) < 262144)
);

alter table public.content_items enable row level security;

create or replace function public.touch_content_item()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists touch_content_item on public.content_items;
create trigger touch_content_item
  before insert or update on public.content_items
  for each row execute function public.touch_content_item();

drop policy if exists "conteúdo: leitura para usuários logados" on public.content_items;
create policy "conteúdo: leitura para usuários logados" on public.content_items
  for select to authenticated using (true);

drop policy if exists "conteúdo: admins inserem" on public.content_items;
create policy "conteúdo: admins inserem" on public.content_items
  for insert to authenticated with check (public.is_admin());

drop policy if exists "conteúdo: admins atualizam" on public.content_items;
create policy "conteúdo: admins atualizam" on public.content_items
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "conteúdo: admins removem" on public.content_items;
create policy "conteúdo: admins removem" on public.content_items
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Dados privados de cada usuário (mesmo formato, RLS por dono)
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array['favorites', 'history', 'custom_responses', 'proposals', 'followup_plans', 'training_attempts'] loop
    execute format($f$
      create table if not exists public.%1$I (
        user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
        id text not null check (char_length(id) between 1 and 200),
        data jsonb not null check (pg_column_size(data) < 131072),
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        primary key (user_id, id)
      )$f$, t);
    execute format('create index if not exists %1$I on public.%2$I (user_id, updated_at desc)', t || '_user_updated_idx', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "dono: ler" on public.%I', t);
    execute format('create policy "dono: ler" on public.%I for select to authenticated using (user_id = (select auth.uid()))', t);
    execute format('drop policy if exists "dono: inserir" on public.%I', t);
    execute format('create policy "dono: inserir" on public.%I for insert to authenticated with check (user_id = (select auth.uid()))', t);
    execute format('drop policy if exists "dono: atualizar" on public.%I', t);
    execute format('create policy "dono: atualizar" on public.%I for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))', t);
    execute format('drop policy if exists "dono: remover" on public.%I', t);
    execute format('create policy "dono: remover" on public.%I for delete to authenticated using (user_id = (select auth.uid()))', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Eventos de uso (estatísticas reais)
-- ---------------------------------------------------------------------------

create table if not exists public.usage_events (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  event text not null check (event in ('view_objection', 'view_niche', 'copy', 'search', 'favorite', 'generate', 'ai_request', 'train')),
  item_kind text check (char_length(item_kind) <= 40),
  item_id text check (char_length(item_id) <= 200),
  created_at timestamptz not null default now()
);

create index if not exists usage_events_event_created_idx on public.usage_events (event, created_at desc);
create index if not exists usage_events_user_event_created_idx on public.usage_events (user_id, event, created_at desc);

alter table public.usage_events enable row level security;

-- O cliente registra o próprio uso; "ai_request" só é gravado pela Edge Function (service role).
drop policy if exists "eventos: usuário registra o próprio uso" on public.usage_events;
create policy "eventos: usuário registra o próprio uso" on public.usage_events
  for insert to authenticated
  with check (user_id = (select auth.uid()) and event <> 'ai_request');

drop policy if exists "eventos: admins leem" on public.usage_events;
create policy "eventos: admins leem" on public.usage_events
  for select to authenticated using (public.is_admin());

create or replace function public.usage_stats(p_days int default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_days int := greatest(1, least(coalesce(p_days, 30), 365));
  v_since timestamptz := now() - make_interval(days => v_days);
begin
  if not public.is_admin() then
    raise exception 'Acesso restrito a administradores.' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'periodoDias', v_days,
    'totalEventos', (select count(*) from public.usage_events where created_at >= v_since),
    'porEvento', coalesce((
      select jsonb_object_agg(event, total)
      from (select event, count(*) as total from public.usage_events where created_at >= v_since group by event) e
    ), '{}'::jsonb),
    'usuariosAtivos', (select count(distinct user_id) from public.usage_events where created_at >= v_since),
    'topObjecoes', public.top_usage_items('view_objection', v_since, 8),
    'topNichos', public.top_usage_items('view_niche', v_since, 8),
    'topCopiados', public.top_usage_items('copy', v_since, 8)
  );
end;
$$;

create or replace function public.top_usage_items(p_event text, p_since timestamptz, p_limit int)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object('itemId', item_id, 'total', total) order by total desc), '[]'::jsonb)
  from (
    select item_id, count(*) as total
    from public.usage_events
    where event = p_event and created_at >= p_since and item_id is not null
    group by item_id
    order by total desc
    limit p_limit
  ) t;
$$;

-- Ranking agregado e anônimo (sem dados pessoais) para o painel de todos os usuários.
create or replace function public.popular_items(p_kind text default 'objection', p_days int default 30, p_limit int default 8)
returns table (item_id text, total bigint)
language sql
stable
security definer
set search_path = public
as $$
  select e.item_id, count(*) as total
  from public.usage_events e
  where auth.uid() is not null
    and e.event = 'view_objection'
    and e.item_kind = p_kind
    and e.item_id is not null
    and e.created_at >= now() - make_interval(days => greatest(1, least(coalesce(p_days, 30), 365)))
  group by e.item_id
  order by total desc
  limit greatest(1, least(coalesce(p_limit, 8), 50));
$$;

revoke execute on function public.top_usage_items(text, timestamptz, int) from public;
revoke execute on function public.usage_stats(int) from public, anon;
revoke execute on function public.popular_items(text, int, int) from public, anon;
grant execute on function public.usage_stats(int) to authenticated;
grant execute on function public.popular_items(text, int, int) to authenticated;

-- ---------------------------------------------------------------------------
-- Primeiro administrador: depois de criar sua conta pelo app, rode no SQL Editor:
--   update public.profiles set role = 'admin' where email = 'voce@suaempresa.com.br';
-- ---------------------------------------------------------------------------
