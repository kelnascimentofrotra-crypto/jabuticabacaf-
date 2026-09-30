# Mundo Solar — site institucional

Site estático (HTML + CSS + JavaScript puro, sem etapa de build) da **Mundo Solar — Energia que transforma**.
Pode ser publicado em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, cPanel etc.): basta
enviar o conteúdo desta pasta para a raiz do domínio.

## Estrutura

```
mundo-solar/
├── index.html              # página única com as 10 seções
├── assets/
│   ├── css/styles.css      # design system (tokens) + layout + responsivo
│   ├── js/main.js          # interações + SITE_CONFIG (contatos)
│   ├── fonts/              # Sora e Inter (self-hosted, woff2)
│   └── img/                # fotos reais das instalações (WebP) + og-image.jpg
├── favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192/512.png
├── site.webmanifest
├── robots.txt
└── sitemap.xml
```

Para testar localmente: `python3 -m http.server` dentro desta pasta e abra `http://localhost:8000`.

## Dados da empresa

- WhatsApp: (94) 9124-3878 · Instagram: @mundosolar.redencao · E-mail: atendimentomundosolar@gmail.com
- Localização: Redenção — PA
- No mercado de energia solar desde 2020; Mundo Solar fundada em 2022
- +500 usinas entregues · +500 famílias e empresas atendidas (seção Sobre)

## Logo

O monograma "MS" é uma **recriação vetorial** da logo enviada (símbolo `#logo-ms` no início do
`<body>` do `index.html`), usada no cabeçalho, no rodapé, no favicon (`favicon.svg` e PNGs) e na
imagem de compartilhamento (`assets/img/og-image.jpg`). Quando o arquivo original da logo estiver
disponível (de preferência SVG ou PNG com fundo transparente), substitua o conteúdo do símbolo — ou
troque os `<svg class="brand__mark">` por `<img>` — e gere o favicon a partir dele.

Os contatos ficam em `SITE_CONFIG`, no topo de `assets/js/main.js` (botões de WhatsApp, formulário de
orçamento e rodapé), e também escritos no rodapé do `index.html` e nos dados estruturados (JSON-LD).
Se algum contato mudar, atualize os três lugares.

## Tabela de kits (seção `#kits`)

Os 9 kits da TABELA MUNDO SOLAR estão em `index.html`, cada um em um `<li class="kit">`. O painel
"Kit selecionado" e a mensagem enviada pelo WhatsApp são montados a partir desses textos, então basta
editar o `<li>` para mudar um kit. Os preços também aparecem no JSON-LD (`hasOfferCatalog`) e na
pergunta "Quanto custa um sistema de energia solar?" do FAQ — atualize junto.

## Pesquisa (lupa)

A lupa do cabeçalho, o campo acima da tabela de kits e os atalhos `/` ou `Ctrl/⌘ + K` abrem a
pesquisa. Ela lê os dados da própria página (kits, projetos, FAQ) — ao editar a tabela, a busca se
atualiza sozinha. Entende consumo ("650 kWh" ou só "650" → indica o menor kit que atende), número de
placas ("10 placas"), inversor ("6kW"), preço ("até 12 mil", "R$ 15.000", "mais barato"),
"leste oeste", marcas (RONMA, AUXSOL) e palavras-chave, sem diferenciar acentos e tolerando pequenos
erros de digitação. O código fica em `assets/js/main.js`, bloco "Pesquisa (lupa)".

## Menu com linha dourada

No desktop, uma linha dourada desliza até o item do menu da seção visível enquanto a página rola, e
antecipa o destino ao passar o mouse. Seções que não estão no menu (Benefícios, FAQ) mantêm o item
anterior destacado.

## Clientes (seção `#depoimentos`)

A seção lista os clientes dos projetos, sem frases inventadas. Para publicar depoimentos em texto, use
somente falas reais, autorizadas pelos clientes.

## Pendente: domínio

Quando o domínio definitivo estiver no ar:
- em `index.html`, adicione `<link rel="canonical" href="https://SEU-DOMINIO/">` e troque
  `og:image`/`twitter:image` por URLs absolutas; no JSON-LD, acrescente `"url"`;
- em `sitemap.xml`, substitua `https://www.seudominio.com.br/`;
- em `robots.txt`, descomente a linha `Sitemap:`.

## Projetos

Os dados dos quatro projetos (kWh/mês, painéis, inversores, nome e cidade) estão em `index.html`,
seção `#projetos`, exatamente como informados pela empresa. As fotos foram associadas aos projetos pela
quantidade de painéis visível em cada imagem — confirme se cada foto corresponde ao projeto certo e, se
precisar trocar, altere apenas o `src`/`srcset` da imagem no card.

| Projeto | Foto usada |
| --- | --- |
| 01 — Goianésio Selaria | `instalacao-telhado-ceramico.webp` |
| 02 — Verá Lúcia | `instalacao-residencial-telhado-ceramico.webp` |
| 03 — Gilvan Barbearia Fashion Man | `instalacao-aerea-residencial.webp` |
| 04 — Telma Freitas | `instalacao-aerea-telhado-metalico.webp` |

## Cache (versão dos arquivos)

O `index.html` carrega `styles.css?v=...` e `main.js?v=...`. Ao alterar o CSS ou o JS, troque o valor de
`v` (qualquer texto novo serve) para que os navegadores baixem a versão atualizada em vez da guardada
em cache.

## Imagens

Cada foto tem duas versões: original (até ~1120 px) e `-640` para telas pequenas, servidas via `srcset`.
Para adicionar uma nova foto, exporte em WebP (qualidade ~80) nas duas larguras e mantenha o mesmo padrão
de nome.

## Créditos

Ícones: [Lucide](https://lucide.dev) (ISC) e [Simple Icons](https://simpleicons.org) (CC0), embutidos
como sprite SVG no `index.html`. Fontes: Sora e Inter (SIL Open Font License).
