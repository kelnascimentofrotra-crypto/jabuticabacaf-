# -*- coding: utf-8 -*-
"""Recorta, trata e instala as fotos de produto enviadas pela loja.

Uso: coloque os originais em assets/img/produtos/originais/ e rode daqui.
Os recortes de cada produto sao declarados em CORTES, em fracoes da imagem
(esquerda, topo, direita, base), para nao depender da resolucao do celular.
"""
from PIL import Image, ImageEnhance
import os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, 'assets/img/produtos/originais')
OUT = os.path.join(BASE, 'assets/img/produtos')

# destino -> (arquivo original, recorte em fracoes, ajuste extra)
CORTES = {
    # destino:            (origem,      (esq, topo, dir, base),   ajuste)
    'manifolds':          ('foto-1.jpg', (0.39, 0.02, 0.83, 0.26), None),
    'flangeador':         ('foto-1.jpg', (0.26, 0.22, 0.78, 0.55), None),
    'tubo-de-cobre':      ('foto-2.jpg', (0.05, 0.38, 1.00, 0.72), None),
    'amperimetro':        ('foto-3.jpg', (0.00, 0.25, 0.44, 0.52), None),
    'mangueiras':         ('foto-3.jpg', (0.04, 0.50, 0.54, 0.79), None),
    'oleos':              ('foto-4.jpg', (0.14, 0.06, 0.44, 0.95), None),
    'gas-refrigerante':   ('foto-4.jpg', (0.40, 0.03, 0.99, 0.99), None),
    'suportes':           ('foto-5.jpg', (0.02, 0.02, 0.98, 0.62), None),
    'motor-condensadora': ('foto-6.jpg', (0.28, 0.40, 0.66, 0.60), None),
    'placa-eletronica':   ('foto-7.jpg', (0.29, 0.40, 0.67, 0.60), None),
    'controles-remotos':  ('foto-9.jpg', (0.00, 0.02, 0.62, 0.36), None),
    'tubo-capilar':       ('foto-9.jpg', (0.55, 0.11, 0.98, 0.38), None),
}

def tratar(im):
    """Mesma grade do restante do site, com um respiro a mais de luz porque
    foto de prateleira costuma vir subexposta."""
    im = ImageEnhance.Color(im).enhance(0.86)
    im = ImageEnhance.Contrast(im).enhance(1.12)
    im = ImageEnhance.Brightness(im).enhance(1.06)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 0.985)))
    b = b.point(lambda v: min(255, int(v * 1.03)))
    return Image.merge('RGB', (r, g, b))

def quadro(im, alvo=(800, 600)):
    """Recorta para 4:3 pelo centro do que sobrou e redimensiona."""
    want = alvo[0] / alvo[1]
    w, h = im.size
    if w / h > want:
        nw = int(h * want); im = im.crop(((w - nw) // 2, 0, (w + nw) // 2, h))
    else:
        nh = int(w / want); im = im.crop((0, (h - nh) // 2, w, (h + nh) // 2))
    return im.resize(alvo, Image.LANCZOS)

def main():
    if not CORTES:
        print('Nenhum recorte definido ainda — aguardando as fotos.')
        return 1
    os.makedirs(OUT, exist_ok=True)
    for destino, (arq, box, extra) in CORTES.items():
        im = Image.open(os.path.join(SRC, arq)).convert('RGB')
        w, h = im.size
        l, t, r, b = box
        im = im.crop((int(l * w), int(t * h), int(r * w), int(b * h)))
        im = quadro(tratar(im))
        for k, v in (extra or {}).items():
            im = {'sat': ImageEnhance.Color, 'con': ImageEnhance.Contrast,
                  'bri': ImageEnhance.Brightness}[k](im).enhance(v)
        caminho = os.path.join(OUT, destino + '.webp')
        im.save(caminho, 'WEBP', quality=84, method=6)
        print('%-22s %6d KB' % (destino, os.path.getsize(caminho) // 1024))
    return 0

if __name__ == '__main__':
    sys.exit(main())
