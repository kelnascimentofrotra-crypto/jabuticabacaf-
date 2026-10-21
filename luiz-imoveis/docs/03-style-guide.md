# 3. Style Guide

> Conceito visual: **"galeria silenciosa"**. O site se comporta como uma galeria de arte — paredes neutras, iluminação precisa, muito espaço livre — e o imóvel é a obra em exposição. O luxo aparece na contenção, nunca no excesso.

Todos os valores abaixo existem como *custom properties* em `../assets/css/styles.css` (seção 1, "Tokens").

---

## 3.1 Cores

### Paleta

| Amostra | Nome | Token | HEX | RGB | Uso |
|---------|------|-------|-----|-----|-----|
| ⬛ | **Preto fosco (Onyx)** | `--onyx` | `#141414` | 20, 20, 20 | Hero, contato, rodapé, menu, botões primários |
| ⬛ | **Grafite** | `--graphite` | `#1E1E1E` | 30, 30, 30 | Superfícies sobre o preto (cartão do formulário) |
| ◼️ | **Cinza ardósia** | `--slate` | `#4B535A` | 75, 83, 90 | Fundo de imagens carregando, hover de botões escuros |
| ◻️ | **Ardósia clara (Névoa)** | `--mist` | `#8A9097` | 138, 144, 151 | Texto secundário sobre preto |
| ⬜ | **Off-white (Marfim)** | `--ivory` | `#F6F3EE` | 246, 243, 238 | Fundo principal; texto sobre escuro |
| ⬜ | **Linho** | `--linen` | `#ECE7DF` | 236, 231, 223 | Seções alternadas, cartão de valor |
| ⬜ | **Pedra** | `--stone` | `#D9D3C9` | 217, 211, 201 | Linhas, separadores, grade do mapa |
| ⬛ | **Tinta** | `--ink` | `#1A1A1A` | 26, 26, 26 | Texto principal sobre claro |
| ◼️ | **Taupe** | `--taupe` | `#5E5A54` | 94, 90, 84 | Texto secundário sobre claro |
| 🟫 | **Dourado escovado** | `--gold` | `#B09265` | 176, 146, 101 | Fios, sublinhados ativos, ícones, botão de destaque |
| 🟫 | **Dourado claro** | `--gold-soft` | `#C9AD7F` | 201, 173, 127 | Rótulos e destaques sobre preto |
| 🟫 | **Bronze** | `--bronze` | `#7D5F3D` | 125, 95, 61 | Rótulos (eyebrows), itálicos de destaque e foco sobre claro |

### Contraste (WCAG 2.1)

| Combinação | Razão | Resultado |
|------------|-------|-----------|
| Tinta `#1A1A1A` sobre Marfim `#F6F3EE` | 15,7 : 1 | AAA |
| Taupe `#5E5A54` sobre Marfim | 6,2 : 1 | AA (texto normal) |
| Taupe sobre Linho `#ECE7DF` | 5,6 : 1 | AA |
| Bronze `#7D5F3D` sobre Marfim | 5,3 : 1 | AA |
| Marfim sobre Onyx `#141414` | 16,6 : 1 | AAA |
| Névoa `#8A9097` sobre Onyx | 5,7 : 1 | AA |
| Dourado `#B09265` sobre Onyx | 6,3 : 1 | AA |
| Dourado claro `#C9AD7F` sobre Onyx | 8,6 : 1 | AAA |
| Onyx sobre Dourado (botão) | 6,3 : 1 | AA |
| ⚠️ Dourado `#B09265` sobre Marfim | 2,7 : 1 | **Reprovado** — use Bronze |

### Regras de uso

- **Proporção 60 / 30 / 10:** 60% tons claros (marfim, linho), 30% escuros (onyx, ardósia), **no máximo 10%** de metálicos. O dourado é um fio, não uma superfície.
- **Dourado nunca é texto sobre fundo claro.** Sobre claro, o acento é o **bronze**.
- **Proibido:** vermelho, amarelo, laranja, gradientes coloridos, selos de "promoção", sombras pesadas. O único estado "de alerta" (erro de formulário) usa um terracota dessaturado (`#E3B7A6`), sem vermelho puro.
- **Ritmo de fundos:** alternar marfim → linho → marfim → preto ao longo da página cria capítulos sem precisar de divisórias.

---

## 3.2 Tipografia

### Famílias

| Função | Fonte (protótipo, Google Fonts) | Por quê | Alternativas premium licenciadas |
|--------|--------------------------------|---------|----------------------------------|
| **Títulos (serifa)** | **Cormorant Garamond** 300/400/500 + itálico | Garamond de alto contraste, desenhada para tamanhos grandes; itálico caligráfico elegante; transmite tradição sem parecer antiquada | Canela, GT Super Display, Ogg, Tiempos Headline |
| **Texto e interface (sans-serif)** | **Manrope** 300/400/500/600 | Geométrica-humanista, excelente legibilidade em telas pequenas, números claros | Neue Haas Unica, Suisse Int'l, GT America |

> Em produção, as fontes devem ser **auto-hospedadas** (`next/font`), com `font-display: swap` e subset latino — sem requisições a terceiros (melhor desempenho e privacidade/LGPD).

### Escala tipográfica (fluida, mobile → desktop)

| Token | Uso | Fonte / peso | Tamanho (390 px → 1440 px) | Altura de linha | Espaçamento |
|-------|-----|--------------|----------------------------|-----------------|-------------|
| `--fs-display` | Título do hero | Cormorant 300 | 44 → 103 px (máx. 108) | 0,98 | −0,01 em |
| `--fs-h1` | Título de página / imóvel | Cormorant 300 | 40 → 76 px (máx. 80) | 1,04 | −0,01 em |
| `--fs-h2` | Título de seção | Cormorant 400 | 34 → 59 px (máx. 60) | 1,04 | −0,01 em |
| `--fs-h3` | Subtítulos, nomes nos cards | Cormorant 400 | 24 → 32 px | 1,15 | 0 |
| `--fs-lead` | Parágrafo de abertura | Cormorant 400 | 20 → 30 px | 1,4 | 0 |
| `--fs-body` | Texto corrido | Manrope 400 | 16 → 17 px | 1,7 | 0 |
| `--fs-small` | Fichas, notas | Manrope 400 | 14 px | 1,6 | 0 |
| `--fs-eyebrow` | Rótulos de seção | Manrope 500, CAIXA-ALTA | 12 px | 1 | **0,22 em** |
| Botões / navegação | — | Manrope 500, CAIXA-ALTA | 12–13 px | 1 | 0,12–0,14 em |

### Regras

1. **Um itálico por título.** O itálico em serifa marca a "virada" emocional da frase: *Exclusividade encontra **seu novo lar.***
2. **Caixa-alta só em rótulos curtos** (eyebrows, botões, navegação) e sempre com espaçamento generoso. Nunca em frases inteiras.
3. **Máximo de duas famílias** e quatro pesos por página.
4. **Medida de linha:** 45–75 caracteres no texto corrido (`max-width: 62ch`).
5. **Números grandes** (estatísticas, ficha técnica) usam a serifa em peso 300 — os algarismos *oldstyle* da Cormorant reforçam o tom editorial.

---

## 3.3 Espaço, grid e formas

### Espaçamento (base 8 px)

| Token | Valor | Uso |
|-------|-------|-----|
| `--gutter` | 20 → 64 px | Margens laterais |
| `--section` | 88 → 176 px | Respiro vertical entre seções |
| Espaços internos | 8 · 16 · 24 · 32 · 48 · 64 · 96 px | Múltiplos de 8 |
| `--maxw` | 1440 px | Largura máxima do conteúdo |
| `--header-h` | 72 px (mobile) · 88 px (desktop) | Altura do cabeçalho |

> **Espaço negativo é conteúdo.** Em caso de dúvida, aumente o respiro em vez de acrescentar um elemento.

### Grid e breakpoints (mobile-first)

| Faixa | Colunas | Comportamento-chave |
|-------|---------|---------------------|
| 0–639 px | 4 | Uma coluna de cards; categorias em carrossel; filtros em *bottom sheet* |
| 640–899 px | 8 | Galeria em 2 colunas; botão "Agendar visita" aparece no cabeçalho |
| 700 px + | — | Cards em 2 colunas com deslocamento alternado |
| 900–1099 px | 12 | Categorias em 3 colunas; Sobre em duas colunas; galeria do imóvel em mosaico |
| 1024 px + | 12 | Filtros em linha; layout de detalhe com cartão de valor fixo |
| 1100 px + | 12 | Navegação completa no cabeçalho; cards em 3 colunas com coluna central deslocada |
| 1440 px + | 12 | Conteúdo centralizado com largura máxima |

**Assimetria intencional:** a coluna central das grades (categorias e imóveis) é deslocada para baixo (`48–96 px`), criando o ritmo de uma revista de arquitetura em vez de uma planilha.

### Formas

- **Cantos retos (raio 0)** em botões, cards, imagens e campos — precisão arquitetônica.
- **Círculos** apenas para botões de ícone, avatar e WhatsApp flutuante.
- **Linhas de 1 px** (`--line-light` / `--line-dark`) como principal recurso de estrutura.
- **Sem sombras**, exceto a sombra suave do botão flutuante.

### Iconografia

Traço linear de **1,25 px**, grade 24 × 24, pontas arredondadas, sem preenchimento (referência: Phosphor *Light* ou Lucide com `stroke-width: 1.25`). Ícones sempre acompanham texto; nunca substituem rótulos.

---

## 3.4 Componentes

| Componente | Variantes | Estados |
|------------|-----------|---------|
| **Botão** | `dark` (preto), `light` (contorno claro sobre foto), `ghost` (contorno), `gold` (destaque, 1 por tela), `sm`, `block` | Hover/foco: preenchimento desliza da esquerda (450 ms) e a seta avança 4 px |
| **Link editorial** | Claro / escuro | Fio base a 12% → sublinhado cheio cresce da esquerda |
| **Card de residência** | Venda, Locação, Lançamento (selo), Exclusivo/Sob consulta | Hover: zoom 1,045 em 1,4 s, troca para 2ª foto, surge "Ver residência"; foco: contorno bronze |
| **Campo de formulário** | Texto, e-mail, telefone (máscara), data, select, textarea | Rótulo flutuante; fio dourado no foco; erro em terracota com mensagem humana |
| **Chips** | Claro / escuro | Selecionado = preenchido (preto no claro, marfim no escuro) |
| **Controle segmentado** | Modalidade (Venda/Aluguel/Lançamentos) | Ativo = sublinhado dourado animado |
| **Selo** | Lançamento · Entrega AAAA, Locação, Exclusivo | Fundo marfim 92%, caixa-alta 11 px |
| **Lightbox** | Galeria em tela cheia | Setas, teclado (← →, Esc), gesto de deslizar, contador "3 / 8" |

---

## 3.5 Movimento e micro-interações

**Princípios:** entrar devagar, responder rápido. Nada pisca, quica ou gira. O movimento imita a câmera de um filme de arquitetura: deslizamentos lentos, revelações suaves.

| Token | Valor | Uso |
|-------|-------|-----|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Padrão de entrada (expo-out) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Revelações tipo "cortina" |
| `--dur-fast` | 200 ms | Cores, opacidade de controles |
| `--dur-base` | 450 ms | Botões, sublinhados, menus |
| `--dur-slow` | 900 ms | Revelação de textos, fios dourados |
| `--dur-xslow` | 1 400 ms | Zoom de imagens |

| Elemento | Gatilho | Animação |
|----------|---------|----------|
| Foto do hero | Carregamento | Zoom de 1,1 → 1,0 em 2,8 s |
| Textos e blocos | Entrar na tela (scroll) | Opacidade 0 → 1 e deslocamento de 28 px, em cascata (80–120 ms entre itens) |
| Imagens editoriais (galeria, retrato) | Entrar na tela | Revelação em "cortina" (`clip-path`) + leve zoom-out |
| Números | Entrar na tela | Contagem crescente em 1,8 s |
| Cabeçalho | Rolagem | Sólido após 60 px; oculta ao descer, reaparece ao subir |
| Card | Hover | Zoom lento + troca de foto + botão "Ver residência" |
| Categoria | Hover | Zoom + fio dourado atravessa o card |
| Menu mobile | Abrir | Fundo em fade; links sobem em cascata (70 ms) |
| Filtros | Alteração | Grade some (200 ms) e os novos cards entram em cascata |
| Navegação entre páginas | Clique | *View Transitions API* (fade de 450 ms) onde suportado |

**Acessibilidade de movimento:** com `prefers-reduced-motion: reduce`, todas as animações são desativadas e o conteúdo aparece imediatamente. Não há carrosséis com troca automática.

---

## 3.6 Diretrizes de fotografia

A fotografia é o produto. Um imóvel de R$ 30 milhões com fotos de celular parece um imóvel de R$ 3 milhões.

### Direção de arte

| Tema | Diretriz |
|------|----------|
| **Luz** | Fachadas na *golden hour* ou na *blue hour* (luzes internas acesas). Interiores com luz natural difusa, cortinas abertas, todas as lâmpadas da cena acesas para equilibrar. Nunca flash direto. |
| **Composição** | Verticais 100% corrigidas. Câmera a 1,2–1,5 m do piso. Lentes equivalentes a 24–35 mm; evitar ultra grande-angular (< 16 mm) que distorce e "mente" sobre o espaço. |
| **Narrativa** | Sequência fixa: fachada/chegada → social → cozinha → íntimo → banho → lazer → detalhes → entorno/vista. A 1ª foto é a capa; a 2ª é revelada no hover do card — escolha um contraste (exterior → interior). |
| **Detalhes** | 20–30% do ensaio em planos fechados: texturas, materiais, marcenaria, metais, luz atravessando um ambiente. São eles que alimentam a galeria masonry. |
| **Produção** | Ambientes despersonalizados: sem fotos de família, documentos, eletrônicos, fios ou objetos de limpeza. Flores e livros com moderação. |
| **Pessoas** | Ausentes, ou silhuetas desfocadas que dão escala. Nunca rostos de moradores. |
| **Cor e tratamento** | Neutro-quente, consistente entre todos os imóveis (preset único). Sem HDR exagerado, sem céu substituído artificialmente, sem saturação de verdes/azuis. |
| **Privacidade** | Não fotografar número da casa, placas de carro ou referências que revelem o endereço exato. |
| **Retrato de Luiz** | Preto e branco, luz natural lateral, em um ambiente arquitetônico; postura relaxada, olhar fora da câmera. Nada de braços cruzados ou "pose de vendedor". |

### Especificações técnicas

| Item | Especificação |
|------|---------------|
| Quantidade por imóvel | 15–30 fotos + 1 vídeo (30–60 s) + drone quando o entorno for diferencial |
| Arquivo master | ≥ 4 000 px no lado maior, sRGB, sem compressão destrutiva |
| Entrega web | AVIF/WebP via CDN de imagens, larguras 480 · 800 · 1200 · 1600 · 2560 px, `srcset` + `sizes` |
| Proporções | Hero 16:9 (desktop) e 4:5 (mobile, recorte próprio); card 4:5; galeria livre (3:2, 4:5, 1:1, 3:4); Open Graph 1200 × 630 |
| Peso-alvo | Hero mobile ≤ 250 KB; card ≤ 120 KB; lightbox ≤ 600 KB |
| Carregamento | Hero com `fetchpriority="high"`; demais com `loading="lazy"`; *placeholder* tonal (cinza ardósia) ou *blur* para evitar saltos de layout |
| Vídeo do hero (opcional) | 8–15 s em loop, sem áudio, H.265/H.264 + WebM, ≤ 4 MB, 1080p desktop / 720p mobile, com imagem *poster*; desativado com `prefers-reduced-motion` e economia de dados |
| Texto alternativo | Descritivo e factual: "Sala de estar com pé-direito duplo voltada para o jardim" — nunca "imagem1.jpg" ou "foto linda" |

---

## 3.7 Acessibilidade (checklist visual)

- Contraste mínimo AA em todos os textos (tabela 3.1).
- Foco visível em todos os elementos interativos (contorno bronze/dourado de 1 px com afastamento de 4 px).
- Alvos de toque ≥ 44 × 44 px.
- Rótulos visíveis em todos os campos — o placeholder nunca substitui o rótulo.
- Erros descritos em texto, não apenas por cor.
- Movimento reduzido respeitado; nenhuma informação depende de animação.
