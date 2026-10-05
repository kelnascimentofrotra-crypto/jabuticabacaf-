-- =====================================================================
-- Thiago Liro · imóveis reais e nome do site
-- Cole no Supabase (SQL Editor) e clique em Run.
-- 1) tira os 9 imóveis de exemplo (só os que ainda estão com o nome de exemplo)
-- 2) cadastra as casas reais; as fotos já vão junto com o site (/assets/imoveis)
-- 3) o nome do site passa de "Recanto do Acre Flats" para "Thiago Liro"
-- Pode rodar de novo: não duplica nada e não mexe no que você já editou no painel.
-- A cidade fica "A definir" (escondida no site) até você trocar no painel.
-- =====================================================================

begin;

update public.configuracoes
set nome_imobiliaria = 'Thiago Liro'
where id = 1 and nome_imobiliaria in ('Recanto do Acre Flats', 'Morada');

delete from public.imoveis
where (slug, titulo) in (
  ('patio', 'Casa Pátio'), ('mirante', 'Casa Mirante'), ('brisa', 'Casa Brisa'),
  ('jequitiba', 'Casa Jequitibá'), ('seixo', 'Casa Seixo'), ('lume', 'Casa Lume'),
  ('jardins', 'Apartamento Jardins'), ('leblon', 'Cobertura Leblon'), ('serra', 'Terreno Serra Verde')
);

insert into public.imoveis
  (slug, titulo, descricao, preco, tipo, finalidade, cidade, quartos, suites, vagas, area,
   selos, caracteristicas, status, destaque, imagem_principal, ordem)
values
  ('casa-cerejeiras', 'Casa Cerejeiras',
   $d$Casa Cerejeiras - 05 de 2026
R$ 450.000,00 R$ 480.000,00$d$,
   450000, 'casa', 'venda', 'A definir', null, null, null, null,
   '{}', '{}', 'disponivel', true, '/assets/imoveis/casa-cerejeiras-1.webp', 1),

  ('unidade-ana-carolina', 'Unidade Ana Carolina',
   $d$Unidade Ana Carolina - COM PLANEJADOS
R$ 550.000,00 R$ 570.000,00$d$,
   550000, 'casa', 'venda', 'A definir', null, null, null, null,
   '{"Com planejados"}', '{}', 'disponivel', true, '/assets/imoveis/unidade-ana-carolina-1.webp', 2),

  ('casa-parque-brasilia', 'Casa Parque Brasília',
   $d$R$ 1.149.900,00
R$ 1.150.000,00

Área construída – 183,51 m²
Lote – 300 m² – 12x25

Localização privilegiada, ao lado da avenida principal e próximo ao Floresta Supermercados.

Casa composta por:
• 3 suítes plenas, sendo uma delas com closet, e todas possuindo um jardim privativo;
• Garagem ampla, coberta para 2 carros;
• Sala de TV e jantar – pé-direito duplo;
• Cozinha gourmet espaçosa, com churrasqueira e ilha com balcão e mesa em madeira rústica;
• Depósito;
• Lavanderia.

Área de lazer:
• Piscina revestida em pastilha, aquecida, com hidromassagem, luz de LED e cascata;
• Deck em volta da piscina.$d$,
   1149900, 'casa', 'venda', 'A definir', 3, 3, 2, 183.51,
   '{}', '{"Piscina aquecida",Hidromassagem,Cascata,"Deck na piscina","Cozinha gourmet",Churrasqueira,"Pé-direito duplo",Closet,"Jardim privativo",Depósito,Lavanderia,"Lote 300 m² (12x25)"}',
   'disponivel', true, '/assets/imoveis/casa-parque-brasilia-1.webp', 3)
on conflict (slug) do nothing;

insert into public.imovel_fotos (imovel_id, caminho, ordem)
select i.id, '/assets/imoveis/' || i.slug || '-' || n || '.webp', n - 1
from public.imoveis i
cross join generate_series(1, 5) as n
where i.slug in ('casa-cerejeiras', 'unidade-ana-carolina', 'casa-parque-brasilia')
  and not exists (select 1 from public.imovel_fotos f where f.imovel_id = i.id)
order by i.slug, n;

commit;
