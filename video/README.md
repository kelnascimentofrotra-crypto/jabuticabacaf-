# Motion — Jabuticaba Café

Vídeo de ~37 s com o logo de 10 anos, as fotos reais e as informações do site, com trilha de bossa nova e efeitos sonoros.

| Arquivo | Formato | Uso |
|---|---|---|
| `jabuticaba-cafe-reels.mp4` | 1080×1920 (9:16) | Reels, Stories, TikTok |
| `jabuticaba-cafe-feed.mp4` | 1080×1080 (1:1) | Post no feed |

Os dois são H.264 + AAC, 30 fps, com áudio normalizado a −14 LUFS (pico −1,5 dBFS), o padrão das redes sociais.

## Roteiro

A narração foi tirada da versão final (a voz sintética não ficou boa), mas continua disponível no processo: veja abaixo.

| Tempo | Cena | Narração (opcional) |
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

- **Trilha:** bossa nova original composta em `audio/compose_music.py` (violão de nylon, contrabaixo, vibrafone, Rhodes e bateria de vassourinha), tocada com o banco de sons FluidR3_GM, licença MIT, que permite uso comercial.
- **Efeitos sonoros:** sintetizados do zero por `audio/build_audio.py`, sem amostras de terceiros.
- **Voz (só na versão com narração):** Letícia-F123, do [RHVoice](https://github.com/RHVoice/RHVoice), licença [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- **Fotos, logo e textos:** do site do Jabuticaba Café.

## Como editar e gerar de novo

`motion.html` tem a animação inteira. Abra no navegador para assistir em loop (clique pausa), use `motion.html?fmt=sq` para o formato quadrado e `?t=12.5` para ver um instante específico. Os textos e preços ficam no próprio HTML (os pratos estão na lista `MENU`). Os horários da narração (`VO`) e dos efeitos sonoros (`CUES`) também.

Passo a passo (precisa de Playwright com Chromium, ffmpeg, Python com `numpy scipy soundfile pyloudnorm mido`, `apt install fluidsynth fluid-soundfont-gm` para a trilha e, só para a narração, `apt install rhvoice rhvoice-brazilian-portuguese`):

```bash
export NODE_PATH=$(npm root -g)
node render.cjs --timeline audio/timeline.json             # 1. exporta horários de narração, efeitos e trilha
python3 audio/compose_music.py                             # 2. bossa nova -> audio/trilha.flac
python3 audio/build_audio.py --sem-voz                     # 3. efeitos + trilha -> audio/mix-sem-voz.wav
node render.cjs --fmt v  --audio audio/mix-sem-voz.wav     # 4. Reels (≈15 min em 4 núcleos)
node render.cjs --fmt sq --audio audio/mix-sem-voz.wav     #    Feed  (≈9 min)
# com narração: ./audio/make_vo.sh e depois build_audio.py sem --sem-voz (gera audio/mix.wav)
# só trocar o áudio de um vídeo já renderizado, sem refazer a imagem:
# ffmpeg -i jabuticaba-cafe-reels.mp4 -i audio/mix-sem-voz.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest saida.mp4
node render.cjs --fmt sq --stills 2,10               # só alguns quadros PNG em ./stills
```
