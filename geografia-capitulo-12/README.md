# A cobertura verde do planeta azul — Capítulo 12

Apresentação interativa de Geografia, em estilo de documentário, feita para a
**Escola Comunitária Santa Maria Bestila**.

- **Professor:** Valdemir
- **Componente curricular:** Geografia
- **Alunos:** Miguel, Henrique, Vinícius e Everton

## Vídeo do cabeçalho

`video/cabecalho-capitulo-12.mp4` (1920×1080, 30 fps, com som, paleta laranja): cada informação
aparece no centro da tela e depois vai para o seu canto — escola, professor, componente curricular
e alunos —, até formar o cabeçalho com o título no centro e o planeta nascendo embaixo.
Fonte da animação: `video/cabecalho.html` (abrir por um servidor local mostra a prévia em loop);
para gerar de novo: `node tools/render_video.js` (precisa de Playwright e ffmpeg).

## Vídeo completo do capítulo

`video/capitulo-12-completo.mp4` (1920×1080, 30 fps, com trilha, cerca de 8 minutos, paleta laranja):
cabeçalho + seções 01 a 07 + quiz em formato de vídeo (pergunta, 5 segundos para responder e
resposta comentada) + encerramento. Durante todo o vídeo, os dados da escola, do professor, do
componente curricular e dos alunos ficam como moldura nos cantos.

Sem acesso ao Wikimedia neste ambiente, o vídeo não usa fotografias: as cenas usam o globo e o
mapa com imagens de satélite da NASA, diagramas animados e paisagens ilustradas.
Fonte: `video/capitulo.html`; para gerar de novo: `node tools/render_capitulo.js`.

## Como abrir

Abra o arquivo **`index.html`** em um navegador moderno (Chrome, Edge, Firefox ou Safari).
É um arquivo único: estilos, scripts e as texturas do globo já estão dentro dele.

- **Com internet:** carrega as fotografias reais e as gravações de natureza do Wikimedia Commons.
- **Sem internet:** a apresentação funciona do mesmo jeito; cada foto que não carregar é
  trocada por uma ilustração com a descrição da imagem, e os sons da natureza passam a ser
  sintetizados no próprio navegador.

Para apresentar na sala, use a tela cheia (botão no canto superior ou tecla <kbd>F</kbd>).

## O que tem na apresentação

| Parte | Conteúdo |
|---|---|
| Abertura | Tela preta → ponto de luz → anéis e partículas → globo 3D se forma (grade, contornos, revelação da superfície) → escola → professor e alunos → título → capítulo 12 → câmera avança até o planeta |
| 01 | Distribuição da vegetação, fatores (temperatura, chuva, latitude, relevo, solo, água), mapa de faixas de latitude interativo, importância da vegetação e atlas com 9 cartões de biomas (cada um abre uma ficha com mapa, clima, adaptações, fauna e ameaças) |
| 02 | Florestas equatoriais e tropicais: clima, localização, estratos da floresta (interativo), características e ameaças |
| 03 | Florestas de coníferas (taiga): clima, adaptações da conífera (pontos interativos) e Mata de Araucárias |
| 04 | Tundra: clima, permafrost (diagrama inverno/verão), vegetação e o degelo do permafrost |
| 05 | Florestas temperadas: as quatro estações, por que as folhas mudam de cor (simulação) e ocupação humana |
| 06 | Formações arbustivas e herbáceas: espectro gramíneas × arbustos, savanas, pradarias, estepes, vegetação mediterrânea, desertos e exemplos brasileiros |
| 07 | O ser humano e a natureza: desmatamento, queimadas, cidades e mineração, comparação de satélite 2000 × 2010 (arrastar), contrastes, caminhos de recuperação e a pergunta final |
| 08 | Quiz com 10 questões, correção imediata, explicação e pontuação |
| Encerramento | Globo, frase final, créditos da escola e botão para reiniciar |

Cada ambiente tem transição, cor, partículas e som próprios (luz filtrada nas florestas tropicais,
névoa nas coníferas, vento na tundra, cores das estações nas temperadas, movimento horizontal nas
formações herbáceas e cortes dramáticos nos impactos ambientais).

## Controles

| Ação | Como fazer |
|---|---|
| Avançar / voltar | Setas <kbd>→</kbd> <kbd>←</kbd>, <kbd>Espaço</kbd>, botões da barra inferior ou deslizar o dedo |
| Menu de seções | Botão de menu no canto superior direito, ou clicar na barra de progresso |
| Som | Botão de alto-falante (liga/desliga, volume, efeitos, trilha, sons da natureza) ou tecla <kbd>M</kbd> |
| Tela cheia | Botão no canto superior ou tecla <kbd>F</kbd> |
| Reiniciar | Botão de reinício no topo, no menu ou na tela final |
| Quiz | Clique na alternativa ou use as teclas <kbd>1</kbd> a <kbd>4</kbd> |
| Fechar janelas | <kbd>Esc</kbd> |

O áudio começa desligado até que a pessoa escolha “Iniciar com som” ou ative no painel.
A preferência do sistema por **movimento reduzido** é respeitada, e também pode ser ligada no painel de som.

## Imagens e sons

- Fotografias e gravações reais do **Wikimedia Commons** (lista completa em [`CREDITOS.md`](CREDITOS.md)
  e no menu da própria apresentação, em “Créditos de imagens e sons”). Cada foto mostra o crédito no canto.
- Globo 3D desenhado em WebGL com as imagens de satélite **NASA Blue Marble** e **Black Marble** (domínio público).
- Trilha instrumental e efeitos sonoros gerados em tempo real com a Web Audio API.

## Para editar

O código-fonte fica em `src/` e o arquivo final é montado por um script:

```bash
python3 tools/gen_media.py   # atualiza o registro de imagens/sons e o CREDITOS.md
python3 tools/build.py       # gera o index.html único
```

Bibliotecas externas: nenhuma. Apenas as fontes do Google Fonts (com fontes do sistema como alternativa).
