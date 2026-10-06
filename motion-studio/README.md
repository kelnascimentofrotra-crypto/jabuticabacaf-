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
```

Requer Playwright (Chromium), ffmpeg e Python com `numpy scipy soundfile pyloudnorm pillow mido`.
