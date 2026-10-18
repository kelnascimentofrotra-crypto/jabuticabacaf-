import { esc, icon, img, delay, words, wordCount, whatsappUrl } from '../lib.mjs';

// Vitrine "Escolhas da semana": só aparece quando há produtos cadastrados (pelo painel ou no
// content.json). Status: 'disponivel', 'esgotado' (aparece com selo) ou 'oculto' (fica fora do site).
export const visibleProducts = ({ products }) =>
  (products?.items ?? []).filter((item) => item.status !== 'oculto' && item.name && item.image?.src);

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const formatPrice = (value) => (typeof value === 'number' && Number.isFinite(value) ? BRL.format(value) : '');

// Ação de cada peça: página própria → WhatsApp com mensagem pronta → formulário com o interesse preenchido.
const productLink = (item, { contact, products }) => {
  const soldOut = item.status === 'esgotado';
  if (item.url) return { href: esc(item.url), attrs: 'target="_blank" rel="noopener"', label: 'Ver detalhes', hint: ' (abre em nova aba)' };
  if (contact.whatsapp.number) {
    const text = (soldOut ? products.soldOutMessage : products.whatsappMessage).replace('{produto}', item.name);
    return {
      href: whatsappUrl(contact.whatsapp.number, text),
      attrs: 'target="_blank" rel="noopener"',
      label: soldOut ? 'Consultar reposição' : 'Quero esta peça',
      hint: ' (abre o WhatsApp em nova aba)',
    };
  }
  return {
    href: '#contato',
    attrs: `data-interest="${esc(item.name)}"`,
    label: soldOut ? 'Consultar reposição' : 'Quero esta peça',
    hint: ' — falar com a equipe sobre esta peça',
  };
};

const spec = (label, values) =>
  values?.length ? `<div class="product__spec"><dt>${label}</dt><dd>${values.map(esc).join(' · ')}</dd></div>` : '';

const product = (item, i, content) => {
  const link = productLink(item, content);
  const soldOut = item.status === 'esgotado';
  const price = formatPrice(item.price);
  const sizes = '(min-width: 1024px) 25vw, 50vw';
  return `
      <li class="product${soldOut ? ' product--soldout' : ''}" data-reveal ${delay(i % 4, 90)}>
        <article class="product__card">
          <div class="product__media${item.imageHover?.src ? ' product__media--swap' : ''}">
            ${img({ ...item.image, alt: item.image.alt || item.name }, { className: 'product__img', sizes })}
            ${item.imageHover?.src ? img({ ...item.imageHover, alt: '' }, { className: 'product__img product__img--hover', sizes }) : ''}
            ${soldOut ? '<span class="product__badge">Esgotado</span>' : ''}
          </div>
          <div class="product__body">
            ${item.category ? `<p class="product__cat">${esc(item.category)}</p>` : ''}
            <h3 class="product__name">${esc(item.name)}</h3>
            ${item.description ? `<p class="product__desc">${esc(item.description)}</p>` : ''}
            ${price ? `<p class="product__price">${price}</p>` : ''}
            ${item.colors?.length || item.sizes?.length ? `<dl class="product__specs">${spec('Cores', item.colors)}${spec('Tamanhos', item.sizes)}</dl>` : ''}
            <a class="product__action" href="${link.href}" ${link.attrs}>
              <span>${link.label}</span>${icon('arrow', 'icon product__arrow')}<span class="sr-only">: ${esc(item.name)}${esc(link.hint)}</span>
            </a>
          </div>
        </article>
      </li>`;
};

export const products = (content) => {
  const { products: p } = content;
  const items = visibleProducts(content);
  if (!items.length) return '';
  return `
<section class="products" id="novidades" data-tone="light" aria-labelledby="products-title">
  <div class="container">
    <header class="products__head">
      <p class="eyebrow eyebrow--line" data-reveal>${esc(p.eyebrow)}</p>
      <h2 class="section-title section-title--wine" id="products-title" data-reveal="words" ${delay(1)}>
        ${words(p.title.plain)} <em>${words(p.title.italic, { start: wordCount(p.title.plain) })}</em>
      </h2>
      ${p.text ? `<p class="products__text" data-reveal ${delay(2)}>${esc(p.text)}</p>` : ''}
    </header>
    <ul class="product-grid" aria-label="${esc(`${p.title.plain} ${p.title.italic}`)}">
      ${items.map((item, i) => product(item, i, content)).join('')}
    </ul>
  </div>
</section>`;
};
