# MBA Temperados — Landing page

Landing page de vidraçaria (box para banheiro, fachadas, vitrines e guarda-corpos em vidro temperado), em HTML + Tailwind CSS, responsiva e pronta para abrir no navegador.

## Como abrir

Dê dois cliques em `index.html`. Não precisa instalar nada.

Para publicar, envie a pasta `mba-temperados/` inteira (o `index.html` junto com a pasta `assets/`) para a hospedagem.

## Estrutura

```
mba-temperados/
├── index.html           ← a página: textos, seções e o número do WhatsApp (CONFIG)
├── assets/
│   ├── css/style.css    ← CSS final, gerado pelo Tailwind (não edite à mão)
│   └── img/             ← todas as imagens do site
├── src/input.css        ← fonte do CSS (botões, cards, hero em camadas)
├── tailwind.config.js   ← cores e fontes da marca
└── package.json         ← comando para gerar o CSS
```

## Antes de publicar

- [x] **WhatsApp:** configurado com (11) 95832-8927. Para trocar, no fim do `index.html`, no bloco `CONFIG`, mude `5511958328927` (DDI + DDD + número, só dígitos) e o número que aparece escrito na seção Contato e no rodapé. Todos os botões de WhatsApp e o formulário usam o número do `CONFIG`.
- [x] **Facebook:** link na seção Contato e no rodapé (procure por `facebook.com` no `index.html` para trocar).
- [ ] **Contatos visíveis:** na seção Contato **e no rodapé**, troque `contato@seudominio.com.br` (texto e `mailto:`), "Sua cidade e região" e o horário.
- [ ] **Depoimentos:** os três textos são **exemplos de layout**. Substitua por avaliações reais de clientes, com autorização.
- [ ] **Números:** "+500 projetos entregues" e "+500 clientes satisfeitos" são ilustrativos. Ajuste para os dados reais da empresa.
- [ ] **Imagens:** troque pelas fotos reais dos serviços (veja abaixo).
- [ ] **Prévia de compartilhamento:** depois de publicar, troque `assets/img/og-image.jpg` na tag `og:image` pelo endereço completo (ex.: `https://www.seudominio.com.br/assets/img/og-image.jpg`).

## Como trocar as imagens

Substitua o arquivo em `assets/img/` **mantendo o mesmo nome**. Não precisa mexer no código.

| Arquivo | Onde aparece | Tamanho recomendado |
|---|---|---|
| `hero.jpg` | Fundo da hero (tablet e computador) | 2400 × 1600 px, paisagem. Deixe o lado esquerdo mais "limpo" (céu, parede): o texto fica ali |
| `hero-mobile.jpg` | Fundo da hero (celular) | 1600 × 1080 px. Pode ser a mesma foto, menor. No celular aparece a parte central-direita |
| `hero-card.jpg` | Miniatura do card "Modelos de box" | 240 × 240 px |
| `destaque.jpg` | Segunda hero (tablet e computador) | 2400 × 1430 px, paisagem, texto à esquerda |
| `destaque-mobile.jpg` | Segunda hero (celular) | 1600 × 950 px |
| `projeto-residencial.jpg` | Projetos: Boxes para banheiro (bloco grande) | 1600 × 960 px, paisagem |
| `projeto-comercial.jpg` | Projetos: Fachadas e vitrines (bloco alto) | 900 × 1110 px, retrato |
| `projeto-guarda-corpo.jpg` | Projetos: Guarda-corpos e sacadas | 1000 × 900 px ou maior, com as sacadas do lado esquerdo da foto |
| `og-image.jpg` | Prévia ao compartilhar o link | 1200 × 630 px |
| `favicon.svg` | Ícone da aba do navegador (navegadores atuais) | SVG quadrado com os cacos de vidro da logo |
| `favicon-32.png` | Ícone da aba em navegadores mais antigos | 32 × 32 px |
| `apple-touch-icon.png` | Ícone ao salvar o site na tela inicial do iPhone | 180 × 180 px, sem cantos arredondados |

Os caminhos das imagens de fundo ficam no bloco `<style>` do `<head>` do `index.html`; as demais estão nas tags `<img>`.

Cada foto aparece em um só lugar do site. A foto atual de guarda-corpos é pequena (392 × 348 px) e foi ampliada; se houver o arquivo original maior, troque `projeto-guarda-corpo.jpg` para ela ficar mais nítida.

**Dicas para fotos leves e nítidas:** JPG com qualidade em torno de 80%, até ~150 KB por foto de card e até ~400 KB para os fundos. O site gratuito [Squoosh](https://squoosh.app) redimensiona e comprime no navegador. Fotos reais de obras entregues pela MBA passam mais confiança que fotos de banco.

### Sobre as imagens atuais

As fotos atuais foram recortadas e otimizadas a partir das referências enviadas e são **provisórias**: confirme que você tem direito de uso comercial antes de publicar ou substitua pelas fotos reais da MBA Temperados. Se usar bancos de imagem, [Unsplash](https://unsplash.com/license) e [Pexels](https://www.pexels.com/license/) permitem uso comercial gratuito; confira a licença de cada foto.

## Logo

A logo foi redesenhada em vetor a partir da arte enviada (que era uma montagem da logo numa parede), para ficar nítida em qualquer tamanho e poder ser animada.

- **Ícone (cacos de vidro):** fica no `<symbol id="logo-icon">`, no início do `<body>` do `index.html`. O header e o rodapé usam esse símbolo.
- **Nome:** "MBA" e "TEMPERADOS" são texto (fonte Montserrat) com o azul da marca em degradê. A frase "projetos em vidros" aparece no rodapé e na abertura.
- **Tamanho:** tudo é proporcional ao `font-size` da classe `.brand` em `src/input.css`.
- **Arquivo oficial:** se a MBA tiver a logo original em SVG, PDF ou AI, vale trocar o símbolo pelos desenhos oficiais.

## Abertura com a logo

Ao abrir a página, uma abertura de cerca de 3 segundos mostra a logo: os cacos de vidro voam e se encaixam, o nome aparece, um brilho passa pelo vidro e a logo voa até o topo da página.

- Clicar, tocar, rolar ou apertar qualquer tecla pula a abertura.
- Quem configurou o celular ou computador para reduzir animações não vê a abertura.
- **Para desligar:** no `<head>` do `index.html`, apague a linha que contém `d.classList.add('intro-on', 'intro-hold')`.

## Menu

No computador (telas a partir de 960 px de largura) os links do menu e o botão "Faça seu orçamento" ficam sempre no topo. Abaixo disso, no celular e no tablet em pé, o menu abre pelo botão com três linhas.

## Sistema visual

O site inteiro segue a atmosfera da hero (céu ao entardecer, vidro, luzes quentes). Depois da hero, cada seção tem um fundo escuro próprio, com luz ambiente em pontos diferentes, e começa na cor em que a anterior termina, para a passagem ser contínua.

| Uso | Valor | Onde mudar |
|---|---|---|
| Fundos das seções (do mais fundo ao mais claro) | `night` 950–600: `#06080D` `#0A0F17` `#0D1320` `#111A2A` `#18233A` `#22304A` | `tailwind.config.js` → `night` |
| Textos sobre fundo escuro | `mist` 100–400: `#F4F6FA` (títulos) `#D6DDE8` `#AEB9CB` (textos) `#8592A8` (secundário) | `tailwind.config.js` → `mist` |
| Amarelo da marca (botões, destaques nos títulos) | `#FFC93C` (hover `#FFD15C`) | `tailwind.config.js` → `brand` |
| Azul do vidro (ícones e luz ambiente) | `#3D93D8` e `#8DCBF7` | `tailwind.config.js` → `glass` |
| Laranja da seta do card da hero | `#FF7A00` | `tailwind.config.js` → `accent` |
| Azul da logo (degradê) | `#8DCBF7` → `#3D93D8` → `#1F64A6` | `src/input.css` → `.grad` |
| Títulos | Montserrat 800, `.section-title` (32 a 52 px conforme a tela) | `src/input.css` |
| Textos | Inter, 15 a 17 px, entrelinha 1,7 | `src/input.css` |
| Raios | 20 px em cards e blocos; 14 px em botões, campos e ícones | `src/input.css` |

Componentes reaproveitados em todo o site (em `src/input.css`): `.eyebrow` (chamada com traço amarelo, igual à da hero), `.section-title` com `.hl` (palavra em amarelo), `.section-lead`, `.section-head`, `.surface` (card de vidro escuro), `.icon-tile` (ícone em placa azul que acende em amarelo no hover), `.tag`, `.link-arrow`, `.btn`.

**Movimento:** entrada suave das seções ao rolar, linha do tempo que se desenha em "Como funciona", leve parallax na foto da segunda hero (só no computador) e efeitos discretos de hover. Tudo isso é desligado para quem configurou o aparelho para reduzir animações.

## Hero em camadas

A hero não é uma imagem com texto: cada parte é um elemento HTML separado.

1. `.hero__bg`: foto de fundo (`background-size: cover`, centralizada no computador e em `75% center` no celular).
2. `.hero__overlay`: gradiente de leitura, `linear-gradient(90deg, rgba(0,0,0,.55) 0%, transparent 60%)` no computador e vertical no celular.
3. `<header>`: fixo, transparente sobre a hero e escuro ao rolar. Abaixo de 960 px vira menu hambúrguer.
4. `.hero__content`: chamada, título com `text-shadow` e gradiente radial escuro atrás, texto e botão amarelo com sombra.
5. `.hero__card`: card flutuante no canto inferior direito (a partir de 1024 px); no celular fica abaixo do botão.

## Editando o layout (opcional)

Só é necessário se você mudar classes no HTML ou o `src/input.css`. Trocar imagens e textos **não** exige isso.

```bash
cd mba-temperados
npm install
npm run build:css   # gera assets/css/style.css
npm run watch:css   # gera de novo automaticamente enquanto você edita
```
