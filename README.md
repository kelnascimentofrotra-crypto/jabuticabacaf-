# Tá No Clima — Refrigeração e Serviço

Site institucional (uma página) da **Tá No Clima — Refrigeração e Serviço**, especialistas em
climatização em São Luís - MA. HTML, CSS e JavaScript puros, sem build e sem dependências.

## Estrutura

```
index.html              página completa
assets/css/style.css    estilos (paleta da logo em variáveis no topo)
assets/js/main.js       interações + CONFIG com os dados de contato
assets/img/             logo (marca e versão completa) e favicon, em SVG
```

## Como atualizar os dados de contato

Telefone, WhatsApp, e-mail, horário e redes sociais ficam **em um único lugar**:
o objeto `CONFIG`, no começo de `assets/js/main.js`.

```js
const CONFIG = {
  whatsapp: '5598000000000',            // 55 + DDD + número, só dígitos
  telefoneExibicao: '(98) 9 9999-9999', // como aparece na tela
  email: 'contato@tanoclima.com.br',
  horario: 'Seg a Sáb, 7h às 18h',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/'
};
```

Ao salvar, o site inteiro é atualizado: topo, botões de WhatsApp, rodapé e formulário.
O endereço aparece direto no HTML (topo, seção *Contato* e rodapé).

> **Pendente:** os valores acima ainda são de exemplo. Troque pelos números reais antes de divulgar o site.

## Paleta (extraída da logo)

| Cor | Hex | Uso |
| --- | --- | --- |
| Azul-marinho | `#0B2E59` | títulos, fundos escuros |
| Azul-marinho profundo | `#071F3E` | topo e rodapé |
| Azul-gelo | `#1E9BE0` | cor principal, botões e ícones |
| Ciano claro | `#7FD4F5` | destaques sobre fundo escuro |
| Vermelho | `#E02B28` | detalhes de acento |
| Fundo gelo | `#EEF5FB` | seções alternadas |

As cores estão em variáveis CSS no início de `assets/css/style.css` (`:root`).

## A seção "O ar que transforma o ambiente"

É uma cena única dirigida pela rolagem, não uma sequência de blocos. Um só
progresso (`0` a `1`, medido pela posição da trilha de 480vh) alimenta câmera,
luz, calor, partículas e leitura técnica ao mesmo tempo.

O ambiente é montado em camadas com profundidade real. Cada camada fica em
`translateZ(-D)` dentro de um elemento com `perspective: 1100px`, e recebe
`scale(1 + D/1100)` — a compensação exata para o plano voltar ao tamanho da
tela. Com isso as posições em porcentagem dentro de cada camada continuam
valendo, e a câmera pode girar e aproximar sem deformar a composição.

A trilha tem **900vh no computador e 700vh no celular**, de propósito: quanto
mais alta, menor o avanço de cada clique da roda. Em 900vh uma rolagem comum de
100px move cerca de 1,4% da cena — antes, com 480vh, movia 2,9%, e o salto
parecia travamento em vez de vídeo. Se a seção precisar ficar mais curta ou mais
longa, é só mudar a altura de `.ar` — as janelas dos atos são proporcionais e se
ajustam sozinhas.

| Trecho da rolagem | O que acontece |
| --- | --- |
| 0 – 16% | câmera aproxima, profundidade de campo resolve, título entra |
| 16 – 66% | câmera orbita, sol perde força, calor sai e o frio entra |
| 26 – 50% | corrente de ar começa: partículas saem do aparelho com direção e profundidade |
| 44 – 62% | aparelho ganha destaque e o segundo título entra |
| 66 – 86% | linhas técnicas desenhadas e leitura de demonstração aparece |
| 86 – 100% | câmera recua e o fecho entra com o botão |

A corrente de ar é um `<canvas>`: cada partícula tem profundidade própria, que
define tamanho, velocidade e opacidade. A emissão sai da posição real do
aparelho na tela, medida a cada quadro, então continua colada nele enquanto a
câmera gira. O canvas para de desenhar quando a seção sai da tela.

Os números do painel (`3,2 m/s`, `11 °C`, `96%`, `-28%`) são **exemplos de
demonstração**, identificados como tal no próprio painel. Troque por medições
reais antes de usá-los como argumento comercial.

Três cuidados evitam engasgo por quadro: o desfoque das camadas é arredondado
em passos de 0,5px e só é escrito quando muda de passo (sai de cena por completo
fora da entrada e da saída, porque `blur()` em camada do tamanho da tela obriga
o navegador a rasterizar tudo de novo); a posição do aparelho é medida **antes**
de qualquer escrita de estilo, senão o `getBoundingClientRect()` força um
recálculo de layout no meio do quadro; e os números do painel só são reescritos
quando o valor muda. Medido durante a rolagem: 11,8 ms de quadro em média, 26 ms
no percentil 95, com 1 quadro acima de 33 ms em 129.

Tudo isso roda no mesmo `requestAnimationFrame` do resto do site, com o
progresso suavizado por interpolação. Não há biblioteca de animação: a mecânica
que o GSAP ScrollTrigger daria com `scrub` já existe no projeto.

## Fotografias

O site funciona sem nenhuma foto: onde ela falta, entra uma cena desenhada em
CSS/SVG. Para colocar as fotos reais, basta salvar os arquivos com estes nomes
dentro de `assets/img/` — não é preciso mexer no código.

| Arquivo | Onde aparece | Tamanho sugerido | O que fotografar |
| --- | --- | --- | --- |
| `tecnico-split.png` | fundo do topo | hoje 915 × 514 — o ideal é 1920 × 1080 | técnico instalando ou consertando um split (**já está no site**) |
| `ambiente.jpg` | seção "Do calor ao conforto" | 1200 × 900 | ambiente já climatizado, com o ar-condicionado visível na parede |

Dicas de enquadramento:

- O topo escurece a foto e aplica um degradê da esquerda para a direita — o
  assunto deve ficar **à direita** do quadro, e a esquerda pode ser parede,
  céu ou fundo liso.
- O recorte do topo está em `object-position: 68% 46%`, calibrado para uma foto
  clara de parede branca com o técnico à esquerda e o aparelho à direita: puxa o
  quadro para o lado do aparelho e deixa a área do texto sobre o fundo liso.
  Com outro enquadramento, ajuste esse valor.
- Fotos de parede branca entram com `brightness(.5)` para o azul da marca
  sobreviver por cima. Foto já escura pode subir esse valor.
- A foto da seção "Do calor ao conforto" recebe uma camada laranja que vai
  virando azul conforme a rolagem. Fotos claras e com boa luz funcionam muito
  melhor nesse efeito do que fotos escuras.
- Se quiser ajustar o recorte, mude `object-position` em `.scene__photo img`
  e `.cf__photo img`, no fim de `assets/css/style.css`.

> Use fotos do próprio trabalho de vocês, ou imagens de banco com licença de uso
> comercial. Não use fotos de outra empresa: além do problema de direitos, dá a
> entender que o serviço mostrado é seu.

## Formulário

Não há servidor: o formulário monta a mensagem e abre o WhatsApp já preenchido.
Nenhum dado é armazenado.

## Publicação

O site é estático — basta servir a raiz do repositório (GitHub Pages, por exemplo).
Para testar localmente: `python3 -m http.server` e abrir `http://localhost:8000`.
