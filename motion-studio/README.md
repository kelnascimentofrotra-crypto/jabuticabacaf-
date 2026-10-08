# motion-studio (versão HTML)

Estúdio da skill `motion-video` (`.claude/skills/motion-video/SKILL.md`). O kit original usa um motor em canvas (`engine.core.js`, `render.sh`, `sfx.py`, `check.py`) que **não veio junto** com os arquivos enviados. Por isso, aqui as cenas são escritas em HTML e renderizadas quadro a quadro no Chromium, seguindo as mesmas regras de movimento e o mesmo fluxo da skill.

```
styles/<estilo>/      style.js + STYLE.md (neon-glow: treinado da referência Full TV · tech-premium: exemplo do kit)
projects/<nome>/      motion.html (cenas, SFX, BOARD) · audio.json · audio/ (trilha) · out/
tools/render.cjs      preview | board | timeline | check | full   (--fmt v|sq, --audio, --workers)
tools/check.py        relatório de dead holds (regra 9)
tools/sheet.py        grades do preview e do board
engine/sfx.py         sons sintetizados + mixagem com a música (-14 LUFS)
fonts/                fontes locais
```

## Fluxo (rodar de dentro de `motion-studio/`)

```bash
export NODE_PATH=$(npm root -g)
node tools/render.cjs projects/jabuticaba-promo preview        # out/preview.jpg
node tools/render.cjs projects/jabuticaba-promo board          # out/board.png (storyboard em imagem)
node tools/render.cjs projects/jabuticaba-promo timeline       # out/timeline.json (SFX, BOARD)
node tools/render.cjs projects/jabuticaba-promo check          # 0 DEAD HOLD = ok
python3 projects/jabuticaba-promo/audio/compose_music.py       # trilha (fluidsynth + fluid-soundfont-gm)
python3 engine/sfx.py projects/jabuticaba-promo                # out/mix.wav (ajuste de som sem re-render)
node tools/render.cjs projects/jabuticaba-promo full --audio projects/jabuticaba-promo/out/mix.wav            # out/final.mp4
node tools/render.cjs projects/jabuticaba-promo full --fmt sq --audio projects/jabuticaba-promo/out/mix.wav   # out/final-sq.mp4
node tools/render.cjs projects/<p> full --from 1000 --audio projects/<p>/out/mix.wav   # só refaz do frame 1000 em diante (o começo vem do out/video.mp4 anterior)
```

## Narração (voz neural Kokoro-82M, Apache-2.0)

O roteiro e os frames de cada fala ficam em `projects/jabuticaba-promo/audio/make_vo.py`. Vozes em português: `pm_alex` (masculina, a padrão, como na referência), `pm_santa` (masculina) e `pf_dora` (feminina). O modelo vem do npm (`kokoro-q8-shards`), porque o Hugging Face fica bloqueado aqui; as instruções estão no topo do script.

```bash
pip install kokoro-onnx
python3 projects/jabuticaba-promo/audio/make_vo.py pm_alex                                   # falas -> audio/vo/pm_alex/
python3 engine/sfx.py projects/jabuticaba-promo --vo audio/vo/pm_alex/vo.json --out mix-pm_alex.wav
ffmpeg -i out/final.mp4 -i out/mix-pm_alex.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/final-voz-masculina.mp4
```

### Narração pronta (ElevenLabs etc.) encaixada nas cenas

`tools/vo_align.py` corta uma narração inteira em frases (DTW de MFCC contra uma referência Kokoro, corte no ponto de menor energia) e põe cada frase no frame em que o texto aparece, acelerando no máximo `max_speed` quando não cabe. O roteiro com os frames fica em `projects/<p>/audio/vo_script.json`.

```bash
python3 tools/vo_align.py projects/site-promo                                   # -> audio/vo/elevenlabs-aline/
python3 engine/sfx.py projects/site-promo --vo audio/vo/elevenlabs-aline/vo.json --out mix-voz.wav
ffmpeg -i projects/site-promo/out/final.mp4 -i projects/site-promo/out/mix-voz.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest projects/site-promo/out/final-voz.mp4
```

## Projeto `site-promo` (por que ter um site)

Anúncio vertical de 42 s no estilo tech-premium: um ponto laranja viaja de nó em nó e, em cada parada, vira linha e abre uma tela (benefícios e, depois, a vitrine com os heroes dos sites). Os prints ficam em `projects/site-promo/assets/`; Aurora e Pulse são sites conceito escritos em `projects/site-promo/concepts/` (abra no navegador ou gere os prints de novo com o Playwright em 1440×900 e 390×844 @2x).

```bash
python3 projects/site-promo/audio/compose_music.py                 # trilha eletrônica 120 BPM (TR-808, harpa, celesta)
node tools/render.cjs projects/site-promo timeline
python3 engine/sfx.py projects/site-promo                            # out/mix.wav
node tools/render.cjs projects/site-promo full --workers 4 --audio projects/site-promo/out/mix.wav
```

## Projeto `webvee-promo` (WEBVEE Leads: IA na captação de clientes)

Vertical, 62 s, com a copy inteira em texto cinético e a paleta do app (roxo `#7530F2`, fonte Plus Jakarta Sans). O ponto roxo é a IA: conecta os leads, varre o radar, desenha o ∞, leva a chave de API e abre cada recurso. O logo W foi redesenhado em SVG a partir do print do app (troque pela arte oficial em `LOGO()` se tiver o arquivo).

```bash
python3 projects/webvee-promo/audio/compose_music.py               # eletrônica escura em ré menor, 120 BPM
node tools/render.cjs projects/webvee-promo timeline && python3 engine/sfx.py projects/webvee-promo
node tools/render.cjs projects/webvee-promo full --workers 4 --audio projects/webvee-promo/out/mix.wav
```

## Projeto `zorro-gamer` (motion designer, 36,8 s)

Phonk/trap a 150 BPM, logo recortado do arquivo do cliente (`assets/logo-cut.png`, `emblem.png`) e o bordão "DANIEL VAI SE LASCAR!" no fim (frames 1008–1104).

```bash
python3 projects/zorro-gamer/audio/compose_music.py
node tools/render.cjs projects/zorro-gamer timeline && python3 engine/sfx.py projects/zorro-gamer
node tools/render.cjs projects/zorro-gamer full --workers 4 --audio projects/zorro-gamer/out/mix.wav
```

## Projeto `lougan-contabil` (Lougan Contabilidade: redução de dívidas, 48 s)

Vertical, tudo em gráfico (dívida subindo, barras de juros, extrato, virada do gráfico, rosca da renda). Um ponto de luz vai de um lado pro outro e abre cada tela (`mkDot`, `dotTravel`, `openCard`). Os valores na tela são ilustrativos. O WhatsApp (+55 98 8499-2560) aparece no CTA e na assinatura. Trilha orquestral/pop a 120 BPM com MuseScore General (MIT) + pedalboard.

```bash
python3 projects/lougan-contabil/audio/compose_music.py
node tools/render.cjs projects/lougan-contabil timeline && python3 engine/sfx.py projects/lougan-contabil
node tools/render.cjs projects/lougan-contabil full --workers 4 --audio projects/lougan-contabil/out/mix.wav
```

Requer Playwright (Chromium), ffmpeg e Python com `numpy scipy soundfile pyloudnorm pillow mido`.
