-- =====================================================================
-- Thiago Liro · tira os dados do dono anterior do site
-- Cole no Supabase (SQL Editor) e clique em Run.
-- Apaga das Configurações: WhatsApp, Instagram, telefone, e-mail, endereço,
-- logo enviada e os números da abertura (famílias atendidas e anos de mercado).
-- Também tira as 3 avaliações de exemplo (de casas que não existem).
-- Não mexe em imóveis, clientes nem mensagens recebidas. Pode rodar de novo.
-- Depois, coloque os dados do Thiago no painel: Configurações → Salvar.
-- =====================================================================

begin;

update public.configuracoes
set nome_imobiliaria = 'Thiago Liro', whatsapp = '', instagram = '', telefone = '',
    email = '', endereco = '', logo = null, updated_at = now()
where id = 1;

do $$
begin
  update public.configuracoes set familias_atendidas = null, anos_mercado = null where id = 1;
exception when undefined_column then null;
end $$;

delete from public.avaliacoes
where (nome, subtitulo) in (
  ('Marina Duarte', 'Casa Mirante · Ilhabela'),
  ('Rafael Nogueira', 'Casa Seixo · Nova Lima'),
  ('Helena e Caio Prado', 'Casa Brisa · Florianópolis')
);

commit;
