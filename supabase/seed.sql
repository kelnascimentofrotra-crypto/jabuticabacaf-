-- =====================================================================
-- Morada · conteúdo atual do site levado para o banco
-- Rode DEPOIS da migração. Só insere o que ainda não existe
-- (pelo slug do imóvel / nome da avaliação), então pode rodar de novo.
-- Depois disso, tudo é editado pelo painel /admin.
-- =====================================================================

insert into public.imoveis
  (slug, titulo, descricao, preco, tipo, finalidade, cidade, uf, bairro, suites, banheiros, vagas, area,
   frente, topografia, selos, caracteristicas, status, destaque, imagem_principal, ordem)
values
  ('patio', 'Casa Pátio', 'Casa térrea com laje de concreto aparente, pilar de pedra e uma sala que se abre inteira para a piscina. Jardim tropical em volta de toda a casa.',
   6800000, 'casa', 'venda', 'São Paulo', 'SP', 'Jardim Europa', 4, 6, 4, 420, null, null,
   '{Exclusivo}', '{Térrea,Piscina,"Jardim tropical"}', 'disponivel', true, '/assets/casa.webp', 1),
  ('mirante', 'Casa Mirante', 'Varandas profundas voltadas para o canal, madeira certificada na fachada e deck com piscina.',
   5200000, 'casa', 'venda', 'Ilhabela', 'SP', 'Vila', 3, 4, 3, 380, null, null,
   '{"Vista para o mar"}', '{Varandas,"Madeira certificada"}', 'disponivel', true,
   'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80', 2),
  ('jequitiba', 'Casa Jequitibá', 'Cinco suítes em volta de um pátio sombreado, a dez minutos do Quadrado.',
   9400000, 'casa', 'venda', 'Trancoso', 'BA', 'Quadrado', 5, 7, 4, 510, null, null,
   '{Novo}', '{Condomínio,"Piscina aquecida"}', 'disponivel', true,
   'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80', 3),
  ('brisa', 'Casa Brisa', 'Volumes brancos, ventilação cruzada e um deck que termina na restinga. Entregue mobiliada com a coleção Morada.',
   38000, 'casa', 'aluguel', 'Florianópolis', 'SC', 'Jurerê', 3, 4, 2, 300, null, null,
   '{Mobiliada}', '{"Perto da praia",Deck}', 'disponivel', false,
   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80', 4),
  ('seixo', 'Casa Seixo', 'Pedra da região, grandes panos de vidro e a serra inteira na janela da sala.',
   5900000, 'casa', 'venda', 'Nova Lima', 'MG', 'Vale dos Cristais', 4, 5, 4, 460, null, null,
   '{}', '{"Vista para a serra","Pedra local"}', 'disponivel', false,
   'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80', 5),
  ('lume', 'Casa Lume', 'Lareira central, pé-direito duplo e luz de fim de tarde o ano inteiro.',
   29000, 'casa', 'aluguel', 'Campos do Jordão', 'SP', 'Capivari', 4, 5, 3, 350, null, null,
   '{Temporada}', '{Lareira,"Pé-direito duplo"}', 'disponivel', false,
   'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80', 6),
  ('jardins', 'Apartamento Jardins', 'Planta ampla com varanda gourmet, piso de madeira e vista aberta para o verde dos Jardins.',
   4900000, 'apartamento', 'venda', 'São Paulo', 'SP', 'Jardins', 3, 4, 3, 280, null, null,
   '{"Andar alto"}', '{"Varanda gourmet","Vista aberta"}', 'disponivel', false,
   'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80', 7),
  ('leblon', 'Cobertura Leblon', 'Cobertura com terraço, piscina privativa e o mar a duas quadras.',
   45000, 'apartamento', 'aluguel', 'Rio de Janeiro', 'RJ', 'Leblon', 4, 5, 3, 320, null, null,
   '{Cobertura}', '{Terraço,"Piscina privativa"}', 'disponivel', false,
   'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80', 8),
  ('serra', 'Terreno Serra Verde', 'Lote de 2.600 m² em aclive suave, com projeto aprovado para casa térrea e vista para a serra.',
   1900000, 'terreno', 'venda', 'Nova Lima', 'MG', 'Condomínio Serra Verde', 0, null, null, 2600, 40, 'Aclive suave',
   '{"Projeto aprovado"}', '{"Vista para a serra","Condomínio fechado"}', 'disponivel', false, null, 9)
on conflict (slug) do nothing;

-- casas e apartamentos: cada suíte conta como quarto
update public.imoveis set quartos = suites
where quartos is null and suites > 0 and tipo <> 'terreno';

-- a foto principal de cada imóvel também entra na galeria
insert into public.imovel_fotos (imovel_id, caminho, ordem)
select i.id, i.imagem_principal, 0
from public.imoveis i
where i.imagem_principal is not null
  and not exists (select 1 from public.imovel_fotos f where f.imovel_id = i.id);

insert into public.avaliacoes (nome, texto, nota, subtitulo, publicado, ordem)
select v.nome, v.texto, v.nota, v.subtitulo, true, v.ordem
from (values
  ('Marina Duarte', 'Visitamos três casas. A terceira já era a nossa.', 5, 'Casa Mirante · Ilhabela', 1),
  ('Rafael Nogueira', 'Documentação em dia e nenhuma surpresa na escritura.', 5, 'Casa Seixo · Nova Lima', 2),
  ('Helena e Caio Prado', 'Chegamos só com as malas. A casa já estava mobiliada.', 5, 'Casa Brisa · Florianópolis', 3)
) as v (nome, texto, nota, subtitulo, ordem)
where not exists (select 1 from public.avaliacoes a where a.nome = v.nome);

update public.configuracoes
set instagram = coalesce(nullif(instagram, ''), '@morada.casas'),
    email     = coalesce(nullif(email, ''), 'contato@morada.com.br')
where id = 1;
