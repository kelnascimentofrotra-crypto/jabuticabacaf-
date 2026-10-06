"""Sons sintetizados + mixagem com música (no lugar do sfx.py do kit, que não veio).

    python3 engine/sfx.py projects/<nome>      -> projects/<nome>/out/mix.wav

Lê out/timeline.json (SFX=[[nome, frame, ganho, pan, {opts}]], FPS, DURATION) e audio.json
({music:{path, align:{musicTime, frame}, gain, fadeIn, fadeOut}, duck:[[frameIni, frameFim, dB]], loudness}).
Sons: whoosh{dur,f0,f1,peak,panFrom,panTo} pop{f0,f1,dur} click{freq,dur} tick chime boom{dur} shimmer{dur}
      typing{n,step} clicks{n,step} glitch{dur} confetti riser{dur}. Som novo = função em GEN.
"""
import json
import sys
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy.ndimage import minimum_filter1d, uniform_filter1d
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly, stft, istft

SR = 48000
R = np.random.default_rng(5)


def t_(d):
    return np.arange(int(d * SR)) / SR


def db(x):
    return 10 ** (x / 20)


def filt(x, kind, f, order=2):
    return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x, axis=-1)


def noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n)


def ir(dur, seed, damp=6500):
    t = t_(dur)
    e = np.exp(-t / (dur / 6.5))
    x = filt(np.stack([noise(len(t), seed) * e, noise(len(t), seed + 1) * e]), 'lowpass', damp)
    x = np.concatenate([np.zeros((2, int(.012 * SR))), x], axis=1)
    return x / np.sqrt(np.sum(x ** 2) / 2)


HALL, ROOM = ir(1.4, 3), ir(.4, 9, 7500)


def verb(x, IR, wet):
    x = np.stack([x, x]) if x.ndim == 1 else x
    return x + wet * np.stack([fftconvolve(x[i], IR[i])[:x.shape[1]] for i in (0, 1)])


def sweep(dur, fpath, bw=1.0, seed=0):
    n = int(dur * SR)
    f, tt, Z = stft(noise(n + 2048, seed), SR, nperseg=1024, noverlap=768)
    fc = np.array([fpath(v) for v in np.clip(tt / dur, 0, 1)])
    m = np.exp(-.5 * ((np.log2(np.maximum(f, 1))[:, None] - np.log2(fc)[None]) / (bw / 2)) ** 2)
    y = istft(Z * m, SR, nperseg=1024, noverlap=768)[1][:n]
    return y / (np.abs(y).max() + 1e-9)


def env(dur, peak, a=2.0, b=1.6):
    t = t_(dur) / dur
    return np.where(t < peak, (t / peak) ** a, ((1 - t) / (1 - peak)) ** b)


def pan2(x, p):
    th = (np.asarray(p) + 1) * np.pi / 4
    return np.stack([x * np.cos(th), x * np.sin(th)])


# ------------------------------------------------------------------ geradores
def whoosh(dur=.5, f0=400, f1=3000, peak=.6, panFrom=-.4, panTo=.4, seed=0, **_):
    fp = lambda v: f0 * (f1 / f0) ** (min(v / peak, 1) if v < peak else 1 - .5 * (v - peak) / (1 - peak))
    x = sweep(dur, fp, 1.1, seed) * env(dur, peak) + filt(noise(int(dur * SR), seed + 1), 'lowpass', 180) * env(dur, peak) * 1.5
    return verb(pan2(x, np.linspace(panFrom, panTo, len(x))), ROOM, .15)


def pop(f0=900, f1=300, dur=.12, **_):
    t = t_(dur)
    f = f1 + (f0 - f1) * np.exp(-t / .018)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .04)
    x[:96] *= np.linspace(0, 1, 96)
    return verb(x + filt(noise(len(t), 3), 'highpass', 3000) * np.exp(-t / .003) * .25, ROOM, .12)


def click(freq=1500, dur=.05, **_):
    t = t_(dur)
    return verb(np.sin(2 * np.pi * freq * t) * np.exp(-t / .005) + filt(noise(len(t), 4), 'highpass', 2500) * np.exp(-t / .002) * .5, ROOM, .1)


def tick(**_):
    t = t_(.06)
    x = np.sin(2 * np.pi * 2600 * t) * np.exp(-t / .006) + filt(noise(len(t), 5), 'highpass', 5000) * np.exp(-t / .003) * .5
    x += np.sin(2 * np.pi * 900 * t) * np.exp(-t / .012) * .4      # corpo de relógio
    return verb(x, ROOM, .2)


def bell(f0, dur=2.0, amp=1.0):
    t = t_(dur)
    x = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t / d) for r, a, d in [(1, 1, .9), (2, .35, .5), (2.76, .25, .35), (4.07, .12, .2)])
    x[:96] *= np.linspace(0, 1, 96)
    return x * amp


def chime(**_):
    out = np.zeros((2, int(2.6 * SR)))
    for k, f in enumerate([1174.66, 1479.98, 1760.0, 2349.32]):
        place(out, pan2(bell(f, 2.2, .8), -.5 + k / 3), k * .06)
    return verb(out, HALL, .35)


def boom(dur=1.2, **_):
    t = t_(dur + .6)
    f = 36 + 60 * np.exp(-t / .09)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (.2 * dur + .05))
    x += filt(noise(len(t), 11), 'lowpass', 1500) * np.exp(-t / .05) * .8
    return verb(np.tanh(x * 1.4), HALL, .16)


def shimmer(dur=1.0, **_):
    out = np.zeros((2, int((dur + .3) * SR)))
    for i in range(int(40 * dur) + 10):
        st = (R.random() ** 1.8) * dur
        t = t_(.08)
        g = np.sin(2 * np.pi * (3000 + R.random() * 6000) * t) * np.exp(-.5 * ((t - .03) / .012) ** 2) * (1 - st / dur) * .5
        place(out, pan2(g, R.uniform(-.8, .8)), st)
    return verb(out, HALL, .4)


def typing(n=10, step=.045, **_):
    out = np.zeros((2, int((n * step + .3) * SR)))
    for i in range(n):
        t = t_(.03)
        k = filt(noise(len(t), 100 + i), 'bandpass', [1800 + R.random() * 2500, 9000]) * np.exp(-t / .004) * (.6 + .4 * R.random())
        k += np.sin(2 * np.pi * (220 + R.random() * 80) * t) * np.exp(-t / .006) * .4
        place(out, pan2(k, R.uniform(-.25, .25)), i * step + R.uniform(-.006, .006))
    return verb(out, ROOM, .1)


def clicks(n=6, step=.08, **_):
    out = np.zeros((2, int((n * step + .2) * SR)))
    for i in range(n):
        place(out, click(1300 + 300 * R.random()), i * step)
    return out


def glitch(dur=.27, **_):
    n = int(dur * SR)
    x = np.zeros(n)
    for _ in range(9):
        a, b = sorted(R.integers(0, n, 2))
        x[a:b] += np.sign(np.sin(2 * np.pi * R.uniform(80, 900) * np.arange(b - a) / SR)) * R.uniform(.3, 1)
    x += filt(noise(n, 13), 'bandpass', [1500, 9000]) * .5
    x = np.round(x * 6) / 6                                                  # bitcrush
    return pan2(x * env(dur, .1, 1, .6), np.sin(np.linspace(0, 20, n)) * .6)


def confetti(**_):
    out = boom(.5) * .5
    pp = filt(noise(int(.25 * SR), 21), 'bandpass', [600, 7000]) * np.exp(-t_(.25) / .03)   # estouro do lança-confete
    place(out, pan2(pp, 0) * 1.4, 0)
    for i in range(60):
        st = .05 + R.random() ** 1.5 * 1.6
        t = t_(.02)
        c = filt(noise(len(t), 200 + i), 'highpass', 4000) * np.exp(-t / .003) * (1 - st / 1.7) * .5
        place(out, pan2(c, R.uniform(-.9, .9)), st)
    return verb(out, HALL, .25)


def riser(dur=1.0, **_):
    t = t_(dur)
    x = sweep(dur, lambda v: 300 * 20 ** v, 1.4, 61) * (t / dur) ** 2.2
    x += np.sin(2 * np.pi * np.cumsum(220 * 4 ** (t / dur)) / SR) * (t / dur) ** 2 * .25
    x[-480:] *= np.linspace(1, 0, 480)
    return verb(pan2(x, np.linspace(-.3, .3, len(x))), HALL, .2)


GEN = dict(whoosh=whoosh, pop=pop, click=click, tick=tick, chime=chime, boom=boom, shimmer=shimmer,
           typing=typing, clicks=clicks, glitch=glitch, confetti=confetti, riser=riser)


def place(bus, sig, t, g=1.0):
    sig = np.stack([sig, sig]) if sig.ndim == 1 else sig
    i = int(round(t * SR))
    if i >= bus.shape[1]:
        return
    j = min(bus.shape[1], i + sig.shape[1])
    bus[:, max(i, 0):j] += sig[:, max(0, -i):j - i] * g


def lufs(x):
    return pyln.Meter(SR).integrated_loudness(x.T)


def main(proj):
    P = Path(proj)
    tl = json.loads((P / 'out' / 'timeline.json').read_text())
    cfg = json.loads((P / 'audio.json').read_text())
    fps, N = tl['FPS'], int(tl['DURATION'] * SR)
    sfx = np.zeros((2, N + 3 * SR))
    for k, (name, frame, gain, pn, opts) in enumerate(tl['SFX']):
        s = GEN[name](seed=k, **opts)
        s = s / (np.abs(s).max() + 1e-9) * gain
        if pn:
            s = s * np.array([[min(1, 1 - pn)], [min(1, 1 + pn)]])
        place(sfx, s, frame / fps)
    sfx = sfx[:, :N] * db(-4)
    mix = sfx.copy()
    m = cfg.get('music')
    if m:
        x, sr = sf.read(P / m['path'])
        x = (resample_poly(x, SR, sr, axis=0) if sr != SR else x).T
        off = m.get('align', {}).get('frame', 0) / fps - m.get('align', {}).get('musicTime', 0)
        mus = np.zeros((2, N))
        place(mus, x, off)
        fi, fo = int(m.get('fadeIn', 0) * SR), int(m.get('fadeOut', 0) * SR)
        if fi: mus[:, :fi] *= np.linspace(0, 1, fi)
        if fo: mus[:, -fo:] *= np.linspace(1, 0, fo) ** 2
        mus = mus * db(-17 - lufs(mus)) * m.get('gain', 1.0)
        for a, b, d in cfg.get('duck', []):
            mus[:, int(a / fps * SR):int(b / fps * SR)] *= db(d)
        mix = mix + mus
        print(f'trilha  {lufs(mus):6.1f} LUFS')
    print(f'efeitos {lufs(sfx):6.1f} LUFS')
    mix = mix * db(cfg.get('loudness', -14) - lufs(mix))
    c = db(-1.5)
    need = np.minimum(1, c / np.maximum(np.abs(mix).max(axis=0), 1e-9))
    w = int(.006 * SR)
    mix = np.clip(mix * uniform_filter1d(minimum_filter1d(need, w), w), -c, c)
    sf.write(P / 'out' / 'mix.wav', mix.T, SR, subtype='PCM_24')
    print(f'mix     {lufs(mix):6.1f} LUFS   pico {20 * np.log10(np.abs(mix).max()):5.1f} dBFS -> {P / "out" / "mix.wav"}')


if __name__ == '__main__':
    main(sys.argv[1])
