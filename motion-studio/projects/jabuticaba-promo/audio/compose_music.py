"""Trilha do promo (estrutura da referência): bossa eletrônica a 120 BPM em ré maior, 33 s.

    python3 compose_music.py   -> trilha.mid, trilha.flac e ../out/trilha.mp3

Seções (1 compasso = 2 s; 1 tempo = 15 frames a 30 fps), batendo com o storyboard:
  0–4 s    intro tensa (Rhodes + pad), gancho "Seu dia vive corrido?"
  4–19 s   groove de bossa (violão, contrabaixo, bateria de vassourinha), a partir do logo
  19–20 s  break em "Tudo isso.."
  20–26 s  drop 1 no preço: bumbo marcando, palmas, shaker e melodia no vibrafone
  26–32 s  drop 2 no logo final, o ponto mais alto
  32–33 s  acorde final
Instrumentos do FluidR3_GM (MIT). Requer mido, numpy, soundfile, fluidsynth e fluid-soundfont-gm.
"""
import subprocess
from pathlib import Path

import mido
import numpy as np
import soundfile as sf

HERE = Path(__file__).parent
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'
BPM, DUR = 120, 33.0
TPB = 480
E8 = TPB // 2
E16 = TPB // 4
BAR = TPB * 4
rng = np.random.default_rng(23)

GROOVE, BREAK, DROP1, DROP2, FINAL = 8 * TPB, 38 * TPB, 40 * TPB, 52 * TPB, 64 * TPB

VOICE = {  # violão/Rhodes (voicings) e baixo
    'Em9': ([55, 59, 62, 66], 40), 'A13sus': ([55, 62, 66, 71], 45), 'A13': ([55, 61, 66, 71], 45),
    'Dmaj9': ([54, 57, 61, 64], 38), 'Bm9': ([57, 61, 62, 66], 47), 'Gmaj9': ([57, 59, 62, 66], 43),
    'F#m7': ([54, 57, 61, 64], 42),
}
# um acorde por compasso, ou [primeira metade, segunda metade]
PROG = ['Em9', 'A13sus', 'Dmaj9', 'Bm9', 'Em9', 'A13', 'Dmaj9', 'Bm9', 'Gmaj9', ['F#m7', 'A13sus'],
        'Dmaj9', 'Bm9', ['Gmaj9', 'A13'], 'Dmaj9', 'Bm9', ['Em9', 'A13'], 'Dmaj9']
MEL = [  # (compasso, tempo, duração, nota) — vibrafone nos drops
    (10, 0, 1, 78), (10, 1, .5, 81), (10, 1.5, 1.5, 85), (10, 3, 1, 81),
    (11, 0, 1.5, 86), (11, 1.5, .5, 85), (11, 2, 1, 83), (11, 3, 1, 78),
    (12, 0, 1, 83), (12, 1, .5, 81), (12, 1.5, .5, 78), (12, 2, 1, 76), (12, 3, 1, 85),
    (13, 0, .5, 81), (13, .5, .5, 86), (13, 1, 1, 90), (13, 2, 1, 88), (13, 3, 1, 85),
    (14, 0, 1.5, 86), (14, 1.5, .5, 85), (14, 2, 1, 83), (14, 3, .5, 81), (14, 3.5, .5, 78),
    (15, 0, 1, 79), (15, 1, 1, 83), (15, 2, 1, 81), (15, 3, 1, 76),
    (16, 0, 2.5, 86),
]


def h(t, a=8):
    return max(0, int(t + rng.integers(-a, a + 1)))


def v(x, a=7):
    return int(np.clip(x + rng.integers(-a, a + 1), 1, 127))


def chord(bar, half):
    c = PROG[bar]
    return c[half] if isinstance(c, list) else c


def compose():
    ev = []   # (tick, canal, nota, vel, dur)
    for bar in range(len(PROG)):
        b0 = bar * BAR
        hot = b0 >= DROP1
        # Rhodes: acorde sustentado (mais presente na intro e no break)
        for half in (0, 1):
            if half and not isinstance(PROG[bar], list):
                continue
            notes, _ = VOICE[chord(bar, half)]
            dur = 2 * TPB if isinstance(PROG[bar], list) else BAR
            t = b0 + half * 2 * TPB
            loud = 52 if (t < GROOVE or BREAK <= t < DROP1) else 36
            for n in notes:
                ev.append((t, 3, n + 12, v(loud, 4), dur - 30))
            if t < GROOVE or BREAK <= t < DROP1:   # pad quente só na intro e no break
                for n in notes[:2]:
                    ev.append((t, 4, n, v(46, 3), dur - 30))
        if b0 + BAR <= GROOVE or b0 >= FINAL:
            continue
        # violão: polegar nos tempos 1 e 3 + batida sincopada da bossa (some no break)
        pattern = [0, 3, 6] if bar % 2 == 0 else [2, 5]
        for i in range(8):
            t = b0 + i * E8
            if t < GROOVE or BREAK <= t < DROP1:
                continue
            notes, root = VOICE[chord(bar, 0 if i < 4 else 1)]
            if i in (0, 4):
                thumb = root + 12 if root < 45 else root
                ev.append((h(t), 0, thumb if i == 0 else thumb + 7 - (12 if thumb + 7 > 59 else 0), v(60), E8 * 3))
            if i in pattern:
                for k, n in enumerate(notes):
                    ev.append((h(t + k * 8, 5), 0, n, v(70 if hot else 62), E8 * 2 - 30))
        # contrabaixo: bossa no groove; nos drops, mais andado (oitavas)
        for half in (0, 1):
            _, root = VOICE[chord(bar, half)]
            h0 = b0 + half * 2 * TPB
            if h0 < GROOVE or BREAK <= h0 < DROP1:
                continue
            line = [(0, root, 3), (3, root + 7, 1)] if not hot else [(0, root, 2), (2, root + 12, 1), (3, root + 7, 1)]
            for pos, n, d in line:
                ev.append((h(h0 + pos * E8, 5), 1, n, v(92 if pos == 0 else 76), E8 * d - 20))
        # bateria
        for i in range(16):
            t = b0 + i * E16
            if t < GROOVE or BREAK <= t < DROP1 or t >= FINAL:
                continue
            e = i // 2 if i % 2 == 0 else None
            if not hot:   # vassourinha: chimbal em colcheias, aro na clave, bumbo leve
                if e is not None:
                    ev.append((h(t, 5), 9, 42, v(42 if e % 2 == 0 else 32), E8))
                    if e in (0, 3, 4, 7):
                        ev.append((h(t, 4), 9, 36, v(56 if e in (0, 4) else 44), E8))
                    if e in ([0, 3, 6] if bar % 2 == 0 else [2, 5]):
                        ev.append((h(t, 4), 9, 37, v(70), E8))
                    if e in (2, 6):
                        ev.append((h(t, 4), 9, 38, v(32), E8 * 2))
            else:         # drops: bumbo marcando os tempos, palmas no 2 e 4, shaker em semicolcheias
                ev.append((h(t, 3), 9, 82, v(44 if i % 2 else 58), E16))
                if i % 4 == 0:
                    ev.append((t, 9, 36, v(96, 4), E8))
                if i in (4, 12):
                    ev.append((h(t, 3), 9, 39, v(78), E8))
                if i % 4 == 2:
                    ev.append((h(t, 3), 9, 46, v(46), E8))
                if (bar % 2 == 0 and i in (0, 6, 12)) or (bar % 2 == 1 and i in (4, 10)):
                    ev.append((h(t, 3), 9, 37, v(64), E8))
    # pratos nos drops e acorde final
    for t in (DROP1, DROP2):
        ev.append((t, 9, 49, 92, BAR))
    notes, root = VOICE['Dmaj9']
    for k, n in enumerate(notes + [69]):
        ev.append((FINAL + k * 25, 0, n, v(74, 3), TPB * 4))
        ev.append((FINAL, 3, n + 12, v(44, 3), TPB * 4))
    ev.append((FINAL, 1, root, 96, TPB * 3))
    ev.append((FINAL, 9, 49, 80, BAR))
    for bar, beat, d, n in MEL:
        ev.append((h(bar * BAR + int(beat * TPB), 6), 2, n, v(84 if beat in (0, 2) else 72), int(d * TPB) - 20))
    return ev


def write_midi(ev, path):
    mid = mido.MidiFile(ticks_per_beat=TPB)
    tr = mido.MidiTrack()
    mid.tracks.append(tr)
    msgs = [(0, mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM)))]
    for ch, prog in [(0, 24), (1, 32), (2, 11), (3, 4), (4, 89)]:
        msgs.append((0, mido.Message('program_change', channel=ch, program=prog)))
    msgs.append((0, mido.Message('program_change', channel=9, program=40)))        # kit "Brush" no groove
    msgs.append((DROP1 - 1, mido.Message('program_change', channel=9, program=0)))  # kit padrão nos drops
    for ch, vol, pan, rev in [(0, 100, 50, 40), (1, 112, 64, 20), (2, 92, 80, 60), (3, 78, 46, 60), (4, 70, 64, 80), (9, 96, 64, 30)]:
        msgs += [(0, mido.Message('control_change', channel=ch, control=7, value=vol)),
                 (0, mido.Message('control_change', channel=ch, control=10, value=pan)),
                 (0, mido.Message('control_change', channel=ch, control=91, value=rev))]
    for t, ch, n, vel, d in ev:
        msgs.append((t, mido.Message('note_on', channel=ch, note=n, velocity=vel)))
        msgs.append((t + d, mido.Message('note_off', channel=ch, note=n, velocity=0)))
    msgs.sort(key=lambda m: (m[0], m[1].type == 'note_on'))
    last = 0
    for t, m in msgs:
        tr.append(m.copy(time=t - last))
        last = t
    mid.save(path)


def main():
    write_midi(compose(), HERE / 'trilha.mid')
    raw = HERE / '.raw.wav'
    subprocess.run(['fluidsynth', '-ni', '-g', '0.55', '-r', '48000', '-F', str(raw), SF2, str(HERE / 'trilha.mid')],
                   check=True, capture_output=True)
    x, sr = sf.read(raw)
    raw.unlink()
    n = int(DUR * sr)
    x = np.pad(x, ((0, max(0, n - len(x))), (0, 0)))[:n]
    fade = int(1.0 * sr)
    x[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
    x = x / np.max(np.abs(x)) * 10 ** (-1 / 20)
    sf.write(HERE / 'trilha.flac', x, sr)
    mp3 = HERE.parent / 'out' / 'trilha.mp3'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(HERE / 'trilha.flac'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
                    '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '256k', str(mp3)], check=True)
    print('ok ->', mp3.name, f'{len(x) / sr:.1f}s')


if __name__ == '__main__':
    main()
