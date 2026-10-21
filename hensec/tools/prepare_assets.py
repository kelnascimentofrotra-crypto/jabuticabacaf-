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
  5. troca a marca antiga impressa nas fotos (escudo + "HENSEC" no teclado,
     no leitor de acesso e no contato do WhatsApp; emblema na manga do
     técnico) pelo nome "Helder Segurança", desenhado com a fonte do site;
  6. exporta WebP otimizados para src/assets/img/.

Uso (fora do projeto, num venv com torch, numpy, scipy, pillow; a fonte vem
de node_modules, então rode `npm install` antes):

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
from PIL import Image, ImageDraw, ImageFilter, ImageFont
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


def mask_card(a, index):
    """Texto dentro do recorte de um card (coordenadas locais)."""
    h, w = a.shape[:2]
    m = np.zeros((h, w), bool)
    m |= shape_mask_local((w, h), OLD_MARKS.get(f"card{index}", []))
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
        if kind == "polygon":
            d.polygon(box, fill=255)
        elif kind == "ellipse":
            d.ellipse(box, fill=255)
        else:
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
    m |= shape_mask_local((W, H), OLD_MARKS["sobre"])
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
    m |= shape_mask_local((W, H), OLD_MARKS["contato"])
    return m


# --------------------------------------------------------------------------
# Marca nas fotos
# --------------------------------------------------------------------------

BRAND = "Helder Segurança"
FONT_DIR = Path(__file__).resolve().parents[1] / "node_modules/@fontsource/plus-jakarta-sans/files"
SS = 8  # supersampling do texto desenhado

# Marca antiga a remover, nas coordenadas de cada imagem.
OLD_MARKS = {
    "sobre": [("ellipse", (299, 538, 358, 600))],                                   # emblema na manga
    "contato": [("polygon", [(1226, 276), (1320, 292), (1320, 329), (1226, 312)])],  # avatar + "Hensec"
    "card2": [("rect", (209, 211, 254, 251))],                                      # teclado do alarme
    "card3": [("rect", (190, 44, 233, 91))],                                        # leitor de acesso
}


def brand_font(weight, cap_px):
    """Plus Jakarta Sans no tamanho em que a altura das maiúsculas é cap_px."""
    path = str(FONT_DIR / f"plus-jakarta-sans-latin-{weight}-normal.woff")
    _, top, _, bottom = ImageFont.truetype(path, 100).getbbox("H")
    return ImageFont.truetype(path, round(100 * cap_px * SS / (bottom - top)))


def text_line(text, weight, cap_px, width=None, tracking=0.0):
    """Uma linha de texto (máscara L em escala SS), recortada na tinta.
    `width` força a largura final distribuindo o espaço entre as letras."""
    font = brand_font(weight, cap_px)
    advances = [font.getlength(ch) for ch in text]
    track = tracking * font.size
    if width is not None and len(text) > 1:
        ink = font.getbbox(text)
        natural = ink[2] - ink[0] + track * (len(text) - 1)
        track += (width * SS - natural) / (len(text) - 1)
    pad = 4 * SS
    img = Image.new("L", (int(sum(advances) + max(track, 0) * len(text)) + 2 * pad, font.size * 2), 0)
    draw = ImageDraw.Draw(img)
    x = pad
    for ch, adv in zip(text, advances):
        draw.text((x, pad), ch, font=font, fill=255)
        x += adv + track
    return img.crop(img.getbbox())


def lockup(top, bottom, gap_px):
    """Duas linhas centralizadas, a de baixo com a largura da de cima."""
    w = max(top.width, bottom.width)
    gap = round(gap_px * SS)
    img = Image.new("L", (w, top.height + gap + bottom.height), 0)
    img.paste(top, ((w - top.width) // 2, 0))
    img.paste(bottom, ((w - bottom.width) // 2, top.height + gap))
    return img


def stamp(arr, layer, center, color, angle=0.0, blur=0.45):
    """Aplica a máscara de texto `layer` (escala SS) centrada em `center`."""
    if angle:
        layer = layer.rotate(-angle, resample=Image.BICUBIC, expand=True)
    small = layer.resize((round(layer.width / SS), round(layer.height / SS)), Image.LANCZOS)
    if blur:
        small = small.filter(ImageFilter.GaussianBlur(blur))
    alpha = np.asarray(small, dtype=np.float32)[..., None] / 255
    x0 = round(center[0] - small.width / 2)
    y0 = round(center[1] - small.height / 2)
    region = arr[y0:y0 + small.height, x0:x0 + small.width].astype(np.float32)
    arr[y0:y0 + small.height, x0:x0 + small.width] = (
        region * (1 - alpha) + np.array(color, np.float32) * alpha
    ).round().astype(np.uint8)


def device_mark(cap_px):
    """Nome em duas linhas, como uma marca impressa no equipamento."""
    first, second = BRAND.upper().split(" ", 1)
    top = text_line(first, 800, cap_px, tracking=0.04)
    return lockup(top, text_line(second, 700, cap_px * 0.56, width=top.width / SS), cap_px * 0.38)


def rebrand(name, arr):
    """Desenha o nome novo onde a marca antiga foi removida."""
    if name == "card2":    # teclado do alarme: tinta escura no painel claro
        stamp(arr, device_mark(7.5), (231.5, 231), (24, 18, 15), blur=0.5)
    elif name == "card3":  # leitor de acesso: serigrafia clara no vidro preto
        stamp(arr, device_mark(8.5), (211, 67), (236, 236, 230), blur=0.5)
    elif name == "contato":  # nome do contato no cabeçalho do WhatsApp
        angle = 10.0
        layer = text_line(BRAND, 600, 8.2)
        half = layer.width / SS / 2
        rad = np.radians(angle)
        x_start, y_mid = 1234, 296.5
        stamp(arr, layer, (x_start + half * np.cos(rad), y_mid + half * np.sin(rad)),
              (248, 250, 248), angle=angle, blur=0.55)
    return arr


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


def shield_shot(clean_hero):
    """Plano da seção "The Shield Experience": contraplano da hero.

    Recorte mais fechado da mesma casa, espelhado (câmera à esquerda olhando
    para a sala) e com tratamento mais frio e escuro. A foto não tem texto,
    então o espelhamento não inverte nenhuma informação.
    """
    a = clean_hero[20:941, 250:1672].astype(np.float32) / 255
    lum = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])[..., None]
    a = lum + (a - lum) * 0.78                                   # dessatura levemente
    shadow = np.clip(1 - lum * 2.2, 0, 1)
    a = a + shadow * np.array([-0.012, 0.004, 0.03])             # sombras mais frias
    a = np.clip(a * 0.9, 0, 1) ** 1.06                           # um ponto mais escuro
    return np.ascontiguousarray((a * 255).astype(np.uint8)[:, ::-1])


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
        clean = rebrand(name, lama(arr, m))
        if dbg:
            Image.fromarray(clean).save(dbg / f"{name}-clean.png")
        save_webp(clean, out / f"{name}.webp")
        print("ok", name)
        if name == "hero":
            save_webp(shield_shot(clean), out / "protecao.webp")
            print("ok protecao")

    # Fotos dos cards de Soluções: recorte interno a cada borda + remoção de texto.
    for i, (x0, y0, x1, y1) in enumerate(CARDS, 1):
        crop = pages[1][y0 + 5:y1 - 5, x0 + 5:x1 - 5].copy()
        m = mask_card(crop, i)
        if dbg:
            Image.fromarray(overlay(crop, m)).save(dbg / f"card{i}-mask.png")
        clean = rebrand(f"card{i}", lama(crop, m))
        if dbg:
            Image.fromarray(clean).save(dbg / f"card{i}-clean.png")
        save_webp(clean, out / f"solucao-{i}.webp", quality=86)
        print("ok card", i)


if __name__ == "__main__":
    main()
