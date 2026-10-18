import { esc, icon, img, delay, words, wordCount } from '../lib.mjs';

// Sem catálogo configurado, cada card leva ao formulário com o interesse preenchido.
const cardLink = (item, catalogUrl) => {
  const url = item.url || catalogUrl;
  if (url) return { href: esc(url), attrs: 'target="_blank" rel="noopener"', hint: ' (abre o catálogo em nova aba)' };
  return { href: '#contato', attrs: `data-interest="${esc(item.name)}"`, hint: ' — falar com a equipe sobre esta categoria' };
};

const card = (item, i, catalogUrl) => {
  const link = cardLink(item, catalogUrl);
  return `
    <li class="cat-card${item.wide ? ' cat-card--wide' : ''}" data-reveal ${delay(i, 90)}>
      <a class="cat-card__link" href="${link.href}" ${link.attrs}>
        <span class="cat-card__media">
          ${img(item.image, { className: 'cat-card__img' })}
        </span>
        <span class="cat-card__body">
          <span class="cat-card__name">${esc(item.name)}</span>
          <span class="cat-card__text">${esc(item.text)}</span>
          <span class="sr-only">${esc(link.hint)}</span>
          <span class="cat-card__arrow" aria-hidden="true">${icon('arrow')}</span>
        </span>
      </a>
    </li>`;
};

export const categories = ({ categories: c }) => {
  const allHref = c.catalogUrl ? esc(c.catalogUrl) : '#categorias-lista';
  const allAttrs = c.catalogUrl ? 'target="_blank" rel="noopener"' : '';
  return `
<section class="categories" id="categorias" data-tone="dark" aria-labelledby="categories-title">
  <div class="categories__bg" aria-hidden="true">
    <img src="${esc(c.background.src)}" width="${c.background.width}" height="${c.background.height}" alt="" loading="lazy" decoding="async">
  </div>
  <div class="container categories__inner">
    <header class="categories__head">
      <p class="eyebrow eyebrow--line eyebrow--light" data-reveal>${esc(c.eyebrow)}</p>
      <h2 class="section-title section-title--light" id="categories-title" data-reveal="words" ${delay(1)}>
        <span class="categories__title-plain">${words(c.title.plain)}</span>
        <em>${words(c.title.italic, { start: wordCount(c.title.plain), className: 'text-gold' })}</em>
      </h2>
      <p class="categories__text" data-reveal ${delay(2)}>${esc(c.text)}</p>
      <div data-reveal ${delay(3)}>
        <a class="btn btn--outline-gold" href="${allHref}" ${allAttrs}>${esc(c.cta)} ${icon('arrow', 'icon btn__arrow')}</a>
      </div>
    </header>

    <ul class="cat-grid" id="categorias-lista" aria-label="Categorias" tabindex="-1">
      ${c.items.map((item, i) => card(item, i, c.catalogUrl)).join('')}
    </ul>

    <div class="categories__closing" data-reveal>
      <p class="categories__words">${c.closing.words.map((w) => `<span>${esc(w)}</span>`).join('<span class="dot" aria-hidden="true">·</span>')}</p>
      <p class="script categories__script" data-write>${esc(c.closing.script)}</p>
    </div>
  </div>
</section>`;
};
