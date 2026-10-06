"""Relatório de dead holds (regra 1 e regra 9 da skill).

Lê quadros em tons de cinza (1/8 da resolução, sem grão) e divide a tela numa grade de 4x6 regiões.
Uma região com conteúdo (não preta) que fica sem mudar por >= 8 frames seguidos vira
"DEAD HOLD — corrigir". Movimento muito pequeno, mas presente, vira "DRIFT LENTO" (aceitável se intencional).
    python3 check.py <raw> <w> <h> <timeline.json> <saida.json>
"""
import json
import sys

import numpy as np

raw, w, h, tl_path, out = sys.argv[1], int(float(sys.argv[2])), int(float(sys.argv[3])), sys.argv[4], sys.argv[5]
fr = np.fromfile(raw, dtype=np.uint8)
n = len(fr) // (w * h)
fr = fr[:n * w * h].reshape(n, h, w).astype(np.float32)
GX, GY = 4, 6 if h > w else 4
cw, ch = w // GX, h // GY
DEAD, SLOW, RUN = .05, .35, 8          # níveis de cinza médios por pixel


def scene_of(f, board):
    best = None
    for bf, title, _ in board:
        if bf <= f + 30:
            best = title
    return best or '?'


try:
    board = json.load(open(tl_path))['BOARD']
except Exception:
    board = []
report = []
for gy in range(GY):
    for gx in range(GX):
        cell = fr[:, gy * ch:(gy + 1) * ch, gx * cw:(gx + 1) * cw]
        lit = cell.mean(axis=(1, 2)) > 12                                  # tem conteúdo visível
        diff = np.abs(np.diff(cell, axis=0)).mean(axis=(1, 2))
        diff = np.concatenate([[99], diff])
        for kind, thr in (('DEAD HOLD — corrigir', DEAD), ('DRIFT LENTO', SLOW)):
            bad = (diff < thr) & lit
            if kind == 'DRIFT LENTO':
                bad &= diff >= DEAD
            i = 0
            while i < n:
                if bad[i]:
                    j = i
                    while j < n and bad[j]:
                        j += 1
                    if j - i >= RUN:
                        report.append({'tipo': kind, 'regiao': [gx, gy], 'de': i, 'ate': j - 1, 'frames': j - i, 'cena': scene_of(i, board)})
                    i = j
                else:
                    i += 1
whole = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
static = [int(i + 1) for i in np.where(whole < DEAD)[0]]
json.dump({'frames': n, 'regioes': report, 'quadros_totalmente_parados': static}, open(out, 'w'), ensure_ascii=False, indent=1)
dead = [r for r in report if r['tipo'].startswith('DEAD')]
slow = [r for r in report if r['tipo'].startswith('DRIFT')]
print(f'{n} frames analisados · {len(dead)} DEAD HOLD · {len(slow)} DRIFT LENTO · {len(static)} quadros totalmente parados')
for r in dead + slow[:12]:
    print(f"  {r['tipo']:22s} região {r['regiao']} frames {r['de']}–{r['ate']} ({r['frames']}f) · cena {r['cena']}")
