# Motion — Jabuticaba Café

Vídeo de ~37 s com o logo de 10 anos, as fotos reais e as informações do site, com narração, efeitos sonoros e trilha.

| Arquivo | Formato | Uso |
|---|---|---|
| `jabuticaba-cafe-reels.mp4` | 1080×1920 (9:16) | Reels, Stories, TikTok |
| `jabuticaba-cafe-feed.mp4` | 1080×1080 (1:1) | Post no feed |

Os dois são H.264 + AAC, 30 fps, com áudio normalizado a −14 LUFS (pico −1,5 dBFS), o padrão das redes sociais.

## Roteiro

| Tempo | Cena | Narração |
|---|---|---|
| 0–4,8 s | Jabuticabas caem, o logo bate na tela | "Momentos especiais começam com um bom café." |
| 4,8–8,4 s | Contador até 10, faixa "ANOS" | "São dez anos de Jabuticaba Café." |
| 8,4–12,6 s | "Uma pausa que vale a pena", fotos do ambiente | "Uma pausa que vale a pena, para aproveitar sem pressa." |
| 12,6–14,4 s | Montagem rápida de fotos: "Nosso cardápio" | — |
| 14,4–22,2 s | Espresso, chocolate quente, bolo, cuscuz e omelete com preços | Nome de cada prato |
| 22,2–25,8 s | Café · Sabores · Ambiente | "Mais do que café: uma experiência." |
| 25,8–31,8 s | Endereço, WhatsApp, Instagram, iFood | "Na Avenida dos Holandeses, em São Luís. Ou peça no conforto da sua casa." |
| 31,8–36,6 s | Encerramento com o logo e @jabuticabacafe | "Jabuticaba Café. Esperamos por você!" |

## Créditos

- **Voz:** Letícia-F123, do [RHVoice](https://github.com/RHVoice/RHVoice), por Olga Yakovleva e Fernando H. F. Botelho, licença [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). A licença permite uso comercial e pede crédito. Ao postar, vale incluir algo como "Voz: Letícia-F123 (RHVoice), CC BY-SA 4.0".
- **Efeitos sonoros e trilha:** sintetizados do zero por `audio/build_audio.py`, sem amostras de terceiros.
- **Fotos, logo e textos:** do site do Jabuticaba Café.

## Como editar e gerar de novo

`motion.html` tem a animação inteira. Abra no navegador para assistir em loop (clique pausa), use `motion.html?fmt=sq` para o formato quadrado e `?t=12.5` para ver um instante específico. Os textos e preços ficam no próprio HTML (os pratos estão na lista `MENU`). Os horários da narração (`VO`) e dos efeitos sonoros (`CUES`) também.

Passo a passo (precisa de Playwright com Chromium, ffmpeg, Python com `numpy scipy soundfile pyloudnorm` e, para regravar a voz, `apt install rhvoice rhvoice-brazilian-portuguese`):

```bash
export NODE_PATH=$(npm root -g)
./audio/make_vo.sh                                   # 1. falas (texto em audio/vo/roteiro.tsv)
node render.cjs --timeline audio/timeline.json       # 2. exporta horários de narração e efeitos
python3 audio/build_audio.py                         # 3. efeitos + trilha + mixagem -> audio/mix.wav
node render.cjs --fmt v  --audio audio/mix.wav       # 4. Reels (≈15 min em 4 núcleos)
node render.cjs --fmt sq --audio audio/mix.wav       #    Feed  (≈9 min)
node render.cjs --fmt sq --stills 2,10               # só alguns quadros PNG em ./stills
```
