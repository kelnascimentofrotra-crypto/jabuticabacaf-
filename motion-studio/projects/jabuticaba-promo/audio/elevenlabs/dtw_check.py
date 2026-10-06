"""Projeta as fronteiras de frase conhecidas (narração Kokoro) na narração da ElevenLabs via DTW de MFCC."""
import numpy as np
import soundfile as sf
from scipy.fft import dct
from scipy.signal import resample_poly, stft

SR = 16000


def mfcc(x, sr):
    x = resample_poly(x, SR, sr)
    f, t, Z = stft(x, SR, nperseg=400, noverlap=240)          # janela 25 ms, passo 10 ms
    P = np.abs(Z) ** 2
    mel = lambda h: 2595 * np.log10(1 + h / 700)
    imel = lambda m: 700 * (10 ** (m / 2595) - 1)
    pts = imel(np.linspace(mel(80), mel(7600), 42))
    fb = np.zeros((40, len(f)))
    for i in range(40):
        a, b, c = pts[i], pts[i + 1], pts[i + 2]
        fb[i] = np.clip(np.minimum((f - a) / (b - a), (c - f) / (c - b)), 0, None)
    M = dct(np.log(fb @ P + 1e-8), axis=0, norm='ortho')[1:14]
    M = (M - M.mean(1, keepdims=True)) / (M.std(1, keepdims=True) + 1e-8)
    return M.T


def dtw(A, B):
    A = A / np.linalg.norm(A, axis=1, keepdims=True); B = B / np.linalg.norm(B, axis=1, keepdims=True)
    C = 1 - A @ B.T
    n, m = C.shape
    D = np.full((n + 1, m + 1), np.inf); D[0, 0] = 0
    for i in range(1, n + 1):
        Di, Dp, Ci = D[i], D[i - 1], C[i - 1]
        for j in range(1, m + 1):
            Di[j] = Ci[j - 1] + min(Dp[j], Di[j - 1], Dp[j - 1])
    i, j, path = n, m, []
    while i > 0 and j > 0:
        path.append((i - 1, j - 1))
        k = np.argmin([D[i - 1, j - 1], D[i - 1, j], D[i, j - 1]])
        i, j = (i - 1, j - 1) if k == 0 else ((i - 1, j) if k == 1 else (i, j - 1))
    return path[::-1]


# referência: falas do Kokoro emendadas com 0,25 s de silêncio
parts, bounds, t = [], [], 0.0
for k in range(12):
    y, sr = sf.read(f'../vo/pm_alex/{k:02d}.wav')
    parts += [y, np.zeros(int(.25 * sr))]
    t += len(y) / sr
    bounds.append(t + .125)                     # meio do silêncio após a frase k
    t += .25
ref = np.concatenate(parts)
A = mfcc(ref, sr)
x, srx = sf.read('narracao.wav')
B = mfcc(x, srx)
path = dtw(A, B)
amap = {}
for i, j in path:
    amap.setdefault(i, []).append(j)
PROJECTED = [float(np.mean(amap[min(int(b * 100), len(A) - 1)]) / 100) for b in bounds[:-1]]
print('fronteiras projetadas (s):', ' '.join(f'{p:.2f}' for p in PROJECTED))
