import { esc, img, delay } from '../lib.mjs';
import { benefitList } from './benefits.mjs';

// Camadas "cinematográficas" da hero. Tudo é decorativo (aria-hidden) e para quando
// o visitante pede menos movimento (prefers-reduced-motion).

// Sombra de folhas de palmeira projetada na parede (balança como se houvesse vento).
const frond = ({ x, y, rotate, length, spread = 1 }) => {
  const leaflets = [];
  for (let i = 1; i <= 15; i++) {
    const t = i / 16;
    const px = length * t;
    const py = -Math.sin(t * Math.PI * 0.9) * length * 0.08;
    const len = length * 0.42 * (1 - t * 0.6) * spread;
    const w = len * 0.13;
    for (const side of [-1, 1]) {
      const angle = side * (58 - t * 18);
      leaflets.push(
        `<path transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${angle.toFixed(1)})" d="M0 0Q${(len * 0.45).toFixed(1)} ${(-w).toFixed(1)} ${len.toFixed(1)} 0Q${(len * 0.45).toFixed(1)} ${w.toFixed(1)} 0 0Z"/>`
      );
    }
  }
  const stem = `<path d="M0 0Q${length * 0.5} ${-length * 0.09} ${length} ${-length * 0.03}" fill="none" stroke="currentColor" stroke-width="${(length * 0.012).toFixed(1)}"/>`;
  return `<g transform="translate(${x} ${y}) rotate(${rotate})">${stem}${leaflets.join('')}</g>`;
};

const leafShadow = () => `
  <svg class="hero__leaves" viewBox="0 0 600 500" preserveAspectRatio="xMinYMin slice" aria-hidden="true" focusable="false">
    <g fill="currentColor">${[
      { x: -30, y: 40, rotate: 18, length: 360 },
      { x: -50, y: 150, rotate: 32, length: 300, spread: 1.1 },
      { x: 10, y: -20, rotate: 6, length: 280 },
    ].map(frond).join('')}</g>
  </svg>`;

// Poeira suspensa na luz do sol: posições fixas, geradas de forma determinística.
const dust = (count = 24) => {
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: count }, () => {
    const x = (34 + rnd() * 62).toFixed(1);
    const y = (8 + rnd() * 72).toFixed(1);
    const size = (1.6 + rnd() * 2.8).toFixed(1);
    const dur = (10 + rnd() * 12).toFixed(1);
    const dl = (-rnd() * 20).toFixed(1);
    const dx = (-30 - rnd() * 50).toFixed(0);
    const dy = (-40 - rnd() * 70).toFixed(0);
    return `<span style="--x:${x}%;--y:${y}%;--s:${size}px;--t:${dur}s;--dl:${dl}s;--dx:${dx}px;--dy:${dy}px"></span>`;
  }).join('');
};

// Cada letra de "SMUG" é revelada em sequência (o texto acessível fica no sr-only).
const brandLetters = (word) =>
  [...word].map((ch, i) => `<span class="hero__letter" style="--li:${i}">${esc(ch)}</span>`).join('');

export const hero = ({ hero: h, heroBenefits }) => `
<section class="hero" id="inicio" data-tone="light" aria-labelledby="hero-title" data-anim-scope>
  <div class="hero__bg" aria-hidden="true">
    <div class="hero__bg-layer">
      ${img(h.background, { className: 'hero__bg-img', eager: true, priority: true })}
    </div>
    ${leafShadow()}
    <span class="hero__sun"></span>
    <span class="hero__sweep"></span>
    <div class="hero__dust">${dust()}</div>
  </div>

  <div class="hero__stage">
    <h1 class="hero__brand" id="hero-title">
      <span class="sr-only">${esc(h.brand)} MODAS</span>
      <span class="hero__brand-word" aria-hidden="true">${brandLetters(h.brand)}</span>
    </h1>

    <figure class="hero__figure">
      ${img(h.photo, { className: 'hero__photo', eager: true, priority: true })}
    </figure>

    <p class="hero__tagline">
      ${h.tagline.map((line, i) => `<span class="hero__tagline-line" ${delay(i, 140)}>${esc(line)}</span>`).join(' ')}
      <span class="hero__tagline-rule" aria-hidden="true"></span>
    </p>
  </div>

  <span class="hero__vignette" aria-hidden="true"></span>

  <div class="hero__benefits">
    ${benefitList(heroBenefits, { variant: 'glass', label: 'Vantagens da SMUG MODAS', titleTag: 'p', reveal: false })}
  </div>

  <span class="hero__grain" aria-hidden="true"></span>
  <span class="hero__letterbox" aria-hidden="true"></span>
</section>`;

// Faixa em movimento logo após a hero (texto decorativo repetido; oculto de leitores de tela).
export const marquee = ({ marquee: items }) => {
  const run = items.map((t) => `<span class="marquee__item">${esc(t)}</span><span class="marquee__star">✦</span>`).join('');
  return `
<div class="marquee" aria-hidden="true" data-anim-scope>
  <div class="marquee__track">
    <div class="marquee__run">${run}</div>
    <div class="marquee__run">${run}</div>
  </div>
</div>`;
};
