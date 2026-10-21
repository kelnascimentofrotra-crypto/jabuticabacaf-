#!/usr/bin/env python3
"""Monta o arquivo único geografia-capitulo-12/index.html a partir de src/.

- Embute styles.css e os scripts (media, content, globe, audio, app).
- Embute as texturas do globo como data URI, para o WebGL funcionar mesmo
  abrindo o arquivo direto do computador (file://), sem servidor.
- Opcional: --artifact gera também dist/artifact.html sem <html>/<head>/<body>,
  no formato de página publicada.

Uso: python3 tools/build.py [--artifact]
"""
import base64
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
SCRIPTS = ["media.js", "content.js", "globe.js", "audio.js", "app.js"]
TEXTURES = {"assets/earth-day.jpg": "image/jpeg", "assets/earth-night.jpg": "image/jpeg", "assets/earth-water.png": "image/png"}


def data_uri(path, mime):
    return f"data:{mime};base64," + base64.b64encode((SRC / path).read_bytes()).decode("ascii")


def build():
    html = (SRC / "index.html").read_text(encoding="utf-8")
    css = (SRC / "styles.css").read_text(encoding="utf-8")
    assert "</style" not in css
    html = html.replace('<link rel="stylesheet" href="styles.css">', "<style>\n" + css + "\n</style>")
    for name in SCRIPTS:
        js = (SRC / name).read_text(encoding="utf-8")
        assert "</script" not in js, name
        tag = f'<script src="{name}"></script>'
        assert tag in html, tag
        html = html.replace(tag, f"<script>\n/* ===== {name} ===== */\n" + js + "\n</script>")
    for path, mime in TEXTURES.items():
        assert f'"{path}"' in html, path
        html = html.replace(f'"{path}"', '"' + data_uri(path, mime) + '"')
    out = ROOT / "index.html"
    out.write_text(html, encoding="utf-8")
    print(f"index.html: {out.stat().st_size / 1024:.0f} KB")
    if "--artifact" in sys.argv:
        dist = ROOT / "dist"
        dist.mkdir(exist_ok=True)
        head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
        head = re.sub(r'<meta charset="utf-8">\s*', "", head)
        head = re.sub(r'<meta name="viewport"[^>]*>\s*', "", head)
        body = re.search(r"<body([^>]*)>(.*)</body>", html, re.S)
        attrs = body.group(1)
        # o esqueleto da página publicada fornece <body>; aplicamos os atributos por script
        cls = re.search(r'class="([^"]*)"', attrs).group(1)
        mood = re.search(r'data-mood="([^"]*)"', attrs).group(1)
        boot = f'<script>document.body.className="{cls}";document.body.dataset.mood="{mood}";</script>\n'
        art = head.strip() + "\n" + boot + body.group(2)
        (dist / "artifact.html").write_text(art, encoding="utf-8")
        print(f"dist/artifact.html: {(dist / 'artifact.html').stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    build()
