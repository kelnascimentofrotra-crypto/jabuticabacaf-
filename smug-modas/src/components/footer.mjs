import { esc, icon, logo, whatsappUrl, navItems } from '../lib.mjs';

export const footer = (content) => {
  const { contact, footer: f, site } = content;
  const links = [
    contact.whatsapp.number && `<li><a href="${whatsappUrl(contact.whatsapp.number, contact.whatsapp.message)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>WhatsApp</span><span class="sr-only"> (abre em nova aba)</span></a></li>`,
    contact.email.address && `<li><a href="mailto:${esc(contact.email.address)}">${icon('mail')}<span>${esc(contact.email.address)}</span></a></li>`,
    contact.social.instagram && `<li><a href="${esc(contact.social.instagram)}" target="_blank" rel="noopener">${icon('instagram')}<span>Instagram</span><span class="sr-only"> (abre em nova aba)</span></a></li>`,
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
        ${navItems(content).map((item) => `<li><a href="#${item.id}">${esc(item.label)}</a></li>`).join('')}
      </ul>
    </nav>
    ${links.length ? `<ul class="site-footer__contact" aria-label="Contato">${links.join('')}</ul>` : ''}
  </div>
  <div class="container site-footer__bottom">
    <p>© ${new Date().getFullYear()} ${esc(site.name)}. Todos os direitos reservados.</p>
    <a class="to-top" href="#inicio">${icon('arrowUp')}<span>Voltar ao topo</span></a>
  </div>
</footer>`;
};

// Botão flutuante de WhatsApp: só existe com número configurado; o JS o mostra
// depois da hero e o esconde perto do contato e do rodapé (que já têm o link).
export const whatsappFloat = ({ contact }) =>
  contact.whatsapp.number
    ? `
<a class="wa-float" href="${whatsappUrl(contact.whatsapp.number, contact.whatsapp.message)}" target="_blank" rel="noopener" data-wa-float>
  ${icon('whatsapp')}<span class="sr-only">Conversar no WhatsApp (abre em nova aba)</span>
</a>`
    : '';
