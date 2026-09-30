-- =====================================================================
-- Morada · migração 3: página "Clientes" do painel
-- Consultas só para administradores: quem tem conta, último acesso,
-- favoritos e carrinhos. Mostra só e-mail e o que o cliente preencheu;
-- senha nunca (o Supabase nem guarda a senha legível).
-- Não cria nem apaga dados. Pode ser rodada de novo.
-- =====================================================================

-- clientes (contas que não são de administrador)
create or replace function public.admin_clientes()
returns table (
  id uuid,
  email text,
  nome text,
  telefone text,
  criado_em timestamptz,
  ultimo_acesso timestamptz,
  favoritos bigint,
  carrinho bigint,
  pedidos bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    u.id,
    u.email::text,
    coalesce(p.nome, ''),
    coalesce(p.telefone, ''),
    u.created_at,
    u.last_sign_in_at,
    (select count(*) from public.favoritos f where f.user_id = u.id),
    (select count(*) from public.carrinho c where c.user_id = u.id),
    (select count(*) from public.pedidos o where o.user_id = u.id)
  from auth.users u
  left join public.perfis p on p.id = u.id
  where public.is_admin()
    and not exists (select 1 from public.admins a where a.user_id = u.id)
  order by u.created_at desc
  limit 2000;
$$;

-- favoritos e carrinhos, do mais recente para o mais antigo
create or replace function public.admin_interesses()
returns table (
  tipo text,
  item text,
  email text,
  nome text,
  quando timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select * from (
    select 'favorito'::text, f.item, u.email::text, coalesce(p.nome, ''), f.created_at
    from public.favoritos f
    join auth.users u on u.id = f.user_id
    left join public.perfis p on p.id = f.user_id
    where public.is_admin()
    union all
    select 'carrinho'::text, c.item, u.email::text, coalesce(p.nome, ''), c.created_at
    from public.carrinho c
    join auth.users u on u.id = c.user_id
    left join public.perfis p on p.id = c.user_id
    where public.is_admin()
  ) t
  order by 5 desc
  limit 1000;
$$;

revoke all on function public.admin_clientes() from public, anon;
revoke all on function public.admin_interesses() from public, anon;
grant execute on function public.admin_clientes() to authenticated;
grant execute on function public.admin_interesses() to authenticated;
