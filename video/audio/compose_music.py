"""Compõe a trilha (bossa nova, 100 BPM, ré maior) e renderiza com instrumentos sampleados.

    python3 compose_music.py   -> trilha.mid + trilha.flac

Instrumentos do banco FluidR3_GM (licença MIT): violão de nylon, contrabaixo acústico,
vibrafone, Rhodes e bateria de vassourinha. Requer: mido, soundfile, numpy e
`apt install fluidsynth fluid-soundfont-gm`.
A grade de tempo bate com o motion.html: 1 compasso = 2,4 s, drop em 1,2 s, acorde final em 33,6 s.
"""
import json
import subprocess
from pathlib import Path

import mido
import numpy as np
import soundfile as sf

HERE = Path(__file__).parent
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'
TL = json.loads((HERE / 'timeline.json').read_text())
BPM = TL['MUSIC']['bpm']
TPB = 480                      # ticks por tempo
E8 = TPB // 2                  # colcheia
BAR = TPB * 4
DROP = round(TL['MUSIC']['dropAt'] / (60 / BPM) * TPB)
END = round(TL['MUSIC']['endAt'] / (60 / BPM) * TPB)
BREAK = (round(13.2 / (60 / BPM) * TPB), round(14.4 / (60 / BPM) * TPB))   # pausa antes do cardápio
rng = np.random.default_rng(10)

# acorde do violão (voicing), baixo (fundamental) e quinta, para cada compasso
CH = {
    'Gmaj7': ([55, 59, 62, 66], 43), 'F#m7': ([54, 57, 61, 64], 42), 'Em7': ([52, 55, 59, 62], 40),
    'Em9': ([55, 59, 62, 66], 40), 'A7': ([55, 61, 64, 69], 45), 'A13': ([55, 61, 66, 71], 45),
    'Dmaj7': ([57, 61, 62, 66], 38), 'Bm7': ([57, 59, 62, 66], 47), 'Dmaj9': ([54, 57, 61, 64, 69], 38),
}
PROG = ['Gmaj7', 'F#m7', 'Em7', 'A7', 'Dmaj7', 'Bm7', 'Em9', 'A13',
        'Gmaj7', 'F#m7', 'Em7', 'A7', 'Dmaj7', ['Em7', 'A7']]
# melodia no vibrafone: (compasso, tempo, duração em tempos, nota MIDI)
MEL = [
    (0, 3, .5, 76), (0, 3.5, .5, 78),
    (1, 0, 1.5, 81), (1, 1.5, .5, 76), (1, 2, 2, 78),
    (2, 0, 1, 79), (2, 1, .5, 78), (2, 1.5, .5, 76), (2, 2, 1, 74), (2, 3, 1, 76),
    (3, 0, 1.5, 73), (3, 1.5, .5, 76), (3, 2, 1.5, 79), (3, 3.5, .5, 78),
    (4, 0, 2.5, 78), (4, 2.5, .5, 76), (4, 3, 1, 78),
    (5, 0, 1.5, 86), (5, 1.5, .5, 85), (5, 2, 1, 83), (5, 3, 1, 81),
    (6, 0, 1.5, 78), (6, 1.5, .5, 79), (6, 2, 2, 83),
    (7, 0, 1, 81), (7, 1, 1, 78), (7, 2, 1.5, 76), (7, 3.5, .5, 73),
    (8, 0, 1.5, 83), (8, 1.5, .5, 81), (8, 2, 2, 78),
    (9, 0, 1.5, 81), (9, 1.5, .5, 76), (9, 2, 2, 78),
    (10, 0, 1, 79), (10, 1, .5, 78), (10, 1.5, .5, 76), (10, 2, 1, 74), (10, 3, 1, 71),
    (11, 0, 1.5, 73), (11, 1.5, .5, 76), (11, 2, 2, 81),
    (12, 0, 2, 78), (12, 2, 1, 81), (12, 3, 1, 85),
    (13, 0, 1.5, 83), (13, 1.5, .5, 81), (13, 2, 1, 79), (13, 3, 1, 76),
    (14, 0, 6, 78),
]


def human(t, amt=10):
    return max(0, int(t + rng.integers(-amt, amt + 1)))


def vel(v, amt=8):
    return int(np.clip(v + rng.integers(-amt, amt + 1), 1, 127))


def in_break(t):
    return BREAK[0] <= t < BREAK[1]


def chord_at(bar, half):
    c = PROG[bar]
    return c[half] if isinstance(c, list) else c


def compose():
    ev = []  # (tick, canal, nota, velocidade, duração)
    for bar in range(len(PROG)):
        b0 = bar * BAR
        for half in (0, 1):
            notes, root = CH[chord_at(bar, half)]
            h0 = b0 + half * 2 * TPB
            # violão: polegar nos tempos 1 e 3 (fundamental/quinta) + acordes sincopados da bossa
            thumb = root + 12 if root < 45 else root
            ev.append((human(h0), 0, thumb if half == 0 else thumb + 7 - (12 if thumb + 7 > 59 else 0), vel(58), E8 * 3))
        pattern = [0, 3, 6] if bar % 2 == 0 else [2, 5]
        for i in pattern:
            t = b0 + i * E8
            notes, _ = CH[chord_at(bar, 0 if i < 4 else 1)]
            for k, n in enumerate(notes):
                ev.append((human(t + k * 9, 6), 0, n, vel(66 if i in (0, 6) else 60), E8 * 2 - 30))
        # Rhodes discreto sustentando a harmonia
        for half in (0, 1):
            notes, _ = CH[chord_at(bar, half)]
            if half == 1 and not isinstance(PROG[bar], list):
                continue
            dur = BAR if not isinstance(PROG[bar], list) else 2 * TPB
            for n in notes:
                ev.append((b0 + half * 2 * TPB, 3, n + 12, vel(34, 4), dur - 20))
        # contrabaixo e bateria entram no drop; param na pausa antes do cardápio
        for half in (0, 1):
            _, root = CH[chord_at(bar, half)]
            h0 = b0 + half * 2 * TPB
            for (pos, n, d) in [(0, root, 3), (3, root + 7, 1)]:
                t = h0 + pos * E8
                if DROP <= t < END and not in_break(t):
                    ev.append((human(t, 6), 1, n, vel(88 if pos == 0 else 70), E8 * d - 20))
        for i in range(8):
            t = b0 + i * E8
            if t < DROP or t >= END or in_break(t):
                continue
            ev.append((human(t, 5), 9, 42, vel(46 if i % 2 == 0 else 34), E8))           # chimbal
            if i in (0, 3, 4, 7):
                ev.append((human(t, 4), 9, 36, vel(62 if i in (0, 4) else 48), E8))        # bumbo
            if i in ([0, 3, 6] if bar % 2 == 0 else [2, 5]):
                ev.append((human(t, 4), 9, 37, vel(72), E8))                            # aro (clave da bossa)
            if i in (2, 6):
                ev.append((human(t, 4), 9, 38, vel(34), E8 * 2))                         # vassourinha
    # acorde final
    notes, root = CH['Dmaj9']
    for k, n in enumerate(notes):
        ev.append((END + k * 25, 0, n, vel(70, 3), TPB * 6))
        ev.append((END, 3, n + 12, vel(40, 3), TPB * 6))
    ev.append((END, 1, root, 90, TPB * 5))
    ev.append((END, 9, 51, 50, TPB * 2))   # prato de condução, bem leve
    # melodia
    for bar, beat, d, n in MEL:
        t = bar * BAR + int(beat * TPB)
        ev.append((human(t, 8), 2, n, vel(76 if beat in (0, 2) else 66), int(d * TPB) - 20))
    return ev


def write_midi(ev, path):
    mid = mido.MidiFile(ticks_per_beat=TPB)
    track = mido.MidiTrack()
    mid.tracks.append(track)
    msgs = [(0, mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM)))]
    for ch, prog in [(0, 24), (1, 32), (2, 11), (3, 4)]:
        msgs.append((0, mido.Message('program_change', channel=ch, program=prog)))
    msgs.append((0, mido.Message('program_change', channel=9, program=40)))            # kit "Brush"
    for ch, vol, pan in [(0, 100, 52), (1, 110, 64), (2, 84, 78), (3, 70, 50), (9, 90, 64)]:
        msgs.append((0, mido.Message('control_change', channel=ch, control=7, value=vol)))
        msgs.append((0, mido.Message('control_change', channel=ch, control=10, value=pan)))
        msgs.append((0, mido.Message('control_change', channel=ch, control=91, value=50)))  # reverb
    for t, ch, n, v, d in ev:
        msgs.append((t, mido.Message('note_on', channel=ch, note=n, velocity=v)))
        msgs.append((t + d, mido.Message('note_off', channel=ch, note=n, velocity=0)))
    msgs.sort(key=lambda m: (m[0], m[1].type == 'note_on'))
    last = 0
    for t, m in msgs:
        track.append(m.copy(time=t - last))
        last = t
    mid.save(path)


def main():
    write_midi(compose(), HERE / 'trilha.mid')
    wav = HERE / '.trilha-raw.wav'
    subprocess.run(['fluidsynth', '-ni', '-g', '0.6', '-r', '48000', '-F', str(wav), SF2, str(HERE / 'trilha.mid')],
                   check=True, capture_output=True)
    x, sr = sf.read(wav)
    wav.unlink()
    n = int(TL['DURATION'] * sr)
    x = np.pad(x, ((0, max(0, n - len(x))), (0, 0)))[:n]
    x = x / np.max(np.abs(x)) * 10 ** (-3 / 20)
    sf.write(HERE / 'trilha.flac', x, sr)
    print('ok -> trilha.flac', f'{len(x) / sr:.1f}s')


if __name__ == '__main__':
    main()
