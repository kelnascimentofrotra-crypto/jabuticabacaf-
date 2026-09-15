# Edu Frio Refrigeração — site

Landing page da Edu Frio Refrigeração (São Luís – MA). Site estático, sem build
e sem dependências externas: é só abrir o `index.html` ou servir a pasta.

```
edu-frio/
├── index.html              página completa (HTML + CSS + JS embutidos)
├── assets/img/             logotipo e 8 fotografias
├── assets/fonts/           Cormorant Garamond e Jost (woff2, auto-hospedadas)
└── build-from-canvas.py    script que gerou esta pasta a partir do design canvas
```

## Origem

A página nasceu como um *design canvas* do Claude Design. Aquele formato depende
do runtime do editor: usa `<image-slot>`, `<helmet>`, um script `type="text/x-dc"`
e ícones resolvidos em tempo de execução — nada disso funciona num navegador comum.
`build-from-canvas.py` faz a tradução para HTML padrão, preservando a composição,
os textos e as animações originais. Ele registra a conversão inicial; o
`index.html` foi editado à mão depois disso, então reexecutá-lo desfaria a seção
"Engenharia do Conforto".

O que a conversão fez:

- `<image-slot>` → `<img>` com `object-fit`, `alt` descritivo e carregamento adiado
  fora da primeira dobra (o hero carrega cedo, por ser o provável LCP).
- 40 ícones Lucide embutidos como SVG inline — antes vinham de uma biblioteca de
  439 KB carregada em tempo de execução.
- Fontes auto-hospedadas; nenhuma chamada ao Google Fonts.
- `viewBox`/`preserveAspectRatio` restaurados nos dois SVGs (o canvas os guardava
  com nomes alterados, que o navegador ignora).
- `style-hover`, atributo só do editor, virou CSS real com `:hover` e `:focus-visible`.
- Removidos o runtime do canvas (React + Lucide) e a marca d'água do editor.
- `<head>` de verdade: título, descrição, Open Graph, favicon, `theme-color` e
  JSON-LD com os dados que aparecem na própria página.

## Correções de defeito

Dois problemas existiam no design original e não apareciam no editor, porque o
canvas é sempre renderizado na largura do navegador:

1. **Hero sumia no celular.** No trecho mobile, `inset = '0'` era seguido de
   `left/right/top = ''`, o que desfaz três dos quatro lados do atalho e deixa só
   `bottom: 0` — o container da foto colapsava para 0×0 abaixo de 760px. Agora o
   trecho mobile limpa apenas `height`, como o de desktop já fazia.
2. **Botão do topo saía da tela em 320px.** O logotipo e o botão não cabiam juntos.
   Em telas ≤360px o espaçamento entre letras da marca foi apertado, em vez de
   cortar conteúdo.

## Seção "Engenharia do Conforto"

Narrativa controlada por scroll, acrescentada depois da conversão. Fica entre
`#precisao` e `#contato`, em `#engenharia`.

Quatro etapas — analisar, dimensionar, climatizar, otimizar — sobre uma placa
fotográfica 3:2. Um traçado técnico em SVG se desenha ao longo do equipamento,
quatro pontos abrem e fecham suas informações, a temperatura cai de 28 a 21 °C
e a luz passa de quente a equilibrada. No fim, todas as marcações são
**recolhidas** e a imagem fica limpa para a frase de desfecho. Esse recolhimento
é o ponto: as outras duas narrativas do site acumulam detalhe até o fim, esta
subtrai — é do que trata "quando a tecnologia desaparece, o conforto permanece".

Decisões que valem registro:

- **Sem bibliotecas.** O site não usa framework nem build; Framer Motion exigiria
  React. A seção entra no mesmo motor de `comfort()` e `precision()`: o scroll
  dentro do track vira um progresso 0–1 e tudo deriva dele, só com `transform`,
  `opacity`, `clip-path` e `stroke-dashoffset`.
- **Coordenadas em pixels da foto.** O SVG usa `viewBox="0 0 770 516"`, o tamanho
  real da imagem, e a moldura tem exatamente essa proporção. Assim as marcações
  caem sobre o mesmo ponto do equipamento em qualquer largura de tela, sem
  recorte que desloque os pontos.
- **Luz por camada, não por filtro.** A mudança de temperatura de cor usa duas
  camadas sobrepostas com opacidade animada. `filter` sobre uma imagem grande
  repinta a cada quadro; opacidade é só composição.
- **Números demonstrativos.** Performance 98% e estabilidade 100% não são
  medições da empresa. O painel é rotulado "Demonstrativo" e o `title` explica.
- **Telas estreitas.** O balão flutuante não cabe sobre a foto, então vira uma
  linha sob a placa que troca conforme o ponto ativo. A imagem continua
  protagonista; o percurso encurta de 420vh para 320vh.

A fotografia é a melhor disponível no acervo da empresa — a instalação de um
split. O conceito pedia um ambiente acabado e sofisticado; se surgir essa foto,
trocar é uma linha em `assets/img/`, **desde que a proporção 3:2 seja mantida**,
senão as marcações saem de lugar.

## Verificação

Chromium (Playwright), com a intro completa e a página percorrida até o fim:

| Condição | Resultado |
|---|---|
| Console e rede em 1440 e 390px | sem erros, sem requisições falhas |
| Imagens | 16/16 carregadas; 40/40 ícones renderizados |
| Rolagem horizontal em 320, 360, 390, 430, 768, 1440px | nenhuma |
| Teclado | *skip link* funciona; foco visível em toda a navegação |
| `prefers-reduced-motion: reduce` | nenhum conteúdo fica oculto |
| Contraste (texto normal, AA 4.5:1) | 12 pares verificados, menor 4.70:1 |
| FPS na seção com scroll contínuo | 59–60 em 320, 390, 768 e 1440px |

Não verificado: leitor de tela, desempenho medido em rede real e o contraste do
texto sobre a fotografia do hero — esse último tem gradiente por cima e não é
avaliável pela fórmula de pares opacos.

## Publicar

Qualquer hospedagem de arquivos estáticos serve. Para GitHub Pages a partir desta
subpasta, o caminho publicado fica `/edu-frio/`; para servir na raiz do domínio,
mova o conteúdo da pasta para a raiz do repositório.

## Dados da página

Telefone e WhatsApp `(98) 9171-7286`, Instagram `@edufrio_ma`. O número do
WhatsApp e a mensagem inicial ficam no objeto de propriedades no fim do
`index.html`, junto com a cor de acento e os controles de movimento.
