# Motion — Jabuticaba Café

Vídeo vertical (1080×1920, 30 fps, ~35 s) para Reels/Stories, feito com o logo de 10 anos, as fotos reais e as informações do site.

**Arquivo final:** `jabuticaba-cafe-motion.mp4` (H.264, ~25 MB, sem áudio; a ideia é colocar a música direto no Instagram).

## Roteiro

| Tempo | Cena |
|---|---|
| 0–4 s | Logo de 10 anos entra girando, com jabuticabas e folhas, e a frase "Momentos especiais começam com um bom café." |
| 4–8 s | "10 ANOS": café, sabores e momentos para aproveitar sem pressa |
| 8–13 s | Sobre: "Uma pausa que vale a pena", com fotos do ambiente |
| 13–22 s | Cardápio: espresso, chocolate quente, bolo de chocolate, cuscuz e omelete, com preços, e uma faixa com outros itens |
| 22–26 s | Experiência: café, sabores e ambiente |
| 26–31 s | Localização (Windows Open Mall, Av. dos Holandeses, 13), WhatsApp, Instagram e iFood |
| 31–35 s | Encerramento com logo e @jabuticabacafe |

## Como editar e renderizar de novo

- `motion.html` tem a animação inteira. Abra no navegador para assistir em loop (clique pausa) ou use `motion.html?t=12.5` para ver um instante específico. Textos, preços e fotos ficam no próprio HTML (os itens do cardápio estão na lista `MENU`).
- `render.cjs` gera o MP4 quadro a quadro e já comprime a versão final (precisa do Playwright com Chromium e do ffmpeg; leva uns 15 min numa máquina de 4 núcleos):

```bash
NODE_PATH=$(npm root -g) node render.cjs                 # gera jabuticaba-cafe-motion.mp4
NODE_PATH=$(npm root -g) node render.cjs --stills 2,10   # só alguns quadros PNG em ./stills
```
