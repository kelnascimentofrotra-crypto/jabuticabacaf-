"""
Gera as camadas fotográficas limpas (sem interface) a partir das páginas
achatadas do PDF de referência HENSEC.

As referências entregues contêm navbar, títulos, botões e cards "impressos"
na imagem. Para que o site use HTML real sem duplicar texto, este script:

  1. extrai as 4 páginas do PDF (1672 × 941);
  2. monta máscaras de tudo o que é interface (traços de texto detectados
     automaticamente + formas explícitas de botões, cards e navbar);
  3. reconstrói essas áreas com o modelo de inpainting LaMa (big-lama);
  4. recorta as fotos dos cards de Soluções;
  5. exporta WebP otimizados para src/assets/img/.

Uso (fora do projeto, num venv com torch, numpy, scipy, pillow):

    python prepare_assets.py --pdf HENSEC_Referencia.pdf \
        --lama big-lama.pt --out ../src/assets/img --debug /tmp/debug

O modelo big-lama.pt está em:
https://github.com/enesmsahin/simple-lama-inpainting/releases/download/v0.1.0/big-lama.pt

Se fotos originais limpas existirem, substitua os arquivos em
src/assets/img/ mantendo os nomes; este script deixa de ser necessário.
"""

import argparse
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import torch
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

W, H = 1672, 941

# Navbar idêntica nas quatro páginas.
NAV_BOX = (62, 18, 1611, 134)


def lum(a):
    a = a.astype(np.float32)
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]


def text_mask(arr, box, thresh=26, open_size=41, dilate=6):
    """Traços claros (texto) dentro de `box`, via top-hat morfológico."""
    x0, y0, x1, y1 = box
    L = lum(arr[y0:y1, x0:x1])
    bg = ndi.grey_opening(L, size=(open_size, open_size))
    m = (L - bg) > thresh
    m = ndi.binary_opening(m, iterations=1) | ((L - bg) > thresh * 2.2)
    m = ndi.binary_dilation(m, iterations=dilate)
    full = np.zeros(arr.shape[:2], bool)
    full[y0:y1, x0:x1] = m
    return full


def shape_mask(shapes):
    img = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(img)
    for s in shapes:
        kind, box = s[0], s[1]
        if kind == "rect":
            d.rectangle(box, fill=255)
        elif kind == "round":
            d.rounded_rectangle(box, radius=s[2], fill=255)
        elif kind == "ellipse":
            d.ellipse(box, fill=255)
        elif kind == "outline":
            d.rounded_rectangle(box, radius=s[2], outline=255, width=s[3])
    return np.array(img) > 0


def nav_mask():
    return shape_mask([("round", NAV_BOX, 18)])


# --------------------------------------------------------------------------
# Máscaras por cena. Coordenadas no espaço 1672 × 941 da referência.
# --------------------------------------------------------------------------

def mask_hero(a):
    m = nav_mask()
    m |= text_mask(a, (78, 190, 482, 220), thresh=30, open_size=21, dilate=5)   # eyebrow
    m |= text_mask(a, (55, 222, 640, 572), thresh=22, open_size=61, dilate=9)   # título
    m |= shape_mask([("rect", (440, 538, 632, 556))])                           # traço dourado
    m |= text_mask(a, (100, 566, 566, 634), thresh=26, open_size=25, dilate=6)  # subtítulo
    m |= shape_mask([
        ("round", (98, 656, 436, 732), 38),          # botão primário
        ("rect", (462, 680, 652, 720)),              # link secundário
        ("rect", (78, 878, 360, 903)),               # assinatura
        ("rect", (830, 838, 843, 890)),              # linha do indicador
        ("rect", (752, 885, 922, 910)),              # "Role para conhecer"
        ("ellipse", (1544, 804, 1627, 888)),         # WhatsApp flutuante
    ])
    return m


CARDS = [(66, 362, 568, 824), (586, 362, 1088, 824), (1106, 362, 1608, 824)]


def mask_solucoes(a):
    m = nav_mask()
    m |= text_mask(a, (80, 152, 296, 176), thresh=30, open_size=21, dilate=5)
    m |= text_mask(a, (70, 176, 716, 352), thresh=22, open_size=61, dilate=9)
    m |= shape_mask([("rect", (786, 268, 1160, 338))])
    for c in CARDS:
        m |= shape_mask([("round", (c[0] - 6, c[1] - 6, c[2] + 6, c[3] + 6), 22)])
    m |= shape_mask([
        ("rect", (64, 842, 1614, 853)),              # divisória do rodapé
        ("rect", (80, 862, 524, 908)),               # pergunta
        ("round", (1230, 854, 1508, 920), 30),       # CTA
        ("ellipse", (1544, 834, 1627, 916)),         # WhatsApp
    ])
    return m


def mask_card(a):
    """Texto dentro do recorte de um card (coordenadas locais)."""
    h, w = a.shape[:2]
    m = np.zeros((h, w), bool)
    m |= text_mask(a, (16, 12, 120, 46), thresh=24, open_size=21, dilate=5)
    m |= shape_mask_local((w, h), [
        ("rect", (16, 288, w - 18, h - 6)),
        # arcos da borda dourada nos cantos arredondados
        ("rect", (0, 0, 20, 20)), ("rect", (w - 21, 0, w - 1, 20)),
        ("rect", (0, h - 21, 20, h - 1)), ("rect", (w - 21, h - 21, w - 1, h - 1)),
    ])
    return m


def shape_mask_local(size, shapes):
    img = Image.new("L", size, 0)
    d = ImageDraw.Draw(img)
    for kind, box in shapes:
        d.rectangle(box, fill=255)
    return np.array(img) > 0


def mask_sobre(a):
    m = nav_mask()
    m |= shape_mask([("rect", (948, 194, 1222, 212))])                          # eyebrow + traço
    m |= text_mask(a, (944, 222, 1572, 478), thresh=22, open_size=61, dilate=9)
    m |= text_mask(a, (948, 492, 1474, 590), thresh=24, open_size=25, dilate=6)
    m |= text_mask(a, (948, 612, 1480, 680), thresh=24, open_size=25, dilate=6)
    m |= shape_mask([
        ("rect", (1084, 614, 1091, 676)),            # divisórias das etapas
        ("rect", (1324, 614, 1331, 676)),
        ("round", (948, 704, 1226, 778), 36),        # Vamos conversar
        ("rect", (1254, 720, 1420, 762)),            # Ver soluções
        ("rect", (70, 840, 1532, 851)),              # linha do rodapé
        ("rect", (68, 862, 404, 889)),
        ("rect", (1096, 856, 1532, 897)),
        ("ellipse", (1544, 834, 1627, 916)),
    ])
    return m


def mask_contato(a):
    m = nav_mask()
    m |= shape_mask([("rect", (100, 182, 296, 202))])
    m |= text_mask(a, (96, 222, 800, 462), thresh=22, open_size=61, dilate=9)
    m |= text_mask(a, (96, 466, 646, 540), thresh=24, open_size=25, dilate=6)
    m |= shape_mask([
        ("round", (96, 551, 705, 824), 26),          # módulo WhatsApp
        ("rect", (100, 836, 670, 892)),              # links inferiores
        ("round", (1220, 800, 1612, 878), 22),       # selo "Mais perto…"
    ])
    return m


# --------------------------------------------------------------------------

class Lama:
    def __init__(self, path):
        torch.set_num_threads(max(1, torch.get_num_threads()))
        self.model = torch.jit.load(path, map_location="cpu").eval()

    def __call__(self, arr, mask):
        h, w = mask.shape
        ph, pw = (8 - h % 8) % 8, (8 - w % 8) % 8
        img = np.pad(arr, ((0, ph), (0, pw), (0, 0)), mode="symmetric")
        msk = np.pad(mask, ((0, ph), (0, pw)), mode="symmetric")
        t_img = torch.from_numpy(img.transpose(2, 0, 1)[None].astype(np.float32) / 255)
        t_msk = torch.from_numpy(msk[None, None].astype(np.float32))
        with torch.inference_mode():
            out = self.model(t_img, t_msk)[0].permute(1, 2, 0).numpy()
        out = np.clip(out * 255, 0, 255).astype(np.uint8)[:h, :w]
        # mantém pixels originais fora da máscara, com borda suavizada
        soft = ndi.gaussian_filter(mask.astype(np.float32), 1.2)[..., None]
        soft = np.clip(soft * 1.6, 0, 1)
        return (out * soft + arr * (1 - soft)).astype(np.uint8)


def overlay(arr, mask):
    o = arr.copy()
    o[mask] = (o[mask] * 0.35 + np.array([255, 0, 80]) * 0.65).astype(np.uint8)
    return o


def save_webp(arr, path, quality=84):
    Image.fromarray(arr).save(path, "WEBP", quality=quality, method=6)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", required=True)
    ap.add_argument("--lama", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--debug")
    args = ap.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    dbg = Path(args.debug) if args.debug else None
    if dbg:
        dbg.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdfimages", "-png", args.pdf, f"{tmp}/p"], check=True)
        pages = [np.array(Image.open(f"{tmp}/p-00{i}.png").convert("RGB")) for i in range(4)]

    lama = Lama(args.lama)
    scenes = [
        ("hero", pages[0], mask_hero),
        ("solucoes", pages[1], mask_solucoes),
        ("sobre", pages[2], mask_sobre),
        ("contato", pages[3], mask_contato),
    ]
    for name, arr, fn in scenes:
        m = fn(arr)
        if dbg:
            Image.fromarray(overlay(arr, m)).save(dbg / f"{name}-mask.png")
        clean = lama(arr, m)
        if dbg:
            Image.fromarray(clean).save(dbg / f"{name}-clean.png")
        save_webp(clean, out / f"{name}.webp")
        print("ok", name)

    # Fotos dos cards de Soluções: recorte interno a cada borda + remoção de texto.
    for i, (x0, y0, x1, y1) in enumerate(CARDS, 1):
        crop = pages[1][y0 + 5:y1 - 5, x0 + 5:x1 - 5].copy()
        m = mask_card(crop)
        if dbg:
            Image.fromarray(overlay(crop, m)).save(dbg / f"card{i}-mask.png")
        clean = lama(crop, m)
        if dbg:
            Image.fromarray(clean).save(dbg / f"card{i}-clean.png")
        save_webp(clean, out / f"solucao-{i}.webp", quality=86)
        print("ok card", i)


if __name__ == "__main__":
    main()
