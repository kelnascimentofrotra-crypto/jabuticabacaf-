import { esc, icon, img, delay } from '../lib.mjs';
import { benefitList } from './benefits.mjs';

// Gera uma folha de palmeira em SVG (usada como sombra desfocada no fundo creme).
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

const leaves = (id, fronds, viewBox) => `
  <svg class="hero__leaves hero__leaves--${id}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <g fill="currentColor">${fronds.map(frond).join('')}</g>
  </svg>`;

export const hero = ({ hero: h, heroBenefits }) => `
<section class="hero" id="inicio" data-tone="light" aria-labelledby="hero-title">
  <div class="hero__bg" aria-hidden="true">
    <span class="hero__glow"></span>
    <span class="hero__beams"></span>
    ${leaves('left', [
      { x: -40, y: 260, rotate: -28, length: 330 },
      { x: -60, y: 520, rotate: -8, length: 300, spread: 1.1 },
      { x: -30, y: 760, rotate: -38, length: 260 },
    ], '0 0 320 900')}
    ${leaves('right', [
      { x: 360, y: 120, rotate: 150, length: 300 },
      { x: 380, y: 520, rotate: 170, length: 280, spread: 1.1 },
    ], '0 0 360 900')}
  </div>

  <div class="hero__stage">
    <h1 class="hero__brand" id="hero-title">
      <span class="hero__brand-word anim-in" ${delay(1, 120)}>${esc(h.brand)}</span><span class="sr-only"> MODAS</span>
    </h1>

    <figure class="hero__figure anim-in anim-in--rise" ${delay(2, 120)}>
      ${img(h.photo, { className: 'hero__photo', eager: true, priority: true })}
    </figure>

    <p class="hero__tagline anim-in" ${delay(4, 120)}>
      ${h.tagline.map((line) => `<span>${esc(line)}</span>`).join(' ')}
      <span class="hero__tagline-rule" aria-hidden="true"></span>
    </p>

    <div class="hero__intro anim-in" ${delay(3, 120)}>
      <p class="eyebrow eyebrow--wine">SMUG MODAS</p>
      <p class="hero__intro-text">${esc(h.intro)}</p>
      <div class="hero__ctas">
        <a class="btn btn--wine" href="#categorias">Ver categorias ${icon('arrow', 'icon btn__arrow')}</a>
        <a class="btn btn--line" href="#loja">Conheça a loja</a>
      </div>
    </div>
  </div>

  <div class="hero__benefits">
    ${benefitList(heroBenefits, { variant: 'glass', label: 'Vantagens da SMUG MODAS', titleTag: 'p', reveal: false })}
  </div>
</section>`;
