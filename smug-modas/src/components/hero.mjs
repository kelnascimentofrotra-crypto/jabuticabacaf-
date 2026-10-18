import { esc, img, delay } from '../lib.mjs';
import { benefitList } from './benefits.mjs';

export const hero = ({ hero: h, heroBenefits }) => `
<section class="hero" id="inicio" data-tone="light" aria-labelledby="hero-title">
  <div class="hero__bg" aria-hidden="true">
    ${img(h.background, { className: 'hero__bg-img', eager: true, priority: true })}
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

  </div>

  <div class="hero__benefits">
    ${benefitList(heroBenefits, { variant: 'glass', label: 'Vantagens da SMUG MODAS', titleTag: 'p', reveal: false })}
  </div>
</section>`;
