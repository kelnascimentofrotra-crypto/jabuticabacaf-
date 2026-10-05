Crie do zero um site de corretor de imóveis em HTML, CSS e JavaScript puro (sem framework, sem build). Ele precisa ser uma réplica fiel do site que descrevo abaixo. Quero só a parte pública que o visitante vê depois de entrar: as 6 cenas, o topo, o menu, a busca, o detalhe do imóvel, os favoritos e o carrinho. NÃO faça tela de entrada/login nem painel administrativo. Escreva todos os textos da interface em português do Brasil.

## 1. Arquivos

- `index.html`: todo o HTML do site, com um sprite SVG inline de ícones (seta, coração, mais, fechar, busca, usuário, telefone, e-mail, alfinete, casa, WhatsApp, play, carrinho, olho).
- `styles.css`: todo o visual.
- `app.js`: todo o comportamento, dentro de uma função que roda no `DOMContentLoaded`.
- `data.js`: os dados (imóveis, avaliações e configurações) em `window.SITE_DATA`. O código não pode ter nenhum dado fixo fora desse arquivo, para depois ser fácil ligar num banco (Supabase).
- `fonts/`: Inter Tight (texto), Newsreader (títulos serifados), Sacramento (assinatura) e Playfair Display (monograma), em woff2 servidos localmente, com `@font-face` e `preload`.
- `assets/`: uma foto grande de casa moderna com piscina para a abertura (em 960, 1280 e 1840 px, webp), e as fotos dos imóveis em `assets/imoveis/<slug>-<n>.webp`, cada uma com miniatura `<slug>-<n>-thumb.webp` (700 px no lado maior).

## 2. Marca

- Assinatura no lugar de logo: `<span class="brand"><span class="brand-s">Thiago</span><span class="brand-tl">TL</span><span class="brand-s">Liro</span></span>`.
  - `.brand-s`: Sacramento, 1em, cor do texto do contexto.
  - `.brand-tl`: Playfair Display 500, 1.3em, `letter-spacing: -0.13em`, `margin: 0 .2em 0 .14em`. Recebe um degradê verde pela variável `--brand-grad`, aplicado com `background-clip: text`. No claro: `#5a8a4a → #416734 → #2f4f26`. No escuro: `#e2f1d8 → #b0d89c → #84b46f`.
  - Deixe o nome e as iniciais configuráveis em `data.js`.
- Ícone da aba: "TL" em Playfair, com degradê verde-claro, sobre um quadrado verde-floresta de cantos arredondados.

## 3. Paleta e tokens (CSS custom properties)

Contexto claro (`:root`):
- `--bg: #faf8f3`, `--fg-rgb: 29 33 27`, `--acc-rgb: 196 146 76`, `--surf-rgb: 255 255 255`, `--panel: #fff`, `--panel-2: #f3eee4`
- `--gold: #416734` (é o verde de destaque; o nome ficou de uma versão antiga), `--gold-grad: linear-gradient(180deg,#4f7d41,#416734 55%,#385b2d)`, `--on-gold: #fff`
- `--ease-out: cubic-bezier(.16,1,.3,1)`, `--ease-cut: cubic-bezier(.77,0,.18,1)`

Contexto escuro, verde-floresta. Vale para `.menu`, `.scene[data-tone="dark"]`, `.m-hero`, `.tone-dark`, e para o topo e o indicador quando `body[data-tone="dark"]`:
- `--bg: #12221a`, `--fg-rgb: 243 237 228`, `--acc-rgb: 150 196 130`, `--surf-rgb: 13 27 19`, `--panel: #172a1f`, `--panel-2: #1d3326`
- `--gold: #9ccb88`, `--gold-grad: linear-gradient(180deg,#5f9a4b,#4c7f3d 50%,#416734)`, `--on-gold: #fff`

Derive o resto desses tokens em cada contexto: `--ink: rgb(var(--fg-rgb))`, `--muted: rgb(var(--fg-rgb)/.6)`, linhas `rgb(var(--acc-rgb)/.3)` e vidro `rgb(var(--surf-rgb)/.7)`. Assim qualquer peça fica certa no claro e no escuro, sem regra extra.

Unidade de layout: `--u: min(1vw, 1.7699svh)`. Todo o desktop é medido em `--u`, para cada cena caber inteira na tela, sem rolagem, em qualquer janela. Outras variáveis: `--radius: calc(2.2*var(--u))`, `--frame-l: 38vw`, `--frame-r: 2.6vw`.

## 4. Estrutura: cenas de tela cheia, como num filme

- `body { overflow: hidden }`. As 6 cenas são `<section class="scene">` com `position: absolute; inset: 0`, e só a ativa fica visível.
- Ordem das cenas, com o `id` e o rótulo de cada uma:
  1. `inicio` ("Início")
  2. `filtro` ("Filtro")
  3. `curadoria` ("Alto padrão")
  4. `instagram` ("Instagram")
  5. `avaliacoes` ("Avaliações")
  6. `contato` ("Contato")
- Instagram, Avaliações e Contato têm `data-tone="dark"`. Ao trocar de cena, copie o tom para `body[data-tone]`, para o topo mudar de cor junto.
- Troca de cena (`go(i)`):
  - trava por cerca de 900 ms;
  - a cena que sai recebe `.is-leaving` (encolhe para `scale(.93)` e escurece);
  - a que entra recebe `.is-active .is-entering`;
  - o body recebe `.is-cutting`, que mostra **barras de cinema** pretas (`.letterbox`, em cima e embaixo) crescendo até `6.5svh` e voltando, em 0,85 s.
  - Os elementos com a classe `.rv` sobem e aparecem em sequência, com o atraso em `style="--d: .5s"`.
  - Respeite `prefers-reduced-motion`, sem animações nesse caso.
- Navegação:
  - roda do mouse, com detecção de inércia: soma o delta, troca quando passar de 28, e ignora a cauda do trackpad;
  - setas do teclado, PageUp/PageDown, Home/End;
  - deslizar o dedo na vertical (mais de 60 px);
  - qualquer elemento com `[data-go="id"]`;
  - hash na URL (`#contato`).
  - Se a cena for maior que a tela (celular pequeno), rola a cena por dentro antes de trocar.
- **Topo fixo** (`.topbar`, a `3u` do topo, com `4.4u` de altura):
  - assinatura à esquerda;
  - no centro, uma **pílula de navegação** de vidro com os 6 itens, borda bege `rgb(acc/.62)`, `backdrop-filter: blur(10px)`, e uma **bolinha verde deslizante** (`.nav-glider`) que anda até o item ativo (0,7 s, ease-out);
  - à direita, botões redondos de busca e conta (com contador de favoritos) e um botão de 3 pontinhos que abre o menu.
- **Indicador lateral** (desktop): número da cena ("01"), 6 tracinhos clicáveis, o total ("06") e o nome da cena escrito na vertical, na borda esquerda.
- O `document.title` muda com a cena: "Thiago Liro — Flats mobiliados" no início; depois, "<Cena> — Thiago Liro".

## 5. As cenas

**01 Início (claro).**
- Texto à esquerda (a `8.6vw`), com ~`42u` de largura:
  - acima do título, a etiqueta "FLATS MOBILIADOS" com um tracinho bege antes;
  - título "Vamos encontrar o seu *recanto*" (Inter Tight 500, `4.35u`, `letter-spacing -0.045em`, a palavra em itálico em verde);
  - botão de contorno "Ver imóveis →" e o texto "ROLE PARA EXPLORAR", com uma linha animada.
- Abaixo, um **cartão grande arredondado** (`.media`, de `6vw` até `2.6vw` da direita, começando em `29.2u` do topo) com a foto da casa. Use a mesma foto em duas camadas: a de dentro é cortada pelo cartão; a de fora mostra só o que passa do topo do cartão, então **o telhado sai para fora do cartão** (efeito 3D).
- Sobre o cartão, peças de vidro branco (`rgba(255,255,255,.72)`, `blur(16px)`):
  - selo no canto superior esquerdo: "CASAS SELECIONADAS PARA / UM JEITO ÚNICO DE VIVER";
  - faixa de números embaixo à esquerda: Cidades, Famílias, Anos e Nota média, com contagem animada de 0 até o valor. Um número vazio esconde o item;
  - dois cartõezinhos embaixo à direita. O primeiro mostra "+N imóveis selecionados", com 3 miniaturas redondas. O segundo mostra o primeiro imóvel em destaque: foto pequena, nome, cidade e um botão verde redondo de seta que abre o detalhe.
- Leve parallax com o mouse (`--mx/--my`) na foto.

**02 Filtro (claro).**
- À esquerda: etiqueta "FILTRO", título "Encontre o imóvel certo", subtítulo e uma foto com legenda.
- À direita, um painel com grupos de chips:
  - O que você procura: Comprar ou alugar / Comprar / Alugar;
  - Tipo: Todos / Casas / Apartamentos / Terrenos (Comerciais e Outros só aparecem se existirem);
  - Cidade: chips gerados a partir dos imóveis;
  - Quartos: Qualquer / 2+ / 3+ / 4+;
  - Valor: um slider por degraus, que só fica ativo depois de escolher Comprar ou Alugar, com faixas diferentes para cada um.
- Rodapé do painel: "**N** imóveis combinam", com 3 miniaturas, e os botões "Limpar" e "Ver os imóveis". "Ver os imóveis" aplica os filtros na cena 03 e vai para ela.

**03 Alto padrão (claro).**
- À esquerda: título serifado "Imóveis de alto padrão", "Os imóveis em destaque agora" e o botão "Ver só alto padrão".
- À direita, um **banner** que encosta na borda (de `38vw` até a direita, `23u` de altura) com slides cruzados dos imóveis em destaque, troca a cada ~6 s, e bolinhas embaixo. Em cima dele, uma pílula de vidro com nome, preço e botão de seta que abre o detalhe.
- Abaixo, uma barra com:
  - "N imóveis";
  - chips "Alto padrão" / "Todos os imóveis";
  - tipos;
  - Comprar / Alugar;
  - setas ← → que rolam a lista.
- Lista horizontal com 4 cards por vez (`scroll-snap`). Cada card tem:
  - foto em cima, com selos "Venda"/"Aluguel" e os selos do imóvel;
  - botão de coração;
  - embaixo: nome, preço e um botão verde redondo "+" que adiciona ao carrinho.
  - Clicar no card abre o detalhe.
- Se nenhum imóvel combinar, mostre "Nenhum imóvel com esses filtros. Limpar filtros".

**04 Instagram (escuro).**
- Etiqueta "INSTAGRAM", título "Veja nossos posts" e "Fotos e vídeos dos flats no nosso perfil."
- Um link "@perfil" que só aparece se houver Instagram em `config`.
- Fileira horizontal de 6 "reels" verticais. Use os imóveis como capa: foto, selo, cidade, nome em serifa, preço e um botão de play no meio.
- Gradiente escuro em cima e embaixo. Cada reel leva ao Instagram (ou abre o detalhe, se não houver Instagram).

**05 Avaliações (escuro).**
- Foto da casa ao fundo, escurecida.
- À esquerda: "AVALIAÇÕES", a nota média enorme ("5,0/5") com contagem animada, 5 estrelas e "N avaliações".
- À direita, um cartão de vidro escuro com aspas grandes verdes, o texto da avaliação em letra grande, e embaixo: avatar com as iniciais, nome, subtítulo e estrelas.
- Navegação: ← →, e barras de progresso que avançam sozinhas a cada ~7 s. Pause quando o mouse estiver em cima.
- Sem avaliações: mostre "As primeiras avaliações aparecem aqui em breve."

**06 Contato (escuro).**
- Foto ao fundo.
- Texto à esquerda: "CONTATO", título "Fale com *a gente.*" (o itálico em verde) e "Mande sua mensagem pelo formulário ou chame direto no WhatsApp."
- Abaixo do texto, a lista de telefone, e-mail e endereço, só os que existirem em `config`.
- À direita, um formulário de vidro escuro:
  - campos Nome, E-mail, Telefone (com máscara "(11) 90000-0000") e "O que você procura?";
  - um campo-isca invisível contra robôs;
  - botão verde "Enviar →";
  - texto legal com link para a política de privacidade.
- Ao enviar: tela "Obrigado! Respondemos em até um dia útil.", com os botões "Falar agora no WhatsApp" e "Enviar outra mensagem". Deixe a função de envio pronta para ligar numa API, chamada `enviarContato(dados)`, que por enquanto só resolve a promessa.

## 6. Camadas por cima

- **Detalhe do imóvel** (tela cheia):
  - abre com uma cortina de baixo para cima (`clip-path: inset(100% 0 0 0)` → `inset(0)`, 0,85 s, ease-cut);
  - à esquerda, a foto grande com selos e, embaixo, miniaturas que trocam a foto com transição suave;
  - à direita: botão "← Voltar", local (bairro · cidade), nome em letra grande, tipo ("Casa — 3 suítes · à venda"), preço grande em verde;
  - ficha com Área, Quartos, Suítes, Banheiros e Vagas (some o que estiver vazio), a descrição e as características em chips;
  - botões "Adicionar ao carrinho", "WhatsApp" (verde do WhatsApp) e coração.
  - Esc ou Voltar fecham.
- **Menu**:
  - abre como uma **íris**: um círculo que cresce a partir do botão de 3 pontinhos (`clip-path: circle()`, 0,95 s), com fundo verde-floresta;
  - lista grande das 6 cenas, numeradas; ao passar o mouse, mostra uma legenda de prévia de cada cena;
  - rodapé com "© ano Thiago Liro" e o e-mail, se existir.
- **Busca**: caixa de texto que procura em nome, tipo, bairro, cidade, características e descrição (sem diferenciar acentos), chips de cidade e resultados com miniatura, nome, "cidade · detalhes" e preço. Enter ou clique abre o detalhe.
- **Conta**: gaveta lateral com as abas Favoritos, Carrinho e Conta.
  - Favoritos e carrinho ficam no `localStorage`.
  - O carrinho mostra os itens, com botão de remover, e o botão "Enviar pelo WhatsApp". Ele monta a mensagem "Olá! Quero seguir com estes itens que separei no site:" seguida da lista numerada (nome — local — preço).
  - Na aba Conta, por enquanto, só um texto: "Em breve você poderá criar sua conta".

## 7. Dados (`data.js`)

```js
window.SITE_DATA = {
  config: { nome: 'Thiago Liro', whatsapp: '', instagram: '', email: '', telefone: '', endereco: '', familias: null, anos: null },
  imoveis: [ /* { slug, titulo, descricao, preco, tipo: 'casa'|'apartamento'|'terreno'|'comercial'|'outros',
               finalidade: 'venda'|'aluguel', cidade, uf, bairro, quartos, suites, banheiros, vagas, area, frente,
               selos: [], caracteristicas: [], status: 'disponivel'|'vendido'|'alugado', destaque: true,
               fotos: ['/assets/imoveis/slug-1.webp', ...], ordem } */ ],
  avaliacoes: [ /* { nome, texto, nota, subtitulo } */ ],
};
```

Coloque 3 imóveis de exemplo:
- **Casa Cerejeiras**: R$ 450.000, venda.
- **Unidade Ana Carolina**: R$ 550.000, venda, com o selo "Com planejados".
- **Casa Parque Brasília**: R$ 1.149.900, venda, 183,51 m², 3 quartos, 3 suítes, 2 vagas. Descrição com várias linhas e características como piscina aquecida, hidromassagem, cozinha gourmet e pé-direito duplo.

Coloque também 3 avaliações de exemplo, marcadas em comentário como "trocar pelas reais".

## 8. Regras de exibição (importantes)

- **Preço exato**, no formato `Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL', maximumFractionDigits:0})`: "R$ 1.149.900". Aluguel ganha "/mês". Use o formato compacto ("R$ 1,2 mi") só no slider do filtro.
- **Fotos inteiras, do jeito que foram enviadas**: nunca cortar nem aproximar nos cards, no banner, nos reels e no detalhe. Use `object-fit: contain`, com a própria foto desfocada (`blur(16px)`, um pouco ampliada) preenchendo a sobra do quadro atrás dela. Sem efeito Ken Burns e sem zoom no hover nas fotos dos imóveis. Só as miniaturas pequenas podem ser recortadas.
- Cards, slides e reels usam a miniatura (`-thumb`). O detalhe usa a foto grande.
- Imóvel sem foto: fundo bege em degradê, com um ícone de casinha.
- Cidade igual a "A definir" fica escondida em tudo: cards, filtros, número de cidades e alfinete.
- A descrição respeita as quebras de linha (`white-space: pre-line`).
- Vendido ou alugado: card em tons de cinza e preço riscado.
- Ordenação: disponíveis primeiro, depois `ordem`, depois os mais novos.
- **Links de WhatsApp**: `https://wa.me/<numero>?text=...`. No detalhe, o texto é "Olá! Tenho interesse no imóvel <nome> (<bairro, cidade/UF>) — <preço>. Pode me passar mais informações?". Sem número, use `wa.me/?text=`.

## 9. Celular (até 900px de largura, ou tela em pé)

- A **abertura vira tela cheia**, em modo escuro de fim de tarde:
  - foto da casa ocupando tudo, com sombra em degradê;
  - em cima: etiqueta, título, texto curto e o botão "Ver imóveis";
  - embaixo, um painel de vidro com o selo "Casas selecionadas para / Um jeito único de viver" e dois cartões: o de "N imóveis selecionados" e o do imóvel em destaque.
- O topo vira: assinatura (~21–23px), botões de busca e conta, e os 3 pontinhos. A pílula de navegação e o indicador somem.
- As cenas trocam deslizando o dedo. As listas horizontais rolam com o dedo sem trocar de cena.
- Cada cena se reorganiza em coluna, sem rolagem lateral nenhuma na página. Tamanhos mínimos: botões com 40–44px de altura, textos com no mínimo 12–13px.
- O detalhe do imóvel fica em coluna: foto, miniaturas e informações, com os botões no fim.

## 10. Qualidade

- Acessibilidade:
  - `aria-label` em botões de ícone;
  - cenas inativas com `inert` e `aria-hidden`;
  - foco visível;
  - Esc fecha as camadas;
  - contraste AA nos dois tons.
- Desempenho:
  - `preload` da foto da abertura e das fontes;
  - `loading="lazy"` nas fotos;
  - imagens em webp;
  - nada de bibliotecas externas.
- Teste em 1440×810, 1280×800, 1024×700 e 390×844: nada cortado, nada sobreposto, sem rolagem lateral e sem erros no console.

## Pronto quando

1. As 6 cenas aparecem com o visual descrito, e a troca entre elas tem as barras de cinema e a entrada em sequência.
2. Filtro → "Ver os imóveis" leva para Alto padrão já filtrado, e o contador bate.
3. Detalhe, menu íris, busca e conta (favoritos e carrinho salvos no navegador) funcionam.
4. Os botões de WhatsApp montam as mensagens certas.
5. No celular, tudo funciona com o dedo e sem rolagem lateral.
6. Trocar os dados em `data.js` muda o site inteiro, sem tocar no resto do código.
