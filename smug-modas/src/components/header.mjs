import { esc, icon, logo } from '../lib.mjs';

// Header fixo com dois estados (controlados em assets/js/main.js):
// na hero, a logo pequena fica oculta e os links à esquerda; após a hero, a logo aparece
// e os links vão para o centro. Ações (pesquisa, conta, favoritos, sacola) sempre à direita;
// por enquanto elas só mostram o aviso de versão de demonstração. Uma única <nav>.
const isExtra = (item) => item.icon !== 'bag'; // no celular, só a sacola fica no header

const actionButton = (item) => `
  <button class="header-action" type="button" aria-label="${esc(item.badge !== undefined ? `${item.label}, ${item.badge} itens` : item.label)}" data-demo="${esc(item.feature)}">
    ${icon(item.icon)}
    ${item.badge !== undefined ? `<span class="header-action__badge" aria-hidden="true">${item.badge}</span>` : ''}
  </button>`;

export const header = ({ nav, headerActions }) => `
<header class="site-header" data-header data-tone="light">
  <div class="site-header__inner">
    ${logo()}
    <nav class="site-nav" aria-label="Principal">
      <ul class="site-nav__list">
        ${nav.map((item) => `<li><a class="site-nav__link" href="#${item.id}" data-nav-link>${esc(item.label)}</a></li>`).join('')}
      </ul>
    </nav>
    <div class="site-header__actions">
      <button class="header-action theme-toggle" type="button" aria-label="Tema escuro" aria-pressed="true" data-theme-toggle>
        <span class="theme-toggle__icon theme-toggle__icon--sun">${icon('sun')}</span>
        <span class="theme-toggle__icon theme-toggle__icon--moon">${icon('moon')}</span>
      </button>
      <ul class="header-actions" aria-label="Ações da loja">
        ${headerActions.items
          .map((item) => `<li class="header-actions__item${isExtra(item) ? ' header-actions__item--extra' : ''}">${actionButton(item)}</li>`)
          .join('')}
      </ul>
      <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded="false" aria-controls="menu-mobile" data-menu-open>
        ${icon('menu')}
      </button>
    </div>
  </div>
</header>`;

export const mobileMenu = ({ nav, contact, headerActions }) => `
<dialog class="mobile-menu" id="menu-mobile" aria-label="Menu" data-menu>
  <div class="mobile-menu__panel">
    <div class="mobile-menu__top">
      ${logo({ className: 'logo--light' })}
      <button class="menu-close" type="button" aria-label="Fechar menu" data-menu-close>${icon('close')}</button>
    </div>
    <nav aria-label="Menu principal">
      <ol class="mobile-menu__list">
        ${nav
          .map(
            (item, i) => `<li style="--i:${i}"><a class="mobile-menu__link" href="#${item.id}" data-menu-link><span class="mobile-menu__num" aria-hidden="true">0${i + 1}</span>${esc(item.label)}</a></li>`
          )
          .join('')}
      </ol>
    </nav>
    <ul class="mobile-menu__actions" aria-label="Ações da loja">
      ${headerActions.items
        .filter(isExtra)
        .map((item) => `<li><button class="mobile-menu__action" type="button" data-demo="${esc(item.feature)}">${icon(item.icon)}<span>${esc(item.label)}</span></button></li>`)
        .join('')}
    </ul>
    <div class="mobile-menu__foot">
      <p class="mobile-menu__script" aria-hidden="true">Mais que moda, é você.</p>
      ${contact.social.instagram ? `<a class="mobile-menu__social" href="${esc(contact.social.instagram)}" target="_blank" rel="noopener">${icon('instagram')}<span>Instagram</span></a>` : ''}
    </div>
  </div>
</dialog>`;

// Aviso exibido ao tocar nas ações da loja (pesquisa, conta, favoritos, sacola).
export const demoToast = ({ headerActions }) => `
<div class="demo-toast" data-demo-toast data-template="${esc(headerActions.demoNotice.text)}">
  <span class="demo-toast__icon" aria-hidden="true" data-demo-icon></span>
  <div class="demo-toast__body">
    <p class="demo-toast__title">${esc(headerActions.demoNotice.title)}</p>
    <p class="demo-toast__text" data-demo-text></p>
  </div>
  <button class="demo-toast__close" type="button" aria-label="Fechar aviso" data-demo-close>${icon('close')}</button>
</div>
<p class="sr-only" role="status" aria-live="polite" data-demo-live></p>`;
