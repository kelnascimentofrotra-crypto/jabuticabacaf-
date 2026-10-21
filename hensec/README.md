# Helder Segurança · Monitoramento 24h

Site institucional em cinco seções (Início → Proteção → Soluções → Sobre a
Helder Segurança → Contato). O layout veio do documento de referência
`HENSEC_Referencia_Desktop_Cinematografica.pdf` (feito para a marca anterior,
HENSEC); todo o conteúdo, as fotos e o favicon já usam o nome Helder Segurança.
A pasta do projeto continua se chamando `hensec/`.

**Stack:** Vite + HTML/CSS/JS sem framework. O conteúdo é estático, então HTML
semântico com aprimoramento progressivo é o caminho mais enxuto: todo texto,
link e botão existe no HTML (funciona e aparece mesmo sem JavaScript) e o JS
(~4 KB) só cuida de menu, seção ativa, revelações e microparallax.
Fontes auto-hospedadas via `@fontsource` (DM Serif Display + Plus Jakarta Sans).

## Como rodar

```bash
cd hensec
npm install
npm run dev       # desenvolvimento em http://localhost:5173
npm run build     # gera dist/ (caminhos relativos: serve na raiz ou numa subpasta)
npm run preview   # serve o build em http://localhost:4173
```

O conteúdo de `dist/` também abre com dois cliques no `index.html`, sem
servidor: o build usa um script clássico (`defer`) em vez de módulo, porque o
navegador bloqueia módulos e arquivos `crossorigin` abertos direto do disco.

## WhatsApp

Todos os botões de contato abrem o WhatsApp da Helder Segurança
(+55 11 98655-8019) com uma mensagem pronta para cada contexto. O número
(`WHATSAPP_NUMBER`, só dígitos) e as mensagens ficam em `src/config.js`.

## Estrutura

```
index.html            marcação das cenas, navbar e ícones (sprite SVG)
src/config.js         número e mensagens de WhatsApp
src/main.js           links de WhatsApp, menu mobile, seção ativa, reveal, parallax
src/styles/main.css   tokens, layout mobile/tablet e cena desktop
src/styles/shield.css seção The Shield Experience (#protecao)
src/assets/img/       fotografias limpas (WebP)
public/favicon.svg    monograma "HS"
tools/                scripts que geram as imagens (a partir do PDF) e o favicon
```

## Como as imagens foram obtidas

As referências recebidas são imagens achatadas: navbar, títulos, botões e cards
estão "impressos" na foto. Para não duplicar texto nem usar print com áreas
clicáveis falsas, cada cena foi limpa:

- `tools/prepare_assets.py` mascara toda a interface (detecção automática dos
  traços de texto + formas de botões, cards e navbar) e reconstrói as áreas com
  o modelo de inpainting **LaMa**; também recorta as fotos dos três cards.
- O mesmo script troca a marca antiga impressa nas fotos: o escudo + "HENSEC"
  do teclado de alarme e do leitor de acesso e o contato do WhatsApp no
  celular viram "Helder Segurança" (desenhado com a fonte do site, na mesma
  posição, cor e inclinação), e o emblema da manga do técnico é removido.
- A foto de The Shield Experience (`protecao.webp`) é um contraplano da hero:
  recorte mais fechado da mesma casa, espelhado e com tratamento mais frio
  (`shield_shot()` em `tools/prepare_assets.py`). Para usar uma fotografia
  própria, substitua o arquivo e ajuste as coordenadas da camada de vigilância
  no `index.html` (elas estão em pixels da imagem, viewBox 1422 × 921).
- A navbar mostra o nome "Helder Segurança" em texto (classe `.brand-name`),
  sem logotipo. O favicon é um monograma "HS" na fonte dos títulos, gerado por
  `tools/make_favicon.py`.

Limitações honestas:

- As fotos têm a resolução da referência (1672 × 941). Em telas 1920+ ou
  retina há leve perda de nitidez; os cards têm ~490 px de largura de origem.
- As áreas reconstruídas ficam sob degradês escuros, mas são reconstrução,
  não a fotografia original. Na cena Soluções, a região atrás dos cards é
  apenas textura ambiente.

Se existirem as fotos originais sem texto, basta substituir os arquivos em
`src/assets/img/` (mesmos nomes).

## Decisões de layout

- **The Shield Experience** (`#protecao`): seção de 750–950 px no desktop, com
  a coluna de texto alinhada à da seção Sobre. A camada de vigilância (moldura,
  ponto da câmera, etiquetas e varredura) é só ilustrativa: não há gravação,
  transmissão nem sistema conectado. No menu, aparece como "Proteção".

- **Desktop** (≥ 1024 px e paisagem): cada cena ocupa `100svh` e todas as
  medidas derivam de `--u = min(100vw / 1672, 100svh / 941)`, ou seja, 1u = 1 px
  da referência. A composição cabe sempre em uma tela, sem cortes nem rolagem
  interna. Em telas mais largas que 16:9 a coluna de conteúdo mantém a
  proporção da referência e a foto segue de ponta a ponta; em alturas muito
  baixas a seção cresce e a página rola normalmente.
- **Menu:** a lista completa na barra aparece a partir de 1280 px de largura;
  abaixo disso (inclusive no desktop de 1024–1279 px) o menu abre pelo botão.
- **Mobile e tablet:** cenas recompostas (foto em destaque + texto em fluxo),
  menu hambúrguer, cards em coluna (horizontais no tablet) e a foto do celular
  após o CTA de Contato.
- O botão flutuante de WhatsApp some no Contato (que tem o próprio CTA) e,
  no mobile, também na Hero, para não disputar espaço com os botões.
- "Tire suas dúvidas" abre o WhatsApp com mensagem própria (não há FAQ no
  projeto).

## Validação feita

Capturas com Chromium (Playwright) em 1920×1080, 1672×941, 1600×900,
1440×900, 1366×768, 1280×720, 2560×1080, 1024×768, 768×1024, 390×844,
375×812 e 360×800: sem rolagem horizontal, sem erros de console, todas as
cenas desktop dentro de uma viewport, menu ativo acompanhando a rolagem,
cliques nos links âncora alinhando cada cena ao topo, conteúdo visível com
JavaScript desativado e com `prefers-reduced-motion`.
