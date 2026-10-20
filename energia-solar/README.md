# Energia Solar — site cinematográfico

Site institucional de energia solar construído a partir das seis telas aprovadas (desktop e mobile) e do briefing em `referencias/`. As seções seguem a ordem do PDF: Início › Soluções › Como funciona › Projetos › Dúvidas › Contato.

## Como rodar

```bash
cd energia-solar
python3 -m http.server 8080      # ou: npm start
# abra http://localhost:8080
```

O `index.html` já vem gerado. Também funciona aberto direto do disco.

Depois de editar a configuração ou o conteúdo, gere a página de novo:

```bash
node build.mjs                   # ou: npm run build (sem dependências)
```

## Modo usado: B (composição integral)

O pacote não tem fotos sem texto, recorte do retrato nem camadas separadas. O briefing proíbe apagar o texto das artes com remoção automática, então o site usa o **modo B**:

- Cada arte aparece **inteira**: `width: 100%`, `height: auto`, `object-fit: contain`, sem `cover`, sem `scale` e sem cortes laterais. A arte nunca é ampliada além do arquivo original (1672 px no desktop). Acima dessa largura, o fundo azul-petróleo completa a tela.
- Os controles desenhados nas artes recebem **áreas clicáveis reais** (links e botões com nome acessível e foco visível). As coordenadas foram medidas na inspeção e são convertidas em porcentagens da própria imagem.
- Busca, FAQ, opções de soluções, etapas e abas de projetos funcionam em **superfícies HTML reais**: uma gaveta lateral no desktop e um painel nativo abaixo da arte no celular e no tablet.
- O celular usa as seis artes mobile próprias, com a apresentação nativa logo abaixo de cada uma.

**Limitação:** os textos dentro das artes são pixels e não animam palavra por palavra. Para o modo A (títulos em HTML animados sobre a foto), é preciso receber as fotos limpas e o recorte do Eude.

## Animações

- Entrada da hero: o palco aparece com opacidade e leve deslocamento, e um pulso indica o CTA principal.
- Entrada de cada arte ao rolar, como unidade (opacidade + 18 px), via IntersectionObserver.
- Hotspots: realce de borda, brilho que atravessa o CTA principal e pulso único depois da entrada.
- Gavetas e menu: deslizam com o fundo escurecendo, e os itens entram escalonados (70–80 ms).
- Soluções: o marcador desliza até a opção escolhida e a mensagem troca com fade.
- Etapas: a linha do tempo se desenha e cada etapa entra em sequência.
- Projetos: a pílula das abas desliza entre as opções.
- FAQ: abre por altura calculada, o ícone + vira −, e os resultados da busca entram suavemente.
- Pré-análise: a barra de progresso avança e as etapas deslizam ao avançar e ao voltar.
- Botões: a seta se desloca 2 px no hover.

Nenhuma animação usa zoom em imagem ou parallax nas fotos. Com `prefers-reduced-motion`, tudo aparece imediatamente. Sem JS, o conteúdo continua visível e os painéis aparecem abaixo de cada arte.

A hero também tem uma versão nativa em HTML (`hero.showOriginalArt: false`): céu desenhado em código, título palavra por palavra, montanhas com parallax suave e luzes da cidade acendendo.

## Configuração (`src/site.config.mjs`)

| Campo | O que faz |
| --- | --- |
| `brand` | Nome e wordmark (marca provisória "Energia Solar"). |
| `whatsappNumber` | Só dígitos, com país e DDD (ex.: `5591999999999`). Vazio = aviso de configuração pendente. |
| `hero.showOriginalArt` | `true` mostra a arte aprovada da hero, com a casa; `false` usa a hero nativa com a copy segura. |
| `claims.heroPercentValidated` | Registro da validação do "Até 90%". Enquanto for `false`, o build avisa a pendência. |
| `messages` | Mensagem de WhatsApp de cada origem de clique (geral, especialista, dúvidas, solução, projeto, análise). |

O conteúdo (FAQ, soluções, etapas, projetos, coordenadas dos hotspots) fica em `src/content.mjs`. Os componentes HTML ficam em `src/render.mjs`.

## Pendências antes de publicar

1. **Número do WhatsApp.** Sem ele, os botões mostram "WhatsApp em configuração" e não abrem conversa com ninguém.
2. **Validação do "Até 90%".** A arte da hero contém o percentual, que não é resultado comprovado no material. Valide com a empresa ou use `hero.showOriginalArt: false` para publicar com "Menos gastos na sua conta de luz.".
3. **Contador da arte de Projetos.** A arte mostra "01 / 03", mas só existe uma cena conceitual. O painel real mostra 01 / 01 com as setas desativadas e explica a diferença. O ideal é reexportar a arte com 01 / 01 ou sem os controles.
4. **Fotos reais de projetos.** A vitrine é conceitual ("Imagens ilustrativas"). Novos itens em `projects` ativam o contador e as setas automaticamente.
5. **Conteúdo do FAQ.** As respostas são as sugeridas no briefing e devem ser revisadas com a operação.
6. **Modo A.** Exige as fotos sem texto e o recorte do retrato do Eude.

## Estrutura

```
energia-solar/
  index.html              página gerada (não editar à mão)
  build.mjs               gera o index.html
  src/                    configuração, conteúdo, componentes, funções puras
  css/styles.css          sistema visual e animações
  js/app.js               comportamento (script clássico, sem dependências)
  assets/img/             derivados WebP (gerados por tools/derive-images.py)
  assets/fonts/           Manrope (OFL)
  referencias/            PNGs originais extraídos sem perda dos PDFs do briefing
  tests/                  testes unitários e no navegador
```

## Testes

```bash
npm test                 # unitários: número do WhatsApp, links, busca sem acento, hotspots
npm run test:e2e         # navegador (requer playwright + chromium)
```

O teste no navegador verifica: proporção 1672/941 sem escala, hero dentro da primeira tela, painéis abrindo pela arte, Escape com retorno de foco, accordion, busca sem acento e sem resultados, atalho `/`, abas pelo teclado, pré-análise sem falso envio, menu mobile, ausência de rolagem horizontal, movimento reduzido e funcionamento sem JS.
