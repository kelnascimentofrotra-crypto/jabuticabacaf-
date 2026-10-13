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

- [ ] **WhatsApp:** no fim do `index.html`, no bloco `CONFIG`, troque `5500000000000` pelo número com DDI + DDD, só dígitos (ex.: `5511987654321`). Todos os botões de WhatsApp e o formulário usam esse número.
- [ ] **Contatos visíveis:** na seção Contato, troque `(00) 00000-0000`, `contato@seudominio.com.br` (texto e `mailto:`), "Sua cidade e região" e o horário.
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
| `como-funciona-1-medicao.jpg` | Como funciona, etapa 01 | 800 × 600 px (4:3) |
| `como-funciona-2-projeto.jpg` | Como funciona, etapa 02 | 800 × 600 px (4:3) |
| `como-funciona-3-fabricacao.jpg` | Como funciona, etapa 03 | 800 × 600 px (4:3) |
| `como-funciona-4-instalacao.jpg` | Como funciona, etapa 04 | 800 × 600 px (4:3) |
| `destaque.jpg` | Segunda hero (tablet e computador) | 2400 × 1430 px, paisagem, texto à esquerda |
| `destaque-mobile.jpg` | Segunda hero (celular) | 1600 × 950 px |
| `projeto-residencial.jpg` | Projetos: Boxes para banheiro | 800 × 600 px (4:3) |
| `projeto-comercial.jpg` | Projetos: Fachadas e vitrines | 800 × 600 px (4:3) |
| `projeto-guarda-corpo.jpg` | Projetos: Guarda-corpos e sacadas | 800 × 600 px (4:3) |
| `og-image.jpg` | Prévia ao compartilhar o link | 1200 × 630 px |
| `favicon.svg` | Ícone da aba do navegador | SVG quadrado |

Os caminhos das imagens de fundo ficam no bloco `<style>` do `<head>` do `index.html`; as demais estão nas tags `<img>`.

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

## Cores e fontes

| Uso | Valor | Onde mudar |
|---|---|---|
| Amarelo da marca (botões, destaques, ícones) | `#FFC93C` (hover `#FFD15C`) | `tailwind.config.js` → `brand` |
| Laranja da seta do card | `#FF7A00` | `tailwind.config.js` → `accent` |
| Azul da logo (degradê) | `#8DCBF7` → `#3D93D8` → `#1F64A6` | `src/input.css` → `.grad` |
| Fundo escuro | `#0E1116` | `tailwind.config.js` → `ink` |
| Títulos | Montserrat 600–800 | Google Fonts, no `<head>` |
| Textos | Inter 400–700 | Google Fonts, no `<head>` |

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
