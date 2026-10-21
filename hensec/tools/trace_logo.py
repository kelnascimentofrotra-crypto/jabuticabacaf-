"""
Vetoriza o logotipo HENSEC (escudo + "HENSEC") a partir da navbar da
página 1 do PDF de referência e gera:

  - logo-path.txt   → atributo `d` usado no <svg class="logo"> do index.html
                      (viewBox "8 5 193 59"; a linha "MONITORAMENTO 24HS"
                      é texto SVG na fonte do site);
  - favicon.svg     → somente o escudo, em public/.

Uso (venv com numpy, pillow e potracer):

    python trace_logo.py --pdf HENSEC_Referencia.pdf --out ./saida

Se a HENSEC tiver o logotipo vetorial oficial, prefira-o: substitua o
<path> do index.html e o public/favicon.svg.
"""

import argparse
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import potrace
from PIL import Image, ImageFilter

BOX = (104, 40, 312, 108)  # recorte da logo na página 1 (1672 × 941)
SCALE = 8                  # ampliação antes de vetorizar


def trace(mask):
    bitmap = potrace.Bitmap(~mask)  # potracer preenche os pixels "escuros"
    path = bitmap.trace(
        turdsize=60,
        turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
        alphamax=1.05,
        opticurve=True,
        opttolerance=0.35,
    )
    parts = []
    for curve in path:
        s = curve.start_point
        d = [f"M{s.x / SCALE:.2f} {s.y / SCALE:.2f}"]
        for seg in curve.segments:
            e = seg.end_point
            if seg.is_corner:
                d.append(f"L{seg.c.x / SCALE:.2f} {seg.c.y / SCALE:.2f}L{e.x / SCALE:.2f} {e.y / SCALE:.2f}")
            else:
                d.append(
                    f"C{seg.c1.x / SCALE:.2f} {seg.c1.y / SCALE:.2f} "
                    f"{seg.c2.x / SCALE:.2f} {seg.c2.y / SCALE:.2f} {e.x / SCALE:.2f} {e.y / SCALE:.2f}"
                )
        d.append("Z")
        parts.append("".join(d))
    return "".join(parts)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdfimages", "-f", "1", "-l", "1", "-png", args.pdf, f"{tmp}/p"], check=True)
        page = Image.open(f"{tmp}/p-000.png").convert("L")

    crop = page.crop(BOX)
    big = crop.resize((crop.width * SCALE, crop.height * SCALE), Image.LANCZOS)
    big = big.filter(ImageFilter.GaussianBlur(SCALE * 0.3))
    mask = np.asarray(big).astype(float) > 118

    full = mask.copy()
    full[46 * SCALE:, 72 * SCALE:] = False  # remove "MONITORAMENTO 24HS" (vira texto SVG)
    (out / "logo-path.txt").write_text(trace(full))

    shield = mask.copy()
    shield[:, 70 * SCALE:] = False
    (out / "favicon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="2 2 70 66">'
        '<rect x="2" y="2" width="70" height="66" rx="14" fill="#0b0907"/>'
        f'<path fill="#f5ede1" fill-rule="evenodd" d="{trace(shield)}"/></svg>\n'
    )
    print("ok", out)


if __name__ == "__main__":
    main()
