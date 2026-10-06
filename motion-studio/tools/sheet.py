"""Monta out/preview.jpg (grade 1/3 da resolução) ou out/board.png (storyboard com título e nota)."""
import json
import sys

from PIL import Image, ImageDraw, ImageFont

mode, out, files = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
first = Image.open(files[0][0])
w0, h0 = first.size
scale = 1 / 3 if mode == 'preview' else (1 / 4 if h0 > w0 else 1 / 3)
w, h = int(w0 * scale), int(h0 * scale)
cols = 8 if mode == 'preview' else 7
cap = 0 if mode == 'preview' else 64
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (w * cols, (h + cap) * rows), (16, 12, 18))
bold = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
reg = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
for i, (path, f, title, note) in enumerate(files):
    im = Image.open(path).convert('RGB').resize((w, h), Image.LANCZOS)
    x, y = (i % cols) * w, (i // cols) * (h + cap)
    sheet.paste(im, (x, y))
    d = ImageDraw.Draw(sheet)
    d.rectangle((x, y, x + 64, y + 24), fill=(255, 255, 255))
    d.text((x + 4, y + 2), f'{f}', fill=(200, 0, 60), font=bold)
    if cap:
        d.text((x + 8, y + h + 6), title, fill=(240, 220, 245), font=bold)
        d.text((x + 8, y + h + 34), note, fill=(180, 160, 190), font=reg)
sheet.save(out, quality=88)
