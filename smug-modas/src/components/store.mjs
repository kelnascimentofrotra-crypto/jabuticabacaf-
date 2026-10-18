import { esc, icon, img, delay } from '../lib.mjs';

// "Venha nos visitar" só vira botão com o link do mapa; o endereço aparece quando confirmado.
export const store = ({ store: s, contact }) => {
  const { lines, mapsUrl } = contact.address;
  const address = lines.length
    ? `<p class="store__address" data-reveal ${delay(3)}>${icon('pin')}<span>${lines.map(esc).join('<br>')}</span></p>`
    : '';
  const cta = mapsUrl
    ? `<div data-reveal ${delay(4)}><a class="btn btn--wine" href="${esc(mapsUrl)}" target="_blank" rel="noopener"><span>${esc(s.cta)}</span>${icon('arrow', 'icon btn__arrow')}<span class="sr-only"> (abre o mapa em nova aba)</span></a></div>`
    : '';

  return `
<section class="store" id="loja" data-tone="light" aria-labelledby="store-title">
  <div class="store__grid container">
    <figure class="store__media" data-reveal="photo">
      ${img(s.photo, { className: 'store__photo', sizes: '(min-width: 1024px) 58vw, 100vw' })}
    </figure>
    <div class="store__content">
      <p class="eyebrow eyebrow--line" data-reveal>${esc(s.eyebrow)}</p>
      <h2 class="section-title section-title--wine" id="store-title" data-reveal ${delay(1)}>${esc(s.title.plain)} <em>${esc(s.title.italic)}</em></h2>
      <p class="section-lead" data-reveal ${delay(2)}>${esc(s.text)}</p>
      ${address}
      ${cta}
    </div>
  </div>
</section>`;
};
