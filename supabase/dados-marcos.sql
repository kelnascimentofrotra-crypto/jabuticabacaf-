-- Marcos Corretor de Imóveis · troca o nome e tira contatos antigos das Configurações
-- Cole no Supabase (SQL Editor) e clique em Run. Não mexe em imóveis, avaliações, clientes nem mensagens.
update public.configuracoes
set nome_imobiliaria = 'Marcos Corretor de Imóveis', whatsapp = '', instagram = '',
    telefone = '', email = '', endereco = '', logo = null, updated_at = now()
where id = 1;
