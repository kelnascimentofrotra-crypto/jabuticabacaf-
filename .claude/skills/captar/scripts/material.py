"""Ferramentas de coleta de material do prospect (identidade visual, fotos, vídeos).

Uso:
  python material.py baixar <url> <arquivo>          baixa imagem (CDN do Instagram/Google)
  python material.py paleta <imagem> [n]             cores dominantes da logo, em hex
  python material.py reel <url_do_reel> <pasta>      baixa o reel (yt-dlp) e prepara pra web
  python material.py video <arquivo.mp4> <pasta>     prepara um vídeo já baixado pra web

"Preparar pra web" = até 15 s, 540 px de largura, H.264, sem áudio (autoplay
mudo), faststart, e um poster .jpg tirado do vídeo. Os frames limpos de vídeo
servem como foto no site. Reel de 70 s em 720p dava 12 MB — pesado demais pra
página aberta no 4G.
"""
import subprocess
import sys
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"


def baixar(url, destino):
    destino = Path(destino)
    destino.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        destino.write_bytes(r.read())
    print(f"{destino}  {destino.stat().st_size // 1024} KB")


def paleta(imagem, n=6):
    from PIL import Image

    img = Image.open(imagem).convert("RGBA")
    img.thumbnail((200, 200))
    fundo = Image.new("RGBA", img.size, (255, 255, 255, 255))
    img = Image.alpha_composite(fundo, img).convert("RGB")
    q = img.quantize(colors=n, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()
    contagem = sorted(q.getcolors(), reverse=True)
    total = sum(c for c, _ in contagem)
    for c, i in contagem:
        r, g, b = pal[i * 3 : i * 3 + 3]
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        tag = "quase branco" if lum > 235 else "quase preto" if lum < 25 else ""
        print(f"#{r:02X}{g:02X}{b:02X}  {100 * c / total:5.1f}%  {tag}")


def video(arquivo, pasta):
    arquivo, pasta = Path(arquivo), Path(pasta)
    pasta.mkdir(parents=True, exist_ok=True)
    nome = arquivo.stem.removesuffix("-orig")
    saida = pasta / f"{nome}.mp4"
    poster = pasta / f"{nome}-poster.jpg"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(arquivo), "-t", "15",
         "-vf", "scale='min(540,iw)':-2", "-c:v", "libx264", "-crf", "30",
         "-preset", "slow", "-an", "-movflags", "+faststart", str(saida)],
        check=True,
    )
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-ss", "1", "-i", str(saida),
         "-frames:v", "1", "-q:v", "3", str(poster)],
        check=True,
    )
    print(f"{saida}  {saida.stat().st_size // 1024} KB")
    print(f"{poster}")


def reel(url, pasta):
    pasta = Path(pasta)
    pasta.mkdir(parents=True, exist_ok=True)
    molde = str(pasta / "reel-%(id)s-orig.%(ext)s")
    subprocess.run(["yt-dlp", "-q", "--no-warnings", "-f", "mp4/best", "-o", molde, url], check=True)
    for orig in pasta.glob("reel-*-orig.mp4"):
        video(orig, pasta)
        orig.unlink()


if __name__ == "__main__":
    cmd, *args = sys.argv[1:] or ["-h"]
    if cmd == "baixar":
        baixar(*args)
    elif cmd == "paleta":
        paleta(args[0], int(args[1]) if len(args) > 1 else 6)
    elif cmd == "video":
        video(*args)
    elif cmd == "reel":
        reel(*args)
    else:
        print(__doc__)
