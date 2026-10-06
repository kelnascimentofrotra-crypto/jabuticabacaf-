"""Corta a narração da ElevenLabs em 12 frases e encaixa cada uma no frame da cena.

    python3 split_align.py   -> ../vo/elevenlabs/NN.wav + vo.json

As fronteiras são escolhidas entre as pausas do áudio (programação dinâmica), comparando
o tamanho de cada trecho com o tamanho esperado da frase (medido nas falas do Kokoro).
Se uma frase não cabe até a próxima, ela é acelerada um pouco (atempo, sem mudar o tom).
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent))
from make_vo import SCRIPT  # noqa: E402  (frames e textos das falas)

x, sr = sf.read(HERE / 'narracao.wav')
hop = sr // 100
e = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
db = 20 * np.log10(e + 1e-9)
voiced = db > np.percentile(db[db > -80], 95) - 35
gaps, i = [], 0
while i < len(voiced):
    if not voiced[i]:
        j = i
        while j < len(voiced) and not voiced[j]:
            j += 1
        if j - i >= 8 and i > 0 and j < len(voiced):
            gaps.append((i, j))
        i = j
    else:
        i += 1
on = np.where(voiced)[0]
start, end = on[0], on[-1] + 1
expected = np.array([len(sf.read(HERE.parent / 'vo' / 'pm_alex' / f'{k:02d}.wav')[0]) / 24000 for k in range(len(SCRIPT))])
n = len(SCRIPT)
scale = (end - start) / 100 / expected.sum()
# fronteiras: projeção DTW das fronteiras conhecidas (narração Kokoro) e, perto de cada projeção,
# a pausa mais longa (fim de frase) entre as que estão a até 0,3 s
proj = PROJ if 'PROJ' in globals() else None
if proj is None:
    import dtw_check  # noqa: F401  (calcula e imprime as projeções)
    proj = dtw_check.PROJECTED
chosen = []
for p in proj:
    near = [g for g in gaps if abs((g[0] + g[1]) / 200 - p) < .3]
    g = max(near, key=lambda g: g[1] - g[0]) if near else min(gaps, key=lambda g: abs((g[0] + g[1]) / 200 - p))
    chosen.append(g)
segs, a = [], start
for g in chosen:
    segs.append((a, g[0])); a = g[1]
segs.append((a, end))
print('frases (s):', ' | '.join(f'{a / 100:.2f}–{b / 100:.2f}' for a, b in segs))

out = HERE.parent / 'vo' / 'elevenlabs'
out.mkdir(parents=True, exist_ok=True)
items, prev_end = [], 0.0
for k, ((a, b), (frame, text)) in enumerate(zip(segs, SCRIPT)):
    clip = x[max(0, a * hop - int(.04 * sr)):b * hop + int(.06 * sr)]
    want = frame / 30
    t0 = max(want, prev_end + .08)
    nxt = SCRIPT[k + 1][0] / 30 if k + 1 < n else 33.0 - .6
    room = nxt - t0 - .06
    dur = len(clip) / sr
    tempo = 1.0
    if dur > room:
        tempo = min(1.12, dur / max(room, .1))
    path = out / f'{k:02d}.wav'
    sf.write(path, clip, sr)
    if tempo > 1.001:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(path), '-af', f'atempo={tempo:.3f}', str(path) + '.tmp.wav'], check=True)
        Path(str(path) + '.tmp.wav').replace(path)
        dur = dur / tempo
    prev_end = t0 + dur
    items.append({'path': f'audio/vo/elevenlabs/{path.name}', 'frame': round(t0 * 30, 1)})
    print(f'{k:02d} cena@{frame:3d}f  entra {t0 * 30:6.1f}f  ({dur:4.2f}s, atempo {tempo:.2f})  esperado {expected[k] * scale:4.2f}s  {text}')
(out / 'vo.json').write_text(json.dumps(items, ensure_ascii=False, indent=1))
