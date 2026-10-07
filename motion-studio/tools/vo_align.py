"""Encaixa uma narração pronta (ex.: ElevenLabs) nas cenas de um projeto, frase por frase.

    python3 tools/vo_align.py projects/<p> [audio/vo_script.json]

vo_script.json:
    {"narration": "audio/elevenlabs/narracao.mp3", "name": "elevenlabs", "ref_voice": "pm_alex",
     "lines": [[frame_em_que_o_texto_aparece, "frase"], ...]}

Como funciona (sem reconhecimento de fala):
  1. gera uma referência das mesmas frases com o Kokoro (fronteiras conhecidas);
  2. alinha referência e narração por DTW de MFCC (com faixa em volta da diagonal) e projeta as fronteiras;
  3. em volta de cada projeção (±0,25 s) corta no trecho de menor energia;
  4. coloca cada frase no frame do texto (pode entrar até 0,2 s antes); se não couber até a próxima,
     acelera um pouco (atempo até 1,15, sem mudar o tom) e, se ainda faltar espaço, empurra a próxima.
Saída: audio/vo/<name>/NN.wav + vo.json (lido por engine/sfx.py --vo).
Modelo Kokoro: projects/jabuticaba-promo/audio/kokoro/ (veja o topo de make_vo.py para baixar).
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.fft import dct
from scipy.signal import resample_poly, stft

ROOT = Path(__file__).resolve().parent.parent
KOK = ROOT / 'projects' / 'jabuticaba-promo' / 'audio' / 'kokoro'
FPS, MFR, PRE, GAP, MAXSPD = 30, 16000, .2, .08, 1.15


def load(path, sr=48000):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64), sr


def mfcc(x, sr):
    x = resample_poly(x, MFR, sr)
    f, t, Z = stft(x, MFR, nperseg=400, noverlap=240)                       # 25 ms / passo 10 ms
    P = np.abs(Z) ** 2
    mel, imel = (lambda h: 2595 * np.log10(1 + h / 700)), (lambda m: 700 * (10 ** (m / 2595) - 1))
    pts = imel(np.linspace(mel(80), mel(7600), 42))
    fb = np.zeros((40, len(f)))
    for i in range(40):
        a, b, c = pts[i], pts[i + 1], pts[i + 2]
        fb[i] = np.clip(np.minimum((f - a) / (b - a), (c - f) / (c - b)), 0, None)
    M = dct(np.log(fb @ P + 1e-8), axis=0, norm='ortho')[1:14]
    M = (M - M.mean(1, keepdims=True)) / (M.std(1, keepdims=True) + 1e-8)
    return M.T


def dtw_band(A, B, R=250):
    A = A / np.linalg.norm(A, axis=1, keepdims=True)
    B = B / np.linalg.norm(B, axis=1, keepdims=True)
    n, m = len(A), len(B)
    lo = [max(0, int(i * m / n) - R) for i in range(n)]
    hi = [min(m, int(i * m / n) + R + 1) for i in range(n)]
    D = np.full((n, m), np.inf)
    for i in range(n):
        c = 1 - B[lo[i]:hi[i]] @ A[i]
        prev = D[i - 1] if i else None
        row = D[i]
        for k, j in enumerate(range(lo[i], hi[i])):
            if i == 0 and j == 0:
                best = 0.0
            else:
                best = min(prev[j] if i else np.inf, row[j - 1] if j else np.inf, prev[j - 1] if i and j else np.inf)
            row[j] = c[k] + best
    i, j, path = n - 1, m - 1, [(n - 1, m - 1)]
    while i > 0 or j > 0:
        cand = [(D[i - 1, j - 1] if i and j else np.inf, i - 1, j - 1), (D[i - 1, j] if i else np.inf, i - 1, j), (D[i, j - 1] if j else np.inf, i, j - 1)]
        _, i, j = min(cand)
        path.append((i, j))
    return path[::-1]


def main():
    P = Path(sys.argv[1]).resolve()
    cfg = json.loads((P / (sys.argv[2] if len(sys.argv) > 2 else 'audio/vo_script.json')).read_text())
    lines = cfg['lines']
    global PRE, MAXSPD
    PRE, MAXSPD = cfg.get('pre', PRE), cfg.get('max_speed', MAXSPD)
    x, sr = load(P / cfg['narration'])
    # 1. referência Kokoro com fronteiras conhecidas
    from kokoro_onnx import Kokoro
    k = Kokoro(str(KOK / 'kokoro-q8.onnx'), str(KOK / 'voices-pt.npz'))
    parts, bounds, t, rsr = [], [], 0.0, 24000
    for _, text in lines:
        y, rsr = k.create(text, voice=cfg.get('ref_voice', 'pm_alex'), speed=1.0, lang='pt-br')
        e = np.convolve(np.abs(y), np.ones(240) / 240, 'same'); idx = np.where(e > .012 * e.max())[0]
        y = y[max(0, idx[0] - 720):idx[-1] + 720]
        parts += [y, np.zeros(int(.25 * rsr))]
        t += len(y) / rsr; bounds.append(t + .125); t += .25
    ref = np.concatenate(parts)
    # 2. DTW e projeção das fronteiras
    A, B = mfcc(ref, rsr), mfcc(x, sr)
    amap = {}
    for i, j in dtw_band(A, B, R=max(250, int(abs(len(A) - len(B)) * 1.2) + 150)):
        amap.setdefault(i, []).append(j)
    proj = [float(np.mean(amap[min(int(b * 100), len(A) - 1)]) / 100) for b in bounds[:-1]]
    # 3. corte no ponto de menor energia perto de cada projeção
    hop = sr // 100
    en = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    sm = np.convolve(en, np.ones(6) / 6, 'same')
    voiced = np.where(20 * np.log10(en + 1e-9) > 20 * np.log10(en.max()) - 40)[0]
    start, end = voiced[0], voiced[-1] + 1
    cuts = []
    for p in proj:
        c = int(p * 100); a, b = max(start + 1, c - 25), min(end - 1, c + 26)
        cuts.append(a + int(np.argmin(sm[a:b])))
    edges = [start] + cuts + [end]
    segs, src = [], []
    for i in range(len(lines)):
        a, b = edges[i], edges[i + 1]
        while a < b - 1 and 20 * np.log10(en[a] + 1e-9) < 20 * np.log10(en.max()) - 38: a += 1       # aparo o silêncio
        while b > a + 1 and 20 * np.log10(en[b - 1] + 1e-9) < 20 * np.log10(en.max()) - 38: b -= 1
        y = x[max(0, a * hop - int(.03 * sr)):min(len(x), b * hop + int(.06 * sr))].copy()
        fl = int(.012 * sr); y[:fl] *= np.linspace(0, 1, fl); y[-fl:] *= np.linspace(1, 0, fl)
        segs.append(y); src.append((a / 100, b / 100))
    # 4. encaixe: entra no texto (até PRE antes), acelera se não couber, empurra se precisar
    tg = [f / FPS for f, _ in lines]
    dur = [len(y) / sr for y in segs]
    spd = [1.0] * len(segs)
    for _ in range(3):
        st, prev_end = [], -1e9
        for i in range(len(segs)):
            s = max(0, tg[i] - PRE, prev_end + GAP)
            st.append(s); prev_end = s + dur[i] / spd[i]
        for i in range(len(segs) - 1):
            room = (tg[i + 1] - PRE) - st[i] - GAP
            if dur[i] / spd[i] > room > 0:
                spd[i] = min(MAXSPD, dur[i] / room)
    out = P / 'audio' / 'vo' / cfg.get('name', 'elevenlabs')
    out.mkdir(parents=True, exist_ok=True)
    items = []
    print(f'narração {len(x) / sr:.1f}s · {len(lines)} frases')
    for i, (y, (f, text)) in enumerate(zip(segs, lines)):
        path = out / f'{i:02d}.wav'
        sf.write(path, y, sr, subtype='PCM_24')
        if spd[i] > 1.005:
            tmp = out / f'.{i:02d}.wav'
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(path), '-af', f'atempo={spd[i]:.4f}', str(tmp)], check=True)
            tmp.replace(path)
        fr = round(st[i] * FPS)
        late = fr - f
        print(f'{i:02d} [{src[i][0]:5.2f}–{src[i][1]:5.2f}s] texto f{f:5d} · voz f{fr:5d} ({late:+4d}f) · {dur[i] / spd[i]:4.2f}s{"  x%.2f" % spd[i] if spd[i] > 1.005 else ""}  {text}')
        items.append({'path': str(path.relative_to(P)), 'frame': fr})
    (out / 'vo.json').write_text(json.dumps(items, ensure_ascii=False, indent=1))
    print('ok ->', (out / 'vo.json').relative_to(P))


if __name__ == '__main__':
    main()
