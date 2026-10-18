# SMUG MODAS — site

Site de página única (one-page) da SMUG MODAS, construído a partir das cinco referências
de design (Início, Nossa loja, Categorias, Sobre a Fabielly e Contato).
HTML, CSS e JavaScript puros, sem dependências; o `index.html` já vem gerado.

## Como visualizar

Os scripts usam `type="module"`, que não carrega em `file://`. Use um servidor local:

```bash
cd smug-modas
python3 -m http.server 8080      # ou: npx serve .
# abra http://localhost:8080
```

## Como editar

O jeito mais fácil é pelo **painel** (`/admin/`, veja abaixo). Por baixo, todo o conteúdo
(textos, imagens, links, contatos, produtos e condições comerciais) fica em **`src/content.json`**.
Quem preferir editar à mão pode alterar esse arquivo e gerar o HTML novamente:

```bash
node build.mjs     # ou: npm run build  (Node 18+)
```

O build lista no terminal tudo o que ainda precisa ser configurado.

```
smug-modas/
├── index.html              ← gerado (pelo build ou pelo painel); não editar à mão
├── build.mjs               ← gera o index.html pelo terminal e lista pendências
├── admin/                  ← painel da loja (abre em …/admin/)
├── src/
│   ├── content.json        ← conteúdo central (o painel edita este arquivo)
│   ├── render.mjs          ← monta a página; usado pelo build e pelo painel
│   ├── lib.mjs             ← ícones, logo, helpers
│   └── components/         ← header + menu, hero, produtos, benefícios, loja,
│                              categorias, sobre, contato, rodapé
└── assets/
    ├── css/styles.css      ← tokens de cor/tipografia + estilos (mobile first)
    ├── js/main.js          ← menu, header, animações, formulário
    ├── fonts/              ← Playfair Display, Jost, Allura (self-hosted, OFL)
    ├── img/                ← fotos em WebP (produtos/ e categorias/ recebem as fotos do painel)
    └── icons/              ← favicon e ícone para iOS
```

## Painel da loja (`/admin/`)

Painel para a dona da loja administrar o site e as vendas pelo navegador, no celular ou no computador.
Não tem servidor: o que é do **site** é publicado direto no GitHub; o que é de **vendas** fica salvo
no próprio navegador.

| Área | O que faz | Onde fica salvo |
| --- | --- | --- |
| Visão geral | produtos no site, pedidos em aberto, vendas do mês, aniversariantes, pendências do site | — |
| Produtos | cadastrar, editar, duplicar, ordenar e excluir peças (foto principal + segunda foto, preço, categoria, cores, tamanhos, descrição, link); status disponível / esgotado / oculto | site (após publicar) |
| Categorias | nome, texto, foto, link e ordem dos cards; textos da seção; link do catálogo | site (após publicar) |
| Dados da loja | WhatsApp (com teste do link), e-mail, endereço, mapa, horário, Instagram, serviço do formulário, condições comerciais (com “confirmada”), título e descrição para o Google | site (após publicar) |
| Textos do site | abertura, faixa, vitrine, nossa loja, sobre a Fabielly, contato e rodapé | site (após publicar) |
| Pedidos | registrar vendas (WhatsApp, Instagram, loja), itens a partir dos produtos, desconto, frete, total automático, pagamento, status, entrega; recibo para imprimir; mensagem pronta no WhatsApp; planilha | este navegador |
| Clientes | cadastro com WhatsApp, Instagram, aniversário, tamanho e observações; histórico e total comprado; planilha | este navegador |
| Mensagens | mostra para onde vão as mensagens do formulário; respostas prontas para o WhatsApp | este navegador |
| Publicar | lista do que muda, verificação, **prévia** (celular/tablet/computador), publicação no GitHub, histórico e download manual | GitHub |
| Configurações | conexão com o GitHub, link da caixa de entrada do formulário, backup / restauração dos dados locais | este navegador |

**Como funciona a publicação.** As alterações do site ficam num rascunho (salvo no navegador, não se perde ao
recarregar). Em “Publicar”, o painel gera o `index.html` com o mesmo código do `build.mjs` e envia
`src/content.json`, `index.html` e as fotos novas num **único commit** pela API do GitHub. Antes de publicar,
ele confere se a versão no GitHub mudou desde que a edição começou e pede confirmação para não sobrescrever.
As fotos são redimensionadas (até 1400 px) e convertidas para WebP no próprio navegador.

**Login com senha.** No primeiro acesso em cada aparelho, o painel pede para criar e-mail e senha. A senha não é
guardada: ela gera (PBKDF2-SHA-256, 310 mil iterações) a chave AES-GCM que **criptografa** os pedidos, clientes,
respostas prontas, o rascunho do site e o token do GitHub guardados no aparelho — sem a senha, esses dados não
podem ser lidos e o painel não publica. Detalhes:

- a sessão vale para a aba aberta (recarregar não pede a senha) e termina ao clicar em **Sair**, ao fechar a aba
  ou depois de **1 hora sem uso**;
- após 5 tentativas erradas, o login espera 30 s antes de aceitar outra (o tempo dobra a cada erro, até 15 min);
- **Configurações → Acesso ao painel** troca o e-mail e a senha (tudo é recriptografado de uma vez);
- **“Esqueci minha senha”** não recupera a senha (é impossível sem servidor): apaga os dados deste aparelho e cria
  um acesso novo. O site publicado não é afetado; pedidos e clientes voltam com o backup;
- como não há servidor, cada aparelho tem o seu próprio acesso. Uma conta única para vários aparelhos exigiria um
  serviço de login on-line (ex.: Supabase).

**Token do GitHub.** A publicação usa um *fine-grained personal access token* da dona do repositório, com acesso
só a este repositório e permissão **Contents: Read and write** (o passo a passo está em Configurações).
O token é digitado no painel e fica guardado no aparelho, criptografado com a senha do painel;
ele não vai para o código do site nem para o backup. Sem token, dá para baixar `content.json` e `index.html`
e publicar manualmente.

**Pedidos, clientes e respostas prontas** ficam no IndexedDB do navegador usado. Para não perder dados ou para usar
em outro aparelho, use **Configurações → Baixar backup / Importar backup**. Sincronização automática entre
aparelhos, uma conta única de login e recebimento automático de pedidos exigiriam um banco de dados on-line
(ex.: Supabase ou Firebase), que não foi incluído.

**Acesso.** O endereço `/admin/` não aparece no site e tem `noindex`. Quem o abrir em outro aparelho só vê a tela de
login (e, sem os dados criptografados da loja nem o token, não tem o que ver nem como publicar).

**Branch de publicação.** Por padrão o painel publica na branch `claude/busy-galileo-x8mcr4`, onde o site está hoje.
Quando o site for para a branch principal (ou outro repositório), troque em Configurações.

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

## Publicação

Esta pasta é independente. Atenção: o `CNAME` na raiz deste repositório aponta para o
domínio da Jabuticaba Café. Para publicar a SMUG MODAS no próprio domínio, o ideal é mover
esta pasta para um repositório (ou projeto de hospedagem) separado, com o `CNAME` da SMUG.
Qualquer hospedagem estática serve (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

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
