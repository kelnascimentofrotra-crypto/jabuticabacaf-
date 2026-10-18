import { esc, icon, logo, talkLink, navItems } from '../lib.mjs';

// Header fixo com dois estados (controlados em assets/js/main.js):
// na hero, a logo pequena fica oculta (o "SMUG" grande já identifica a marca) e os links ficam
// à esquerda; após a hero, a logo aparece e os links vão para o centro. "Falar com a loja"
// fica sempre à direita. Uma única <nav> para leitores de tela.
const talkButton = (content, className) => {
  const talk = talkLink(content);
  const wa = content.contact.whatsapp.number;
  return `<a class="${className}" href="${talk.href}" ${talk.attrs}>${wa ? icon('whatsapp') : ''}<span>${esc(content.hero.secondaryCta)}</span>${talk.hint ? `<span class="sr-only">${esc(talk.hint)}</span>` : ''}</a>`;
};

export const header = (content) => `
<header class="site-header" data-header data-tone="light">
  <div class="site-header__inner">
    ${logo()}
    <nav class="site-nav" aria-label="Principal">
      <ul class="site-nav__list">
        ${navItems(content).map((item) => `<li><a class="site-nav__link" href="#${item.id}" data-nav-link>${esc(item.label)}</a></li>`).join('')}
      </ul>
    </nav>
    <div class="site-header__actions">
      ${talkButton(content, 'btn btn--sm btn--line site-header__cta')}
      <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded="false" aria-controls="menu-mobile" data-menu-open>
        ${icon('menu')}
      </button>
    </div>
  </div>
</header>`;

export const mobileMenu = (content) => `
<dialog class="mobile-menu" id="menu-mobile" aria-label="Menu" data-menu>
  <div class="mobile-menu__panel">
    <div class="mobile-menu__top">
      ${logo({ className: 'logo--light' })}
      <button class="menu-close" type="button" aria-label="Fechar menu" data-menu-close>${icon('close')}</button>
    </div>
    <nav aria-label="Menu principal">
      <ol class="mobile-menu__list">
        ${navItems(content)
          .map(
            (item, i) => `<li style="--i:${i}"><a class="mobile-menu__link" href="#${item.id}"><span class="mobile-menu__num" aria-hidden="true">0${i + 1}</span>${esc(item.label)}</a></li>`
          )
          .join('')}
      </ol>
    </nav>
    <div class="mobile-menu__foot">
      ${talkButton(content, 'btn btn--gold btn--block mobile-menu__cta')}
      ${content.contact.social.instagram ? `<a class="mobile-menu__social" href="${esc(content.contact.social.instagram)}" target="_blank" rel="noopener">${icon('instagram')}<span>Instagram</span><span class="sr-only"> (abre em nova aba)</span></a>` : ''}
      <p class="mobile-menu__script" aria-hidden="true">${esc(content.footer.tagline)}</p>
    </div>
  </div>
</dialog>`;
