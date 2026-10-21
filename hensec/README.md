# HENSEC · Monitoramento 24h

Site institucional em quatro cenas (Hero → Soluções → Sobre a Hensec → Contato),
construído a partir do documento `HENSEC_Referencia_Desktop_Cinematografica.pdf`.

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

## Pendência de configuração

- **Número de WhatsApp:** defina `WHATSAPP_NUMBER` em `src/config.js`
  (formato `55DDDNUMERO`, só dígitos). As mensagens de cada botão ficam no
  mesmo arquivo. Enquanto estiver vazio, os botões abrem o WhatsApp com a
  mensagem pronta, mas sem destinatário.

## Estrutura

```
index.html            marcação das 4 cenas, navbar, ícones (sprite SVG) e logo
src/config.js         número e mensagens de WhatsApp
src/main.js           links de WhatsApp, menu mobile, seção ativa, reveal, parallax
src/styles/main.css   tokens, layout mobile/tablet e cena desktop
src/assets/img/       fotografias limpas (WebP)
public/favicon.svg    escudo HENSEC
tools/                scripts que geraram as imagens e a logo a partir do PDF
```

## Como as imagens foram obtidas

As referências recebidas são imagens achatadas: navbar, títulos, botões e cards
estão "impressos" na foto. Para não duplicar texto nem usar print com áreas
clicáveis falsas, cada cena foi limpa:

- `tools/prepare_assets.py` mascara toda a interface (detecção automática dos
  traços de texto + formas de botões, cards e navbar) e reconstrói as áreas com
  o modelo de inpainting **LaMa**; também recorta as fotos dos três cards.
- `tools/trace_logo.py` vetoriza o escudo e a palavra "HENSEC" da navbar; a
  linha "MONITORAMENTO 24HS" é texto SVG.

Limitações honestas:

- As fotos têm a resolução da referência (1672 × 941). Em telas 1920+ ou
  retina há leve perda de nitidez; os cards têm ~490 px de largura de origem.
- As áreas reconstruídas ficam sob degradês escuros, mas são reconstrução,
  não a fotografia original. Na cena Soluções, a região atrás dos cards é
  apenas textura ambiente.
- A logo é uma vetorização da referência, não o arquivo oficial.

Se existirem as fotos originais sem texto ou a logo vetorial oficial, basta
substituir os arquivos em `src/assets/img/` (mesmos nomes) e o `<path>` da logo
no `index.html`.

## Decisões de layout

- **Desktop** (≥ 1024 px e paisagem): cada cena ocupa `100svh` e todas as
  medidas derivam de `--u = min(100vw / 1672, 100svh / 941)`, ou seja, 1u = 1 px
  da referência. A composição cabe sempre em uma tela, sem cortes nem rolagem
  interna. Em telas mais largas que 16:9 a coluna de conteúdo mantém a
  proporção da referência e a foto segue de ponta a ponta; em alturas muito
  baixas a seção cresce e a página rola normalmente.
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
