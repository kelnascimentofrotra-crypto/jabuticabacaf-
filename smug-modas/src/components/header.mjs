import { esc, icon, logo } from '../lib.mjs';

// Header fixo: logo à esquerda, navegação central (desktop) e ação à direita.
// No mobile, apenas logo + botão do menu (não há carrinho implementado).
export const header = ({ nav }) => `
<header class="site-header" data-header data-tone="light">
  <div class="site-header__inner">
    ${logo()}
    <nav class="site-nav" aria-label="Principal">
      <ul class="site-nav__list">
        ${nav.map((item) => `<li><a class="site-nav__link" href="#${item.id}" data-nav-link>${esc(item.label)}</a></li>`).join('')}
      </ul>
    </nav>
    <div class="site-header__actions">
      <a class="btn btn--header" href="#contato">Fale conosco</a>
      <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded="false" aria-controls="menu-mobile" data-menu-open>
        ${icon('menu')}
      </button>
    </div>
  </div>
</header>`;

export const mobileMenu = ({ nav, contact }) => `
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
    <div class="mobile-menu__foot">
      <p class="mobile-menu__script" aria-hidden="true">Mais que moda, é você.</p>
      ${contact.social.instagram ? `<a class="mobile-menu__social" href="${esc(contact.social.instagram)}" target="_blank" rel="noopener">${icon('instagram')}<span>Instagram</span></a>` : ''}
    </div>
  </div>
</dialog>`;
