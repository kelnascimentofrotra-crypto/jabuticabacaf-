"""Trilha do Zorro Gamer: phonk/trap a 150 BPM em mi menor, 33,6 s.

    python3 compose_music.py   -> trilha.mid, trilha.flac e ../out/trilha.mp3

1 tempo = 12 frames, 1 compasso = 48 frames (1,6 s). Seções batendo com o storyboard:
  c0–1    (0–96)      intro: pad escuro + melodia de cowbell filtrada, chimbal contando
  c2–13   (96–672)    drop: 808 distorcido, bateria trap (rolos de chimbal), cowbell
  c14–15  (672–768)   montagem: pancadas a cada 2 tempos (GLITCH / FOGO / IMPACTO / ESTILO)
  c16–17  (768–864)   respiro: pad + cowbell, subida até o logo
  c18–20  (864–1008)  drop final no logo e acorde final
O 808 é sintetizado aqui (seno com queda de afinação + saturação); o resto é FluidR3_GM (MIT).
"""
import subprocess
from pathlib import Path

import mido
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

HERE = Path(__file__).parent
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'
BPM, DUR, SR = 150, 33.6, 48000
TPB = 480
E16, BAR = TPB // 4, TPB * 4
rng = np.random.default_rng(5)
SEC = lambda b: 'intro' if b < 2 else 'drop' if b < 14 else 'hits' if b < 16 else 'break' if b < 18 else 'final' if b < 20 else 'end'
CH = ['Em', 'C', 'Am', 'B']
PADV = {'Em': [52, 55, 59, 64], 'C': [52, 55, 60, 64], 'Am': [52, 57, 60, 64], 'B': [51, 54, 59, 63]}
ROOT = {'Em': 40, 'C': 36, 'Am': 33, 'B': 35}                  # 808 (E2, C2, A1, B1)
COW = [[76, None, 79, None, 83, None, 81, 79, None, 78, None, 76, None, 74, None, 76],
       [76, None, 79, None, 83, None, 84, 83, None, 81, None, 79, None, 78, 79, None]]
PAD, COWB, HIT, DR = 0, 1, 2, 9


def v(x, a=6):
    return int(np.clip(x + rng.integers(-a, a + 1), 1, 127))


def compose():
    ev, bass = [], []                                         # bass: (segundo, nota midi, duração s, glide)
    nb = int(round(DUR / 1.6))
    for b in range(nb):
        sec, ch = SEC(b), CH[b % 4]
        b0 = b * BAR
        if sec != 'end':
            for n in PADV[ch]:
                ev.append((b0, PAD, n, v(62 if sec in ('intro', 'break') else 48, 3), BAR - 10))
        else:
            for n in PADV['Em'] + [71]:
                ev.append((b0, PAD, n, 70, BAR * 2))
        # cowbell (melodia phonk)
        if sec in ('intro', 'drop', 'break', 'final'):
            pat = COW[b % 2]
            for i, n in enumerate(pat):
                if n is None:
                    continue
                vel = {'intro': 46, 'break': 58, 'drop': 74, 'final': 80}[sec] + (8 if i % 4 == 0 else 0)
                ev.append((b0 + i * E16, COWB, n, v(vel, 4), E16 * 2))
        # 808: tempo 1 longo, contratempo, tempo 3½ (com glide ocasional)
        if sec in ('drop', 'final'):
            t = b0 / TPB * 60 / BPM
            r = ROOT[ch]
            for pos, dur, gl in [(0, .55, 0), (1.5, .3, 0), (2.5, .55, 0), (3.5, .35, 12 if b % 4 == 3 else 0)]:
                bass.append((t + pos * 60 / BPM, r, dur, gl))
        elif sec == 'hits':
            for k in range(4):
                bass.append((b0 / TPB * 60 / BPM + k * 2 * 60 / BPM, ROOT['Em'], .7, 0))
        elif sec == 'end':
            bass.append((b0 / TPB * 60 / BPM, ROOT['Em'], 1.4, 0))
        # bateria (kit TR-808)
        for i in range(16):
            t = b0 + i * E16
            if sec == 'intro':
                if b == 1 and i >= 12:
                    continue                                    # 1 tempo de silêncio antes do drop
                ev.append((t, DR, 42, v(28 + b * 18 + (12 if i % 4 == 0 else 0)), E16))
            elif sec in ('drop', 'final'):
                if i in (0, 7, 10) or (b % 2 and i == 14):
                    ev.append((t, DR, 36, v(112, 4), E16 * 2))
                if i in (4, 12):
                    ev.append((t, DR, 39, v(104), E16 * 2)); ev.append((t, DR, 38, v(70), E16))
                roll = b % 4 == 3 and i >= 12                      # rolo de chimbal em fusas no fim da frase
                if roll:
                    for k in range(2):
                        ev.append((t + k * E16 // 2, DR, 42, v(50 + (i - 12) * 10), E16 // 2))
                elif i % 2 == 0 or (b % 2 == 0 and i in (5, 13)):
                    ev.append((t, DR, 42, v(66 if i % 4 == 0 else 50), E16))
                if i == 6:
                    ev.append((t, DR, 46, v(60), E16 * 2))
            elif sec == 'hits':
                if i % 8 == 0:
                    ev.append((t, DR, 36, 124, E16 * 2)); ev.append((t, DR, 49, 100, BAR // 2)); ev.append((t, HIT, 64, 110, E16 * 6))
                    ev.append((t, HIT, 52, 110, E16 * 6))
            elif sec == 'break':
                if b == 17 and i >= 8:
                    ev.append((t, DR, 38, v(40 + (i - 8) * 10), E16))   # caixa subindo até o logo
                elif i % 4 == 0:
                    ev.append((t, DR, 42, v(40), E16))
            elif sec == 'end' and i == 0:
                ev.append((t, DR, 36, 120, E16 * 2)); ev.append((t, DR, 49, 104, BAR)); ev.append((t, HIT, 64, 110, TPB * 3))
    for b in (2, 6, 10, 18):
        ev.append((b * BAR, DR, 49, 104, BAR)); ev.append((b * BAR, HIT, 64, 104, TPB * 2)); ev.append((b * BAR, HIT, 52, 104, TPB * 2))
    return ev, bass


def write_midi(ev, path):
    mid = mido.MidiFile(ticks_per_beat=TPB)
    tr = mido.MidiTrack(); mid.tracks.append(tr)
    msgs = [(0, mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM)))]
    for ch, prog in [(PAD, 95), (COWB, 113), (HIT, 55), (DR, 25)]:
        msgs.append((0, mido.Message('program_change', channel=ch, program=prog)))
    for ch, vol, pan, rev in [(PAD, 80, 64, 90), (COWB, 96, 70, 55), (HIT, 92, 64, 70), (DR, 112, 64, 20)]:
        msgs += [(0, mido.Message('control_change', channel=ch, control=7, value=vol)), (0, mido.Message('control_change', channel=ch, control=10, value=pan)),
                 (0, mido.Message('control_change', channel=ch, control=91, value=rev))]
    for t, ch, n, vel, d in ev:
        msgs.append((t, mido.Message('note_on', channel=ch, note=n, velocity=vel)))
        msgs.append((t + d, mido.Message('note_off', channel=ch, note=n, velocity=0)))
    msgs.sort(key=lambda m: (m[0], m[1].type == 'note_on'))
    last = 0
    for t, m in msgs:
        tr.append(m.copy(time=t - last)); last = t
    mid.save(path)


def b808(note, dur, glide=0):
    t = np.arange(int((dur + .25) * SR)) / SR
    f0 = 440 * 2 ** ((note - 69) / 12)
    f = f0 * (1 + 1.2 * np.exp(-t / .03)) * 2 ** (glide / 12 * np.clip((t - dur * .5) / (dur * .5), 0, 1))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR)
    env = np.minimum(1, t / .004) * np.exp(-t / (dur * .9))
    x = np.tanh(3.2 * x * env) * .9
    return sosfilt(butter(2, 900, 'low', fs=SR, output='sos'), x)


def main():
    ev, bass = compose()
    write_midi(ev, HERE / 'trilha.mid')
    raw = HERE / '.raw.wav'
    subprocess.run(['fluidsynth', '-ni', '-g', '0.5', '-r', str(SR), '-F', str(raw), SF2, str(HERE / 'trilha.mid')], check=True, capture_output=True)
    x, sr = sf.read(raw); raw.unlink()
    n = int(DUR * SR)
    x = np.pad(x, ((0, max(0, n - len(x))), (0, 0)))[:n]
    bl = np.zeros(n)
    for t, note, dur, gl in bass:
        y = b808(note, dur, gl); i = int(t * SR); j = min(n, i + len(y))
        if i < n:
            bl[i:j] += y[:j - i]
    # o 808 abaixa um pouco o resto (sidechain leve)
    env = np.convolve(np.abs(bl), np.ones(960) / 960, 'same')
    duck = 1 - .3 * np.clip(env / (env.max() + 1e-9) * 2, 0, 1)
    x = x * duck[:, None] / (np.max(np.abs(x)) + 1e-9) * .7 + .55 * bl[:, None]
    fade = int(1.2 * SR)
    x[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
    x = x / np.max(np.abs(x)) * 10 ** (-1 / 20)
    sf.write(HERE / 'trilha.flac', x, SR)
    mp3 = HERE.parent / 'out' / 'trilha.mp3'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(HERE / 'trilha.flac'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '256k', str(mp3)], check=True)
    print('ok ->', mp3.name, f'{len(x) / SR:.1f}s')


if __name__ == '__main__':
    main()
