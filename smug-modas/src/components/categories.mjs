import { esc, icon, img, delay, whatsappUrl } from '../lib.mjs';

// Destino de cada categoria: link próprio → catálogo → WhatsApp com mensagem pronta.
// Sem nenhum desses dados o card não vira link (nada de caminho sem saída).
const categoryLink = (item, { catalog, contact, categories }) => {
  const url = item.url || catalog.url;
  if (url) return { href: esc(url), attrs: 'target="_blank" rel="noopener"', cue: 'Ver no catálogo', hint: ' (abre o catálogo em nova aba)' };
  if (contact.whatsapp.number) {
    const text = categories.whatsappMessage.replace('{categoria}', item.name.toLocaleLowerCase('pt-BR'));
    return { href: whatsappUrl(contact.whatsapp.number, text), attrs: 'target="_blank" rel="noopener"', cue: 'Ver modelos', hint: ' (abre o WhatsApp em nova aba)' };
  }
  return null;
};

const card = (item, i, content) => {
  const link = categoryLink(item, content);
  const inner = `
        <span class="cat-card__media">
          ${img(item.image, { className: 'cat-card__img', sizes: '(min-width: 1024px) 25vw, 50vw' })}
        </span>
        <span class="cat-card__body">
          <span class="cat-card__name">${esc(item.name)}</span>
          <span class="cat-card__text">${esc(item.text)}</span>
          ${link ? `<span class="cat-card__cue">${esc(link.cue)}${icon('arrow', 'icon cat-card__arrow')}</span><span class="sr-only">${esc(link.hint)}</span>` : ''}
        </span>`;
  return `
    <li class="cat-card" data-reveal ${delay(i)}>
      ${link ? `<a class="cat-card__inner cat-card__inner--link" href="${link.href}" ${link.attrs}>${inner}</a>` : `<div class="cat-card__inner">${inner}</div>`}
    </li>`;
};

export const categories = (content) => {
  const { categories: c } = content;
  return `
<section class="categories" id="categorias" data-tone="dark" aria-labelledby="categories-title">
  <div class="categories__bg" aria-hidden="true">
    <img src="${esc(c.background.src)}" width="${c.background.width}" height="${c.background.height}" alt="" loading="lazy" decoding="async">
  </div>
  <div class="container">
    <header class="section-head">
      <p class="eyebrow eyebrow--line eyebrow--light" data-reveal>${esc(c.eyebrow)}</p>
      <h2 class="section-title section-title--light" id="categories-title" data-reveal ${delay(1)}>${esc(c.title.plain)} <em class="text-gold">${esc(c.title.italic)}</em></h2>
      <p class="section-lead section-lead--light" data-reveal ${delay(2)}>${esc(c.text)}</p>
    </header>
    <ul class="cat-grid" aria-label="${esc(c.eyebrow)}">
      ${c.items.map((item, i) => card(item, i, content)).join('')}
    </ul>
  </div>
</section>`;
};
