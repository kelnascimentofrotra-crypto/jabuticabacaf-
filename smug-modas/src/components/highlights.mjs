import { esc, icon } from '../lib.mjs';

// Faixa logo abaixo da hero. Condições comerciais só entram quando confirmadas pela loja;
// o restante vem dos diferenciais neutros. No máximo quatro itens.
export const highlightItems = ({ highlights, commercialHighlights }) =>
  [...commercialHighlights.filter((item) => item.confirmed), ...highlights].slice(0, 4);

export const highlightsStrip = (content) => `
<section class="highlights" aria-label="Diferenciais da SMUG MODAS">
  <ul class="highlights__list container">
    ${highlightItems(content)
      .map(
        (item) => `
    <li class="highlight">
      ${icon(item.icon, 'icon highlight__icon')}
      <div class="highlight__body">
        <p class="highlight__title">${esc(item.title)}</p>
        <p class="highlight__text">${esc(item.text)}</p>
      </div>
    </li>`
      )
      .join('')}
  </ul>
</section>`;
