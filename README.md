# Morada — site + painel administrativo

> **A versão publicada do site do Arthur agora fica no repositório [`arturcorretor`](https://github.com/kelnascimentofrotra-crypto/arturcorretor)** (site na raiz, publicado pela Vercel). Esta pasta `morada/` é uma cópia espelhada; o passo a passo completo e atualizado está no README de lá.

Site estático em `morada/` (HTML, CSS e JavaScript, sem build) com painel em `/admin`.
Os dados (imóveis, fotos, avaliações e contatos) ficam no **Supabase**; o site é publicado na **Vercel**.

```
morada/
├── index.html, styles.css, app.js   site público (lê os dados do Supabase)
├── supabase-config.js               busca a URL e a chave pública em /api/config
├── api/config.js                    função da Vercel: entrega SUPABASE_URL e SUPABASE_ANON_KEY
├── admin/index.html                 painel (/admin, /admin/login, /admin/imoveis, …)
├── admin-app/admin.js, admin.css    código e visual do painel
├── vendor/supabase.js               supabase-js (MIT), usado só pelo painel
└── vercel.json                      rotas do /admin e cabeçalhos
supabase/
├── migrations/…_painel_admin.sql    tabelas, RLS, buckets e políticas do Storage
└── seed.sql                         leva os imóveis e avaliações atuais do site para o banco
```

## 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. **SQL Editor → New query**: cole `supabase/migrations/20260929120000_painel_admin.sql` e clique em **Run**.
3. Ainda no SQL Editor, rode `supabase/seed.sql` (leva os 9 imóveis e as 3 avaliações que o site já tinha para o banco; pode rodar de novo sem duplicar).
4. **Authentication → Sign In / Providers → Email**: desative **Allow new users to sign up**.
   Assim ninguém cria conta pelo site. (Mesmo que alguém crie, sem estar na tabela `admins` não consegue alterar nada.)

### Primeiro administrador

1. **Authentication → Users → Add user → Create new user**: e-mail e uma senha forte, com **Auto Confirm User** marcado.
2. **SQL Editor**, trocando o e-mail:

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'seu-email@exemplo.com';
```

Para tirar o acesso de alguém: `delete from public.admins where user_id = (select id from auth.users where email = '...');`

A senha nunca fica no código: o login é feito pelo Supabase Auth.

## 2. Vercel

1. **Add New → Project** e importe este repositório.
2. **Root Directory**: `morada` · **Framework Preset**: Other · sem Build Command.
3. **Settings → Environment Variables** (Production e Preview):

| Variável | Onde pegar no Supabase |
| --- | --- |
| `SUPABASE_URL` | Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Project Settings → API Keys → chave **anon public** (ou **Publishable key**) |

4. **Deploy** (ou *Redeploy* depois de mudar as variáveis).

Nunca use a **service_role / secret key** no site. A chave anon é pública por natureza; quem protege os dados são as políticas RLS. Se a chave secreta for colocada por engano em `SUPABASE_ANON_KEY`, a função `/api/config` se recusa a enviá-la.

## 3. Usar o painel

Abra `https://seu-dominio/admin`, entre com o e-mail e a senha do administrador.

- **Dashboard**: totais reais (imóveis, disponíveis, vendidos, alugados, em destaque) e os últimos cadastrados.
- **Imóveis**: lista com busca, filtro por status e páginas; cadastrar, editar, excluir, mudar status e destaque. Fotos: várias de uma vez, a primeira é a principal, reordenar (arrastar ou setas), trocar e remover. As fotos são reduzidas para 1600 px (+ miniatura de 640 px) antes de ir para o Storage; o banco guarda só o caminho.
- **Destaques**: o que aparece em “Imóveis em destaque” no site, e em que ordem.
- **Avaliações**: criar, editar, publicar/despublicar e excluir. A nota média do site vem daqui.
- **Configurações**: nome, WhatsApp, Instagram, telefone, e-mail, endereço e logo.

Tudo o que é salvo aparece no site na próxima vez que a página abrir (e quando a aba volta a ficar visível, depois de 1 minuto).

## Segurança (RLS)

- Visitante (chave anon): só **lê** imóveis, fotos, configurações e avaliações **publicadas**. Não tem permissão de escrita em nenhuma tabela.
- Usuário logado que não está em `admins`: só leitura, igual ao visitante.
- Admin: cria, edita e exclui — a checagem é feita no banco pela função `is_admin()`, não pela interface.
- Storage (buckets `imoveis` e `site`): leitura pública pelo link da foto; enviar, trocar, listar e apagar só admin.

## Rodar sem Supabase

Abrindo `morada/index.html` direto do computador (ou sem as variáveis configuradas), o site mostra os imóveis de exemplo e o `/admin` avisa que falta configurar o Supabase.
