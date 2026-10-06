"""Narração do promo com voz neural (Kokoro-82M, Apache-2.0) em português do Brasil.

    python3 make_vo.py pm_alex     # voz masculina (padrão, como na referência)
    python3 make_vo.py pf_dora     # voz feminina

Gera vo/<voz>/NN.wav e vo/<voz>/vo.json (arquivo + frame de entrada), lido pelo engine/sfx.py.
Requer: pip install kokoro-onnx (traz onnxruntime e espeak-ng). O modelo vem do npm, porque o Hugging Face
fica bloqueado neste ambiente:
    npm pack kokoro-q8-shards && tar xzf kokoro-q8-shards-1.0.0.tgz && cat package/kokoro-q8.part{0..5}.bin > kokoro/kokoro-q8.onnx
    (sha256 fbae9257e1e05ffc727e951ef9b9c98418e6d79f1c9b6b13bd59f5c9028a1478)
As vozes pf_dora / pm_alex / pm_santa (kokoro/voices-pt.npz) foram extraídas do pacote npm kokoro-js.
"""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = Path(__file__).parent
VOICE = sys.argv[1] if len(sys.argv) > 1 else 'pm_alex'
SPEED = 1.08
# (frame de entrada a 30 fps, texto). A grafia de "iFood" é fonética para o espeak.
SCRIPT = [
    (6, 'Seu dia vive corrido?'),
    (54, 'Chega de pressa!'),
    (91, 'Conheça o Jabuticaba Café!'),
    (146, 'Uma cafeteria completa, com muito sabor, tudo em um só lugar.'),
    (250, 'Cafés, bolos, lanches...'),
    (350, 'Feito na hora, com carinho em cada detalhe.'),
    (426, 'Cardápio completo, todo dia fresquinho,'),
    (512, 'pra curtir cada pausa do seu dia.'),
    (584, 'Tudo isso...'),
    (612, 'a partir de três reais!'),
    (700, 'Peça pelo aifúdi, ou venha nos visitar!'),
    (850, 'Venha tomar um café com a gente!'),
]


def trim(x, sr, thr=.012, pad=.03):
    e = np.convolve(np.abs(x), np.ones(int(.01 * sr)) / int(.01 * sr), 'same')
    idx = np.where(e > thr * e.max())[0]
    a, b = max(0, idx[0] - int(pad * sr)), min(len(x), idx[-1] + int(pad * sr))
    return x[a:b]


def main():
    k = Kokoro(str(HERE / 'kokoro' / 'kokoro-q8.onnx'), str(HERE / 'kokoro' / 'voices-pt.npz'))
    out = HERE / 'vo' / VOICE
    out.mkdir(parents=True, exist_ok=True)
    items, prev_end = [], -1
    for i, (frame, text) in enumerate(SCRIPT):
        audio, sr = k.create(text, voice=VOICE, speed=SPEED, lang='pt-br')
        audio = trim(audio, sr)
        path = out / f'{i:02d}.wav'
        sf.write(path, audio, sr)
        dur_f = len(audio) / sr * 30
        flag = '  <- encosta na próxima fala' if frame < prev_end else ''
        print(f'{i:02d} frame {frame:4d}–{frame + dur_f:6.1f} ({len(audio) / sr:4.2f}s)  {text}{flag}')
        prev_end = frame + dur_f
        items.append({'path': f'audio/vo/{VOICE}/{path.name}', 'frame': frame})
    (out / 'vo.json').write_text(json.dumps(items, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
