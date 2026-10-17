# Mundo Solar — site institucional

Site estático (HTML + CSS + JavaScript puro, sem etapa de build) da **Mundo Solar — Energia que transforma**.
Pode ser publicado em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, cPanel etc.): basta
enviar o conteúdo desta pasta para a raiz do domínio.

## Estrutura

```
mundo-solar/
├── index.html              # página principal (todas as seções)
├── privacidade.html        # Política de Privacidade (LGPD)
├── assets/
│   ├── css/styles.css      # design system (tokens) + layout + responsivo
│   ├── js/main.js          # interações + SITE_CONFIG (contatos)
│   ├── js/meta-pixel.js    # Meta Pixel: PageView e Lead (só após consentimento)
│   ├── js/cookies.js       # aviso de cookies (Aceitar / Recusar)
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

Os 9 kits da TABELA MUNDO SOLAR (preços de 17/10/2026: R$ 10.999,00 a R$ 26.499,00) estão em `index.html`, cada um em um `<li class="kit">`. O painel
"Kit selecionado" e a mensagem enviada pelo WhatsApp são montados a partir desses textos, então basta
editar o `<li>` para mudar um kit. Os preços também aparecem no JSON-LD (`hasOfferCatalog`) e na
pergunta "Quanto custa um sistema de energia solar?" do FAQ — atualize junto.

## Pesquisa (lupa)

A lupa do cabeçalho, o campo acima da tabela de kits e os atalhos `/` ou `Ctrl/⌘ + K` abrem a
pesquisa. Quando a pessoa procura algo que não está na tabela (outra marca, outra potência de placa,
inversor ou faixa de preço inexistente), aparece "Não temos esse modelo" com um botão do WhatsApp que já
leva o termo pesquisado na mensagem, e os kits disponíveis logo abaixo. Ela lê os dados da própria página (kits, projetos, FAQ) — ao editar a tabela, a busca se
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

## Meta Pixel (ID do conjunto de dados 1488152875517253)

Toda a medição está em `assets/js/meta-pixel.js`, carregado no `<head>` do `index.html` e do
`privacidade.html`.

- **Consentimento (LGPD):** o Pixel só é carregado depois que o visitante clica em **Aceitar** no aviso
  de cookies (`assets/js/cookies.js`). Sem aceite (ou com "Recusar"), nada é enviado à Meta — por isso
  não há `<noscript>` do Pixel nem `preconnect` para a Meta. A escolha fica salva no navegador
  (`localStorage` "ms-cookie-consent") e pode ser alterada em "Preferências de cookies" no rodapé.
  Ao aceitar, o PageView da página atual é enviado na hora.

- **PageView:** uma vez por página carregada. Âncoras do menu (`#kits`, `#contato`…) não contam como
  nova página. Se o site passar a usar navegação SPA (`history.pushState`), cada troca real de endereço
  conta uma vez.
- **Lead (cliques):** qualquer link cujo destino seja WhatsApp (`wa.me`, `api.whatsapp.com`) ou e-mail
  (`mailto:`), em qualquer parte do site — não é preciso marcar os botões; um link novo para o WhatsApp
  passa a ser medido automaticamente. Parâmetros enviados: `content_name` (ex.: "Kit 700 kWh/mês",
  "Projeto Meneses Gás"), `content_category` (WhatsApp / E-mail), `lead_source` (cabecalho, kits,
  rodape, pesquisa, botao-flutuante…) e, na pesquisa, `search_term`.
- **Lead (formulário de orçamento):** só após o envio válido — o `main.js` dispara o evento
  `mundosolar:lead` depois de abrir o WhatsApp (ou o e-mail) com a mensagem. Abrir o formulário ou
  enviar com campos vazios não conta.
- **Não são Lead:** menu, botões que só abrem o formulário, Instagram, seleção de kit, lupa, FAQ.
- **Sem duplicidade:** o mesmo contato em até 2 s conta uma vez; cada Lead tem `eventID` único
  (pronto para deduplicar com a API de Conversões, se ela for usada no futuro).
- Nenhum dado pessoal digitado no formulário é enviado para a Meta.

Para trocar o Pixel, altere `PIXEL_ID` em `assets/js/meta-pixel.js`.

## Política de Privacidade e cookies

`privacidade.html` explica os dados tratados, bases legais, compartilhamento (Meta e Vercel), cookies e
direitos do titular (art. 18 da LGPD), com os contatos da empresa. Link no rodapé e no aviso de
cookies. Revise o texto sempre que mudar a forma de coletar dados (por exemplo, ao adicionar outra
ferramenta de medição) e atualize a data no início da página.

## Hospedagem na Vercel (mundosolar1.vercel.app)

O site está publicado e configurado para `https://mundosolar1.vercel.app` (URL canônica, Open Graph, sitemap,
robots e JSON-LD). O `vercel.json` desta pasta define cabeçalhos de segurança e de cache.

Pelo painel da Vercel (sem linha de comando):
1. vercel.com → **Add New… → Project** → importe o repositório `jabuticabacaf-` do GitHub.
2. **Project Name:** `mundosolar1` (gera `mundosolar1.vercel.app`).
3. **Root Directory:** `mundo-solar` · **Framework Preset:** Other · sem Build Command.
4. A Vercel publica a branch de produção (por padrão `main`). Para publicar esta versão, faça o merge da
   branch do site na `main` ou, em *Settings → Git → Production Branch*, escolha a branch do site.

Pela linha de comando (com um token da Vercel): dentro desta pasta,
`npx vercel deploy --prod --name mundosolar1 --token SEU_TOKEN`.

Se o domínio mudar (por exemplo, um domínio próprio), troque
`https://mundosolar1.vercel.app` pelo domínio novo em `index.html`, `sitemap.xml` e `robots.txt`.

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

### Alto padrão (empresas) — bloco `#alto-padrao`

No início da seção de Projetos. Dados exatamente como nos posts da Mundo Solar:

| Empresa | Geração | Economia mensal | Economia anual | Equipamento | Foto |
| --- | --- | --- | --- | --- | --- |
| Carajás Motos Yamaha (destaque) | 7.000 kWh | R$ 8.000,00 | R$ 96.000,00 | — | `projeto-carajas-motos-yamaha.webp` |
| Meneses Gás | 3.600 kWh | R$ 3.200,00 | R$ 38.400,00 | Microinversor Growatt 2000W | `instalacao-comercial-aerea.webp` (mesma foto do topo) |
| Academia Athletica Person | 2.500 kWh | R$ 2.300,00 | R$ 27.600,00 | — | `projeto-academia-athletica-person.webp` |
| Disk Bebidas Pingo de Ouro | 2.000 kWh | R$ 2.300,00 | R$ 27.600,00 | 02 Inversores SOFAR | `projeto-disk-bebidas-pingo-de-ouro.webp` |
| Bolos do Sítio | 1.800 kWh | R$ 2.200,00 | R$ 26.400,00 | Microinversor Deye monofásico 220V | `projeto-bolos-do-sitio.webp` |

A faixa de totais (16.900 kWh · R$ 18.000/mês · R$ 216.000/ano) é a soma desses cinco projetos — se
mudar algum valor, atualize os totais. As fotos `usina-estrutura-elevada-*.webp` aparecem sem nome nem
números até que a empresa confirme esses dados. Cada card tem um botão "Quero um projeto assim" que abre o
WhatsApp citando o projeto (atributo `data-wa-msg`).

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
