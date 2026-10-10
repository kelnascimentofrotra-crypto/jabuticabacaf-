-- =====================================================================
-- Cleuma Maia · tira os contatos antigos do site
-- Cole no Supabase (SQL Editor) e clique em Run.
-- Apaga das Configurações: WhatsApp, Instagram, telefone, e-mail, endereço,
-- logo enviada e os números da abertura (famílias atendidas e anos de mercado).
-- Não mexe em imóveis, avaliações, clientes nem mensagens. Pode rodar de novo.
-- Depois, coloque os dados da Cleuma no painel: Configurações → Salvar.
-- =====================================================================

begin;

update public.configuracoes
set nome_imobiliaria = 'Cleuma Maia Corretora de Imóveis', whatsapp = '', instagram = '',
    telefone = '', email = '', endereco = '', logo = null, updated_at = now()
where id = 1;

do $$
begin
  update public.configuracoes set familias_atendidas = null, anos_mercado = null where id = 1;
exception when undefined_column then null;
end $$;

commit;
