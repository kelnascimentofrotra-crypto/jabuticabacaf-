import { esc, icon, delay } from '../lib.mjs';

// Lista de benefícios/valores reutilizada no hero, na loja e no sobre.
// variant: 'glass' (hero), 'light' (loja, fundo creme), 'dark' (sobre, fundo marrom)
export const benefitList = (items, { variant, label, titleTag = 'h3', reveal = true }) => `
  <ul class="benefits benefits--${variant}" aria-label="${esc(label)}">
    ${items
      .map(
        (item, i) => `
      <li class="benefit"${reveal ? ' data-reveal' : ''} ${delay(i)}>
        ${icon(item.icon, 'icon benefit__icon')}
        <div class="benefit__body">
          <${titleTag} class="benefit__title">${esc(item.title)}</${titleTag}>
          <p class="benefit__text">${esc(item.text)}</p>
        </div>
      </li>`
      )
      .join('')}
  </ul>`;
