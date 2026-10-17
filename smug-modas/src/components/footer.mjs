import { esc, icon, logo, whatsappUrl } from '../lib.mjs';

export const footer = ({ nav, contact, footer: f, site }) => {
  const links = [
    contact.whatsapp.number && `<li><a href="${whatsappUrl(contact.whatsapp.number)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>WhatsApp</span></a></li>`,
    contact.email.address && `<li><a href="mailto:${esc(contact.email.address)}">${icon('mail')}<span>${esc(contact.email.address)}</span></a></li>`,
    contact.social.instagram && `<li><a href="${esc(contact.social.instagram)}" target="_blank" rel="noopener">${icon('instagram')}<span>Instagram</span></a></li>`,
  ].filter(Boolean);

  return `
<footer class="site-footer" data-tone="dark">
  <div class="container site-footer__inner">
    <div class="site-footer__brand">
      ${logo({ className: 'logo--light' })}
      <p class="script site-footer__tagline">${esc(f.tagline)}</p>
    </div>
    <nav class="site-footer__nav" aria-label="Rodapé">
      <ul>
        ${nav.map((item) => `<li><a href="#${item.id}">${esc(item.label)}</a></li>`).join('')}
      </ul>
    </nav>
    ${links.length ? `<ul class="site-footer__contact">${links.join('')}</ul>` : ''}
  </div>
  <div class="container site-footer__bottom">
    <p>© ${new Date().getFullYear()} ${esc(site.name)}. Todos os direitos reservados.</p>
    <a class="to-top" href="#inicio">${icon('arrowUp')}<span>Voltar ao topo</span></a>
  </div>
</footer>`;
};
