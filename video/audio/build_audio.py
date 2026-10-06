"""Monta a trilha do motion: narração + efeitos sonoros + trilha lo-fi, tudo sintetizado aqui.

    python3 build_audio.py            -> mix.wav (48 kHz, estéreo, -14 LUFS)

Lê timeline.json (exportado do motion.html com `node render.cjs --timeline audio/timeline.json`)
e as falas em vo/*.wav (geradas por make_vo.sh). Requer numpy, scipy, soundfile e pyloudnorm.
"""
import json
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy.signal import butter, sosfilt, lfilter, fftconvolve, resample_poly, stft, istft

HERE = Path(__file__).parent
SR = 48000
TL = json.loads((HERE / 'timeline.json').read_text())
DUR = TL['DURATION']
N = int(DUR * SR)
rng = np.random.default_rng(7)


# ---------------------------------------------------------------- utilitários
def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def db(x):
    return 10 ** (x / 20)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, 'highpass', fs=SR, output='sos'), x, axis=-1)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'lowpass', fs=SR, output='sos'), x, axis=-1)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x, axis=-1)


def peq(x, f0, gain_db, q=0.8, kind='peak'):
    """Equalizador biquad (RBJ): 'peak', 'lowshelf' ou 'highshelf'."""
    a_ = 10 ** (gain_db / 40)
    w0 = 2 * np.pi * f0 / SR
    alpha = np.sin(w0) / (2 * q)
    cw = np.cos(w0)
    if kind == 'peak':
        b = [1 + alpha * a_, -2 * cw, 1 - alpha * a_]
        a = [1 + alpha / a_, -2 * cw, 1 - alpha / a_]
    else:
        sa = 2 * np.sqrt(a_) * alpha
        if kind == 'lowshelf':
            b = [a_ * ((a_ + 1) - (a_ - 1) * cw + sa), 2 * a_ * ((a_ - 1) - (a_ + 1) * cw), a_ * ((a_ + 1) - (a_ - 1) * cw - sa)]
            a = [(a_ + 1) + (a_ - 1) * cw + sa, -2 * ((a_ - 1) + (a_ + 1) * cw), (a_ + 1) + (a_ - 1) * cw - sa]
        else:
            b = [a_ * ((a_ + 1) + (a_ - 1) * cw + sa), -2 * a_ * ((a_ - 1) + (a_ + 1) * cw), a_ * ((a_ + 1) + (a_ - 1) * cw - sa)]
            a = [(a_ + 1) - (a_ - 1) * cw + sa, 2 * ((a_ - 1) - (a_ + 1) * cw), (a_ + 1) - (a_ - 1) * cw - sa]
    return lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=-1)


def onepole(x, tau):
    k = np.exp(-1 / (tau * SR))
    return lfilter([1 - k], [1, -k], x)


def pan(mono, p):
    """p em [-1, 1] (constante ou vetor) -> estéreo com lei de potência constante."""
    th = (np.asarray(p) + 1) * np.pi / 4
    return np.stack([mono * np.cos(th), mono * np.sin(th)])


def place(bus, sig, t, gain=1.0):
    """Soma `sig` (mono ou estéreo) no barramento estéreo a partir do instante t (s)."""
    if sig.ndim == 1:
        sig = np.stack([sig, sig])
    i = int(round(t * SR))
    if i >= bus.shape[1]:
        return
    j = min(bus.shape[1], i + sig.shape[1])
    s0 = max(0, -i)
    bus[:, max(i, 0):j] += sig[:, s0:j - i] * gain


def norm_peak(x, peak_db=0.0):
    m = np.max(np.abs(x))
    return x if m == 0 else x / m * db(peak_db)


def make_ir(dur=1.2, seed=1, damp=6000):
    r = np.random.default_rng(seed)
    t = t_axis(dur)
    env = np.exp(-t / (dur / 6.5))
    ir = np.stack([r.standard_normal(len(t)) * env, r.standard_normal(len(t)) * env])
    ir = lp(ir, damp)
    pre = np.zeros((2, int(.015 * SR)))
    ir = np.concatenate([pre, ir], axis=1)
    return ir / np.sqrt(np.sum(ir ** 2) / 2)


IR_HALL = make_ir(1.4, 3)
IR_ROOM = make_ir(.45, 5, 7000)


def reverb(x, ir, wet):
    if x.ndim == 1:
        x = np.stack([x, x])
    y = np.stack([fftconvolve(x[0], ir[0])[:x.shape[1]], fftconvolve(x[1], ir[1])[:x.shape[1]]])
    return x + y * wet


def sweep_noise(dur, f_path, bw_oct=1.0, seed=0):
    """Ruído filtrado por uma banda cuja frequência central segue f_path(t) (0..1 -> Hz)."""
    n = int(dur * SR)
    x = np.random.default_rng(seed).standard_normal(n + 2048)
    f, tt, Z = stft(x, SR, nperseg=1024, noverlap=768)
    tn = np.clip(tt / dur, 0, 1)
    fc = np.array([f_path(v) for v in tn])
    lf = np.log2(np.maximum(f, 1))[:, None]
    mask = np.exp(-0.5 * ((lf - np.log2(fc)[None, :]) / (bw_oct / 2)) ** 2)
    _, y = istft(Z * mask, SR, nperseg=1024, noverlap=768)
    y = y[:n]
    return y / (np.max(np.abs(y)) + 1e-9)


def env_curve(dur, peak_at, rise_pow=2.0, fall_pow=1.6):
    t = t_axis(dur) / dur
    up = (t / peak_at) ** rise_pow
    down = ((1 - t) / (1 - peak_at)) ** fall_pow
    return np.where(t < peak_at, up, down)


# ---------------------------------------------------------------- efeitos sonoros
def sfx_whoosh(dur=.7, seed=0, lo=250, hi=2600, peak=.62):
    f_path = lambda v: lo * (hi / lo) ** (np.sin(np.pi * min(v / peak, 1) / 2) if v < peak else 1 - .55 * (v - peak) / (1 - peak))
    x = sweep_noise(dur, f_path, 1.1, seed) * env_curve(dur, peak)
    body = lp(np.random.default_rng(seed + 1).standard_normal(len(x)), 180) * env_curve(dur, peak) * 3
    x = x + body * .5
    p = np.linspace(-.6, .6, len(x))
    return reverb(pan(x, p), IR_ROOM, .15)


def sfx_whip(dur=.32, seed=0):
    return sfx_whoosh(dur, seed, 700, 5200, .5)


def sfx_swish(dur=.26, seed=0):
    return sfx_whoosh(dur, seed, 1800, 6500, .45)


def sfx_pop(pitch=1.0):
    t = t_axis(.12)
    f = (300 + 650 * np.exp(-t / .018)) * pitch
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .04)
    x[:int(.002 * SR)] *= np.linspace(0, 1, int(.002 * SR))
    click = hp(np.random.default_rng(int(pitch * 100)).standard_normal(len(t)), 3000) * np.exp(-t / .003) * .25
    return reverb(x + click, IR_ROOM, .12)


def sfx_impact():
    t = t_axis(1.6)
    f = 36 + 60 * np.exp(-t / .09)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .24)
    hit = lp(np.random.default_rng(11).standard_normal(len(t)), 1500) * np.exp(-t / .05) * .8
    tail = lp(np.random.default_rng(12).standard_normal(len(t)), 350) * np.exp(-t / .3) * .2
    x = np.tanh((sub + hit + tail) * 1.4)
    return reverb(x, IR_HALL, .14)


def sfx_thump():
    t = t_axis(.4)
    f = 60 + 90 * np.exp(-t / .03)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .1)
    x += lp(np.random.default_rng(21).standard_normal(len(t)), 2500) * np.exp(-t / .012) * .5
    return reverb(x, IR_ROOM, .15)


def sfx_tick(pitch=1.0):
    t = t_axis(.05)
    x = np.sin(2 * np.pi * 2400 * pitch * t) * np.exp(-t / .006)
    x += hp(np.random.default_rng(31).standard_normal(len(t)), 5000) * np.exp(-t / .003) * .4
    return x


def sfx_click():
    t = t_axis(.05)
    x = np.sin(2 * np.pi * 1500 * t) * np.exp(-t / .005) + hp(np.random.default_rng(41).standard_normal(len(t)), 2500) * np.exp(-t / .002) * .5
    return reverb(x, IR_ROOM, .1)


def sfx_shutter():
    out = np.zeros(int(.12 * SR))
    for k, (dt, a) in enumerate([(0, 1), (.045, .7)]):
        t = t_axis(.03)
        c = bp(np.random.default_rng(50 + k).standard_normal(len(t)), 1800, 7000) * np.exp(-t / .006) * a
        c += np.sin(2 * np.pi * 420 * t) * np.exp(-t / .008) * .3 * a
        i = int(dt * SR)
        out[i:i + len(c)] += c
    return reverb(out, IR_ROOM, .12)


def sfx_riser(dur=1.2):
    t = t_axis(dur)
    x = sweep_noise(dur, lambda v: 300 * (6000 / 300) ** v, 1.4, 61) * (t / dur) ** 2.2
    f = 220 * (4 ** (t / dur))
    x += np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / dur) ** 2 * .25
    x[-int(.01 * SR):] *= np.linspace(1, 0, int(.01 * SR))
    return reverb(pan(x, np.linspace(-.3, .3, len(x))), IR_HALL, .2)


def bell(f0, dur=2.0, amp=1.0, decay=1.0):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for ratio, a, d in [(1, 1, .9), (2.0, .35, .5), (2.76, .25, .35), (4.07, .12, .2), (5.4, .05, .12)]:
        x += a * np.sin(2 * np.pi * f0 * ratio * t) * np.exp(-t / (d * decay))
    x[:int(.002 * SR)] *= np.linspace(0, 1, int(.002 * SR))
    return x * amp


def sfx_ding(pitch=1.0):
    return reverb(bell(1568 * pitch, 1.6, 1, .7), IR_HALL, .3)


def sfx_chime():
    out = np.zeros((2, int(2.6 * SR)))
    for k, f in enumerate([1174.66, 1479.98, 1760.0, 2349.32]):
        place(out, pan(bell(f, 2.2, .8, 1.1), -.5 + k / 3), k * .06)
    return reverb(out, IR_HALL, .35)


def sfx_shimmer(dur=1.2):
    r = np.random.default_rng(71)
    out = np.zeros((2, int((dur + .2) * SR)))
    for _ in range(46):
        st = (r.random() ** 1.8) * dur
        f = 3000 + r.random() * 6000
        t = t_axis(.08)
        g = np.sin(2 * np.pi * f * t) * np.exp(-0.5 * ((t - .03) / .012) ** 2) * (1 - st / dur) * .5
        place(out, pan(g, r.uniform(-.8, .8)), st)
    return reverb(out, IR_HALL, .4)


def sfx_boing():
    out = np.zeros(int(.5 * SR))
    for dt, f0, f1, a in [(0, 620, 260, 1), (.2, 480, 280, .45)]:
        t = t_axis(.16)
        f = f1 + (f0 - f1) * np.exp(-t / .03)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .05) * a
        i = int(dt * SR)
        out[i:i + len(x)] += x
    return reverb(out, IR_ROOM, .15)


SFX = {  # nome: (gerador, pico em dBFS antes da normalização final)
    'whoosh': (lambda o, s: sfx_whoosh(o.get('dur', .7), s), -10),
    'whip': (lambda o, s: sfx_whip(seed=s), -8),
    'swish': (lambda o, s: sfx_swish(seed=s), -15),
    'pop': (lambda o, s: sfx_pop(o.get('pitch', 1)), -12),
    'impact': (lambda o, s: sfx_impact(), -5),
    'thump': (lambda o, s: sfx_thump(), -11),
    'tick': (lambda o, s: sfx_tick(o.get('pitch', 1)), -21),
    'click': (lambda o, s: sfx_click(), -19),
    'shutter': (lambda o, s: sfx_shutter(), -15),
    'riser': (lambda o, s: sfx_riser(o.get('dur', 1.2)), -14),
    'ding': (lambda o, s: sfx_ding(o.get('pitch', 1)), -20),
    'chime': (lambda o, s: sfx_chime(), -14),
    'shimmer': (lambda o, s: sfx_shimmer(), -19),
    'boing': (lambda o, s: sfx_boing(), -13),
}


def build_sfx():
    bus = np.zeros((2, N + SR * 3))
    for k, cue in enumerate(TL['CUES']):
        name, t = cue[0], cue[1]
        opts = cue[2] if len(cue) > 2 else {}
        gen, peak = SFX[name]
        sig = norm_peak(gen(opts, k), peak + opts.get('gain', 0))
        place(bus, sig, t)
    return bus[:, :N]


# ---------------------------------------------------------------- trilha lo-fi
def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def epiano(f, dur, vel=1.0, detune=0.0):
    t = t_axis(dur)
    fm = f * 2 ** (detune / 1200)
    idx = 1.6 * np.exp(-t / .22) + .2
    x = np.sin(2 * np.pi * fm * t + idx * np.sin(2 * np.pi * fm * t))
    x += .12 * np.sin(2 * np.pi * fm * 2 * t) * np.exp(-t / .4)
    env = np.exp(-t / 1.3) * (1 - np.exp(-t / .004))
    rel = int(.08 * SR)
    env[-rel:] *= np.linspace(1, 0, rel)
    return x * env * vel * (1 + .07 * np.sin(2 * np.pi * 4.6 * t))


def bass_note(f, dur, vel=1.0):
    t = t_axis(dur)
    x = np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * 2 * f * t)
    env = (1 - np.exp(-t / .008)) * (.55 + .45 * np.exp(-t / .25))
    rel = int(.06 * SR)
    env[-rel:] *= np.linspace(1, 0, rel)
    return np.tanh(x * env * 1.5) * vel


def kick():
    t = t_axis(.45)
    f = 46 + 70 * np.exp(-t / .035)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .16) + hp(np.random.default_rng(81).standard_normal(len(t)), 2000) * np.exp(-t / .002) * .2


def snare(seed):
    t = t_axis(.3)
    nz = bp(np.random.default_rng(seed).standard_normal(len(t)), 900, 5000) * np.exp(-t / .07)
    return nz * .7 + np.sin(2 * np.pi * 185 * t) * np.exp(-t / .05) * .5


def hat(seed, open_=False):
    t = t_axis(.2)
    return hp(np.random.default_rng(seed).standard_normal(len(t)), 7000, 4) * np.exp(-t / (.07 if open_ else .022))


CHORDS = [  # (notas do teclado, baixo) — IV  iii  ii  V  em ré maior
    ([55, 59, 62, 66, 69], 43),
    ([54, 57, 61, 64, 71], 42),
    ([52, 55, 59, 62, 66], 40),
    ([55, 61, 66, 71], 45),
]
FINAL = ([54, 57, 61, 64, 69, 74], 38)  # Dmaj9


def build_music():
    m = TL['MUSIC']
    beat = 60 / m['bpm']
    bar = beat * 4
    keys = np.zeros((2, N + SR * 4))
    bass = np.zeros(N + SR * 4)
    drums = np.zeros((2, N + SR * 4))
    n_bars = int(np.ceil(m['endAt'] / bar))
    for b in range(n_bars):
        t0 = b * bar
        notes, root = CHORDS[b % 4]
        hits = [(0, 1.0, notes), (1.5, .62, notes[-3:]), (3.0, .5, notes[-2:])]
        for (bt, vel, ns) in hits:
            st = t0 + bt * beat
            if st >= m['endAt']:
                continue
            nxt = [h[0] for h in hits if h[0] > bt]
            dur = ((nxt[0] if nxt else 4) - bt) * beat + .25
            for k, n in enumerate(ns):
                f = midi(n)
                place(keys, np.stack([epiano(f, dur, vel, -3), epiano(f, dur, vel, 3)]) * .22, st + k * .012)
        for (bt, d, semis) in [(0, 2.3, 0), (2.5, 1.4, 7 if b % 2 else 12)]:
            st = t0 + bt * beat
            if st < m['endAt']:
                place_mono(bass, bass_note(midi(root + semis), d * beat), st, .5)
        # bateria entra no "drop" e para no acorde final
        for i in range(8):
            st = t0 + i * beat / 2 + (beat * .08 if i % 2 else 0)  # swing nas colcheias
            if st < m['dropAt'] - .01 or st >= m['endAt']:
                continue
            place(drums, pan(hat(1000 + b * 8 + i, i == 7 and b % 2 == 1), .35) * (.28 if i % 2 else .4), st)
            if i in (0, 5):
                place(drums, kick() * .9, st)
            if i in (2, 6):
                place(drums, pan(snare(2000 + b * 8 + i), -.1) * .55, st)
    notes, root = FINAL
    for k, n in enumerate(notes):
        place(keys, np.stack([epiano(midi(n), 3.2, .9, -3), epiano(midi(n), 3.2, .9, 3)]) * .22, m['endAt'] + k * .03)
    place_mono(bass, bass_note(midi(root), 3.0, .9), m['endAt'], .5)

    keys = lp(peq(keys, 300, 1.5, kind='lowshelf'), 4800)
    bass = lp(bass, 420)
    drums = lp(reverb(drums, IR_ROOM, .18), 9000)
    mix = keys + np.stack([bass, bass]) + drums * .8
    # chiado de vinil
    crackle = np.zeros(mix.shape[1])
    pos = rng.integers(0, len(crackle), int(len(crackle) / SR * 7))
    crackle[pos] = rng.uniform(-1, 1, len(pos))
    crackle = bp(crackle, 800, 6000) * .15 + lp(rng.standard_normal(len(crackle)), 5000) * .004
    mix = mix + np.stack([crackle, crackle])
    mix = np.tanh(mix * 1.2) / 1.2
    mix[:, :int(.25 * SR)] *= np.linspace(0, 1, int(.25 * SR))
    mix = mix[:, :N]
    fade = int(1.0 * SR)
    mix[:, -fade:] *= np.linspace(1, 0, fade) ** 2
    return mix


def place_mono(bus, sig, t, gain=1.0):
    i = int(round(t * SR))
    j = min(len(bus), i + len(sig))
    if i < len(bus):
        bus[i:j] += sig[:j - i] * gain


# ---------------------------------------------------------------- narração
def process_vo(x, sr):
    x = resample_poly(x, SR, sr) if sr != SR else x
    x = hp(x, 90)
    x = peq(x, 240, 2.0, .8)                         # calor
    x = peq(x, 3200, 1.5, 1.0)                       # presença
    x = peq(x, 7000, -3.0, kind='highshelf')         # suaviza o chiado da síntese
    lvl = np.sqrt(onepole(x ** 2, .012)) + 1e-9      # compressor 3:1 acima de -22 dB
    over = np.maximum(0, 20 * np.log10(lvl) + 22)
    x = x * db(-over * (1 - 1 / 3))
    return x


def build_vo():
    bus = np.zeros((2, N + SR * 2))
    active = np.zeros(N + SR * 2)
    for v in TL['VO']:
        x, sr = sf.read(HERE / 'vo' / f"{v['id']}.wav")
        if x.ndim > 1:
            x = x.mean(axis=1)
        y = process_vo(x, sr)
        place(bus, y, v['t'])
        i = int(v['t'] * SR)
        active[i:i + len(y)] = 1
    bus = reverb(bus, IR_ROOM, .08)
    return bus[:, :N], active[:N]


# ---------------------------------------------------------------- mixagem
def lufs(x):
    return pyln.Meter(SR).integrated_loudness(x.T)


def set_lufs(x, target):
    return x * db(target - lufs(x))


def limiter(x, ceiling_db=-1.5):
    """Limitador de pico: o mínimo local do ganho necessário, suavizado por média móvel (nunca passa do teto)."""
    from scipy.ndimage import minimum_filter1d, uniform_filter1d
    c = db(ceiling_db)
    need = np.minimum(1, c / np.maximum(np.max(np.abs(x), axis=0), 1e-9))
    w = int(.006 * SR)
    g = uniform_filter1d(minimum_filter1d(need, w), w)
    return np.clip(x * g, -c, c)


def main():
    vo, active = build_vo()
    sfx = build_sfx()
    music = build_music()
    vo = set_lufs(vo, -16)
    music = set_lufs(music, -24)
    duck = 1 - .58 * np.clip(onepole(onepole(active, .06), .12), 0, 1)   # ~ -7.5 dB sob a voz
    music = music * duck
    mix = vo + sfx + music
    mix = set_lufs(mix, -14)
    mix = limiter(mix, -1.5)
    sf.write(HERE / 'mix.wav', mix.T, SR, subtype='PCM_24')
    for name, x in [('voz', vo), ('efeitos', sfx), ('trilha', music), ('mix', mix)]:
        print(f'{name:8s} {lufs(x):6.1f} LUFS   pico {20 * np.log10(np.max(np.abs(x)) + 1e-9):6.1f} dBFS')
    np.savez_compressed(HERE / '.stems.npz', vo=vo.astype(np.float32), sfx=sfx.astype(np.float32), music=music.astype(np.float32))


if __name__ == '__main__':
    main()
