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
CORTES = {}   # preenchido quando as fotos chegarem

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

def quadro(im, alvo=(1200, 900)):
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
