#!/usr/bin/env python3
"""Gera derivados WebP das referências, sem recorte e sem mudar a proporção.

Uso: python3 tools/derive-images.py   (requer Pillow)
Os PNGs originais em referencias/ nunca são alterados.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SETS = {
    # 'full' = largura original do arquivo; os demais são reduções.
    'desktop': (ROOT / 'referencias', ('full', 1280)),
    'mobile': (ROOT / 'referencias' / 'mobile', ('full', 640)),
}

for name, (src_dir, widths) in SETS.items():
    out_dir = ROOT / 'assets' / 'img' / name
    out_dir.mkdir(parents=True, exist_ok=True)
    for src in sorted(src_dir.glob('*.png')):
        im = Image.open(src).convert('RGB')
        w, h = im.size
        for target in widths:
            if target == 'full':
                res = im
            elif target >= w:
                continue  # nunca ampliar
            else:
                res = im.resize((target, round(h * target / w)), Image.LANCZOS)
            out = out_dir / f'{src.stem}-{target}.webp'
            res.save(out, 'WEBP', quality=88, method=6)
            print(f'{out.relative_to(ROOT)}  {res.size[0]}x{res.size[1]}  {out.stat().st_size // 1024} KB')
