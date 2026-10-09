-- Nome do site: O Cara dos Apartamentos (aba do navegador, rodapé, privacidade, mensagens)
update public.configuracoes
set nome_imobiliaria = 'O Cara dos Apartamentos', updated_at = now()
where id = 1;
