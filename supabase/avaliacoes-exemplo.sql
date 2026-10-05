-- =====================================================================
-- Thiago Liro · 3 avaliações de EXEMPLO publicadas (site ainda não divulgado)
-- Cole no Supabase (SQL Editor) e clique em Run.
-- Troca os 3 modelos "Nome do cliente" por exemplos publicados no site.
-- Antes de divulgar o site, troque pelo que clientes reais disseram (o
-- Dashboard do painel lembra enquanto houver exemplo). Pode rodar de novo.
-- =====================================================================

begin;

delete from public.avaliacoes
where nome in ('Nome do cliente 1', 'Nome do cliente 2', 'Nome do cliente 3');

insert into public.avaliacoes (nome, texto, nota, subtitulo, publicado, ordem)
select v.nome, v.texto, 5, v.subtitulo, true, v.ordem
from (values
  ('Juliana M.', 'O Thiago respondeu rápido no WhatsApp, mandou vídeo de todos os cômodos e marcou a visita no mesmo dia. Fechamos em poucas semanas.', 'Compra de casa', 1),
  ('Carlos R.', 'Atendimento sério e sem pressão. Ele explicou cada etapa do financiamento e acompanhou tudo até a entrega das chaves.', 'Financiamento', 2),
  ('Fernanda e Paulo S.', 'A gente queria casa com piscina e planejados. Ele já veio com opções certas pro nosso orçamento.', 'Compra de casa', 3)
) as v (nome, texto, subtitulo, ordem)
where not exists (select 1 from public.avaliacoes a where a.nome = v.nome);

commit;
