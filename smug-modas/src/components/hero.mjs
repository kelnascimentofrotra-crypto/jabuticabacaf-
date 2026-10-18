import { esc, icon, img, talkLink, collectionLink } from '../lib.mjs';

// Sombra de folhas de palmeira projetada na parede (balança devagar; decorativa).
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

// Cada letra de "SMUG" entra em sequência (o nome acessível fica no sr-only).
const brandLetters = (word) =>
  [...word].map((ch, i) => `<span class="hero__letter" style="--li:${i}">${esc(ch)}</span>`).join('');

export const hero = (content) => {
  const { hero: h } = content;
  const collection = collectionLink(content);
  const talk = talkLink(content);
  return `
<section class="hero" id="inicio" data-tone="light" aria-labelledby="hero-title" data-anim-scope>
  <div class="hero__scene">
    <div class="hero__bg" aria-hidden="true">
      ${img(h.background, { className: 'hero__bg-img', eager: true, priority: true })}
      ${leafShadow()}
      <span class="hero__sun"></span>
    </div>
    <div class="hero__stage">
      <h1 class="hero__brand" id="hero-title">
        <span class="sr-only">${esc(h.brand)} MODAS</span>
        <span class="hero__brand-word" aria-hidden="true">${brandLetters(h.brand)}</span>
      </h1>
      <figure class="hero__figure">
        ${img(h.photo, { className: 'hero__photo', eager: true, priority: true })}
      </figure>
    </div>
  </div>

  <div class="hero__intro">
    <p class="hero__eyebrow">${esc(h.eyebrow)}</p>
    <p class="hero__tagline">${esc(h.tagline.plain)} <em>${esc(h.tagline.italic)}</em></p>
    <div class="hero__actions">
      <a class="btn btn--wine" href="${collection.href}" ${collection.attrs}>
        <span>${esc(h.primaryCta)}</span>${icon('arrow', 'icon btn__arrow')}${collection.hint ? `<span class="sr-only">${esc(collection.hint)}</span>` : ''}
      </a>
      <a class="btn btn--line" href="${talk.href}" ${talk.attrs}>
        ${content.contact.whatsapp.number ? icon('whatsapp') : ''}<span>${esc(h.secondaryCta)}</span>${talk.hint ? `<span class="sr-only">${esc(talk.hint)}</span>` : ''}
      </a>
    </div>
  </div>
</section>`;
};
