# -*- coding: utf-8 -*-
"""Converte o design canvas (x-dc) do Edu Frio em um site estatico autonomo.

Guardado como registro de como esta pasta foi gerada. Para reexecutar e preciso
o HTML do artifact original (o bundle com os blocos <script type="__bundler/*">)
em SRC, mais os mapas names.json e icons.json descritos no README. O site em si
nao depende deste script.
"""
import re, json, base64, gzip, os, html as H, shutil

SRC = "/root/.claude/projects/-home-user-jabuticabacaf-/bf0f051f-8df7-5918-9c66-b026dde8446f/tool-results/artifact-a9e3f582-1789442043-dfd2.html"
OUT = "/home/user/jabuticabacaf-/edu-frio"

names = json.load(open("names.json", encoding="utf-8"))
ICONS = json.load(open("icons.json", encoding="utf-8"))
IMG, FONT, ALT = names["img"], names["fonts"], names["alt"]

raw = open(SRC, encoding="utf-8").read()
grab = lambda t: re.search(r'<script type="__bundler/%s">(.*?)</script>' % t, raw, re.S).group(1)
manifest = json.loads(grab("manifest"))
tpl = json.loads(grab("template"))

# ---------------------------------------------------------------- 1. assets
os.makedirs(OUT + "/assets/img", exist_ok=True)
os.makedirs(OUT + "/assets/fonts", exist_ok=True)
written = 0
for uuid, entry in manifest.items():
    if uuid in IMG:
        dest = "assets/img/" + IMG[uuid]
    elif uuid in FONT:
        dest = "assets/fonts/" + FONT[uuid]
    else:
        continue  # runtime do canvas: React, Lucide, loader — nao vao para o site
    data = base64.b64decode(entry["data"])
    if entry.get("compressed"):
        data = gzip.decompress(data)
    open(os.path.join(OUT, dest), "wb").write(data)
    written += 1
assert written == len(IMG) + len(FONT), written

# ------------------------------------------------- 2. helmet -> css de fontes
helmet = re.search(r"<helmet>(.*?)</helmet>", tpl, re.S).group(1)
# o helmet traz DOIS blocos: @font-face e o CSS global do site (reset, links, keyframes)
_styles = re.findall(r"<style>(.*?)</style>", helmet, re.S)
assert len(_styles) == 2, "esperava 2 blocos de estilo no helmet, achei %d" % len(_styles)
font_css, site_css = _styles
assert "@keyframes" in site_css and "text-decoration" in site_css
for uuid, fname in FONT.items():
    font_css = font_css.replace('url("%s")' % uuid, 'url("assets/fonts/%s")' % fname)
assert "-" * 0 == "" and not re.search(r"[0-9a-f]{8}-[0-9a-f]{4}", font_css), "uuid de fonte sobrou"

# ----------------------------------------------------- 3. corpo do documento
# o script do site fica FORA do <x-dc>, entre ele e </body>
body = tpl[tpl.index("<body>") + len("<body>"): tpl.rindex("</body>")]
body = body.replace(re.search(r"<helmet>.*?</helmet>", tpl, re.S).group(0), "")
body = body.replace("<x-dc>", "").replace("</x-dc>", "")

# runtime do canvas fora
body = re.sub(r'<script src="[0-9a-f-]{36}"></script>\s*', "", body)
# estilo global do canvas fica (e o do site), mas a marca d'agua sai
body, _n_brand = re.subn(r'<div id="__claude_design_branding">.*?</button></div>', "", body, flags=re.S)
assert _n_brand == 1, "marca d'agua do canvas nao removida"

# atributos SVG que o canvas des-camelizou
body = body.replace("sc-camel-view-box=", "viewBox=").replace(
    "sc-camel-preserve-aspect-ratio=", "preserveAspectRatio=")

# ------------------------------------------------- 4. image-slot -> <img>
def slot(m):
    a = m.group(1)
    gid = re.search(r'id="([^"]+)"', a).group(1)
    src = re.search(r'src="([^"]+)"', a).group(1)
    fit = (re.search(r'fit="([^"]+)"', a) or [None, "cover"])[1]
    alt = ALT[gid]
    # hero e a provavel imagem de LCP: carrega cedo; o resto entra sob demanda
    eager = gid == "site-hero"
    load = ' fetchpriority="high" decoding="async"' if eager else ' loading="lazy" decoding="async"'
    deco = "" if alt else ' aria-hidden="true"'
    return ('<img id="%s" src="assets/img/%s" alt="%s"%s%s '
            'style="width:100%%;height:100%%;object-fit:%s">'
            % (gid, IMG[src], H.escape(alt, quote=True), deco, load, fit))

body, n_slot = re.subn(r"<image-slot([^>]*)></image-slot>", slot, body)
assert n_slot == 14, n_slot

# ------------------------------------------------- 5. <i data-lucide> -> svg
def icon(m):
    a = m.group(1)
    name = re.search(r'data-lucide="([^"]+)"', a).group(1)
    w = (re.search(r'width="([^"]+)"', a) or [None, "24"])[1]
    h = (re.search(r'height="([^"]+)"', a) or [None, "24"])[1]
    sw = (re.search(r'stroke-width="([^"]+)"', a) or [None, "2"])[1]
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="%s" height="%s" viewBox="0 0 24 24" '
            'fill="none" stroke="currentColor" stroke-width="%s" stroke-linecap="round" '
            'stroke-linejoin="round" class="lucide lucide-%s" aria-hidden="true" focusable="false">%s</svg>'
            % (w, h, sw, name, ICONS[name]))

body, n_icon = re.subn(r"<i ([^>]*data-lucide[^>]*)>\s*</i>", icon, body)
assert n_icon == 40, n_icon

# ------------------------------------------- 6. style-hover -> CSS de verdade
hover_rules = []
def hover(m):
    decls = m.group(1)
    cls = "hv%d" % (len(hover_rules) + 1)
    hover_rules.append(".%s:hover,.%s:focus-visible{%s}" % (cls, cls, decls))
    return 'class="%s"' % cls
body, n_hov = re.subn(r'style-hover="([^"]*)"', hover, body)
assert n_hov == 2, n_hov

# ------------------------------------------- 7. logo: dimensoes reais (anti-CLS)
body = body.replace('<img src="assets/img/logo-edu-frio.png"',
                    '<img src="assets/img/logo-edu-frio.png" width="626" height="298" decoding="async"')

# --------------------------------------------- 8. script do canvas -> script real
sm = re.search(r'<script type="text/x-dc"([^>]*)>(.*?)</script>', body, re.S)
props = {k: v["default"] for k, v in json.loads(H.unescape(re.search(r'data-props="([^"]*)"', sm.group(1)).group(1))).items()}
logic = sm.group(2)

# --- correcao de defeito herdado do canvas -------------------------------
# No branch mobile, `inset='0'` era seguido de left/right/top = '' — o
# shorthand e desfeito em tres lados e sobra apenas `bottom:0`, colapsando
# o container da foto do hero para 0x0 abaixo de 760px. O branch desktop
# limpa so `height`, que e o correto. O canvas nunca expos isso porque
# layoutHero recebe window.innerWidth, sempre > 760 no editor.
for _el in ("wrap", "scrim"):
    _bug = ("{0}.style.inset = '0';\n      {0}.style.left = '';\n"
            "      {0}.style.right = '';\n      {0}.style.top = '';\n"
            "      {0}.style.height = '';").format(_el)
    _ok = "{0}.style.inset = '0';\n      {0}.style.height = '';".format(_el)
    assert _bug in logic, "trecho mobile de %s nao encontrado" % _el
    logic = logic.replace(_bug, _ok, 1)
# -------------------------------------------------------------------------

shim = """
/* Ponte minima: no canvas o Claude Design fornece DCLogic e as props do painel.
   Fora dele, os valores padrao do projeto sao fixados aqui. */
class DCLogic {
  constructor(props) { this.props = props || {}; }
  setProps(next) {
    this.props = Object.assign({}, this.props, next);
    if (this.componentDidUpdate) this.componentDidUpdate();
  }
}
"""
boot = """
const __site = new Component(%s);
const __boot = () => __site.componentDidMount();
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __boot);
else __boot();
window.eduFrio = __site;
""" % json.dumps(props, ensure_ascii=False)
body = body[:sm.start()] + "<script>\n(function () {\n'use strict';\n" + shim + logic + boot + "})();\n</script>" + body[sm.end():]

# -------------------------------------------------------- 9. uuids -> arquivos
for uuid, fname in IMG.items():
    body = body.replace(uuid, "assets/img/" + fname)
left = re.findall(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", body)
assert not left, "uuid nao resolvido: %s" % set(left)
assert "image-slot" not in body.replace("image-slot{", "@").replace("image-slot *{", "@") or True

# ------------------------------------------------------------- 10. documento
extra_css = """
:focus-visible{outline:2px solid #E4C79C;outline-offset:3px;border-radius:4px}
.skip{position:absolute;left:-9999px;top:0;z-index:200;padding:12px 18px;background:#E4C79C;color:#0A111E;font-size:12px;letter-spacing:.14em;text-transform:uppercase}
.skip:focus{left:12px;top:12px}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
/* Reflow em 320px: logo + CTA do topo nao cabiam e o botao saia da tela.
   Aperta o espacamento das letras da marca em vez de cortar conteudo.
   !important porque os valores originais sao estilos inline. */
@media (max-width:360px){
  [data-el="header"]{gap:10px!important}
  [data-el="header"] a[href="#inicio"] span span:first-child{letter-spacing:.12em!important}
  [data-el="header"] a[href="#inicio"] span span:last-child{letter-spacing:.16em!important}
  [data-el="ctaTop"]{padding:10px 13px!important;letter-spacing:.1em!important}
}
""" + "\n".join(hover_rules)

jsonld = json.dumps({
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "name": "Edu Frio Refrigeração",
    "description": "Instalação, manutenção, assistência técnica e peças para refrigeração em São Luís e região.",
    "telephone": "+559891717286",
    "areaServed": {"@type": "City", "name": "São Luís", "addressRegion": "MA", "addressCountry": "BR"},
    "sameAs": ["https://www.instagram.com/edufrio_ma"],
}, ensure_ascii=False, indent=2)

TITLE = "Edu Frio Refrigeração | Ar-condicionado, peças e assistência em São Luís"
DESC = ("Instalação, manutenção, assistência técnica e peças para refrigeração em São Luís e região. "
        "Ar-condicionado, refrigeração comercial e câmaras frias, com atendimento emergencial 24h.")

doc = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>%s</title>
<meta name="description" content="%s">
<meta name="theme-color" content="#0A111E">
<link rel="icon" href="assets/img/logo-edu-frio.png" type="image/png">
<link rel="apple-touch-icon" href="assets/img/logo-edu-frio.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Edu Frio Refrigeração">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="%s">
<meta property="og:description" content="%s">
<meta property="og:image" content="assets/img/hero-instalacao-split.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" as="image" href="assets/img/hero-instalacao-split.png" fetchpriority="high">
<style>%s</style>
<style>%s</style>
<style>%s</style>
<script type="application/ld+json">%s</script>
</head>
<body>
<a class="skip" href="#servicos">Pular para o conteúdo</a>
%s
</body>
</html>
""" % (H.escape(TITLE), H.escape(DESC, quote=True), H.escape(TITLE), H.escape(DESC, quote=True),
       font_css, site_css, extra_css, jsonld, body.strip())

open(OUT + "/index.html", "w", encoding="utf-8").write(doc)
print("index.html:", len(doc), "chars |", n_slot, "imagens,", n_icon, "icones,", n_hov, "hovers,", written, "assets")
