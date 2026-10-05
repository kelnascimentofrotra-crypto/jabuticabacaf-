-- =====================================================================
-- Thiago Liro · 3 modelos de avaliação no painel (NÃO aparecem no site)
-- Cole no Supabase (SQL Editor) e clique em Run.
-- Ficam como "Não publicada" em Avaliações. Para cada uma: troque o nome,
-- o imóvel e o texto pelo que o cliente real disse (com a permissão dele)
-- e clique em Publicar. Pode rodar de novo: não duplica.
-- =====================================================================

insert into public.avaliacoes (nome, texto, nota, subtitulo, publicado, ordem)
select v.nome, v.texto, 5, v.subtitulo, false, v.ordem
from (values
  ('Nome do cliente 1', 'Escreva aqui o que o cliente disse sobre o atendimento (pode copiar da mensagem dele no WhatsApp) e clique em Publicar.', 'Imóvel · Cidade', 1),
  ('Nome do cliente 2', 'Escreva aqui o que o cliente disse sobre o atendimento (pode copiar da mensagem dele no WhatsApp) e clique em Publicar.', 'Imóvel · Cidade', 2),
  ('Nome do cliente 3', 'Escreva aqui o que o cliente disse sobre o atendimento (pode copiar da mensagem dele no WhatsApp) e clique em Publicar.', 'Imóvel · Cidade', 3)
) as v (nome, texto, subtitulo, ordem)
where not exists (select 1 from public.avaliacoes a where a.nome = v.nome);
