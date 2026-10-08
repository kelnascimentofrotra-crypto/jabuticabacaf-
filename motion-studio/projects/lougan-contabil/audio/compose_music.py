"""Trilha da Lougan Contabilidade: corporativa inspiradora, 120 BPM, 60 s.

    python3 compose_music.py   -> trilha.mid, trilha.flac e ../out/trilha.mp3

Instrumentos do MuseScore General (MIT, pacote musescore-general-soundfont), renderizados em
duas bases (música e bateria) e mixados com o pedalboard (compressor, reverb, sidechain leve
do bumbo e limitador). 1 compasso = 2 s = 60 frames. Seções batendo com o storyboard:
  c0–4    (0–300)     problema: lá menor, piano grave, cordas em trêmolo, relógio, tímpanos (dívida, juros, mês no vermelho)
  c5      (300–360)   "É aí que entra a Lougan": rufo de prato → acorde de Dó maior no logo (frame 314)
  c6–8    (360–540)   análise e negociação: piano, pizzicato, chocalho, caixa subindo no fim
  c9–12   (540–780)   drop no gráfico despencando: C–G–Am–F com bateria, glockenspiel
  c13–18  (780–1140)  todo tipo de dívida / nome limpo / parcela em dia: mesma progressão, melodia uma oitava acima
  c19–21  (1140–1320) serviços: groove
  c22–23  (1320–1440) "o próprio Lougan": leve, sem bumbo
  c24–26  (1440–1620) conversa e CTA: volta crescendo, virada até o logo
  c27–29  (1620–1800) assinatura: acorde aberto, glockenspiel e fade
"""
import subprocess
from pathlib import Path

import mido
import numpy as np
import soundfile as sf
from pedalboard import Compressor, HighpassFilter, HighShelfFilter, Limiter, LowShelfFilter, Pedalboard, Reverb

HERE = Path(__file__).parent
SF = '/usr/share/sounds/sf3/MuseScore_General_Full.sf3'
BPM, DUR, SR = 120, 60.0, 48000
TPB = 480
E8, E16, BAR = TPB // 2, TPB // 4, TPB * 4
rng = np.random.default_rng(3)
F2T = lambda fr: int(round(fr / 15 * TPB))                    # frame (30 fps) -> tick

V = {'Am': ([57, 60, 64], 33), 'F': ([57, 60, 65], 29), 'E': ([56, 59, 64], 28), 'C': ([60, 64, 67, 72], 36), 'G': ([59, 62, 67, 71], 43),
     'Am2': ([57, 60, 64, 69], 45), 'F2': ([57, 60, 65, 69], 41), 'Gs': ([60, 62, 67, 72], 43), 'Cmaj9': ([59, 62, 64, 67, 71], 36)}
PROG = ['C', 'G', 'Am2', 'F2']
SEC = ['intro'] * 5 + ['rise'] + ['pre'] * 3 + ['groove'] * 4 + ['drop'] * 6 + ['groove'] * 3 + ['light', 'light'] + ['cta', 'cta', 'cta2'] + ['outro'] * 3
MEL = {'C': [(0, .5, 76), (.5, .5, 79), (1, 1, 84), (2, .5, 83), (2.5, .5, 79), (3, 1, 76)],
       'G': [(0, .5, 74), (.5, .5, 79), (1, 1, 83), (2, .5, 81), (2.5, .5, 79), (3, 1, 74)],
       'Am2': [(0, .5, 72), (.5, .5, 76), (1, 1, 81), (2, .5, 79), (2.5, .5, 76), (3, 1, 72)],
       'F2': [(0, .5, 72), (.5, .5, 77), (1, 1, 81), (2, 1, 79), (3, 1, 77)]}
PNO, STR, PIZ, BAS, GLK, TREM, TIMP, HIT, DR = 0, 1, 2, 3, 4, 5, 6, 7, 9


def v(x, a=6):
    return int(np.clip(x + rng.integers(-a, a + 1), 1, 127))


def hum(t, a=5):
    return max(0, int(t + rng.integers(-a, a + 1)))


def compose():
    mus, drm = [], []
    for b, sec in enumerate(SEC):
        b0 = b * BAR
        if sec == 'intro':
            ch = ['Am', 'F', 'E', 'Am', 'E'][b]
            notes, root = V[ch]
            for i in range(8):                                                   # piano grave em colcheias
                mus.append((hum(b0 + i * E8), PNO, (root + 12) if i % 2 == 0 else notes[i // 2 % 3] - 12, v(46 + b * 6), E8))
            for n in notes:
                mus.append((b0, TREM, n, v(40 + b * 12, 3), BAR - 20))           # cordas em trêmolo crescendo
            mus.append((b0, TIMP, root + 12, 80 + b * 6, TPB))
            for i in range(8):
                if not (b == 4 and i >= 6):
                    drm.append((b0 + i * E8, DR, 76 if i % 2 == 0 else 77, v(52 + b * 6), E16))   # relógio (wood block)
            continue
        if sec == 'rise':
            for n in V['E'][0]:
                mus.append((b0, TREM, n, 70, F2T(314) - b0 - 10))
            for k in range(8):                                                   # rufo de prato até o logo
                t = b0 + k * (F2T(314) - b0) // 8
                drm.append((t, DR, 49 if k % 2 else 51, v(30 + k * 9), E16))
            t = F2T(314)                                                          # acorde no logo
            for n in V['C'][0] + [48]:
                mus.append((t, PNO, n, 96, TPB * 2)); mus.append((t, STR, n, 84, BAR + TPB))
            mus.append((t, GLK, 84, 90, TPB * 2)); mus.append((t, TIMP, 48, 110, TPB)); drm.append((t, DR, 49, 104, BAR))
            continue
        if sec == 'pre':
            notes, root = V[['C', 'G', 'Am2'][(b - 6) % 3]]
            for i in range(8):
                mus.append((hum(b0 + i * E8), PNO, notes[[0, 2, 1, 3][i % 4]], v(62), E8 + 40))
            for n in notes:
                mus.append((b0, STR, n, v(46, 3), BAR - 20))
            for i in range(16):
                drm.append((hum(b0 + i * E16, 3), DR, 70, v(36 if i % 2 else 48), E16))
            for i in (1, 3, 5, 7):
                mus.append((b0 + i * E8, PIZ, notes[i % 3] + 12, v(60), E8))
            mus.append((b0, BAS, root, 80, BAR - 40))
            for i in range(16):
                if i in (0, 8):
                    drm.append((b0 + i * E16, DR, 36, v(84), E16))
                if b == 8 and i >= 8:
                    drm.append((b0 + i * E16, DR, 38, v(40 + (i - 8) * 9), E16))   # caixa subindo até o drop
            continue
        if sec == 'break':
            for k, ch in enumerate(['F2', 'Gs']):
                for n in V[ch][0]:
                    mus.append((b0 + k * 2 * TPB, PNO, n, 72, 2 * TPB - 20)); mus.append((b0 + k * 2 * TPB, STR, n, 50, 2 * TPB))
            continue
        if sec == 'outro':
            if b == 27:
                for n in V['Cmaj9'][0] + [48, 84]:
                    mus.append((b0, PNO, n, 84, BAR * 2)); mus.append((b0, STR, n, 70, BAR * 2))
                mus.append((b0, BAS, 36, 90, BAR * 2)); mus.append((b0, GLK, 88, 84, TPB * 3)); mus.append((b0, TIMP, 48, 96, TPB))
                drm.append((b0, DR, 49, 96, BAR)); drm.append((b0, DR, 36, 104, E8))
            continue
        # groove / light / cta / drop
        ch = PROG[b % 4]
        notes, root = V[ch]
        hot = sec in ('groove', 'drop', 'cta2')
        for i in range(8):                                                       # piano em colcheias (arpejo dos acordes)
            mus.append((hum(b0 + i * E8), PNO, notes[[0, 2, 1, 3, 0, 2, 1, 3][i] % len(notes)] + (12 if sec == 'drop' and i % 2 else 0), v(70 if hot else 58), E8 + 30))
        for n in notes:
            mus.append((b0, STR, n, v(60 if hot else 48, 3), BAR - 20))
        for i in (1, 3, 5, 7):
            mus.append((b0 + i * E8, PIZ, notes[(i // 2) % len(notes)] + 12, v(66 if hot else 54), E8))
        if sec != 'light':
            for i in range(8):
                mus.append((hum(b0 + i * E8, 3), BAS, root + (12 if i in (3, 7) else 0), v(92 if i % 2 == 0 else 74), E8 - 30))
        else:
            mus.append((b0, BAS, root, 76, BAR - 40))
        if sec in ('groove', 'drop', 'light') and 9 <= b <= 23:
            for beat, d, n in MEL[ch]:
                mus.append((hum(b0 + int(beat * TPB), 3), GLK, n + (12 if sec == 'drop' else 0), v(86 if beat in (0, 1, 2) else 74), int(d * TPB) - 20))
        for i in range(16):
            t = b0 + i * E16
            if sec == 'light':
                if i in (4, 12):
                    drm.append((hum(t, 3), DR, 39, v(70), E8))
                if i % 2 == 0:
                    drm.append((hum(t, 3), DR, 70, v(44), E16))
                continue
            if sec == 'cta' and i % 4 == 0:
                drm.append((t, DR, 36, v(96), E8)); continue
            if sec == 'cta':
                if i % 2 == 0:
                    drm.append((hum(t, 3), DR, 70, v(42), E16))
                continue
            if i % 4 == 0:
                drm.append((t, DR, 36, v(108, 4), E8))
            if i in (4, 12):
                drm.append((hum(t, 3), DR, 39, v(96), E8)); drm.append((hum(t, 3), DR, 38, v(60), E8))
            drm.append((hum(t, 3), DR, 70, v(56 if i % 2 == 0 else 40), E16))
            if i % 4 == 2:
                drm.append((t, DR, 46, v(54), E8))
            if sec == 'cta2' and i >= 12:
                drm.append((t, DR, 38, v(60 + (i - 12) * 14), E16))
        if b % 4 == 1 and hot:
            drm.append((b0, DR, 49, 92, BAR))
    for fr in (84, 260):                                                         # pancadas orquestrais (só aumenta? / não fecha.)
        t = F2T(fr)
        mus.append((t, HIT, 57, 110, TPB)); mus.append((t, HIT, 45, 110, TPB)); mus.append((t, TIMP, 45, 112, TPB))
    for fr in (540, 795, 1155, 1620):                                            # drops e entradas de seção
        t = F2T(fr)
        drm.append((t, DR, 49, 112, BAR)); drm.append((t, DR, 57, 100, BAR)); mus.append((t, TIMP, 48, 116, TPB))
    return mus, drm


def write_midi(ev, path, programs):
    mid = mido.MidiFile(ticks_per_beat=TPB)
    tr = mido.MidiTrack(); mid.tracks.append(tr)
    msgs = [(0, mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM)))]
    for ch, prog, vol, pan in programs:
        msgs += [(0, mido.Message('program_change', channel=ch, program=prog)), (0, mido.Message('control_change', channel=ch, control=7, value=vol)),
                 (0, mido.Message('control_change', channel=ch, control=10, value=pan))]
    for t, ch, n, vel, d in ev:
        msgs.append((t, mido.Message('note_on', channel=ch, note=n, velocity=vel)))
        msgs.append((t + d, mido.Message('note_off', channel=ch, note=n, velocity=0)))
    msgs.sort(key=lambda m: (m[0], m[1].type == 'note_on'))
    last = 0
    for t, m in msgs:
        tr.append(m.copy(time=t - last)); last = t
    mid.save(path)


def synth(mid):
    raw = mid.with_suffix('.wav')
    subprocess.run(['fluidsynth', '-ni', '-g', '0.6', '-R', '0', '-C', '0', '-r', str(SR), '-F', str(raw), SF, str(mid)], check=True, capture_output=True)
    x, _ = sf.read(raw); raw.unlink(); mid.unlink()
    n = int(DUR * SR)
    return np.pad(x, ((0, max(0, n - len(x))), (0, 0)))[:n].T.astype(np.float32)


def main():
    mus, drm = compose()
    progs = [(PNO, 0, 104, 58), (STR, 48, 92, 70), (PIZ, 45, 90, 40), (BAS, 33, 108, 64), (GLK, 9, 92, 86), (TREM, 44, 96, 64), (TIMP, 47, 110, 64), (HIT, 55, 100, 64)]
    write_midi(mus + drm, HERE / 'trilha.mid', progs + [(DR, 0, 110, 64)])
    m_mid, d_mid = HERE / '.m.mid', HERE / '.d.mid'
    write_midi(mus, m_mid, progs); write_midi(drm, d_mid, [(DR, 0, 110, 64)])
    m, d = synth(m_mid), synth(d_mid)
    m = Pedalboard([HighpassFilter(40), LowShelfFilter(250, -1.5), HighShelfFilter(7000, 2.0), Compressor(-20, 2.5, 15, 150), Reverb(.45, .3, .14, .9, 1.0)])(m, SR)
    d = Pedalboard([HighpassFilter(30), Compressor(-16, 4, 4, 90), HighShelfFilter(9000, 1.5), Reverb(.2, .4, .05, .95, .8)])(d, SR)
    # sidechain leve: a música respira com o bumbo
    env = np.convolve(np.abs(d).mean(0), np.ones(1200) / 1200, 'same')
    duck = 1 - .22 * np.clip(env / (np.percentile(env, 99) + 1e-9), 0, 1)
    x = m * duck * 1.0 + d * .8
    x = Pedalboard([Compressor(-14, 1.8, 20, 200), Limiter(-1.2, 120)])(x.astype(np.float32), SR)
    fade = int(2.0 * SR)
    x[:, -fade:] *= np.linspace(1, 0, fade) ** 2
    x = x / np.max(np.abs(x)) * 10 ** (-1 / 20)
    sf.write(HERE / 'trilha.flac', x.T, SR)
    mp3 = HERE.parent / 'out' / 'trilha.mp3'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(HERE / 'trilha.flac'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '256k', str(mp3)], check=True)
    print('ok ->', mp3.name, f'{x.shape[1] / SR:.1f}s')


if __name__ == '__main__':
    main()
