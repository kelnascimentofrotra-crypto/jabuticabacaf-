// Estilo: neon-glow — anúncio de app/serviço em fundo preto com UMA cor de acento em neon (bloom forte),
// texto digitado, ícones em tiles, pílulas 3D, tela dividida e preço com confete.
// Treinado a partir da referência "Full TV Streaming" (WhatsApp Video 2026-10-05, 576x1024, 30 fps, 33 s).
// Regras de linguagem visual em STYLE.md (ler antes de criar cenas).
window.STYLE = {
  name: 'neon-glow',
  w: 1080, h: 1920, fps: 30,
  // medidas na referência: fundo #080808, tons de fundo #180808–#780818, acento #F81808 / #FE321C, brilho do texto #FA4053
  colors: { dark: '#080808', light: '#480808', accent: '#F81808', contrast: '#FFFFFF', card: '#180808' },
  glow: { rgb: '248,24,8', text: '#FA4053', bloom: .9 },   // bloom em textos, tiles, aros e pílulas
  fonts: {
    display: 'Montserrat', mono: 'Montserrat',
    css: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
    files: ['Montserrat.woff2'],
    preload: ['500 40px "Montserrat"', '700 80px "Montserrat"', '800 110px "Montserrat"'],
  },
  // fundo escuro: brilho central pulsando + grade fina; "light" = tela cheia na cor de acento (cartelas de transição)
  bg: {
    dark: {
      blobs: [{ x: 540, y: 960, ax: 40, ay: 80, fx: 1, fy: 1, rx: 760, ry: 760, rgb: '248,24,8', a: .14 }],
      grid: { step: 90, rgb: '248,24,8', a: .06 },
    },
    light: {
      blobs: [
        { x: 540, y: 900, ax: 80, ay: 140, fx: 1, fy: 2, rx: 900, ry: 900, rgb: '255,70,50', a: .55 },
        { x: 540, y: 1700, ax: 120, ay: 60, fx: 2, fy: 1, rx: 800, ry: 500, rgb: '120,8,24', a: .5 },
      ],
    },
  },
  transition: 'zoomblur',
  grain: .03,
  vignette: { amt: .6, rgb: '0,0,0', inner: .35, breathe: .05, cycles: 2 },
  sfx: { transition: { name: 'whoosh', gain: .3, opts: { dur: .4, f0: 600, f1: 4800, peak: .5 } } },
};
