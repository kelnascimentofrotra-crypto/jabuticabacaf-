-- =====================================================================
-- Relatórios do painel (migração 4): contagem anônima de visitas e cliques
-- O site registra, sem nenhum dado pessoal: visitas (1 por sessão do
-- navegador), imóveis vistos (1 por imóvel por sessão) e cliques no
-- WhatsApp. Não guarda nome, e-mail, IP nem cookies.
-- Só administradores leem os números. Pode ser rodada de novo.
-- =====================================================================

create table if not exists public.eventos (
  id         bigint generated always as identity primary key,
  tipo       text not null check (tipo in ('visita', 'imovel', 'whatsapp')),
  imovel     text check (imovel is null or (char_length(imovel) between 1 and 80 and imovel ~ '^[a-z0-9]+(-[a-z0-9]+)*$')),
  created_at timestamptz not null default now()
);
create index if not exists eventos_created_at_idx on public.eventos (created_at);

-- a data é sempre a do servidor; se chegar uma enxurrada (robô), o excesso é descartado sem erro
create or replace function public.eventos_antes_de_gravar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.eventos where created_at > now() - interval '1 minute') >= 300 then
    return null;
  end if;
  new.created_at := now();
  return new;
end;
$$;
drop trigger if exists eventos_antes_de_gravar on public.eventos;
create trigger eventos_antes_de_gravar before insert on public.eventos
  for each row execute function public.eventos_antes_de_gravar();

alter table public.eventos enable row level security;

drop policy if exists "eventos: qualquer um registra" on public.eventos;
create policy "eventos: qualquer um registra" on public.eventos
  for insert to anon, authenticated with check (true);
drop policy if exists "eventos: admin le" on public.eventos;
create policy "eventos: admin le" on public.eventos
  for select to authenticated using (public.is_admin());

grant insert on public.eventos to anon, authenticated;
grant select on public.eventos to authenticated;

-- relatório de um período: totais, período anterior (mesmo tamanho), série para o gráfico
-- (por hora até 2 dias, por dia até 180 dias, por semana depois disso) e ranking dos imóveis.
-- p_inicio nulo = desde o primeiro registro ("Tempo todo"). p_fuso = fuso de quem está vendo.
create or replace function public.admin_relatorio(
  p_inicio timestamptz,
  p_fim timestamptz,
  p_fuso text default 'America/Sao_Paulo'
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  fuso     text := coalesce(nullif(p_fuso, ''), 'America/Sao_Paulo');
  v_fim    timestamptz := coalesce(p_fim, now());
  v_inicio timestamptz := p_inicio;
  passo    text;
  anterior jsonb;
  resultado jsonb;
begin
  if not public.is_admin() then
    raise exception 'Sem permissão' using errcode = '42501';
  end if;
  if not exists (select 1 from pg_timezone_names where name = fuso) then
    fuso := 'America/Sao_Paulo';
  end if;
  if v_inicio is null then
    select coalesce(min(created_at), v_fim) into v_inicio from public.eventos;
    v_inicio := date_trunc('day', v_inicio at time zone fuso) at time zone fuso;
  end if;
  if v_fim <= v_inicio then
    v_fim := v_inicio + interval '1 hour';
  end if;
  passo := case
    when v_fim - v_inicio <= interval '2 days' then 'hour'
    when v_fim - v_inicio <= interval '180 days' then 'day'
    else 'week'
  end;

  if p_inicio is not null then
    select jsonb_build_object(
      'visitas',  count(*) filter (where tipo = 'visita'),
      'imoveis',  count(*) filter (where tipo = 'imovel'),
      'whatsapp', count(*) filter (where tipo = 'whatsapp'),
      'avaliacoes', (select count(*) from public.avaliacoes a
                     where a.created_at >= v_inicio - (v_fim - v_inicio) and a.created_at < v_inicio)
    ) into anterior
    from public.eventos
    where created_at >= v_inicio - (v_fim - v_inicio) and created_at < v_inicio;
  end if;

  with ev as (
    select tipo, imovel, date_trunc(passo, created_at at time zone fuso) as balde
    from public.eventos
    where created_at >= v_inicio and created_at < v_fim
  ),
  baldes as (
    select generate_series(
      date_trunc(passo, v_inicio at time zone fuso),
      date_trunc(passo, (v_fim - interval '1 second') at time zone fuso),
      ('1 ' || passo)::interval
    ) as balde
  ),
  serie as (
    select b.balde,
           count(e.tipo) filter (where e.tipo = 'visita')   as v,
           count(e.tipo) filter (where e.tipo = 'whatsapp') as w
    from baldes b
    left join ev e on e.balde = b.balde
    group by b.balde
  ),
  ranking as (
    select imovel,
           count(*) filter (where tipo = 'imovel')   as v,
           count(*) filter (where tipo = 'whatsapp') as w
    from ev
    where imovel is not null
    group by imovel
    order by 2 desc, 3 desc
    limit 50
  )
  select jsonb_build_object(
    'inicio', v_inicio,
    'fim', v_fim,
    'passo', passo,
    'totais', jsonb_build_object(
      'visitas',  (select count(*) from ev where tipo = 'visita'),
      'imoveis',  (select count(*) from ev where tipo = 'imovel'),
      'whatsapp', (select count(*) from ev where tipo = 'whatsapp'),
      'avaliacoes', (select count(*) from public.avaliacoes a
                     where a.created_at >= v_inicio and a.created_at < v_fim)
    ),
    'anterior', anterior,
    'serie', coalesce((select jsonb_agg(jsonb_build_array(to_char(balde, 'YYYY-MM-DD"T"HH24:MI'), v, w) order by balde) from serie), '[]'::jsonb),
    'imoveis', coalesce((
      select jsonb_agg(jsonb_build_object(
               'slug', r.imovel,
               'titulo', coalesce(i.titulo, r.imovel),
               'existe', i.id is not null,
               'visualizacoes', r.v,
               'whatsapp', r.w
             ) order by r.v desc, r.w desc)
      from ranking r
      left join public.imoveis i on i.slug = r.imovel
    ), '[]'::jsonb)
  ) into resultado;

  return resultado;
end;
$$;

revoke all on function public.admin_relatorio(timestamptz, timestamptz, text) from public, anon;
grant execute on function public.admin_relatorio(timestamptz, timestamptz, text) to authenticated;
