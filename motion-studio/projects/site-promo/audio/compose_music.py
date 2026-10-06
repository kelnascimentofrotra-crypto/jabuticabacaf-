"""Trilha do "por que ter um site": eletrônica moderna a 120 BPM, dó maior / lá menor, 42 s.

    python3 compose_music.py   -> trilha.mid, trilha.flac e ../out/trilha.mp3

1 compasso = 2 s = 60 frames (1 tempo = 15 frames a 30 fps). Seções batendo com o storyboard:
  c0–3    (0–240)     intro tensa: pad em Am, pulso do baixo, chimbal crescendo (o problema)
  c4–9    (240–600)   groove claro: harpa em arpejo, baixo saltado, 808 (a solução, os 4 benefícios)
  c10     (600–660)   subida: caixa em semicolcheias até a virada para o escuro
  c11     (660–720)   "Sites que vendem": sem bumbo, só pad, arpejo e chimbal
  c12–16  (720–1020)  drop: 4 no chão, stabs de polysynth e melodia de celesta (vitrine dos sites)
  c17     (1020–1080) respiro: "O próximo é o seu"
  c18     (1080–1140) CTA: bumbo em semínimas e virada de caixa até o clique
  c19     (1140–1200) drop final no clique; c20 (1200–1260) acorde final
Instrumentos do FluidR3_GM (MIT). Requer mido, numpy, soundfile, fluidsynth e fluid-soundfont-gm.
"""
import subprocess
from pathlib import Path

import mido
import numpy as np
import soundfile as sf

HERE = Path(__file__).parent
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'
BPM, DUR = 120, 42.0
TPB = 480
E8, E16, BAR = TPB // 2, TPB // 4, TPB * 4
rng = np.random.default_rng(7)

VOICE = {  # voicing (pad/arpejo) e fundamental do baixo
    'Am9': ([60, 64, 67, 71], 45), 'Fmaj9': ([57, 60, 64, 67], 41), 'G6': ([59, 62, 64, 67], 43),
    'C/E': ([59, 64, 67, 72], 40), 'Em7': ([59, 62, 64, 67], 40), 'E7sus': ([57, 62, 64, 71], 40),
    'Dm9': ([57, 60, 64, 65], 38), 'Cmaj9': ([59, 62, 64, 67], 36),
}
# (acordes do compasso: 1 ou 2 metades, seção)
BARS = [('Am9', 'intro'), ('Am9', 'intro'), ('Fmaj9', 'intro'), ('E7sus', 'intro'),
        ('Fmaj9', 'groove'), ('G6', 'groove'), ('Am9', 'groove'), ('C/E', 'groove'), ('Fmaj9', 'groove'), ('G6', 'groove'),
        (['Am9', 'E7sus'], 'build'), ('Fmaj9', 'pre'),
        ('Fmaj9', 'drop'), ('G6', 'drop'), ('Am9', 'drop'), ('Em7', 'drop'), (['Fmaj9', 'G6'], 'drop'),
        ('Dm9', 'break'), (['G6', 'E7sus'], 'cta'), (['Fmaj9', 'G6'], 'drop'), ('Cmaj9', 'final')]
MEL = {  # compasso: [(tempo, duração, nota)] — celesta nos drops
    12: [(0, .5, 76), (.5, .5, 79), (1, 1, 81), (2.5, .5, 79), (3, 1, 76)],
    13: [(0, .5, 74), (.5, .5, 79), (1, 1, 83), (2.5, .5, 81), (3, 1, 79)],
    14: [(0, .5, 76), (.5, .5, 79), (1, 1, 84), (2.5, .5, 83), (3, 1, 81)],
    15: [(0, .5, 79), (.5, .5, 83), (1, 1.5, 86), (2.5, .5, 83), (3, 1, 79)],
    16: [(0, 1, 81), (1, 1, 76), (2, 1, 83), (3, 1, 79)],
    19: [(0, .5, 76), (.5, .5, 79), (1, 1, 84), (2, .5, 83), (2.5, .5, 81), (3, 1, 79)],
    20: [(0, 3, 84)],
}
PAD, BASS, ARP, STAB, CEL, DR = 0, 1, 2, 3, 4, 9


def hum(t, a=4):
    return max(0, int(t + rng.integers(-a, a + 1)))


def v(x, a=6):
    return int(np.clip(x + rng.integers(-a, a + 1), 1, 127))


def compose():
    ev = []  # (tick, canal, nota, vel, dur)
    for b, (ch, sec) in enumerate(BARS):
        b0 = b * BAR
        halves = ch if isinstance(ch, list) else [ch]
        hl = BAR // len(halves)
        for k, name in enumerate(halves):
            notes, root = VOICE[name]
            t0 = b0 + k * hl
            # pad: sempre; mais presente na intro e no respiro
            pv = {'intro': 50, 'break': 54, 'pre': 46, 'final': 52}.get(sec, 38)
            for n in notes:
                ev.append((t0, PAD, n, v(pv, 3), hl - 20))
            # baixo
            if sec == 'intro' and b >= 1:
                for i in range(hl // E8):
                    ev.append((t0 + i * E8, BASS, root, v(46 + b * 9 + i, 3), E8 - 60))
            elif sec == 'groove':
                for pos, n in [(0, root), (.75, root), (1.5, root + 12), (2, root), (2.75, root), (3.5, root + 12)]:
                    if pos * TPB < hl:
                        ev.append((hum(t0 + int(pos * TPB)), BASS, n, v(92 if pos in (0, 2) else 74), E8 - 40))
            elif sec in ('drop', 'build', 'cta'):
                for i in range(hl // E8):
                    ev.append((hum(t0 + i * E8), BASS, root + (12 if i % 2 else 0), v(96 if i % 2 == 0 else 78), E8 - 50))
            elif sec == 'final':
                ev.append((t0, BASS, root, 100, BAR - 100))
            # arpejo de harpa (subindo e descendo pelo voicing + oitava)
            arp = notes + [notes[0] + 12, notes[1] + 12]
            order = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5, 3, 1]
            step = {'groove': E16, 'drop': E16, 'pre': E16, 'build': E16, 'cta': E16, 'break': E8}.get(sec)
            if step or (sec == 'intro' and b >= 2):
                step = step or E8
                for i in range(hl // step):
                    vel = {'groove': 62, 'drop': 58, 'pre': 50, 'build': 56, 'cta': 54, 'break': 48}.get(sec, 40)
                    ev.append((hum(t0 + i * step, 3), ARP, arp[order[i % len(order)]] + 12, v(vel + (10 if i % 4 == 0 else 0)), step * 2))
            # stabs de polysynth nos contratempos
            if sec in ('drop', 'groove'):
                for i in range(hl // E16):
                    if i % 4 == 2 and (sec == 'drop' or i in (6, 14)):
                        for n in notes:
                            ev.append((t0 + i * E16, STAB, n + 12, v(70 if sec == 'drop' else 52), E16 + 20))
        # bateria (kit TR-808)
        for i in range(16):
            t = b0 + i * E16
            if sec == 'intro':
                if i == 0:
                    ev.append((t, DR, 36, v(70 + b * 8), E8))
                if b >= 1 and not (b == 3 and i >= 12):                 # 1 tempo de silêncio antes da virada
                    ev.append((hum(t, 2), DR, 42, v(24 + b * 10 + (10 if i % 4 == 0 else 0)), E16))
                if b >= 2 and i in (4, 12) and not (b == 3 and i >= 12):
                    ev.append((t, DR, 37, v(56), E8))
            elif sec == 'groove':
                if i in (0, 6, 8):
                    ev.append((t, DR, 36, v(100 if i != 6 else 82), E8))
                if i in (4, 12):
                    ev.append((hum(t, 2), DR, 39, v(88), E8))
                ev.append((hum(t, 2), DR, 42, v(54 if i % 2 == 0 else 34), E16))
                if i in (6, 14):
                    ev.append((t, DR, 46, v(52), E8))
            elif sec == 'build':
                if i < 8 and i % 4 == 0:
                    ev.append((t, DR, 36, v(104), E8))
                if i >= 8:
                    ev.append((t, DR, 38, v(50 + (i - 8) * 9), E16))
                elif i % 2 == 0:
                    ev.append((t, DR, 42, v(50), E16))
            elif sec == 'pre':
                ev.append((hum(t, 2), DR, 42 if i % 2 == 0 else 82, v(46 if i % 2 == 0 else 34), E16))
                if i in (4, 12):
                    ev.append((t, DR, 37, v(60), E8))
            elif sec == 'drop':
                if i % 4 == 0:
                    ev.append((t, DR, 36, v(110, 4), E8))
                if i in (4, 12):
                    ev.append((hum(t, 2), DR, 39, v(96), E8)); ev.append((hum(t, 2), DR, 38, v(70), E8))
                ev.append((hum(t, 2), DR, 42, v(60 if i % 2 == 0 else 40), E16))
                if i % 4 == 2:
                    ev.append((t, DR, 46, v(58), E8))
            elif sec == 'cta':
                if i % 4 == 0 and i < 12:
                    ev.append((t, DR, 36, v(96), E8))
                if i % 2 == 0 and i < 8:
                    ev.append((t, DR, 42, v(48), E16))
                if i >= 8 and i < 15:                                # virada até o clique (último 1/16 em silêncio)
                    ev.append((t, DR, 38, v(54 + (i - 8) * 10), E16))
            elif sec == 'final' and i == 0:
                ev.append((t, DR, 36, 110, E8))
        if sec == 'break':
            ev.append((b0 + 12 * E16, DR, 42, v(40), E16)); ev.append((b0 + 14 * E16, DR, 42, v(50), E16))
    for b in (4, 12, 16, 19, 20):                                       # pratos nas viradas
        ev.append((b * BAR, DR, 49, 96 if b != 16 else 70, BAR))
    for b, notes in MEL.items():
        for beat, d, n in notes:
            ev.append((hum(b * BAR + int(beat * TPB), 3), CEL, n, v(80 if beat in (0, 1, 2) else 70), int(d * TPB) - 20))
    return ev


def write_midi(ev, path):
    mid = mido.MidiFile(ticks_per_beat=TPB)
    tr = mido.MidiTrack()
    mid.tracks.append(tr)
    msgs = [(0, mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM)))]
    for ch, prog in [(PAD, 89), (BASS, 38), (ARP, 46), (STAB, 90), (CEL, 8), (DR, 25)]:
        msgs.append((0, mido.Message('program_change', channel=ch, program=prog)))
    for ch, vol, pan, rev, cho in [(PAD, 86, 64, 90, 60), (BASS, 104, 64, 10, 0), (ARP, 84, 76, 70, 30), (STAB, 68, 52, 70, 50), (CEL, 88, 72, 90, 20), (DR, 104, 64, 25, 0)]:
        msgs += [(0, mido.Message('control_change', channel=ch, control=7, value=vol)),
                 (0, mido.Message('control_change', channel=ch, control=10, value=pan)),
                 (0, mido.Message('control_change', channel=ch, control=91, value=rev)),
                 (0, mido.Message('control_change', channel=ch, control=93, value=cho))]
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
    subprocess.run(['fluidsynth', '-ni', '-g', '0.5', '-r', '48000', '-F', str(raw), SF2, str(HERE / 'trilha.mid')],
                   check=True, capture_output=True)
    x, sr = sf.read(raw)
    raw.unlink()
    n = int(DUR * sr)
    x = np.pad(x, ((0, max(0, n - len(x))), (0, 0)))[:n]
    fade = int(1.2 * sr)
    x[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
    x = x / np.max(np.abs(x)) * 10 ** (-1 / 20)
    sf.write(HERE / 'trilha.flac', x, sr)
    mp3 = HERE.parent / 'out' / 'trilha.mp3'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(HERE / 'trilha.flac'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
                    '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '256k', str(mp3)], check=True)
    print('ok ->', mp3.name, f'{len(x) / sr:.1f}s')


if __name__ == '__main__':
    main()
