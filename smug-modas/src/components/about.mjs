import { esc, img, delay } from '../lib.mjs';
import { benefitList } from './benefits.mjs';

export const about = ({ about: a }) => `
<section class="about" id="sobre" data-tone="dark" aria-labelledby="about-title">
  <div class="about__grid container">
    <header class="about__head">
      <p class="eyebrow eyebrow--line eyebrow--light" data-reveal>${esc(a.eyebrow)}</p>
      <h2 class="about__title" id="about-title" data-reveal ${delay(1)}>${esc(a.title)}</h2>
    </header>

    <figure class="about__media" data-reveal="zoom">
      ${img(a.photo, { className: 'about__photo', sizes: '(min-width: 1024px) 50vw, 100vw' })}
    </figure>

    <div class="about__content">
      <blockquote class="about__quote" data-reveal>
        <p>${a.quote.map((l) => `<span>${esc(l)}</span>`).join(' ')}</p>
      </blockquote>
      ${a.paragraphs.map((p, i) => `<p class="about__text" data-reveal ${delay(i + 1)}>${esc(p)}</p>`).join('')}
      <div class="about__sign" data-reveal ${delay(3)}>
        <p class="script about__signature">${esc(a.signature)} <svg class="about__heart" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20s-7.4-4.5-9-9.1C1.9 7.7 4 4.6 7.1 4.6c2 0 3.5 1.1 4.9 3 1.4-1.9 2.9-3 4.9-3 3.1 0 5.2 3.1 4.1 6.3C19.4 15.5 12 20 12 20z"/></svg></p>
        <p class="about__role">${esc(a.role)}</p>
      </div>
    </div>
  </div>
  <div class="container">
    ${benefitList(a.values, { variant: 'dark', label: 'Nossos valores' })}
  </div>
</section>`;
