# Estética Marista — site

Site de página única feito a partir das referências visuais (Hero, Sobre, Procedimentos e Resultados), com tela de entrada, animações de entrada e de rolagem, parallax e agendamento pelo WhatsApp.

## Como rodar no computador

O site é estático (HTML, CSS e JS) e não precisa instalar nada além do **Node.js**.

**Windows:** dê dois cliques em `iniciar-site.bat`. O navegador abre sozinho em `http://localhost:3000`.

**Pelo terminal (Windows, macOS ou Linux):**

```bash
cd estetica-marista
npm start            # abre o navegador em http://localhost:3000
# ou
node server.js       # só sobe o servidor
PORT=8080 node server.js   # em outra porta
```

Sem Node.js, dá para usar Python: `python -m http.server 3000` dentro da pasta e acessar `http://localhost:3000`.

Para parar o servidor: `Ctrl + C` no terminal.

## Publicar na Vercel

O site é estático, não precisa de build.

**Pelo painel (importando do GitHub):** a Vercel publica a branch principal (`main`), então a pasta `estetica-marista` precisa estar nela (faça o merge desta branch antes).

1. Em https://vercel.com/new, importe o repositório `jabuticabacaf-`.
2. **Project Name:** `estetica-marista` (o endereço fica `estetica-marista.vercel.app`, se estiver livre).
3. **Root Directory:** clique em *Edit* e escolha a pasta `estetica-marista`.
4. **Framework Preset:** *Other*. Deixe Build Command e Output Directory em branco.
5. Clique em **Deploy**.

**Pelo terminal (de dentro desta pasta):**

```bash
npx vercel            # faz login e cria o projeto; use o nome estetica-marista
npx vercel --prod     # publica no endereço principal
```

## WhatsApp

Todos os botões de agendamento levam direto para o WhatsApp **+55 62 3988-1915** com uma mensagem pronta. O "Saiba mais" de cada procedimento já cita o procedimento na mensagem. O número também aparece no rodapé e num botão flutuante no canto da tela.

Para trocar o número, substitua `556239881915` em `index.html` (só dígitos com DDI e DDD).

## Estrutura

```
estetica-marista/
├── index.html          conteúdo do site
├── css/style.css       visual, responsivo e animações
├── js/main.js          animações, menu e parallax
├── img/                fotos recortadas das referências (WebP) e logo em SVG
├── fonts/              DM Serif Display e Figtree (funcionam offline)
├── server.js           servidor local sem dependências
├── iniciar-site.bat    atalho para Windows
└── package.json
```

## Sobre as imagens

- As referências 3 e 4 eram duas versões da mesma seção de procedimentos. A seção **Procedimentos** usa o layout da referência 3 (com a foto da clínica). Em cada procedimento repetido ficou a melhor foto das duas versões (a de Toxina Botulínica veio da referência 4, que mostra a aplicação).
- A seção **Resultados** aproveita o título e a foto da referência 4.
- O letreiro da parede na foto da clínica foi trocado para "Estética Marista".
- A foto do hero teve o fundo removido para a palavra "BELEZA" ficar atrás da modelo, como na referência.
- O logo foi redesenhado em SVG para ficar nítido em qualquer tamanho.
