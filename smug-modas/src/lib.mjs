// Utilitários compartilhados pelos componentes.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

// Ícones de traço fino (24×24), desenhados para a identidade da SMUG.
const ICONS = {
  arrow: '<path d="M4 12h15"/><path d="m13.5 6.5 5.5 5.5-5.5 5.5"/>',
  arrowUp: '<path d="M12 19V5"/><path d="m6.5 10.5 5.5-5.5 5.5 5.5"/>',
  menu: '<path d="M3.5 6.5h17"/><path d="M3.5 12h17"/><path d="M3.5 17.5h17"/>',
  close: '<path d="m5.5 5.5 13 13"/><path d="m18.5 5.5-13 13"/>',
  truck: '<path d="M2.5 6.5h11v9.5h-11z"/><path d="M13.5 9.5h4l3.5 3.6v2.9h-7.5"/><circle cx="6.5" cy="17.5" r="1.7"/><circle cx="17" cy="17.5" r="1.7"/><path d="M1 9h3M.5 11.5h3"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 9.5h19"/><path d="M6 15h4.5"/>',
  headset: '<path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2"/><rect x="3" y="13" width="4" height="6" rx="1.6"/><rect x="17" y="13" width="4" height="6" rx="1.6"/><path d="M19 19v.4a2.6 2.6 0 0 1-2.6 2.6H13"/>',
  sofa: '<path d="M5 10.5V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2.5"/><path d="M3 12.5a2 2 0 0 1 4 0V14h10v-1.5a2 2 0 0 1 4 0V18H3z"/><path d="M5.5 18v2M18.5 18v2"/>',
  hanger: '<path d="M10 5.5a2 2 0 1 1 2 2v1.3"/><path d="M12 8.8 3.4 15.4a1 1 0 0 0 .6 1.8h16a1 1 0 0 0 .6-1.8L12 8.8"/>',
  diamond: '<path d="M6.5 4.5h11l3.5 4.8-9 10.7-9-10.7z"/><path d="M3 9.3h18"/><path d="m9.5 4.5-1.6 4.8L12 20l4.1-10.7-1.6-4.8"/>',
  heart: '<path d="M12 20s-7.4-4.5-9-9.1C1.9 7.7 4 4.6 7.1 4.6c2 0 3.5 1.1 4.9 3 1.4-1.9 2.9-3 4.9-3 3.1 0 5.2 3.1 4.1 6.3C19.4 15.5 12 20 12 20z"/>',
  whatsapp: '<path d="M3.6 20.4 4.9 16A8.4 8.4 0 1 1 8 19.2z"/><path d="M9.1 8.2c-.4.5-.5 1.2-.2 2.1.7 1.9 2.2 3.4 4.1 4.1.9.3 1.6.2 2.1-.2l.5-.6-1.9-1.1-.9.6c-.9-.4-1.6-1.1-2-2l.6-.9-1.1-1.9z"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.6 7 8.4 6.4L20.4 7"/>',
  pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.1 2"/>',
  chat: '<path d="M12 4c4.7 0 8.5 3.2 8.5 7.2s-3.8 7.2-8.5 7.2c-1 0-2-.1-2.9-.4L4.6 20l1.2-3.5C4.4 15.2 3.5 13.3 3.5 11.2 3.5 7.2 7.3 4 12 4z"/><path d="M8.6 11.3h.01M12 11.3h.01M15.4 11.3h.01" stroke-width="2.2"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.1 6.9h.01" stroke-width="2"/>',
};

export const icon = (name, className = 'icon') =>
  `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] ?? ''}</svg>`;

// <img> com dimensões declaradas (evita mudanças de layout) e lazy-load por padrão.
export const img = ({ src, srcset, width, height, alt = '', position }, { className = '', sizes = '100vw', eager = false, priority = false } = {}) => {
  const attrs = [
    className && `class="${className}"`,
    `src="${esc(src)}"`,
    srcset && `srcset="${srcset.map(([s, w]) => `${esc(s)} ${w}w`).join(', ')}"`,
    srcset && `sizes="${esc(sizes)}"`,
    `width="${width}"`,
    `height="${height}"`,
    `alt="${esc(alt)}"`,
    eager ? 'loading="eager"' : 'loading="lazy"',
    'decoding="async"',
    priority && 'fetchpriority="high"',
    position && `style="object-position:${esc(position)}"`,
  ].filter(Boolean);
  return `<img ${attrs.join(' ')}>`;
};

// Logotipo tipográfico (monograma + SMUG / MODAS).
export const logo = ({ href = '#inicio', className = '' } = {}) => `
  <a class="logo ${className}" href="${href}" aria-label="SMUG MODAS — voltar ao início">
    <span class="logo__mark" aria-hidden="true">S</span>
    <span class="logo__rule" aria-hidden="true"></span>
    <span class="logo__type" aria-hidden="true">
      <span class="logo__name">SMUG</span>
      <span class="logo__sub">MODAS</span>
    </span>
  </a>`;

export const whatsappUrl = (number, text = '') =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

// Destinos de link: { href, attrs, hint } — hint é o complemento lido por leitores de tela.
const external = (href, hint) => ({ href: esc(href), attrs: 'target="_blank" rel="noopener"', hint });
const internal = (id) => ({ href: `#${id}`, attrs: '', hint: '' });

// "Falar com a loja": conversa no WhatsApp com mensagem pronta; sem número, a seção de contato.
export const talkLink = ({ contact }, text = contact.whatsapp.message) =>
  contact.whatsapp.number
    ? external(whatsappUrl(contact.whatsapp.number, text), ' (abre o WhatsApp em nova aba)')
    : internal('contato');

// "Conhecer a coleção": catálogo real → vitrine de produtos → categorias.
export const collectionLink = ({ catalog, products }) => {
  if (catalog.url) return external(catalog.url, ' (abre o catálogo em nova aba)');
  return internal(products.items.length ? 'produtos' : 'categorias');
};

// Navegação: "Novidades" só entra quando há produtos reais cadastrados.
export const navItems = ({ nav, products }) =>
  products.items.length ? [nav[0], { id: 'produtos', label: products.eyebrow }, ...nav.slice(1)] : nav;

// Atraso escalonado para animações de entrada (curto: o conteúdo não deve demorar a aparecer).
export const delay = (i, step = 70) => `style="--d:${i * step}ms"`;
