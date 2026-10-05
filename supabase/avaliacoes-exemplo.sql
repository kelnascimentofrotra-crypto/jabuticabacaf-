-- =====================================================================
-- Thiago Liro · 3 avaliações de EXEMPLO publicadas (site ainda não divulgado)
-- Cole no Supabase (SQL Editor) e clique em Run.
-- Troca os 3 modelos "Nome do cliente" por exemplos publicados no site.
-- Antes de divulgar o site, troque pelo que clientes reais disseram (o
-- Dashboard do painel lembra enquanto houver exemplo). Pode rodar de novo.
-- =====================================================================

begin;

delete from public.avaliacoes
where nome in ('Nome do cliente 1', 'Nome do cliente 2', 'Nome do cliente 3',
               'Juliana M.', 'Carlos R.', 'Fernanda e Paulo S.');

insert into public.avaliacoes (nome, texto, nota, subtitulo, publicado, ordem)
select v.nome, v.texto, 5, v.subtitulo, true, v.ordem
from (values
  ('Juliana M.', 'Casa maravilhosa, do jeitinho que a gente sonhava! O Thiago mandou vídeo de cada cômodo, marcou a visita no mesmo dia e em poucas semanas a gente já estava com a chave na mão.', 'Compra de casa', 1),
  ('Carlos R.', 'Acabamento impecável e casa muito bem localizada. O Thiago explicou cada etapa do financiamento com calma e acompanhou tudo até a entrega das chaves.', 'Financiamento', 2),
  ('Fernanda e Paulo S.', 'Casas lindas, com planejados e piscina, tudo de muito bom gosto. Ele já veio com as opções certas pro nosso orçamento. Recomendo demais!', 'Compra de casa', 3)
) as v (nome, texto, subtitulo, ordem)
where not exists (select 1 from public.avaliacoes a where a.nome = v.nome);

commit;
