# Morada — site + painel administrativo

Site estático (HTML, CSS e JavaScript, sem build) com painel em `/admin`.
Os dados (imóveis, fotos, avaliações e contatos) ficam no **Supabase**; o site é publicado na **Vercel**.

```
index.html, styles.css, app.js   site público (lê os dados do Supabase)
supabase-config.js               busca a URL e a chave pública em /api/config
api/config.js                    função da Vercel: entrega SUPABASE_URL e SUPABASE_ANON_KEY
admin/index.html                 painel (/admin, /admin/login, /admin/imoveis, …)
admin-app/admin.js, admin.css    código e visual do painel
vendor/supabase.js               supabase-js (MIT), usado só pelo painel
vercel.json                      rotas do /admin e cabeçalhos
supabase/                        SQL do banco (não é publicado no site — veja .vercelignore)
├── migrations/…_painel_admin.sql    tabelas, RLS, buckets e políticas do Storage
├── seed.sql                         imóveis e avaliações de exemplo
├── imoveis-reais.sql                tira os exemplos e cadastra as casas reais (fotos em assets/imoveis)
├── limpar-dados-antigos.sql         apaga contatos, logo e avaliações de exemplo do dono anterior
├── avaliacoes-modelo.sql            3 modelos de avaliação não publicados, para trocar pelos depoimentos reais
└── avaliacoes-exemplo.sql           3 avaliações de exemplo publicadas (trocar pelas reais antes de divulgar)
```

## 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. **SQL Editor → New query**: cole `supabase/migrations/20260929120000_painel_admin.sql` e clique em **Run**.
3. Ainda no SQL Editor, rode `supabase/seed.sql` (leva os 9 imóveis e as 3 avaliações que o site já tinha para o banco; pode rodar de novo sem duplicar).
   Depois rode `supabase/imoveis-reais.sql`: tira esses exemplos e cadastra as casas reais.
4. Rode também `supabase/migrations/20260930120000_contas_contatos.sql` (mensagens do formulário, contas de clientes, números da apresentação). Só acrescenta; pode rodar de novo.
5. **Authentication → Sign In / Providers**: deixe **Allow new users to sign up** ligado — é o cadastro dos clientes no site.
   Isso não dá acesso ao painel: só quem está na tabela `admins` consegue alterar alguma coisa.
   - **Confirm email** ligado: o cliente precisa clicar no link do e-mail antes de entrar. O envio de e-mails padrão do Supabase é limitado (poucos por hora); para muitos cadastros, configure um SMTP próprio em **Authentication → Emails → SMTP Settings** ou deixe essa opção desligada.
6. **Authentication → URL Configuration**:
   - **Site URL**: o endereço do site (ex.: `https://ocaradosapartamentos.vercel.app`).
   - **Redirect URLs**: adicione `https://SEU-DOMINIO/**` — é para onde voltam os links de “esqueci minha senha” (clientes e painel) e o login com Google.

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
2. **Framework Preset**: Other · deixe Root Directory e Build Command como estão.
3. **Settings → Environment Variables** (Production e Preview):

| Variável | Onde pegar no Supabase |
| --- | --- |
| `SUPABASE_URL` | Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Project Settings → API Keys → chave **anon public** (ou **Publishable key**) |

4. **Deploy** (ou *Redeploy* depois de mudar as variáveis).

Nunca use a **service_role / secret key** no site. A chave anon é pública por natureza; quem protege os dados são as políticas RLS. Se a chave secreta for colocada por engano em `SUPABASE_ANON_KEY`, a função `/api/config` se recusa a enviá-la.

## 3. Usar o painel

Abra `https://seu-dominio/admin`, entre com o e-mail e a senha do administrador.

- **Dashboard**: totais reais (imóveis, disponíveis, vendidos, alugados, alto padrão) e os últimos cadastrados.
- **Imóveis**: lista com busca, filtro por status e páginas; cadastrar, editar, excluir, mudar status e marcar como alto padrão. Fotos: várias de uma vez, a primeira é a principal, reordenar (arrastar ou setas), trocar e remover. As fotos são reduzidas para 1600 px (+ miniatura de 640 px) antes de ir para o Storage; o banco guarda só o caminho.
- **Alto padrão**: o que aparece em “Imóveis de alto padrão” no site, e em que ordem.
- **Avaliações**: criar, editar, publicar/despublicar e excluir. A nota média do site vem daqui.
- **Contatos**: mensagens do formulário do site e pedidos finalizados no carrinho, com WhatsApp e e-mail para responder, lidas/não lidas e contador no menu.
- **Configurações**: nome, WhatsApp, Instagram, telefone, e-mail, endereço, logo e números da apresentação (famílias atendidas, anos de mercado).
- **Minha conta** (clique no seu e-mail no topo): trocar a senha. Na tela de entrada há “Esqueci minha senha”.
- O **Dashboard** mostra as mensagens novas e uma lista do que ainda falta para o site ficar completo.

## Contas de clientes

No site, os clientes criam conta com e-mail e senha, recuperam a senha por e-mail e têm favoritos, carrinho e pedidos salvos na conta, em qualquer aparelho. Em **Minha conta → Conta** podem editar nome, telefone, foto e senha, ou excluir a conta (LGPD). O modo visitante continua.

**Login com Google:** desligado. A opção saiu das Configurações do painel e o site só oferece e-mail e senha. Para voltar a ter, é preciso criar um “ID do cliente OAuth” no Google Cloud (a conta precisa da verificação em duas etapas), colar o Client ID e o Secret no Supabase em **Authentication → Sign In / Providers → Google** e devolver a opção ao painel.

Tudo o que é salvo aparece no site na próxima vez que a página abrir (e quando a aba volta a ficar visível, depois de 1 minuto).

## Segurança (RLS)

- Visitante (chave anon): só **lê** imóveis, fotos, configurações e avaliações **publicadas**, e pode **enviar** mensagens pelo formulário (sem conseguir ler nenhuma). Não altera nada.
- Cliente logado: lê e altera só o próprio perfil, favoritos, carrinho e pedidos, e só mexe na própria pasta de fotos de perfil.
- Usuário logado que não está em `admins`: só leitura, igual ao visitante.
- Admin: cria, edita e exclui — a checagem é feita no banco pela função `is_admin()`, não pela interface.
- Storage (buckets `imoveis` e `site`): leitura pública pelo link da foto; enviar, trocar, listar e apagar só admin.

## Supabase grátis sem pausar

No plano grátis, o Supabase pausa o projeto depois de 7 dias sem nenhum acesso. Para evitar isso, a Vercel chama `/api/manter-ativo` uma vez por dia (seção `crons` do `vercel.json`), que só faz uma leitura simples no banco. Se mesmo assim o projeto for pausado, é só entrar no Supabase e clicar em **Restore project** — nenhum dado é apagado.

## Páginas extras

- `/privacidade` — Política de Privacidade (modelo; revise com o responsável pela imobiliária). Nome e contatos vêm das Configurações.
- `/sitemap.xml` e `robots.txt` para o Google; página 404 própria; imagem de compartilhamento em `assets/og-tl.jpg`.

## Rodar sem Supabase

Abrindo `index.html` direto do computador (ou sem as variáveis configuradas), o site mostra os imóveis de exemplo e o `/admin` avisa que falta configurar o Supabase.
