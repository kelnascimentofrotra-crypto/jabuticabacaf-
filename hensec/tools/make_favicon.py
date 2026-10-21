"""
Gera public/favicon.svg: monograma "HS" (Helder Segurança) em DM Serif
Display, convertido em contornos para não depender da fonte no navegador.

Uso (venv com fonttools e brotli; a fonte vem de node_modules, então rode
`npm install` antes):

    python make_favicon.py --out ../public/favicon.svg
"""

import argparse
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

FONT = Path(__file__).resolve().parents[1] / (
    "node_modules/@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2"
)
TEXT = "HS"
BOX = 64          # viewBox do ícone
TEXT_HEIGHT = 30  # altura das maiúsculas no ícone
INK = "#0b0907"
IVORY = "#f5ede1"
GOLD = "#e6ba64"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    font = TTFont(str(FONT))
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    names = [cmap[ord(ch)] for ch in TEXT]

    # largura total e altura das maiúsculas em unidades da fonte
    advance = sum(glyphs[n].width for n in names)
    bounds = BoundsPen(glyphs)
    glyphs[names[0]].draw(bounds)
    cap = bounds.bounds[3]
    scale = TEXT_HEIGHT / cap
    x0 = (BOX - advance * scale) / 2
    baseline = (BOX + TEXT_HEIGHT) / 2

    paths, x = [], 0
    for name in names:
        pen = SVGPathPen(glyphs)
        # y da fonte cresce para cima; no SVG, para baixo
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x0 + x * scale, baseline)))
        paths.append(pen.getCommands())
        x += glyphs[name].width

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {BOX} {BOX}">'
        f'<rect width="{BOX}" height="{BOX}" rx="14" fill="{INK}"/>'
        f'<path fill="{IVORY}" d="{paths[0]}"/>'
        f'<path fill="{GOLD}" d="{paths[1]}"/>'
        "</svg>\n"
    )
    Path(args.out).write_text(svg)
    print("ok", args.out)


if __name__ == "__main__":
    main()
