"""Trilha da WEBVEE Leads: eletrônica escura em ré menor, 120 BPM, 62 s.

    python3 compose_music.py   -> trilha.mid, trilha.flac e ../out/trilha.mp3

1 compasso = 2 s = 60 frames. Seções batendo com o storyboard:
  c0–2    (0–180)     intro: pad, pulso do baixo, chimbal crescendo ("Imagine ter uma IA…")
  c3–6    (180–420)   groove A (radar, funil, novos clientes)
  c7      (420–480)   "E o melhor:": impacto e silêncio, só o pad
  c8–9    (480–600)   leve, sem bumbo (∞ e a chave de API)
  c10–14  (600–900)   groove B, mais grave (limites, memória, conexão)
  c15–18  (900–1140)  drop 1: os recursos
  c19–22  (1140–1380) suave: o assistente, a qualquer hora
  c23–24  (1380–1500) subida até o drop 2
  c25–27  (1500–1680) drop 2: "Mais automação / velocidade / oportunidades", um prato por compasso
  c28–30  (1680–1860) respiro, impacto no logo (frame 1770) e acorde final
Instrumentos do FluidR3_GM (MIT). Requer mido, numpy, soundfile, fluidsynth e fluid-soundfont-gm.
"""
import subprocess
from pathlib import Path

import mido
import numpy as np
import soundfile as sf

HERE = Path(__file__).parent
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'
BPM, DUR = 120, 62.0
TPB = 480
E8, E16, BAR = TPB // 2, TPB // 4, TPB * 4
rng = np.random.default_rng(11)

VOICE = {
    'Dm9': ([57, 60, 64, 65], 38), 'Bbmaj7': ([57, 62, 65, 69], 46), 'C6': ([57, 60, 64, 67], 48),
    'Am7': ([55, 60, 64, 67], 45), 'Gm9': ([57, 58, 62, 65], 43), 'A7sus': ([55, 62, 64, 67], 45),
    'Dfin': ([57, 62, 64, 69], 38),
}
BARS = [('Dm9', 'intro'), ('Dm9', 'intro'), ('Bbmaj7', 'intro'),
        ('Bbmaj7', 'groove'), ('C6', 'groove'), ('Dm9', 'groove'), ('Am7', 'groove'),
        ('Gm9', 'stop'), ('Bbmaj7', 'lite'), ('A7sus', 'lite'),
        ('Dm9', 'grooveB'), ('Bbmaj7', 'grooveB'), ('Gm9', 'grooveB'), ('A7sus', 'grooveB'), ('Dm9', 'grooveB'),
        ('Bbmaj7', 'drop'), ('C6', 'drop'), ('Dm9', 'drop'), ('A7sus', 'drop'),
        ('Gm9', 'soft'), ('Bbmaj7', 'soft'), ('Dm9', 'soft'), ('C6', 'soft'),
        ('Gm9', 'build'), ('A7sus', 'build'),
        ('Bbmaj7', 'drop'), ('C6', 'drop'), ('Dm9', 'drop'),
        ('Bbmaj7', 'break'), (['Gm9', 'Dfin'], 'endhit'), ('Dfin', 'ring')]
M1 = {0: [(0, .5, 77), (.5, .5, 81), (1, 1, 86), (2.5, .5, 84), (3, 1, 81)],
      1: [(0, .5, 76), (.5, .5, 79), (1, 1, 84), (2.5, .5, 81), (3, 1, 79)],
      2: [(0, .5, 77), (.5, .5, 81), (1, 1.5, 88), (2.5, .5, 86), (3, 1, 81)],
      3: [(0, 1, 79), (1, 1, 76), (2, 1, 81), (3, 1, 79)]}
MEL = {15: M1[0], 16: M1[1], 17: M1[2], 18: M1[3], 25: M1[0], 26: M1[1], 27: M1[2]}
PAD, BASS, ARP, STAB, LEAD, DR = 0, 1, 2, 3, 4, 9


def hum(t, a=4):
    return max(0, int(t + rng.integers(-a, a + 1)))


def v(x, a=6):
    return int(np.clip(x + rng.integers(-a, a + 1), 1, 127))


def compose():
    ev = []
    for b, (ch, sec) in enumerate(BARS):
        b0 = b * BAR
        halves = ch if isinstance(ch, list) else [ch]
        hl = BAR // len(halves)
        for k, name in enumerate(halves):
            notes, root = VOICE[name]
            t0 = b0 + k * hl
            final = sec == 'endhit' and k == 1
            pv = {'intro': 50, 'stop': 58, 'lite': 46, 'soft': 52, 'break': 56, 'ring': 54}.get(sec, 40)
            dur = hl - 20 if sec != 'ring' else BAR * 2
            for n in notes:
                ev.append((t0, PAD, n, v(62 if final else pv, 3), dur if not final else hl + BAR))
            # baixo
            if sec == 'intro' and b >= 1:
                for i in range(hl // E8):
                    ev.append((t0 + i * E8, BASS, root, v(50 + b * 10 + i, 3), E8 - 60))
            elif sec == 'groove':
                for pos, n in [(0, root), (.75, root), (1.5, root + 12), (2, root), (2.75, root), (3.5, root + 12)]:
                    ev.append((hum(t0 + int(pos * TPB)), BASS, n, v(92 if pos in (0, 2) else 74), E8 - 40))
            elif sec in ('grooveB', 'drop', 'build'):
                for i in range(hl // E8):
                    ev.append((hum(t0 + i * E8), BASS, root + (12 if i % 2 else 0), v(98 if i % 2 == 0 else 80), E8 - 50))
            elif sec in ('lite', 'soft', 'break') or final or sec == 'ring':
                ev.append((t0, BASS, root, v(84 if not final else 104), hl - 40 if sec != 'ring' else BAR))
            elif sec == 'stop':
                ev.append((t0, BASS, root, 100, E8))
            # arpejo
            arp = notes + [notes[0] + 12, notes[1] + 12]
            order = [0, 2, 1, 3, 2, 4, 3, 5, 4, 3, 2, 1, 3, 2, 4, 1]
            step = {'groove': E16, 'grooveB': E16, 'drop': E16, 'lite': E16, 'build': E16, 'soft': E8, 'break': E8, 'intro': E8 if b >= 2 else None}.get(sec)
            if step:
                vel = {'groove': 58, 'grooveB': 56, 'drop': 54, 'lite': 50, 'build': 54, 'soft': 52, 'break': 46, 'intro': 40}[sec]
                for i in range(hl // step):
                    ev.append((hum(t0 + i * step, 3), ARP, arp[order[i % len(order)]] + 12, v(vel + (10 if i % 4 == 0 else 0)), int(step * 1.5)))
            # stabs
            if sec in ('drop', 'grooveB'):
                for i in range(hl // E16):
                    if i % 4 == 2 and (sec == 'drop' or i in (6, 14)):
                        for n in notes:
                            ev.append((t0 + i * E16, STAB, n + 12, v(70 if sec == 'drop' else 54), E16 + 20))
            if final:                                                        # impacto do logo
                ev.append((t0, DR, 36, 120, E8)); ev.append((t0, DR, 49, 110, BAR)); ev.append((t0, DR, 57, 90, BAR))
                for n in notes:
                    ev.append((t0, STAB, n + 12, 92, TPB * 3))
                ev.append((t0, LEAD, 86, 88, TPB * 3))
        # bateria (kit Electronic)
        for i in range(16):
            t = b0 + i * E16
            if sec == 'intro':
                if i == 0:
                    ev.append((t, DR, 36, v(72 + b * 8), E8))
                if b >= 1:
                    ev.append((hum(t, 2), DR, 42, v(24 + b * 12 + (10 if i % 4 == 0 else 0)), E16))
                if b == 2 and i in (4, 12):
                    ev.append((t, DR, 37, v(56), E8))
            elif sec in ('groove', 'grooveB'):
                if i in ((0, 6, 8) if sec == 'groove' else (0, 6, 8, 10)):
                    ev.append((t, DR, 36, v(102 if i in (0, 8) else 84), E8))
                if i in (4, 12):
                    ev.append((hum(t, 2), DR, 39, v(90), E8))
                ev.append((hum(t, 2), DR, 42, v(54 if i % 2 == 0 else 34), E16))
                if i in (6, 14):
                    ev.append((t, DR, 46, v(52), E8))
            elif sec == 'stop' and i == 0:
                ev.append((t, DR, 36, 120, E8)); ev.append((t, DR, 49, 104, BAR))
            elif sec == 'lite':
                ev.append((hum(t, 2), DR, 42 if i % 2 == 0 else 82, v(46 if i % 2 == 0 else 32), E16))
                if i in (4, 12):
                    ev.append((t, DR, 37, v(62), E8))
            elif sec == 'drop':
                if i % 4 == 0:
                    ev.append((t, DR, 36, v(112, 4), E8))
                if i in (4, 12):
                    ev.append((hum(t, 2), DR, 39, v(98), E8)); ev.append((hum(t, 2), DR, 38, v(72), E8))
                ev.append((hum(t, 2), DR, 42, v(60 if i % 2 == 0 else 40), E16))
                if i % 4 == 2:
                    ev.append((t, DR, 46, v(58), E8))
            elif sec == 'soft':
                if i in (0, 8):
                    ev.append((t, DR, 36, v(86), E8))
                if i in (4, 12):
                    ev.append((t, DR, 37, v(58), E8))
                if i % 2 == 0:
                    ev.append((hum(t, 2), DR, 42, v(40), E16))
            elif sec == 'build':
                if b == 23 and i % 4 == 0:
                    ev.append((t, DR, 36, v(100), E8))
                if b == 23 and i % 2 == 0:
                    ev.append((t, DR, 42, v(52), E16))
                if b == 24 and i < 15:
                    ev.append((t, DR, 38, v(48 + i * 5), E16))
            elif sec == 'endhit' and i < 8 and i % 2 == 0:
                ev.append((t, DR, 38, v(40 + i * 8), E16))
    for b in (3, 10, 15, 25, 26, 27):
        ev.append((b * BAR, DR, 49, 96 if b in (15, 25) else 78, BAR))
    for b, notes in MEL.items():
        for beat, d, n in notes:
            ev.append((hum(b * BAR + int(beat * TPB), 3), LEAD, n, v(84 if beat in (0, 1, 2) else 72), int(d * TPB) - 20))
    return ev


def write_midi(ev, path):
    mid = mido.MidiFile(ticks_per_beat=TPB)
    tr = mido.MidiTrack()
    mid.tracks.append(tr)
    msgs = [(0, mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM)))]
    for ch, prog in [(PAD, 89), (BASS, 39), (ARP, 81), (STAB, 90), (LEAD, 80), (DR, 24)]:
        msgs.append((0, mido.Message('program_change', channel=ch, program=prog)))
    for ch, vol, pan, rev, cho in [(PAD, 88, 64, 95, 70), (BASS, 104, 64, 10, 0), (ARP, 62, 74, 80, 40), (STAB, 66, 54, 75, 50), (LEAD, 70, 66, 90, 30), (DR, 104, 64, 25, 0)]:
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
    fade = int(1.5 * sr)
    x[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
    x = x / np.max(np.abs(x)) * 10 ** (-1 / 20)
    sf.write(HERE / 'trilha.flac', x, sr)
    mp3 = HERE.parent / 'out' / 'trilha.mp3'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(HERE / 'trilha.flac'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
                    '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '256k', str(mp3)], check=True)
    print('ok ->', mp3.name, f'{len(x) / sr:.1f}s')


if __name__ == '__main__':
    main()
