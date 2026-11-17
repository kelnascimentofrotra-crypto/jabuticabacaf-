# SMUG MODAS — site

Site de página única (one-page) da SMUG MODAS, construído a partir das cinco referências
de design (Início, Nossa loja, Categorias, Sobre a Fabielly e Contato).
HTML, CSS e JavaScript puros no navegador; um painel (`/admin/`) com funções na Vercel atualiza
postagens, produtos e textos do site sem novo deploy.

## Como visualizar

Para ver o site **com o painel funcionando** (login, publicação e fotos) no computador:

```bash
cd smug-modas
npm install
npm run dev        # abre em http://localhost:3000  (painel: /admin/, código de teste: SMUG-TESTE)
```

O servidor local imita as funções da Vercel e guarda tudo em `.local-blob/` (fora do Git).
Só para olhar o site, sem painel, qualquer servidor estático serve (`python3 -m http.server 8080`).

## Como editar

O jeito mais fácil é pelo **painel** (`/admin/`, veja abaixo): o que se publica nele aparece no site em instantes.
Por baixo, o conteúdo de partida (textos, imagens, links, contatos, produtos e condições comerciais) fica em
**`src/content.json`**. Quem preferir editar à mão altera esse arquivo e gera o HTML de novo:

```bash
node build.mjs     # ou: npm run build  (Node 20+)
```

O build gera o `index.html`, monta a pasta `public/` (o que a Vercel publica) e lista no terminal
tudo o que ainda precisa ser configurado.

```
smug-modas/
├── index.html              ← gerado pelo build; não editar à mão
├── build.mjs               ← gera o index.html, monta public/ e lista pendências
├── vercel.json             ← build, pasta publicada, /conteudo.json e cabeçalhos
├── admin/                  ← painel da loja (abre em …/admin/)
│   ├── index.html, admin.css, app.js, login.js, api.js, ui.js, images.js
│   └── views/              ← Início, Postagens, Produtos (+ Categorias), Configurações
├── api/                    ← funções da Vercel (login, conteúdo, fotos)
│   └── _lib/               ← armazenamento (Vercel Blob), sessão, validação
├── scripts/dev-server.mjs  ← servidor local com as mesmas funções
├── src/
│   ├── content.json        ← conteúdo de partida (antes da primeira publicação no painel)
│   ├── render.mjs          ← monta a página; usado pelo build e pelo navegador
│   ├── lib.mjs             ← ícones, logo, helpers
│   └── components/         ← header + menu, hero, produtos, postagens, benefícios, loja,
│                              categorias, sobre, contato, rodapé
└── assets/
    ├── css/styles.css      ← tokens de cor/tipografia + estilos (mobile first)
    ├── js/live.js          ← busca o conteúdo publicado no painel e atualiza a página
    ├── js/main.js          ← menu, header, animações, postagens, formulário
    ├── fonts/              ← Playfair Display, Jost, Allura (self-hosted, OFL)
    ├── img/                ← fotos em WebP
    └── icons/              ← favicon e ícone para iOS
```

## Painel da loja (`/admin/`)

Mesmo layout do painel do Marcos (menu lateral escuro, topo com modo claro/escuro, conta e “Sair”,
cartões com números, tabelas e login com a tela dividida), nas cores da SMUG. Funciona no celular
(o menu vira gaveta e as tabelas viram cartões) e no computador. São quatro opções no menu:

| Opção | O que faz |
| --- | --- |
| **Dashboard** | cartões (postagens no site, rascunhos, produtos disponíveis, esgotados, categorias), lista “Para o site ficar completo” com botão “Resolver”, últimas postagens e últimos produtos |
| **Postagens** | tabela com busca e filtro; situação (publicada/rascunho) e destaque (estrela) mudam na própria lista; formulário com título, texto, foto de capa, botão com link, data e destaque |
| **Produtos** | tabela com busca e filtros; situação (disponível/esgotado/oculto) muda na lista; formulário com fotos, preço, categoria, cores, tamanhos, link; duplicar e excluir. Botão **Categorias** (nome, texto, foto, link, ordem e link do catálogo) |
| **Configurações** | contato (WhatsApp com teste do link, e-mail, Instagram), endereço e horário, razão social e CNPJ para o rodapé, serviço do formulário, Google Analytics, vantagens da abertura e todos os textos do site |

**Minha conta** (clicando no nome, no topo): trocar e-mail ou senha e sair.

**Como o site é atualizado.** Cada “Salvar e publicar” envia o conteúdo para a função `/api/content`, que confere o
login, valida os dados (links só `https://`, tamanhos, listas) e grava um único arquivo público no **Vercel Blob**.
O site lê esse conteúdo por `/conteudo.json` (função `api/site.js`) ao abrir (`assets/js/live.js`) e refaz só as
seções que mudaram — sem novo deploy. Sem publicação ainda, a função devolve o conteúdo original (nunca dá erro).
A Vercel guarda a resposta por até 15 segundos; pelo botão “Ver o site” do painel a mudança aparece na hora.

**Dois aparelhos ao mesmo tempo.** Cada publicação leva a versão em que a edição começou. Se o site mudou em outro
aparelho, a função recusa (409), o painel carrega a versão nova e pede para salvar de novo — nada é sobrescrito.

**Fotos.** São reduzidas e convertidas para WebP no próprio aparelho e enviadas por `/api/upload` (até 3 MB, só
JPG/PNG/WebP, conferindo o conteúdo do arquivo) para o Blob, com nome aleatório.

**Login.** Uma conta única (e-mail e senha) para todos os aparelhos:

- **primeiro acesso:** o painel pede o **código de ativação** (variável `ADMIN_SETUP_CODE` na Vercel) e cria o
  e-mail e a senha. Depois disso o código não vale mais;
- a senha é guardada só como hash **scrypt** com sal, num arquivo privado de nome imprevisível no Blob;
- a sessão é um cookie `HttpOnly`, `Secure`, `SameSite=Strict`, assinado (HMAC) e válido por 7 dias;
  trocar a senha desconecta os outros aparelhos;
- após 5 tentativas erradas, o login espera 30 s (o tempo dobra a cada novo erro, até 15 min); publicações
  exigem a mesma origem do site;
- **esqueceu a senha?** Quem cuida da Vercel apaga o arquivo `private/admin-….json` no Blob (Storage → Browser)
  e o painel volta a pedir o código de ativação (troque também o `ADMIN_SETUP_CODE` e faça um novo deploy).
  Não troque o `SMUG_SESSION_SECRET` à toa: ele também define onde fica a conta.

**Variáveis na Vercel** (Project → Settings → Environment Variables): `BLOB_READ_WRITE_TOKEN` (criada ao
conectar o Blob), `ADMIN_SETUP_CODE` e `SMUG_SESSION_SECRET` (ambas *sensitive*). Nenhuma chave vai para o
navegador.

**Acesso.** O endereço `/admin/` não aparece no site e tem `noindex`.

## Pendências antes de publicar

Nenhum dado ilustrativo das referências foi publicado. Enquanto não forem preenchidos
(no painel ou em `src/content.json`), os itens de contato aparecem como “Informação a confirmar” e
nenhum link é gerado.

| Item | Onde | Situação atual |
| --- | --- | --- |
| WhatsApp real | `contact.whatsapp` | vazio (a referência tinha “(xx) xxxx-xxxx”) |
| E-mail | `contact.email` | vazio (a referência sugere `contato@smugmodas.com.br` — confirmar) |
| Endereço + link do mapa | `contact.address` | vazio (a referência tinha “Rua Exemplo, 123”). Sem o link, “Venha nos visitar” leva ao contato |
| Horário | `contact.hours` | vazio (a referência sugere “Segunda a Sábado, 09h às 18h” — confirmar) |
| Envio do formulário | `form.endpoint` | **sem integração** — veja abaixo |
| Condições comerciais | `heroBenefits` | “Frete Grátis acima de R$ 299”, “Pagamento Seguro”, “Coleções Exclusivas”, “Suporte 24/7” vêm da referência; confirme e marque `confirmed: true` |
| Catálogo | `categories.catalogUrl` / `items[].url` | sem catálogo: os cards levam ao formulário com o interesse já preenchido |
| URL do site | `site.url` | necessária para canonical, Open Graph e dados estruturados |
| Instagram | `contact.social.instagram` | opcional |
| Pesquisa, conta, favoritos e sacola | `headerActions` | só demonstração: mostram aviso, sem função real |

### Formulário de contato

O formulário valida nome, e-mail, telefone (opcional) e mensagem, com mensagens de erro
específicas, estado de envio e tratamento de falhas. Ele **nunca simula uma entrega**.
O comportamento depende do que estiver configurado:

1. **`form.endpoint` preenchido** (recomendado: Formspree, Web3Forms, Getform ou API própria):
   envia por `POST` (JSON ou multipart, conforme `form.format`) e só mostra a confirmação
   quando o servidor responde com sucesso. Sem JavaScript, o formulário faz um POST comum.
2. **Sem endpoint, com WhatsApp:** o botão vira “Enviar pelo WhatsApp” e abre a conversa
   com a mensagem pronta — o aviso abaixo do botão explica isso.
3. **Sem endpoint, só com e-mail:** abre o aplicativo de e-mail com a mensagem pronta.
4. **Nada configurado (estado atual):** valida os campos e informa que o envio on-line ainda
   não está disponível.

Não coloque chaves secretas no front-end; serviços como Formspree usam apenas a URL pública
do formulário.

## Imagens

Não havia fotos originais no projeto: as imagens foram extraídas das áreas fotográficas das
referências (sem textos ou botões embutidos), e os títulos, textos e botões foram refeitos em HTML.

| Arquivo | Origem | Observação |
| --- | --- | --- |
| `fabielly-hero.webp` | referência do Início | recorte com remoção de fundo, para ficar à frente do “SMUG” em HTML |
| `hero-fundo.webp` | imagem de referência desktop do Início | parede com a luz do sol, planta e piso; letras, pessoa, header e painel removidos (LaMa + interpolação ao longo dos feixes de luz) |
| `fabielly-retrato*.webp` | referência Sobre | inclui o espaço acima da cabeça; textos “SOBRE A” e “Fabielly” removidos (LaMa) |
| `loja-ambiente*.webp` | referência Nossa loja | área fotográfica completa |
| `categorias-loja.webp`, `cat-*.webp` | referência Categorias | só a parte da foto acima dos rótulos |
| `contato-recepcao.webp` | referência Contato | lado direito da foto (recepção) |
| `og-smug-modas.jpg` | composição | imagem de compartilhamento (1200×630) |

As referências têm cerca de 850 px de largura, então as fotos ficam um pouco suaves em telas
grandes ou de alta densidade. **Para a versão final, envie as fotos originais em alta resolução**
(Fabielly no fundo creme, Fabielly na loja, ambiente da loja, recepção e as cinco categorias)
e substitua os arquivos mantendo os mesmos nomes, ou atualize `width`/`height` em
`src/content.json`.

## Checklist de lançamento

| Item | Situação |
| --- | --- |
| Celular | testado de 320 a 1440 px, sem rolagem lateral; menu do celular |
| Formulário | com serviço de envio: só diz “enviada” se o serviço confirmar; sem ele, abre o WhatsApp (ou e-mail) com a mensagem pronta; sem nenhum contato, avisa que não enviou |
| WhatsApp | links `wa.me` só existem com número cadastrado no painel (nenhum número inventado) |
| Página 404 | `404.html` gerada pelo build, com a identidade do site e botão para o início |
| HTTPS / hospedagem | Vercel, HTTPS automático + HSTS |
| Imagens | WebP; foto da abertura com versão de 360 px para celular |
| Favicon | `favicon.ico` + PNG 32 px + ícone do iPhone |
| Imagem de compartilhamento | `og:image` 1200×630 com endereço completo e texto alternativo |
| `sitemap.xml` e `robots.txt` | gerados pelo build (painel e API fora das buscas) |
| Google Analytics e cookies | opcional: com o ID em Configurações, aparece o aviso e o Analytics só carrega depois de “Aceitar”. Sem o ID o site não usa cookies |
| Dados no rodapé | WhatsApp, e-mail, Instagram, endereço, horário, razão social e CNPJ (o que estiver preenchido) |
| Títulos e descrições | título e descrição da página, Open Graph, dados estruturados; 404 e painel com `noindex` |
| Segurança | Content-Security-Policy (script embutido liberado só pelo hash, conferido pelo build), HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP |
| Domínio próprio | pendente: precisa comprar o domínio (Vercel → Domains) |

## Publicação

O site e o painel estão na **Vercel** (projeto `smugmodassite`, endereço `https://smugmodassite.vercel.app`),
publicados a partir desta pasta (`Root Directory: smug-modas`). O build roda `npm run build` e publica `public/`;
as funções ficam em `api/`.

Atenção: o `CNAME` na raiz deste repositório aponta para o domínio da Jabuticaba Café. Para um domínio próprio da
SMUG, adicione-o em Project → Settings → Domains na Vercel (e, de preferência, mova esta pasta para um
repositório só da SMUG).

## Header

O header fixo tem dois estados, controlados em `assets/js/main.js` (`initHeader`):

- **Na hero:** a logo pequena fica oculta (o “SMUG” grande da hero já identifica a marca), os links
  ficam à esquerda e o fundo é integrado à hero.
- **Após a hero** (classe `is-past-hero`): quando o início da segunda seção alcança a base do header,
  a logo aparece à esquerda, os links deslizam para o centro (só com `transform`) e o fundo fica creme.

A troca usa `IntersectionObserver` sobre a hero inteira, com 16 px de histerese para não alternar perto
do limite. Abaixo de `75em` (1200 px com fonte padrão) a navegação usa o menu compacto. Sem JavaScript,
o header já nasce no estado “após a hero”.

Os ícones de **pesquisa, conta, favoritos e sacola** (`headerActions` em `src/content.json`) ainda não têm
loja virtual por trás: ao tocar, mostram o aviso “Este site é apenas uma versão de demonstração…”.
No celular, o header mostra só a sacola; pesquisa, conta e favoritos ficam dentro do menu.
Quando a loja existir, troque cada botão pelo link ou ação real e remova o aviso.

## Animações

- **Hero (abertura cinematográfica):** a cena surge do preto entre barras de cinema, a câmera faz uma aproximação
  lenta (Ken Burns), as letras de SMUG sobem uma a uma com sombra do sol, a Fabielly entra em foco, a frase fecha
  o espaçamento das letras e o painel recebe um reflexo de luz. Depois disso ficam em movimento contínuo e suave:
  o brilho do sol, uma faixa de luz pela parede, sombras de folhas balançando, poeira na luz e grão de filme.
- **Profundidade:** no desktop, as camadas da hero se deslocam levemente com o mouse. Ao rolar, a hero sobe
  inteira (sem deslocar camadas). A foto da loja tem um leve parallax dentro da moldura.
- **Seções:** títulos aparecem palavra por palavra, fotos abrem com uma “cortina”, linhas douradas e ícones se
  desenham, cards de categoria inclinam em 3D com brilho, botões têm reflexo, a assinatura é “escrita”, há uma
  faixa em movimento após a hero, barra de progresso de leitura e a marca SMUG gigante no rodapé.
- Tudo usa `transform`/`opacity`; animações contínuas pausam fora da tela (`data-anim-scope`).
  Os tempos ficam em `assets/css/styles.css` (seções “Animações”, “Hero cinematográfica” e “Faixa em movimento”).

## Acessibilidade e movimento

- HTML semântico, link “Pular para o conteúdo”, foco visível e áreas de toque de pelo menos 44 px.
- Menu mobile em `<dialog>` modal: o foco fica preso no menu, Escape fecha, a rolagem do fundo
  é bloqueada e o foco volta ao botão ao fechar. Ao escolher uma seção, o foco vai para o título dela.
- As animações respeitam `prefers-reduced-motion`: com “reduzir movimento” ativo, tudo aparece pronto, sem
  parallax, poeira, grão ou faixa em movimento. Sem JavaScript, todo o conteúdo continua visível.
