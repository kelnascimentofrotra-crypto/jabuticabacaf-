# Estética Mariana Costa — site

Site de página única feito a partir das referências visuais (Hero, Sobre, Procedimentos e Resultados), com tela de entrada, animações de entrada e de rolagem, parallax e formulário de agendamento.

## Como rodar no computador

O site é estático (HTML, CSS e JS) e não precisa instalar nada além do **Node.js**.

**Windows:** dê dois cliques em `iniciar-site.bat`. O navegador abre sozinho em `http://localhost:3000`.

**Pelo terminal (Windows, macOS ou Linux):**

```bash
cd estetica-mariana-costa
npm start            # abre o navegador em http://localhost:3000
# ou
node server.js       # só sobe o servidor
PORT=8080 node server.js   # em outra porta
```

Sem Node.js, dá para usar Python: `python -m http.server 3000` dentro da pasta e acessar `http://localhost:3000`.

Para parar o servidor: `Ctrl + C` no terminal.

## Configurar o WhatsApp do agendamento

Os botões "Agendar" e "Saiba mais" abrem um formulário que monta a mensagem e envia pelo WhatsApp.
Coloque o número da clínica em `js/main.js`:

```js
var CONFIG = {
  whatsapp: '5511987654321' // DDI + DDD + número, só dígitos
};
```

Enquanto o número estiver vazio, o formulário avisa que falta configurar.

## Estrutura

```
estetica-mariana-costa/
├── index.html          conteúdo do site
├── css/style.css       visual, responsivo e animações
├── js/main.js          animações, menu, parallax e agendamento
├── img/                fotos recortadas das referências (WebP) e logo em SVG
├── fonts/              DM Serif Display e Figtree (funcionam offline)
├── server.js           servidor local sem dependências
├── iniciar-site.bat    atalho para Windows
└── package.json
```

## Sobre as imagens

- As referências 3 e 4 eram duas versões da mesma seção de procedimentos. A seção **Procedimentos** usa o layout da referência 3 (com a foto da clínica). Em cada procedimento repetido ficou a melhor foto das duas versões (a de Toxina Botulínica veio da referência 4, que mostra a aplicação).
- A seção **Resultados** aproveita o título e a foto da referência 4.
- A foto do hero teve o fundo removido para a palavra "BELEZA" ficar atrás da modelo, como na referência.
- O logo foi redesenhado em SVG para ficar nítido em qualquer tamanho.
