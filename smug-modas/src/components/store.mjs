import { esc, icon, img, delay, words, wordCount } from '../lib.mjs';
import { benefitList } from './benefits.mjs';

export const store = ({ store: s, contact }) => {
  const maps = contact.address.mapsUrl;
  const cta = maps
    ? `<a class="btn btn--wine btn--wide" href="${esc(maps)}" target="_blank" rel="noopener">${esc(s.cta)} ${icon('arrow', 'icon btn__arrow')}<span class="sr-only"> (abre o mapa em nova aba)</span></a>`
    : `<a class="btn btn--wine btn--wide" href="#contato">${esc(s.cta)} ${icon('arrow', 'icon btn__arrow')}</a>`;

  return `
<section class="store" id="loja" data-tone="light" aria-labelledby="store-title">
  <div class="store__grid container">
    <div class="store__content">
      <p class="eyebrow eyebrow--line" data-reveal>${esc(s.eyebrow)}</p>
      <h2 class="section-title section-title--wine" id="store-title" data-reveal="words" ${delay(1)}>
        ${words(s.title.plain)} <em>${words(s.title.italic, { start: wordCount(s.title.plain) })}</em>
      </h2>
      ${s.paragraphs.map((p, i) => `<p class="store__text" data-reveal ${delay(i + 2)}>${esc(p)}</p>`).join('')}
      <div data-reveal ${delay(4)}>${cta}</div>
    </div>
    <figure class="store__media" data-reveal="zoom">
      <span class="parallax" data-parallax="0.12">${img(s.photo, { className: 'store__photo', sizes: '(min-width: 1024px) 55vw, 100vw' })}</span>
    </figure>
  </div>
  <div class="container">
    ${benefitList(s.benefits, { variant: 'light', label: 'Diferenciais da loja' })}
  </div>
</section>`;
};
