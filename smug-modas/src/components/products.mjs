import { esc, icon, img, delay, whatsappUrl } from '../lib.mjs';

// "Escolhas da semana": só é renderizada quando há produtos reais em content.products.items.
// Ação de cada peça: página do produto → catálogo → WhatsApp com mensagem → contato.
const productLink = (item, { catalog, contact, products }) => {
  const url = item.url || catalog.url;
  if (url) return { href: esc(url), attrs: 'target="_blank" rel="noopener"', label: 'Ver detalhes', hint: ' (abre em nova aba)' };
  if (contact.whatsapp.number) {
    const text = products.whatsappMessage.replace('{produto}', item.name);
    return { href: whatsappUrl(contact.whatsapp.number, text), attrs: 'target="_blank" rel="noopener"', label: 'Pedir pelo WhatsApp', hint: ' (abre o WhatsApp em nova aba)' };
  }
  return { href: '#contato', attrs: '', label: 'Falar com a loja', hint: '' };
};

const spec = (label, values) =>
  values?.length ? `<div class="product__spec"><dt>${label}</dt><dd>${values.map(esc).join(', ')}</dd></div>` : '';

const product = (item, i, content) => {
  const link = productLink(item, content);
  return `
    <li class="product" data-reveal ${delay(i % 4)}>
      <article class="product__card">
        <div class="product__media${item.imageHover ? ' product__media--swap' : ''}">
          ${img(item.image, { className: 'product__img', sizes: '(min-width: 1024px) 25vw, 50vw' })}
          ${item.imageHover ? img({ ...item.imageHover, alt: '' }, { className: 'product__img product__img--hover', sizes: '(min-width: 1024px) 25vw, 50vw' }) : ''}
        </div>
        <div class="product__body">
          <h3 class="product__name">${esc(item.name)}</h3>
          ${item.price ? `<p class="product__price">${esc(item.price)}</p>` : ''}
          ${item.colors?.length || item.sizes?.length ? `<dl class="product__specs">${spec('Cores', item.colors)}${spec('Tamanhos', item.sizes)}</dl>` : ''}
          <a class="product__action" href="${link.href}" ${link.attrs}>
            <span>${link.label}</span>${icon('arrow', 'icon btn__arrow')}<span class="sr-only">: ${esc(item.name)}${esc(link.hint)}</span>
          </a>
        </div>
      </article>
    </li>`;
};

export const products = (content) => {
  const { products: p } = content;
  if (!p.items.length) return '';
  return `
<section class="products" id="produtos" data-tone="light" aria-labelledby="products-title">
  <div class="container">
    <header class="section-head">
      <p class="eyebrow eyebrow--line" data-reveal>${esc(p.eyebrow)}</p>
      <h2 class="section-title section-title--wine" id="products-title" data-reveal ${delay(1)}>${esc(p.title.plain)} <em>${esc(p.title.italic)}</em></h2>
    </header>
    <ul class="product-grid" aria-label="${esc(`${p.title.plain} ${p.title.italic}`)}">
      ${p.items.map((item, i) => product(item, i, content)).join('')}
    </ul>
  </div>
</section>`;
};
