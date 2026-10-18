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

Todo o conteúdo (textos, imagens, links, contatos e condições comerciais) fica em
**`src/content.mjs`**. Depois de editar, gere o HTML novamente:

```bash
node build.mjs     # ou: npm run build  (Node 18+)
```

O build lista no terminal tudo o que ainda precisa ser configurado.

```
smug-modas/
├── index.html              ← gerado pelo build (não editar à mão)
├── build.mjs               ← monta o index.html e lista pendências
├── src/
│   ├── content.mjs         ← conteúdo central
│   ├── lib.mjs             ← ícones, logo, helpers
│   └── components/         ← header + menu, hero, benefícios, loja,
│                              categorias, sobre, contato, rodapé
└── assets/
    ├── css/styles.css      ← tokens de cor/tipografia + estilos (mobile first)
    ├── js/main.js          ← menu, header, animações, formulário
    ├── fonts/              ← Playfair Display, Jost, Allura (self-hosted, OFL)
    ├── img/                ← fotos em WebP
    └── icons/              ← favicon e ícone para iOS
```

## Pendências antes de publicar

Nenhum dado ilustrativo das referências foi publicado. Enquanto não forem preenchidos
em `src/content.mjs`, os itens de contato aparecem como “Informação a confirmar” e
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
| `fabielly-retrato*.webp` | referência Sobre | restos do título “Fabielly” removidos por preenchimento |
| `loja-ambiente*.webp` | referência Nossa loja | área fotográfica completa |
| `categorias-loja.webp`, `cat-*.webp` | referência Categorias | só a parte da foto acima dos rótulos |
| `contato-recepcao.webp` | referência Contato | lado direito da foto (recepção) |
| `og-smug-modas.jpg` | composição | imagem de compartilhamento (1200×630) |

As referências têm cerca de 850 px de largura, então as fotos ficam um pouco suaves em telas
grandes ou de alta densidade. **Para a versão final, envie as fotos originais em alta resolução**
(Fabielly no fundo creme, Fabielly na loja, ambiente da loja, recepção e as cinco categorias)
e substitua os arquivos mantendo os mesmos nomes, ou atualize `width`/`height` em
`src/content.mjs`.

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

Os ícones de **pesquisa, conta, favoritos e sacola** (`headerActions` em `src/content.mjs`) ainda não têm
loja virtual por trás: ao tocar, mostram o aviso “Este site é apenas uma versão de demonstração…”.
No celular, o header mostra só a sacola; pesquisa, conta e favoritos ficam dentro do menu.
Quando a loja existir, troque cada botão pelo link ou ação real e remova o aviso.

## Acessibilidade e movimento

- HTML semântico, link “Pular para o conteúdo”, foco visível e áreas de toque de pelo menos 44 px.
- Menu mobile em `<dialog>` modal: o foco fica preso no menu, Escape fecha, a rolagem do fundo
  é bloqueada e o foco volta ao botão ao fechar. Ao escolher uma seção, o foco vai para o título dela.
- As animações respeitam `prefers-reduced-motion`. Sem JavaScript, todo o conteúdo continua visível.
