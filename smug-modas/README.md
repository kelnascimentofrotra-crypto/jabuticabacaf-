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

Todo o conteúdo (textos, imagens, links, contatos, produtos e condições comerciais) fica em
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
│   └── components/         ← header + menu, hero, faixa de diferenciais,
│                              produtos, categorias, loja, sobre, contato, rodapé
└── assets/
    ├── css/styles.css      ← tokens de cor/tipografia + estilos (mobile first)
    ├── js/main.js          ← header, menu, animações, formulário, WhatsApp flutuante
    ├── fonts/              ← Playfair Display, Jost, Allura (self-hosted, OFL)
    ├── img/                ← fotos em WebP
    └── icons/              ← favicon e ícone para iOS
```

## Ordem da página

Hero → faixa de diferenciais → **Escolhas da semana** (só com produtos reais) → Categorias →
Nossa loja → Sobre a Fabielly → Contato → Rodapé.

## Pendências antes de publicar

Nenhum dado ilustrativo das referências foi publicado. O que não estiver preenchido em
`src/content.mjs` simplesmente não aparece (sem links falsos, sem “a confirmar” na página),
e o `node build.mjs` lista o que falta.

| Item | Onde | Enquanto estiver vazio |
| --- | --- | --- |
| WhatsApp oficial | `contact.whatsapp` | “Falar com a loja” leva à seção de contato; categorias sem link; sem botão flutuante |
| E-mail | `contact.email` | linha oculta no contato e no rodapé |
| Endereço e link do mapa | `contact.address` | sem endereço; sem o botão “Venha nos visitar” |
| Horário | `contact.hours` | linha oculta |
| Instagram | `contact.social.instagram` | linha oculta |
| Envio do formulário | `form.endpoint` | o formulário não aparece (veja abaixo) |
| Catálogo | `catalog.url` | “Conhecer a coleção” leva às categorias (ou aos produtos, se houver) |
| Produtos | `products.items` | “Escolhas da semana” fica oculta. Cadastre só peças reais, com foto, nome e preço confirmado |
| Condições comerciais | `commercialHighlights` | frete grátis, pagamento seguro e suporte 24/7 ficam ocultos até `confirmed: true` |
| Nomes das categorias | `categories.items` | Roupas, Vestidos, Calçados e Acessórios — confirmar se correspondem ao acervo |
| URL do site | `site.url` | sem canonical, `og:url` e URL nos dados estruturados |

Se nenhum canal nem formulário estiver configurado (situação atual), a seção de contato mostra
apenas o aviso “Os canais de atendimento da SMUG MODAS serão publicados aqui em breve.”

### Destinos dos botões

- **Conhecer a coleção:** `catalog.url` → `#produtos` (com produtos) → `#categorias`.
- **Falar com a loja** (hero, header e menu): WhatsApp com a mensagem de `contact.whatsapp.message` → `#contato`.
- **Categorias:** `items[].url` → `catalog.url` → WhatsApp com “Olá! Vim pelo site da SMUG MODAS e gostaria de
  conhecer os modelos de [categoria].” (codificada na URL). Sem nenhum desses dados, o card não vira link.
- **Produtos:** `url` da peça → `catalog.url` → WhatsApp com `products.whatsappMessage` → `#contato`.

### Formulário de contato

O formulário só é exibido quando `form.endpoint` aponta para um serviço real de envio
(Formspree, Web3Forms, Getform ou API própria). Ele:

- valida nome, e-mail, telefone (opcional, com DDD) e mensagem, com rótulos visíveis e erros específicos;
- mostra “Enviando…” e bloqueia o botão durante o envio;
- só mostra a confirmação quando o servidor responde com sucesso (`2xx`);
- em caso de erro ou demora, avisa e **mantém o que foi digitado**;
- envia JSON ou multipart, conforme `form.format`; sem JavaScript, faz um POST comum.

Não coloque chaves secretas no front-end; serviços como o Formspree usam apenas a URL pública do formulário.

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
`src/content.mjs`.

## Publicação

Esta pasta é independente. Atenção: o `CNAME` na raiz deste repositório aponta para o
domínio da Jabuticaba Café. Para publicar a SMUG MODAS no próprio domínio, o ideal é mover
esta pasta para um repositório (ou projeto de hospedagem) separado, com o `CNAME` da SMUG.
Qualquer hospedagem estática serve (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## Header

O header fixo tem dois estados, controlados em `assets/js/main.js` (`initHeader`):

- **Na hero:** a logo pequena fica oculta (o “SMUG” grande já identifica a marca), os links ficam à esquerda,
  “Falar com a loja” à direita e o fundo é integrado à hero.
- **Após a hero** (classe `is-past-hero`): a logo aparece em bronze escuro (legível sobre o creme), os links
  deslizam para o centro (só com `transform`) e o fundo fica creme opaco, com linha e sombra discretas.

A troca usa `IntersectionObserver` sobre a hero inteira, com 16 px de histerese. Abaixo de `75em` (1200 px)
a navegação usa o menu compacto (`<dialog>` modal); de 600 px em diante, “Falar com a loja” fica visível no header.
Sem JavaScript, o header já nasce no estado “após a hero”. `scroll-padding-top` evita que o header cubra os
títulos ao navegar por âncoras.

## Animações

- **Abertura da hero (≈ 0,9 s):** letras de SMUG sobem em sequência, a Fabielly aparece e o texto com os botões
  entra logo depois. Nada fica escondido por segundos.
- **Ambiente:** sombras de folhas e brilho do sol bem lentos; pausam quando a hero sai da tela. No desktop com
  mouse, as camadas da hero têm uma profundidade sutil. Ao rolar, nada se desloca dentro da hero.
- **Seções:** entradas de 350–650 ms (opacidade + leve deslocamento) e microinterações de 150–250 ms.
- Sem parallax de rolagem, sem sequestro do scroll e sem bibliotecas.

## Acessibilidade e movimento

- HTML semântico, link “Pular para o conteúdo”, foco visível e áreas de toque de pelo menos 44 px.
- Menu mobile em `<dialog>` modal: foco preso no menu, Escape fecha, a rolagem do fundo é bloqueada e o foco
  volta ao botão ao fechar. Ao escolher uma seção, o menu fecha e o foco vai para o título dela.
- Com “reduzir movimento” ativo, tudo aparece pronto e as animações contínuas param.
  Sem JavaScript, todo o conteúdo continua visível.
- Dados estruturados (`ClothingStore`) só com informações confirmadas: sem preços, estoque ou avaliações.
