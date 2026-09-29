-- =====================================================================
-- Morada · painel administrativo
-- Tabelas, segurança (RLS) e Storage para o site público e o /admin.
-- Rode uma vez no Supabase: SQL Editor → cole este arquivo → Run.
-- Pode ser rodado de novo sem apagar dados (é idempotente).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Administradores
-- Quem está nesta tabela pode editar o site. Ninguém entra aqui pelo
-- site: o primeiro admin é incluído pelo SQL Editor (veja o README).
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- mantém updated_at em dia
create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Imóveis
-- ---------------------------------------------------------------------
create table if not exists public.imoveis (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  titulo           text not null check (char_length(titulo) between 2 and 120),
  descricao        text not null default '' check (char_length(descricao) <= 4000),
  preco            numeric(14, 2) not null check (preco >= 0),
  tipo             text not null check (tipo in ('casa', 'apartamento', 'terreno', 'comercial', 'outros')),
  finalidade       text not null check (finalidade in ('venda', 'aluguel')),
  cidade           text not null check (char_length(cidade) between 2 and 80),
  uf               text check (uf is null or uf ~ '^[A-Z]{2}$'),
  bairro           text not null default '',
  endereco         text not null default '',
  quartos          smallint check (quartos is null or quartos between 0 and 99),
  suites           smallint check (suites is null or suites between 0 and 99),
  banheiros        smallint check (banheiros is null or banheiros between 0 and 99),
  vagas            smallint check (vagas is null or vagas between 0 and 99),
  area             numeric(10, 2) check (area is null or area >= 0),
  frente           numeric(8, 2) check (frente is null or frente >= 0),   -- terrenos
  topografia       text,                                                 -- terrenos
  selos            text[] not null default '{}',                         -- etiquetas do card (ex.: Exclusivo)
  caracteristicas  text[] not null default '{}',                         -- lista da página do imóvel
  status           text not null default 'disponivel' check (status in ('disponivel', 'vendido', 'alugado')),
  destaque         boolean not null default false,
  imagem_principal text,        -- caminho no bucket "imoveis" (ou URL completa)
  ordem            integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists imoveis_created_idx  on public.imoveis (created_at desc);
create index if not exists imoveis_destaque_idx on public.imoveis (destaque) where destaque;
create index if not exists imoveis_status_idx   on public.imoveis (status);

drop trigger if exists imoveis_updated_at on public.imoveis;
create trigger imoveis_updated_at before update on public.imoveis
  for each row execute function public.tocar_updated_at();

-- Fotos de cada imóvel (a ordem define a galeria)
create table if not exists public.imovel_fotos (
  id         uuid primary key default gen_random_uuid(),
  imovel_id  uuid not null references public.imoveis (id) on delete cascade,
  caminho    text not null,   -- caminho no bucket "imoveis" (ou URL completa)
  ordem      integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists imovel_fotos_imovel_idx on public.imovel_fotos (imovel_id, ordem);

-- ---------------------------------------------------------------------
-- Avaliações
-- ---------------------------------------------------------------------
create table if not exists public.avaliacoes (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null check (char_length(nome) between 2 and 80),
  texto      text not null check (char_length(texto) between 2 and 600),
  nota       smallint not null default 5 check (nota between 1 and 5),
  subtitulo  text not null default '',   -- ex.: "Casa Mirante · Ilhabela"
  foto       text,                        -- caminho no bucket "site" (opcional)
  publicado  boolean not null default true,
  ordem      integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists avaliacoes_publicado_idx on public.avaliacoes (publicado, ordem);

drop trigger if exists avaliacoes_updated_at on public.avaliacoes;
create trigger avaliacoes_updated_at before update on public.avaliacoes
  for each row execute function public.tocar_updated_at();

-- ---------------------------------------------------------------------
-- Configurações do site (uma linha só, id = 1)
-- ---------------------------------------------------------------------
create table if not exists public.configuracoes (
  id               smallint primary key default 1 check (id = 1),
  nome_imobiliaria text not null default 'Morada',
  whatsapp         text not null default '' check (whatsapp ~ '^[0-9]{0,15}$'),  -- só dígitos, com DDI e DDD
  instagram        text not null default '',    -- @perfil
  telefone         text not null default '',
  email            text not null default '',
  endereco         text not null default '',
  logo             text,                         -- caminho no bucket "site"
  updated_at       timestamptz not null default now()
);

insert into public.configuracoes (id) values (1) on conflict (id) do nothing;

drop trigger if exists configuracoes_updated_at on public.configuracoes;
create trigger configuracoes_updated_at before update on public.configuracoes
  for each row execute function public.tocar_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- Visitante: só lê o que é público. Admin: lê e altera tudo.
-- ---------------------------------------------------------------------
alter table public.admins        enable row level security;
alter table public.imoveis       enable row level security;
alter table public.imovel_fotos  enable row level security;
alter table public.avaliacoes    enable row level security;
alter table public.configuracoes enable row level security;

-- admins: cada usuário só enxerga a própria linha (para o painel saber se é admin)
drop policy if exists "admins: ver a propria linha" on public.admins;
create policy "admins: ver a propria linha" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- imoveis
drop policy if exists "imoveis: leitura publica" on public.imoveis;
create policy "imoveis: leitura publica" on public.imoveis
  for select to anon, authenticated using (true);
drop policy if exists "imoveis: admin cria" on public.imoveis;
create policy "imoveis: admin cria" on public.imoveis
  for insert to authenticated with check (public.is_admin());
drop policy if exists "imoveis: admin edita" on public.imoveis;
create policy "imoveis: admin edita" on public.imoveis
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "imoveis: admin exclui" on public.imoveis;
create policy "imoveis: admin exclui" on public.imoveis
  for delete to authenticated using (public.is_admin());

-- imovel_fotos
drop policy if exists "fotos: leitura publica" on public.imovel_fotos;
create policy "fotos: leitura publica" on public.imovel_fotos
  for select to anon, authenticated using (true);
drop policy if exists "fotos: admin cria" on public.imovel_fotos;
create policy "fotos: admin cria" on public.imovel_fotos
  for insert to authenticated with check (public.is_admin());
drop policy if exists "fotos: admin edita" on public.imovel_fotos;
create policy "fotos: admin edita" on public.imovel_fotos
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "fotos: admin exclui" on public.imovel_fotos;
create policy "fotos: admin exclui" on public.imovel_fotos
  for delete to authenticated using (public.is_admin());

-- avaliacoes: o público só vê as publicadas
drop policy if exists "avaliacoes: leitura publica" on public.avaliacoes;
create policy "avaliacoes: leitura publica" on public.avaliacoes
  for select to anon, authenticated using (publicado or public.is_admin());
drop policy if exists "avaliacoes: admin cria" on public.avaliacoes;
create policy "avaliacoes: admin cria" on public.avaliacoes
  for insert to authenticated with check (public.is_admin());
drop policy if exists "avaliacoes: admin edita" on public.avaliacoes;
create policy "avaliacoes: admin edita" on public.avaliacoes
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "avaliacoes: admin exclui" on public.avaliacoes;
create policy "avaliacoes: admin exclui" on public.avaliacoes
  for delete to authenticated using (public.is_admin());

-- configuracoes
drop policy if exists "config: leitura publica" on public.configuracoes;
create policy "config: leitura publica" on public.configuracoes
  for select to anon, authenticated using (true);
drop policy if exists "config: admin edita" on public.configuracoes;
create policy "config: admin edita" on public.configuracoes
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Defesa extra: o papel anônimo não tem permissão de escrita nenhuma.
revoke insert, update, delete, truncate on public.imoveis, public.imovel_fotos, public.avaliacoes,
  public.configuracoes, public.admins from anon;
-- Ninguém entra na tabela de admins pela API.
revoke insert, update, delete, truncate on public.admins from authenticated;

-- ---------------------------------------------------------------------
-- Storage: fotos dos imóveis e arquivos do site (logo, fotos de avaliação)
-- Buckets públicos: qualquer um abre a foto pelo link público, sem precisar
-- de política de leitura. Listar, enviar, trocar e apagar: só admin.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('imoveis', 'imoveis', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('site',    'site',    true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "storage: leitura publica morada" on storage.objects;
drop policy if exists "storage: admin lista" on storage.objects;
create policy "storage: admin lista" on storage.objects
  for select to authenticated using (bucket_id in ('imoveis', 'site') and public.is_admin());
drop policy if exists "storage: admin envia" on storage.objects;
create policy "storage: admin envia" on storage.objects
  for insert to authenticated with check (bucket_id in ('imoveis', 'site') and public.is_admin());
drop policy if exists "storage: admin troca" on storage.objects;
create policy "storage: admin troca" on storage.objects
  for update to authenticated using (bucket_id in ('imoveis', 'site') and public.is_admin())
  with check (bucket_id in ('imoveis', 'site') and public.is_admin());
drop policy if exists "storage: admin apaga" on storage.objects;
create policy "storage: admin apaga" on storage.objects
  for delete to authenticated using (bucket_id in ('imoveis', 'site') and public.is_admin());
