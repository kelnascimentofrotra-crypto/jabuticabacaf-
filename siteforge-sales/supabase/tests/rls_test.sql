-- Testes de RLS e regras de permissão. Rode após stub_supabase.sql e a migração.
\set ON_ERROR_STOP on

create or replace function pg_temp.expect_error(sql text, label text) returns void language plpgsql as $$
begin
  begin
    execute sql;
  exception when others then
    raise notice 'ok (bloqueado): %', label;
    return;
  end;
  raise exception 'FALHOU: era esperado erro em "%"', label;
end $$;

create or replace function pg_temp.expect_eq(actual bigint, expected bigint, label text) returns void language plpgsql as $$
begin
  if actual is distinct from expected then
    raise exception 'FALHOU: % (esperado %, obtido %)', label, expected, actual;
  end if;
  raise notice 'ok: %', label;
end $$;

grant execute on all functions in schema pg_temp to anon, authenticated;

-- Usuários
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'ana@exemplo.com', '{"nome":"Ana"}'),
  ('00000000-0000-0000-0000-00000000000b', 'bruno@exemplo.com', '{}');

select pg_temp.expect_eq((select count(*) from public.profiles), 2, 'trigger cria perfis');
select pg_temp.expect_eq((select count(*) from public.profiles where nome = 'Ana'), 1, 'nome vem dos metadados');
select pg_temp.expect_eq((select count(*) from public.profiles where nome = 'bruno'), 1, 'nome padrão a partir do e-mail');

-- Promoção pelo SQL Editor (sem JWT) é permitida
update public.profiles set role = 'admin' where email = 'ana@exemplo.com';
select pg_temp.expect_eq((select count(*) from public.profiles where role = 'admin'), 1, 'primeiro admin promovido pelo SQL Editor');

-- ===== Bruno (vendedor) =====
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);

select pg_temp.expect_eq((select count(*) from public.profiles), 1, 'vendedor vê só o próprio perfil');
select pg_temp.expect_error($$update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000b'$$, 'vendedor não muda o próprio papel');
update public.profiles set nome = 'Bruno Silva' where id = '00000000-0000-0000-0000-00000000000b';
select pg_temp.expect_eq((select count(*) from public.profiles where nome = 'Bruno Silva'), 1, 'vendedor altera o próprio nome');
update public.profiles set nome = 'Hacker' where id = '00000000-0000-0000-0000-00000000000a';
select pg_temp.expect_eq((select count(*) from public.profiles where nome = 'Hacker'), 0, 'vendedor não altera perfil alheio (RLS filtra)');

select pg_temp.expect_error($$insert into public.content_items (kind, id, data) values ('quick', 'x', '{"id":"x"}')$$, 'vendedor não cria conteúdo');

insert into public.favorites (user_id, id, data) values ('00000000-0000-0000-0000-00000000000b', 'objection:esta-muito-caro', '{"id":"objection:esta-muito-caro"}');
select pg_temp.expect_error($$insert into public.favorites (user_id, id, data) values ('00000000-0000-0000-0000-00000000000a', 'x', '{}')$$, 'vendedor não grava dados em nome de outro usuário');
insert into public.proposals (id, data) values ('p1', '{"id":"p1"}');
select pg_temp.expect_eq((select count(*) from public.proposals where user_id = '00000000-0000-0000-0000-00000000000b'), 1, 'user_id padrão = auth.uid()');

insert into public.usage_events (event, item_kind, item_id) values ('view_objection', 'objection', 'esta-muito-caro');
insert into public.usage_events (event, item_kind, item_id) values ('view_objection', 'objection', 'esta-muito-caro');
select pg_temp.expect_error($$insert into public.usage_events (event) values ('ai_request')$$, 'cliente não registra ai_request');
select pg_temp.expect_error($$insert into public.usage_events (event) values ('evento_falso')$$, 'evento inválido rejeitado');
select pg_temp.expect_eq((select count(*) from public.usage_events), 0, 'vendedor não lê eventos');
select pg_temp.expect_error($$select public.usage_stats(30)$$, 'vendedor não acessa estatísticas');
select pg_temp.expect_eq((select count(*) from public.popular_items('objection', 30, 8)), 1, 'ranking agregado disponível ao vendedor');

-- ===== Ana (admin) =====
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
select pg_temp.expect_eq((select count(*) from public.profiles), 2, 'admin vê todos os perfis');
insert into public.content_items (kind, id, data) values ('quick', 'nova', '{"id":"nova","titulo":"T","texto":"X"}');
select pg_temp.expect_eq((select count(*) from public.content_items where updated_by = '00000000-0000-0000-0000-00000000000a'), 1, 'admin cria conteúdo e autoria é registrada');
update public.content_items set deleted = true, data = null where kind = 'quick' and id = 'nova';
select pg_temp.expect_eq((select count(*) from public.content_items where deleted), 1, 'admin marca conteúdo como removido');
select pg_temp.expect_error($$insert into public.content_items (kind, id, data) values ('tipo-invalido', 'y', '{}')$$, 'tipo de conteúdo inválido rejeitado');
select pg_temp.expect_eq((select count(*) from public.favorites), 0, 'admin não vê favoritos de outro usuário');
select pg_temp.expect_eq((select count(*) from public.usage_events), 2, 'admin lê eventos');
select pg_temp.expect_eq((select (public.usage_stats(30) ->> 'totalEventos')::bigint), 2, 'estatísticas contam eventos reais');
select pg_temp.expect_eq((select (public.usage_stats(30) -> 'topObjecoes' -> 0 ->> 'total')::bigint), 2, 'ranking de objeções nas estatísticas');
select pg_temp.expect_error($$update public.profiles set role = 'vendedor' where id = '00000000-0000-0000-0000-00000000000a'$$, 'último admin não pode se rebaixar');
update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000b';
update public.profiles set role = 'vendedor' where id = '00000000-0000-0000-0000-00000000000a';
select pg_temp.expect_eq((select count(*) from public.profiles where role = 'vendedor'), 1, 'admin promove outro e se rebaixa (agora só vê o próprio perfil)');

-- ===== Bruno agora é admin; Ana virou vendedora =====
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
select pg_temp.expect_eq((select count(*) from public.profiles where role = 'admin'), 1, 'novo admin vê exatamente um admin');
select pg_temp.expect_eq((select count(*) from public.content_items), 1, 'novo admin enxerga conteúdo');
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
delete from public.content_items where kind = 'quick' and id = 'nova';
select pg_temp.expect_eq((select count(*) from public.content_items), 1, 'ex-admin não remove conteúdo (RLS ignora o delete)');

-- ===== Anônimo =====
reset role;
set role anon;
select set_config('request.jwt.claim.sub', '', false);
select pg_temp.expect_eq((select count(*) from public.content_items), 0, 'anônimo não lê conteúdo');
select pg_temp.expect_eq((select count(*) from public.profiles), 0, 'anônimo não lê perfis');
select pg_temp.expect_error($$select * from public.popular_items('objection', 30, 8)$$, 'anônimo não executa ranking');
reset role;

-- Exclusão do usuário apaga os dados dele
delete from auth.users where id = '00000000-0000-0000-0000-00000000000b';
select pg_temp.expect_eq((select count(*) from public.favorites), 0, 'dados apagados junto com o usuário');

\echo 'TODOS OS TESTES DE RLS PASSARAM'
