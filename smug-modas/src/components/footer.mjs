import { esc, icon, logo, whatsappUrl } from '../lib.mjs';

// ID de medição do Google Analytics (G-XXXX): só entra na página se tiver o formato certo
export const gaId = (content) => {
  const id = String(content.analytics?.gaId || '').trim().toUpperCase();
  return /^G-[A-Z0-9]{4,14}$/.test(id) ? id : '';
};

// Aviso de cookies: só aparece quando o Google Analytics está configurado (sem ele o site não usa cookies)
const consent = (id) => `
<div class="consent" role="dialog" aria-live="polite" aria-label="Aviso de cookies" data-consent data-ga="${esc(id)}" hidden>
  <p class="consent__text">Usamos cookies do Google Analytics para entender quantas pessoas visitam o site. Eles só são ativados se você aceitar.</p>
  <div class="consent__actions">
    <button class="consent__btn" type="button" data-consent-choice="recusado">Recusar</button>
    <button class="consent__btn consent__btn--accept" type="button" data-consent-choice="aceito">Aceitar</button>
  </div>
</div>`;

export const footer = (content) => {
  const { nav, contact, footer: f, site } = content;
  const id = gaId(content);
  const links = [
    contact.whatsapp.number && `<li><a href="${whatsappUrl(contact.whatsapp.number)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(contact.whatsapp.display || 'WhatsApp')}</span></a></li>`,
    contact.email.address && `<li><a href="mailto:${esc(contact.email.address)}">${icon('mail')}<span>${esc(contact.email.address)}</span></a></li>`,
    contact.social.instagram && `<li><a href="${esc(contact.social.instagram)}" target="_blank" rel="noopener">${icon('instagram')}<span>Instagram</span></a></li>`,
    contact.address.lines.length &&
      (contact.address.mapsUrl
        ? `<li><a href="${esc(contact.address.mapsUrl)}" target="_blank" rel="noopener">${icon('pin')}<span>${contact.address.lines.map(esc).join('<br>')}</span></a></li>`
        : `<li><span class="site-footer__item">${icon('pin')}<span>${contact.address.lines.map(esc).join('<br>')}</span></span></li>`),
    contact.hours.lines.length && `<li><span class="site-footer__item">${icon('clock')}<span>${contact.hours.lines.map(esc).join('<br>')}</span></span></li>`,
  ].filter(Boolean);
  const legal = [site.legalName && esc(site.legalName), site.cnpj && `CNPJ ${esc(site.cnpj)}`].filter(Boolean).join(' · ');

  return `
<footer class="site-footer" data-tone="dark" data-anim-scope>
  <div class="container site-footer__inner">
    <div class="site-footer__brand">
      ${logo({ className: 'logo--light' })}
      <p class="script site-footer__tagline" data-write>${esc(f.tagline)}</p>
    </div>
    <nav class="site-footer__nav" aria-label="Rodapé">
      <ul>
        ${nav.map((item) => `<li><a href="#${item.id}">${esc(item.label)}</a></li>`).join('')}
      </ul>
    </nav>
    ${links.length ? `<ul class="site-footer__contact">${links.join('')}</ul>` : ''}
  </div>
  <p class="site-footer__wordmark" aria-hidden="true" data-reveal>${[...'SMUG'].map((ch, i) => `<span style="--li:${i}">${ch}</span>`).join('')}</p>
  <div class="container site-footer__bottom">
    <p>© ${new Date().getFullYear()} ${esc(site.name)}. Todos os direitos reservados.${legal ? `<br><span class="site-footer__legal">${legal}</span>` : ''}</p>
    ${id ? '<button class="site-footer__cookies" type="button" data-consent-open>Preferências de cookies</button>' : ''}
    <a class="to-top" href="#inicio">${icon('arrowUp')}<span>Voltar ao topo</span></a>
  </div>
  ${id ? consent(id) : ''}
</footer>`;
};
