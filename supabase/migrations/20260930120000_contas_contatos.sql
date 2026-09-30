-- =====================================================================
-- Morada · migração 2
-- Mensagens do formulário, contas de clientes (perfil, favoritos,
-- carrinho e pedidos) e números editáveis da apresentação.
-- Só acrescenta: não apaga imóveis, usuários nem configurações.
-- Pode ser rodada de novo sem problema.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Configurações: números da apresentação e login com Google
-- ---------------------------------------------------------------------
alter table public.configuracoes add column if not exists familias_atendidas integer;
alter table public.configuracoes add column if not exists anos_mercado integer;
alter table public.configuracoes add column if not exists login_google boolean not null default false;

-- ---------------------------------------------------------------------
-- Mensagens do site (formulário de contato e pedidos do carrinho)
-- Qualquer visitante pode ENVIAR; só o admin lê, marca e apaga.
-- ---------------------------------------------------------------------
create table if not exists public.contatos (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null check (char_length(nome) between 2 and 80),
  email      text not null default '' check (char_length(email) <= 120 and (email = '' or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  telefone   text not null default '' check (char_length(telefone) <= 30),
  mensagem   text not null default '' check (char_length(mensagem) <= 2000),
  imovel     text check (imovel is null or char_length(imovel) <= 80),
  origem     text not null default 'formulario' check (origem in ('formulario', 'carrinho')),
  lido       boolean not null default false,
  user_id    uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  check (email <> '' or telefone <> '')
);

create index if not exists contatos_created_idx on public.contatos (created_at desc);
create index if not exists contatos_nao_lidos_idx on public.contatos (created_at desc) where not lido;

-- anti-abuso: no máximo 3 mensagens do mesmo e-mail em 10 minutos e 20 por minuto no total;
-- quem envia não escolhe "lido", data nem de quem é a mensagem
create or replace function public.contatos_antes_de_gravar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email <> '' and (
    select count(*) from public.contatos
    where lower(email) = lower(new.email) and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'Muitas mensagens seguidas. Tente de novo em alguns minutos.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.contatos where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'Muitas mensagens seguidas. Tente de novo em alguns minutos.' using errcode = 'P0001';
  end if;
  new.lido := false;
  new.created_at := now();
  new.user_id := auth.uid();
  return new;
end;
$$;

drop trigger if exists contatos_antes_de_gravar on public.contatos;
create trigger contatos_antes_de_gravar before insert on public.contatos
  for each row execute function public.contatos_antes_de_gravar();

alter table public.contatos enable row level security;

drop policy if exists "contatos: qualquer um envia" on public.contatos;
create policy "contatos: qualquer um envia" on public.contatos
  for insert to anon, authenticated with check (true);
drop policy if exists "contatos: admin le" on public.contatos;
create policy "contatos: admin le" on public.contatos
  for select to authenticated using (public.is_admin());
drop policy if exists "contatos: admin marca" on public.contatos;
create policy "contatos: admin marca" on public.contatos
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "contatos: admin apaga" on public.contatos;
create policy "contatos: admin apaga" on public.contatos
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------
-- Contas de clientes
-- ---------------------------------------------------------------------
create table if not exists public.perfis (
  id         uuid primary key references auth.users (id) on delete cascade,
  nome       text not null default '' check (char_length(nome) <= 80),
  telefone   text not null default '' check (char_length(telefone) <= 30),
  foto       text check (foto is null or char_length(foto) <= 500),  -- caminho no bucket "perfis" (ou URL da foto do Google)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists perfis_updated_at on public.perfis;
create trigger perfis_updated_at before update on public.perfis
  for each row execute function public.tocar_updated_at();

-- cria o perfil sozinho quando alguém cria conta (e-mail/senha ou Google)
create or replace function public.criar_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfis (id, nome, foto)
  values (
    new.id,
    left(coalesce(nullif(new.raw_user_meta_data ->> 'nome', ''), nullif(new.raw_user_meta_data ->> 'full_name', ''), nullif(new.raw_user_meta_data ->> 'name', ''), ''), 80),
    left(nullif(new.raw_user_meta_data ->> 'avatar_url', ''), 500)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists morada_criar_perfil on auth.users;
create trigger morada_criar_perfil after insert on auth.users
  for each row execute function public.criar_perfil();

-- contas que já existiam (ex.: administradores) também ganham perfil
insert into public.perfis (id, nome)
select id, left(coalesce(raw_user_meta_data ->> 'nome', ''), 80) from auth.users
on conflict (id) do nothing;

create table if not exists public.favoritos (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  item       text not null check (char_length(item) between 1 and 90),
  created_at timestamptz not null default now(),
  primary key (user_id, item)
);

create table if not exists public.carrinho (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  item       text not null check (char_length(item) between 1 and 90),
  created_at timestamptz not null default now(),
  primary key (user_id, item)
);

create table if not exists public.pedidos (
  id         uuid primary key default gen_random_uuid(),
  numero     bigint generated always as identity (start with 1001) unique,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  itens      jsonb not null check (jsonb_typeof(itens) = 'array' and jsonb_array_length(itens) between 1 and 50),
  created_at timestamptz not null default now()
);
create index if not exists pedidos_user_idx on public.pedidos (user_id, created_at desc);

alter table public.perfis    enable row level security;
alter table public.favoritos enable row level security;
alter table public.carrinho  enable row level security;
alter table public.pedidos   enable row level security;

drop policy if exists "perfis: dono le" on public.perfis;
create policy "perfis: dono le" on public.perfis
  for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "perfis: dono cria" on public.perfis;
create policy "perfis: dono cria" on public.perfis
  for insert to authenticated with check (id = auth.uid());
drop policy if exists "perfis: dono edita" on public.perfis;
create policy "perfis: dono edita" on public.perfis
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "favoritos: so do dono" on public.favoritos;
create policy "favoritos: so do dono" on public.favoritos
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "carrinho: so do dono" on public.carrinho;
create policy "carrinho: so do dono" on public.carrinho
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "pedidos: dono le" on public.pedidos;
create policy "pedidos: dono le" on public.pedidos
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "pedidos: dono cria" on public.pedidos;
create policy "pedidos: dono cria" on public.pedidos
  for insert to authenticated with check (user_id = auth.uid());

-- a própria pessoa pode apagar a conta (LGPD); administradores não se apagam por aqui
create or replace function public.excluir_minha_conta()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta primeiro.' using errcode = '42501';
  end if;
  if public.is_admin() then
    raise exception 'Contas de administrador não podem ser apagadas por aqui.' using errcode = '42501';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.excluir_minha_conta() from public, anon;
grant execute on function public.excluir_minha_conta() to authenticated;
revoke all on function public.criar_perfil() from public, anon, authenticated;
revoke all on function public.contatos_antes_de_gravar() from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- Permissões da API (as políticas acima decidem as linhas)
-- ---------------------------------------------------------------------
grant insert on public.contatos to anon, authenticated;
grant select, update, delete on public.contatos to authenticated;
grant select, insert, update on public.perfis to authenticated;
grant select, insert, delete on public.favoritos, public.carrinho to authenticated;
grant select, insert on public.pedidos to authenticated;
revoke select, update, delete, truncate on public.contatos from anon;
revoke all on public.perfis, public.favoritos, public.carrinho, public.pedidos from anon;

-- ---------------------------------------------------------------------
-- Storage: fotos de perfil (cada pessoa só mexe na própria pasta)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('perfis', 'perfis', true, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "perfis: dono lista a foto" on storage.objects;
create policy "perfis: dono lista a foto" on storage.objects
  for select to authenticated using (bucket_id = 'perfis' and split_part(name, '/', 1) = auth.uid()::text);
drop policy if exists "perfis: dono envia a foto" on storage.objects;
create policy "perfis: dono envia a foto" on storage.objects
  for insert to authenticated with check (bucket_id = 'perfis' and split_part(name, '/', 1) = auth.uid()::text);
drop policy if exists "perfis: dono troca a foto" on storage.objects;
create policy "perfis: dono troca a foto" on storage.objects
  for update to authenticated using (bucket_id = 'perfis' and split_part(name, '/', 1) = auth.uid()::text)
  with check (bucket_id = 'perfis' and split_part(name, '/', 1) = auth.uid()::text);
drop policy if exists "perfis: dono apaga a foto" on storage.objects;
create policy "perfis: dono apaga a foto" on storage.objects
  for delete to authenticated using (bucket_id = 'perfis' and split_part(name, '/', 1) = auth.uid()::text);
