import { esc, img, delay } from '../lib.mjs';

export const about = ({ about: a }) => `
<section class="about" id="sobre" data-tone="dark" aria-labelledby="about-title">
  <div class="about__grid container">
    <figure class="about__media" data-reveal="photo">
      ${img(a.photo, { className: 'about__photo', sizes: '(min-width: 1024px) 50vw, 100vw' })}
    </figure>

    <div class="about__content">
      <p class="eyebrow eyebrow--line eyebrow--light" data-reveal>${esc(a.eyebrow)}</p>
      <h2 class="about__title" id="about-title" data-reveal ${delay(1)}>${esc(a.title)}</h2>
      <blockquote class="about__quote" data-reveal ${delay(2)}>
        <p>${a.quote.map((l) => `<span>${esc(l)}</span>`).join(' ')}</p>
      </blockquote>
      ${a.paragraphs.map((p, i) => `<p class="about__text" data-reveal ${delay(i + 3)}>${esc(p)}</p>`).join('')}
      <div class="about__sign" data-reveal ${delay(5)}>
        <p class="script about__signature">${esc(a.signature)}</p>
        <p class="about__role">${esc(a.role)}</p>
      </div>
    </div>
  </div>
</section>`;
