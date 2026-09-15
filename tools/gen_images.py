#!/usr/bin/env python3
"""
Gerador das imagens da landing page (assets/img).

Tudo e renderizado aqui: ruido fBm + shading (difusa/especular/fresnel) +
profundidade de campo + grading quente. Rode:

    python3 tools/gen_images.py

Para usar fotografia real, substitua os arquivos em assets/img mantendo os
mesmos nomes e proporcoes - o HTML/CSS nao precisa de nenhuma alteracao.
"""
import math, os
import numpy as np
from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "img")
os.makedirs(OUT, exist_ok=True)


# ---------------------------------------------------------------- utilidades

def rng(seed):
    return np.random.default_rng(seed)


def _box1d(a, r, axis):
    a = np.moveaxis(a, axis, 0)
    pad = np.pad(a, [(r + 1, r)] + [(0, 0)] * (a.ndim - 1), mode="edge")
    c = np.cumsum(pad, axis=0, dtype=np.float32)
    out = (c[2 * r + 1:] - c[:-(2 * r + 1)]) / np.float32(2 * r + 1)
    return np.moveaxis(out, 0, axis)


def blur(a, radius, passes=3):
    """Gaussiana aproximada (3 box blurs) em float - sem perda de precisao."""
    if radius <= 0:
        return a
    r = max(1, int(round(radius * 0.62)))
    out = np.asarray(a, np.float32)
    for _ in range(passes):
        out = _box1d(out, r, 0)
        out = _box1d(out, r, 1)
    return out


def smooth_noise(h, w, cells, seed):
    """Value noise em float, interpolação quíntica (suave e sem banding)."""
    c = max(2, int(cells))
    g = rng(seed).random((c + 1, c + 1)).astype(np.float32)
    yi = np.linspace(0, c, h, dtype=np.float32)
    xi = np.linspace(0, c, w, dtype=np.float32)
    y0 = np.floor(yi).astype(np.int32); x0 = np.floor(xi).astype(np.int32)
    y1 = np.minimum(y0 + 1, c); x1 = np.minimum(x0 + 1, c)
    ty = (yi - y0)[:, None]; tx = (xi - x0)[None, :]
    ty = ty * ty * ty * (ty * (ty * 6 - 15) + 10)
    tx = tx * tx * tx * (tx * (tx * 6 - 15) + 10)
    a = g[np.ix_(y0, x0)]; b = g[np.ix_(y0, x1)]
    c2 = g[np.ix_(y1, x0)]; d = g[np.ix_(y1, x1)]
    top = a + (b - a) * tx
    bot = c2 + (d - c2) * tx
    return top + (bot - top) * ty


def fbm(h, w, octaves=6, cells=4, seed=1, gain=0.5, lac=2.0):
    total = np.zeros((h, w), np.float32)
    amp, norm, c = 1.0, 0.0, cells
    for i in range(octaves):
        total += amp * smooth_noise(h, w, int(round(c)), seed + i * 977)
        norm += amp
        amp *= gain
        c *= lac
    return total / norm


def normalize(v):
    return v / (np.sqrt((v * v).sum(-1, keepdims=True)) + 1e-9)


def normals(height, strength=1.0):
    gy, gx = np.gradient(height.astype(np.float32))
    return normalize(np.stack([-gx * strength, -gy * strength, np.ones_like(height)], -1))


def ramp(t, stops):
    t = np.clip(t, 0, 1)
    out = np.zeros(t.shape + (3,), np.float32)
    for i in range(len(stops) - 1):
        p0, c0 = stops[i]
        p1, c1 = stops[i + 1]
        m = (t >= p0) & (t <= p1)
        if not m.any():
            continue
        k = ((t[m] - p0) / max(1e-6, p1 - p0))[:, None]
        out[m] = np.array(c0, np.float32) * (1 - k) + np.array(c1, np.float32) * k
    out[t < stops[0][0]] = np.array(stops[0][1], np.float32)
    out[t > stops[-1][0]] = np.array(stops[-1][1], np.float32)
    return out


def vignette(shape, amount=0.35, softness=1.25, cx=0.5, cy=0.5):
    h, w = shape
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt((x / w - cx) ** 2 + ((y / h - cy) * 0.95) ** 2) / 0.72
    return (1.0 - amount * np.clip(d, 0, 1.6) ** softness)[..., None]


def bloom(img, thr=0.72, radius=26, amount=0.30):
    lum = img.max(-1)
    hi = np.clip((lum - thr) / (1 - thr + 1e-6), 0, 1)[..., None] * img
    return np.clip(img + blur(hi, radius) * amount, 0, 1)


def grade(img, warm=1.0, contrast=1.06, lift=0.015, grain=0.012, seed=7):
    img = np.clip(img, 0, 1)
    img = (img - 0.5) * contrast + 0.5
    img = img + lift * (1 - img)
    img = img * np.array([1.0 + 0.030 * warm, 1.0 + 0.003 * warm, 1.0 - 0.028 * warm], np.float32)
    img = np.clip(img, 0, 1) ** (1 / 1.02)
    g = blur(rng(seed).normal(0, 1, img.shape[:2]).astype(np.float32), 0.7)
    return np.clip(img + g[..., None] * grain * 2.2, 0, 1)


def save(img, name, quality=82):
    arr = (np.clip(img, 0, 1) * 255).astype(np.uint8)
    p = os.path.join(OUT, name)
    Image.fromarray(arr, "RGB").save(p, quality=quality, optimize=True, progressive=True)
    print("  %-26s %-12s %5.0f KB" % (name, "x".join(map(str, Image.open(p).size)),
                                      os.path.getsize(p) / 1024))


# ------------------------------------------------------------------ paletas

CHOCO = [(0.00, (0.055, 0.028, 0.020)), (0.35, (0.150, 0.075, 0.045)),
         (0.62, (0.310, 0.160, 0.086)), (0.84, (0.520, 0.300, 0.150)),
         (1.00, (0.760, 0.520, 0.300))]
CARAMEL = [(0.00, (0.200, 0.100, 0.045)), (0.32, (0.450, 0.235, 0.092)),
           (0.60, (0.730, 0.440, 0.175)), (0.84, (0.905, 0.650, 0.310)),
           (1.00, (0.990, 0.860, 0.620))]
CREAM = [(0.00, (0.430, 0.345, 0.270)), (0.30, (0.720, 0.630, 0.520)),
         (0.60, (0.895, 0.835, 0.740)), (0.85, (0.975, 0.945, 0.890)),
         (1.00, (1.000, 0.990, 0.960))]
COCOA = [(0.00, (0.085, 0.052, 0.040)), (0.42, (0.245, 0.155, 0.108)),
         (0.74, (0.430, 0.295, 0.200)), (1.00, (0.660, 0.500, 0.360))]


# ------------------------------------------------------------- superficies

def surface(h, w, palette, seed=3, warp=28.0, octaves=7, cells=3,
            spec_power=48, spec_amt=0.85, light=(-0.42, -0.62, 0.66),
            bump=90.0, gloss_noise=0.0):
    base = fbm(h, w, octaves, cells, seed)
    wx = fbm(h, w, 4, cells + 1, seed + 501) - 0.5
    wy = fbm(h, w, 4, cells + 1, seed + 907) - 0.5
    y, x = np.mgrid[0:h, 0:w]
    xs = np.clip(x + wx * warp, 0, w - 1).astype(np.int32)
    ys = np.clip(y + wy * warp, 0, h - 1).astype(np.int32)
    height = blur(base[ys, xs], 0.8)

    N = normals(height * bump)
    L = normalize(np.array(light, np.float32))
    H = normalize(L + np.array([0, 0, 1], np.float32))
    diff = np.clip((N * L).sum(-1), 0, 1)
    spec = np.clip((N * H).sum(-1), 0, 1) ** spec_power
    if gloss_noise:
        spec = spec * (0.6 + gloss_noise * fbm(h, w, 4, 40, seed + 31))
    fres = (1 - np.clip(N[..., 2], 0, 1)) ** 3

    t = np.clip(0.18 + 0.72 * diff + 0.30 * (height - 0.5), 0, 1)
    col = ramp(t, palette)
    col = col + spec[..., None] * spec_amt * np.array([1.0, 0.93, 0.82], np.float32)
    col = col + fres[..., None] * 0.10 * np.array([1.0, 0.86, 0.70], np.float32)
    return np.clip(col, 0, 1), height


# ------------------------------------------------------------------ esferas

def dot_field(hh, ww, dot_r, seed, density=0.85):
    """Campo de granulado: impulsos aleatorios desfocados viram bolinhas."""
    n = max(8, int(density * (hh * ww) / (math.pi * dot_r * dot_r)))
    r = rng(seed)
    f = np.zeros((hh, ww), np.float32)
    ys = r.integers(0, hh, n)
    xs = np.clip((r.random(n) * ww).astype(np.int32), 0, ww - 1)
    np.add.at(f, (ys, xs), r.uniform(0.55, 1.0, n).astype(np.float32))
    f = blur(f, dot_r * 0.52)
    return f / (f.max() + 1e-6)


def render_spheres(h, w, spheres, bg, seed=11, light=(-0.46, -0.62, 0.62)):
    img = bg.copy()
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    order = sorted(spheres, key=lambda s: s["y"])

    for s in order:                                    # sombras de contato
        cx, cy, r = s["x"], s["y"], s["r"]
        sh = np.exp(-(((x - cx - r * 0.20) / (r * 1.28)) ** 2 +
                      ((y - cy - r * 0.88) / (r * 0.40)) ** 2))
        sh = blur(sh, max(3.0, r * 0.14))
        img = img * (1 - 0.55 * s.get("shadow", 1.0) * sh[..., None])

    L = normalize(np.array(light, np.float32))
    V = np.array([0, 0, 1], np.float32)
    H = normalize(L + V)
    L2 = normalize(np.array([0.78, -0.05, 0.40], np.float32))     # fill quente
    L3 = normalize(np.array([0.25, 0.60, -0.62], np.float32))     # rim

    for i, s in enumerate(order):
        cx, cy, r = float(s["x"]), float(s["y"]), float(s["r"])
        pad = int(r * 1.15) + 4
        x0, x1 = max(0, int(cx - pad)), min(w, int(cx + pad))
        y0, y1 = max(0, int(cy - pad)), min(h, int(cy + pad))
        if x1 <= x0 or y1 <= y0:
            continue
        hh, ww = y1 - y0, x1 - x0
        ly, lx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
        dx, dy = (lx - cx) / r, (ly - cy) / r
        d2 = dx * dx + dy * dy
        nz = np.sqrt(np.clip(1 - d2, 0, 1))
        N = np.stack([dx, dy, nz], -1)
        alpha = np.clip((1.0 - np.sqrt(d2)) * r / 1.4, 0, 1)

        gran = s.get("gran", 1.0)
        if gran > 0:
            dr = max(1.6, r * s.get("dot", 0.052))
            dots = dot_field(hh, ww, dr, seed + i * 313 + 7)
            dn = normals(dots * (dr * 2.6) * gran)
            N = normalize(N + np.stack([dn[..., 0], dn[..., 1], np.zeros_like(dots)], -1) * 0.85)
            ao = 0.62 + 0.55 * dots
        else:
            ao = np.ones((hh, ww), np.float32)

        tone = 0.90 + 0.22 * fbm(hh, ww, 3, 4, seed + i * 71)
        base = np.array(s.get("color", (0.185, 0.090, 0.055)), np.float32)[None, None, :] * tone[..., None]

        diff = np.clip(((N * L).sum(-1) + 0.24) / 1.24, 0, 1) ** 1.05
        fill = np.clip((N * L2).sum(-1), 0, 1)
        rim = np.clip((N * L3).sum(-1), 0, 1) ** 2.4
        hdot = np.clip((N * H).sum(-1), 0, 1)
        spec_broad = hdot ** s.get("shine", 36)
        spec_tight = hdot ** 420
        fres = (1 - np.clip(nz, 0, 1)) ** 3.2

        col = base * (0.10 + 1.02 * diff[..., None]) * ao[..., None]
        col = col + base * fill[..., None] * 0.50 * np.array([1.30, 1.04, 0.80], np.float32)
        col = col + rim[..., None] * np.array([0.42, 0.28, 0.16], np.float32) * s.get("rim", 1.0)
        col = col + (spec_broad * 0.42 + spec_tight * 1.15)[..., None] * s.get("spec", 0.85) \
            * np.array([1.0, 0.95, 0.86], np.float32) * ao[..., None]
        col = col + fres[..., None] * 0.07 * np.array([1.0, 0.85, 0.66], np.float32)
        col = col * (1 - 0.30 * np.clip(dy, 0, 1)[..., None] ** 2)   # oclusao inferior

        br = s.get("blur", 0.0)
        if br:
            col = blur(col, br)
            alpha = blur(alpha, br * 0.85)
        a = alpha[..., None]
        img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - a) + np.clip(col, 0, 1) * a
    return img


def bokeh_bg(h, w, top, bot, n=30, seed=5, scale=1.0, inten=(0.05, 0.16)):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    g = (y / h)[..., None]
    img = np.array(top, np.float32)[None, None, :] * (1 - g) + \
          np.array(bot, np.float32)[None, None, :] * g + np.zeros((h, w, 3), np.float32)
    r = rng(seed)
    light = np.zeros((h, w), np.float32)
    for _ in range(n):
        cx, cy = r.uniform(-0.08, 1.08) * w, r.uniform(-0.08, 0.95) * h
        rad = r.uniform(0.04, 0.17) * min(h, w) * scale
        d = np.sqrt(((x - cx) / rad) ** 2 + ((y - cy) / rad) ** 2)
        disc = np.clip(1.0 - d, 0, 1) ** 0.45
        light += disc * (0.72 + 0.50 * np.clip(d, 0, 1) ** 5) * r.uniform(*inten)
    light = blur(light, 5)
    img = 1 - (1 - img) * (1 - light[..., None] * np.array([1.0, 0.82, 0.58], np.float32))
    return np.clip(blur(img, 2.5), 0, 1)


def table(h, w, horizon=0.54, top=(0.90, 0.855, 0.790), bot=(0.66, 0.575, 0.480), seed=9):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    t = np.clip((y / h - horizon) / (1 - horizon), 0, 1)
    col = np.array(top, np.float32)[None, None, :] * (1 - t[..., None]) + \
          np.array(bot, np.float32)[None, None, :] * t[..., None]
    col = col * (1 + (fbm(h, w, 5, 6, seed) - 0.5)[..., None] * 0.12)
    col = col * (1 + (fbm(h, w, 2, 240, seed + 77) - 0.5)[..., None] * 0.06)
    mask = np.clip((y / h - horizon) * 30, 0, 1)[..., None]
    return np.clip(col, 0, 1), mask


def sparkles(img, n=60, seed=4, size=(1.0, 4.0), inten=(0.10, 0.45),
             tint=(1.0, 0.86, 0.62), band=(0.0, 1.0)):
    h, w = img.shape[:2]
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    r = rng(seed)
    add = np.zeros((h, w), np.float32)
    for _ in range(n):
        cx, cy = r.uniform(0, 1) * w, r.uniform(band[0], band[1]) * h
        rad = r.uniform(*size) * (min(h, w) / 900.0)
        add += r.uniform(*inten) * np.exp(-(((x - cx) / rad) ** 2 + ((y - cy) / rad) ** 2))
    add = add + blur(add, 10) * 0.5
    return np.clip(img + add[..., None] * np.array(tint, np.float32), 0, 1)


def crumbs(h, w, img, n, seed, band, rmin, rmax, blur_max=0.0):
    r = rng(seed)
    sp = []
    for _ in range(n):
        sp.append(dict(x=r.uniform(0.02, 0.98) * w,
                       y=r.uniform(*band) * h,
                       r=r.uniform(rmin, rmax) * min(h, w) / 900.0,
                       gran=0.0, shine=60, spec=0.9, shadow=0.55,
                       blur=r.uniform(0, blur_max) if blur_max else 0.0,
                       color=(0.16, 0.078, 0.048)))
    return render_spheres(h, w, sp, img, seed=seed + 5)


def depth_blur(img, focus=(0.55, 0.85), max_blur=16):
    h = img.shape[0]
    y = (np.arange(h, dtype=np.float32) / h)[:, None]
    d = np.maximum(focus[0] - y, y - focus[1])
    m = np.clip(d / 0.42, 0, 1) ** 1.25
    return img * (1 - m[..., None]) + blur(img, max_blur) * m[..., None]


# -------------------------------------------------------------------- cenas

def scene_hero(h=1700, w=1360):
    bg = bokeh_bg(h, w, (0.820, 0.752, 0.660), (0.615, 0.512, 0.408),
                  n=30, seed=21, scale=1.25, inten=(0.05, 0.19))
    tb, tm = table(h, w, horizon=0.44, top=(0.818, 0.760, 0.682),
                   bot=(0.545, 0.455, 0.365), seed=12)
    img = bg * (1 - tm) + tb * tm
    img = blur(img, 10)

    base = int(h * 0.62)
    sp = [
        dict(x=w * 0.18, y=base - h * 0.130, r=w * 0.115, blur=6.0, gran=0.8, shadow=0.55),
        dict(x=w * 0.83, y=base - h * 0.150, r=w * 0.100, blur=8.0, gran=0.8, shadow=0.5),
        dict(x=w * 0.24, y=base + h * 0.090, r=w * 0.190, gran=1.0, shine=34, spec=0.85,
             blur=1.2),
        dict(x=w * 0.77, y=base + h * 0.120, r=w * 0.205, gran=1.0, shine=30, spec=0.80,
             blur=1.6, color=(0.170, 0.082, 0.050)),
        dict(x=w * 0.50, y=base - h * 0.030, r=w * 0.240, gran=1.05, shine=40, spec=1.0,
             color=(0.200, 0.098, 0.060)),
    ]
    img = render_spheres(h, w, sp, img, seed=31)
    img = crumbs(h, w, img, 30, 44, (0.76, 0.97), 3.0, 8.0, blur_max=2.0)
    img = sparkles(img, n=40, seed=8, band=(0.05, 0.52), inten=(0.05, 0.20))
    img = sparkles(img, n=20, seed=19, size=(0.6, 1.5), inten=(0.18, 0.60), band=(0.55, 0.95))
    img = depth_blur(img, focus=(0.42, 0.88), max_blur=13)
    img = bloom(img, 0.80, 30, 0.22)
    img = img * vignette((h, w), 0.30, 1.3, 0.5, 0.50)
    return grade(img, 1.05, 1.06, 0.015, 0.011, 3)


def scene_ganache(h=1250, w=1900):
    col, _ = surface(h, w, CHOCO, seed=23, warp=46, octaves=7, cells=3,
                     spec_power=60, spec_amt=0.95, bump=120, gloss_noise=0.5)
    col = sparkles(col, n=30, seed=12, size=(0.8, 2.2), inten=(0.12, 0.45))
    col = bloom(col, 0.66, 24, 0.36)
    col = depth_blur(col, focus=(0.30, 0.74), max_blur=15)
    col = col * vignette((h, w), 0.46, 1.25)
    return grade(col, 1.15, 1.10, 0.012, 0.011, 5)


def scene_caramel(h=1500, w=1200):
    col, _ = surface(h, w, CARAMEL, seed=44, warp=62, octaves=6, cells=2,
                     spec_power=34, spec_amt=0.72, bump=95, gloss_noise=0.35)
    col = bloom(col, 0.72, 22, 0.30)
    col = depth_blur(col, focus=(0.26, 0.78), max_blur=12)
    col = col * vignette((h, w), 0.38, 1.2)
    return grade(col, 1.05, 1.06, 0.018, 0.011, 9)


def scene_cream(h=1700, w=1360):
    """Creme batido / merengue: relevo forte, brilho suave."""
    col, _ = surface(h, w, CREAM, seed=61, warp=58, octaves=6, cells=2,
                     spec_power=16, spec_amt=0.26, bump=150,
                     light=(-0.54, -0.60, 0.58))
    col = col * 0.88
    col = sparkles(col, n=22, seed=27, size=(0.6, 1.5), inten=(0.06, 0.22),
                   tint=(1.0, 0.94, 0.84))
    col = depth_blur(col, focus=(0.26, 0.70), max_blur=18)
    col = bloom(col, 0.90, 16, 0.12)
    col = col * vignette((h, w), 0.46, 1.30)
    return grade(col, 0.95, 1.07, 0.012, 0.010, 13)


def scene_cocoa(h=1400, w=1120):
    col, _ = surface(h, w, COCOA, seed=77, warp=16, octaves=8, cells=5,
                     spec_power=90, spec_amt=0.32, bump=160, gloss_noise=0.8)
    col = sparkles(col, n=70, seed=31, size=(0.5, 1.5), inten=(0.10, 0.45))
    col = col * vignette((h, w), 0.44, 1.2)
    return grade(col, 1.10, 1.08, 0.012, 0.012, 17)


def scene_mesa(h=1400, w=2400):
    bg = bokeh_bg(h, w, (0.900, 0.850, 0.780), (0.645, 0.545, 0.445),
                  n=30, seed=51, scale=1.25, inten=(0.06, 0.20))
    tb, tm = table(h, w, horizon=0.44, top=(0.855, 0.800, 0.730),
                   bot=(0.545, 0.455, 0.365), seed=18)
    img = bg * (1 - tm) + tb * tm
    img = blur(img, 8)
    r = rng(99)
    sp = []
    for i in range(3):                                   # fundo desfocado
        sp.append(dict(x=w * (0.18 + 0.30 * i + r.uniform(-0.04, 0.04)),
                       y=h * (0.50 + r.uniform(-0.02, 0.03)),
                       r=w * r.uniform(0.026, 0.040), blur=7.0, gran=0.7, shadow=0.45))
    groups = [(0.17, 0.66, 0.060), (0.34, 0.74, 0.048), (0.52, 0.64, 0.068),
              (0.70, 0.76, 0.050), (0.86, 0.68, 0.044)]
    for gx, gy, gr in groups:
        for k in range(r.integers(2, 4)):
            sp.append(dict(x=w * (gx + r.uniform(-0.035, 0.035)),
                           y=h * (gy + r.uniform(-0.05, 0.05)),
                           r=w * gr * r.uniform(0.62, 1.0),
                           gran=1.0, shine=36, spec=0.85,
                           blur=r.uniform(0, 1.8)))
    img = render_spheres(h, w, sp, img, seed=57)
    img = crumbs(h, w, img, 40, 61, (0.78, 0.98), 2.5, 7.0, blur_max=2.5)
    img = sparkles(img, n=60, seed=23, band=(0.02, 0.50), inten=(0.06, 0.24))
    img = depth_blur(img, focus=(0.48, 0.92), max_blur=15)
    img = bloom(img, 0.74, 34, 0.28)
    img = img * vignette((h, w), 0.42, 1.25, 0.5, 0.50)
    return grade(img, 1.05, 1.06, 0.015, 0.010, 21)


def scene_desejo(h=1500, w=1900):
    bg = bokeh_bg(h, w, (0.965, 0.940, 0.895), (0.845, 0.775, 0.690),
                  n=16, seed=71, scale=1.8, inten=(0.04, 0.12))
    tb, tm = table(h, w, horizon=0.56, top=(0.945, 0.915, 0.865),
                   bot=(0.780, 0.705, 0.615), seed=33)
    img = bg * (1 - tm) + tb * tm
    img = blur(img, 9)
    sp = [
        dict(x=w * 0.175, y=h * 0.50, r=h * 0.068, blur=6, gran=0.75, shadow=0.45),
        dict(x=w * 0.845, y=h * 0.48, r=h * 0.060, blur=7, gran=0.75, shadow=0.4),
        dict(x=w * 0.50, y=h * 0.585, r=h * 0.265, gran=1.05, shine=38, spec=1.05,
             color=(0.205, 0.100, 0.060)),
        dict(x=w * 0.285, y=h * 0.775, r=h * 0.120, gran=1.0, shine=34, spec=0.85, blur=1.4),
        dict(x=w * 0.715, y=h * 0.795, r=h * 0.130, gran=1.0, shine=32, spec=0.85, blur=1.8),
    ]
    img = render_spheres(h, w, sp, img, seed=83)
    img = crumbs(h, w, img, 30, 91, (0.86, 0.99), 2.5, 7.0, blur_max=2.2)
    img = sparkles(img, n=50, seed=29, band=(0.02, 0.55), inten=(0.05, 0.22))
    img = depth_blur(img, focus=(0.40, 0.94), max_blur=12)
    img = bloom(img, 0.80, 28, 0.24)
    img = img * vignette((h, w), 0.24, 1.2)
    return grade(img, 0.95, 1.05, 0.020, 0.010, 37)


def scene_teresina(h=1200, w=1900):
    """Fim de tarde quente - pano de fundo sutil para a secao de localizacao."""
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    t = (y / h)[..., None]
    img = np.array([0.975, 0.940, 0.885], np.float32)[None, None, :] * (1 - t) + \
          np.array([0.820, 0.730, 0.620], np.float32)[None, None, :] * t
    img = img + np.zeros((h, w, 3), np.float32)
    sun = np.exp(-(((x - w * 0.68) / (w * 0.26)) ** 2 + ((y - h * 0.30) / (h * 0.30)) ** 2))
    img += sun[..., None] * np.array([0.20, 0.13, 0.05], np.float32)
    img += (fbm(h, w, 5, 4, 91) - 0.5)[..., None] * 0.06
    band = np.clip((y / h - 0.66) * 7, 0, 1)[..., None]
    img = img * (1 - band * 0.16)
    img = sparkles(img, n=40, seed=53, size=(1.2, 4.0), inten=(0.04, 0.16), band=(0.05, 0.75))
    img = img * vignette((h, w), 0.26, 1.2)
    return grade(img, 1.05, 1.03, 0.025, 0.009, 41)


# ---------------------------------------------------------------- variacoes

def crop_to(img, ratio, cx=0.5, cy=0.5, zoom=1.0):
    h, w = img.shape[:2]
    tw, th = w, int(round(w / ratio))
    if th > h:
        th, tw = h, int(round(h * ratio))
    tw, th = max(8, int(tw / zoom)), max(8, int(th / zoom))
    x0 = int(np.clip(cx * w - tw / 2, 0, w - tw))
    y0 = int(np.clip(cy * h - th / 2, 0, h - th))
    return img[y0:y0 + th, x0:x0 + tw]


def resize(img, w):
    h = int(round(img.shape[0] * w / img.shape[1]))
    im = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8), "RGB")
    return np.asarray(im.resize((w, h), Image.LANCZOS), np.float32) / 255.0


def main():
    print("renderizando…")
    hero = scene_hero();     save(resize(hero, 1200), "hero-doce.jpg", 82)
    gan = scene_ganache();   save(resize(gan, 1700), "macro-chocolate.jpg", 78)
    cre = scene_cream();     save(resize(cre, 1100), "preparo-creme.jpg", 80)
    car = scene_caramel()
    coc = scene_cocoa()
    mesa = scene_mesa();     save(resize(mesa, 2400), "mesa-cinematica.jpg", 76)
    des = scene_desejo();    save(resize(des, 1600), "desejo.jpg", 80)
    ter = scene_teresina();  save(resize(ter, 1500), "teresina.jpg", 78)

    save(resize(crop_to(gan, 0.8, 0.46, 0.50, 1.05), 760), "esp-bolos.jpg", 80)
    save(resize(crop_to(hero, 0.8, 0.50, 0.66, 1.40), 760), "esp-brigadeiros.jpg", 80)
    save(resize(crop_to(car, 0.8, 0.50, 0.50, 1.15), 760), "esp-doces.jpg", 80)
    save(resize(crop_to(mesa, 0.8, 0.36, 0.64, 1.60), 760), "esp-kits.jpg", 80)
    save(resize(crop_to(cre, 0.8, 0.50, 0.45, 1.20), 760), "esp-encomendas.jpg", 80)

    save(resize(crop_to(des, 0.75, 0.50, 0.58, 1.50), 660), "oc-aniversarios.jpg", 80)
    save(resize(crop_to(cre, 0.75, 0.42, 0.40, 1.45), 660), "oc-casamentos.jpg", 80)
    save(resize(crop_to(car, 0.75, 0.58, 0.55, 1.40), 660), "oc-cafe.jpg", 80)
    save(resize(crop_to(coc, 0.75, 0.50, 0.50, 1.25), 660), "oc-presentes.jpg", 80)
    save(resize(crop_to(gan, 0.75, 0.72, 0.52, 1.25), 660), "oc-datas.jpg", 80)
    save(resize(crop_to(mesa, 0.75, 0.66, 0.62, 1.80), 660), "oc-eventos.jpg", 80)

    save(resize(crop_to(mesa, 1.91, 0.50, 0.54, 1.0), 1200), "og-cover.jpg", 80)
    print("ok ->", OUT)


if __name__ == "__main__":
    main()
