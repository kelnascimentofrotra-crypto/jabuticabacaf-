import { esc, icon, img, delay, whatsappUrl } from '../lib.mjs';

// Somente canais configurados em src/content.mjs aparecem (nada de "a confirmar" na página).
export const contactChannels = ({ whatsapp, email, address, hours, social }) =>
  [
    whatsapp.number && {
      icon: 'whatsapp',
      label: 'WhatsApp',
      value: `<a href="${whatsappUrl(whatsapp.number, whatsapp.message)}" target="_blank" rel="noopener">${esc(whatsapp.display || whatsapp.number)}<span class="sr-only"> (abre o WhatsApp em nova aba)</span></a>`,
    },
    email.address && {
      icon: 'mail',
      label: 'E-mail',
      value: `<a href="mailto:${esc(email.address)}">${esc(email.address)}</a>`,
    },
    address.lines.length && {
      icon: 'pin',
      label: 'Endereço',
      value: address.mapsUrl
        ? `<a href="${esc(address.mapsUrl)}" target="_blank" rel="noopener">${address.lines.map(esc).join('<br>')}<span class="sr-only"> (abre o mapa em nova aba)</span></a>`
        : address.lines.map(esc).join('<br>'),
    },
    hours.lines.length && {
      icon: 'clock',
      label: 'Horário de atendimento',
      value: hours.lines.map(esc).join('<br>'),
    },
    social.instagram && {
      icon: 'instagram',
      label: 'Instagram',
      value: `<a href="${esc(social.instagram)}" target="_blank" rel="noopener">${esc(social.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, ''))}<span class="sr-only"> (abre em nova aba)</span></a>`,
    },
  ].filter(Boolean);

const field = ({ id, name, label, type = 'text', attrs = '', textarea = false, optional = false }) => `
        <div class="field${textarea ? ' field--full' : ''}">
          <label class="field__label" for="${id}">${label}${optional ? ' <span class="field__optional">(opcional)</span>' : ''}</label>
          ${
            textarea
              ? `<textarea class="field__input" id="${id}" name="${name}" rows="5" aria-describedby="${id}-error" ${attrs}></textarea>`
              : `<input class="field__input" id="${id}" name="${name}" type="${type}" aria-describedby="${id}-error" ${attrs}>`
          }
          <p class="field__error" id="${id}-error" data-error-for="${id}"></p>
        </div>`;

// Formulário só existe com um serviço real de envio (form.endpoint). O JS mostra a confirmação
// apenas quando o servidor responde com sucesso; sem JS, o envio é um POST comum.
const contactForm = ({ contactSection: s, form }) => `
    <div class="form-card" data-reveal ${delay(2)}>
      <h3 class="form-card__title">${esc(s.formTitle)}</h3>
      <p class="form-card__text">${esc(s.formText)}</p>
      <form class="contact-form" action="${esc(form.endpoint)}" method="post" data-contact-form data-format="${esc(form.format)}">
        ${field({ id: 'cf-nome', name: 'nome', label: 'Nome', attrs: 'autocomplete="name" required minlength="2" maxlength="80"' })}
        ${field({ id: 'cf-email', name: 'email', label: 'E-mail', type: 'email', attrs: 'autocomplete="email" inputmode="email" required maxlength="120" spellcheck="false"' })}
        ${field({ id: 'cf-telefone', name: 'telefone', label: 'Telefone', type: 'tel', optional: true, attrs: 'autocomplete="tel" inputmode="tel" maxlength="20"' })}
        ${field({ id: 'cf-mensagem', name: 'mensagem', label: 'Mensagem', textarea: true, attrs: 'required minlength="10" maxlength="2000"' })}
        <div class="hp" aria-hidden="true">
          <label for="cf-empresa">Não preencha este campo</label>
          <input id="cf-empresa" name="_gotcha" type="text" tabindex="-1" autocomplete="off">
        </div>
        <div class="contact-form__footer">
          <button class="btn btn--wine btn--block" type="submit" data-submit>
            <span data-submit-label>Enviar mensagem</span>${icon('arrow', 'icon btn__arrow')}
          </button>
          <p class="form-hint">Usamos seus dados apenas para responder ao seu contato.</p>
          <p class="form-status" role="status" aria-live="polite" data-form-status></p>
        </div>
      </form>
    </div>`;

export const contactSection = (content) => {
  const { contactSection: s, contact, form } = content;
  const channels = contactChannels(contact);
  const hasForm = Boolean(form.endpoint);
  const wa = contact.whatsapp.number;

  return `
<section class="contact${hasForm ? ' contact--form' : ''}" id="contato" data-tone="light" aria-labelledby="contact-title">
  <div class="contact__grid container">
    <figure class="contact__media" data-reveal="photo">
      ${img(s.photo, { className: 'contact__photo' })}
    </figure>

    <div class="contact__info">
      <p class="eyebrow eyebrow--line" data-reveal>${esc(s.eyebrow)}</p>
      <h2 class="section-title section-title--wine" id="contact-title" data-reveal ${delay(1)}>${esc(s.title.plain)} <em>${esc(s.title.italic)}</em></h2>
      <p class="section-lead" data-reveal ${delay(2)}>${esc(s.text)}</p>
      ${!channels.length && !hasForm ? `<p class="contact__pending" data-reveal ${delay(3)}>${esc(s.pendingText)}</p>` : ''}
      ${
        channels.length
          ? `<ul class="contact-list">${channels
              .map(
                (item, i) => `
        <li class="contact-item" data-reveal ${delay(i + 3)}>
          <span class="contact-item__icon">${icon(item.icon)}</span>
          <div class="contact-item__body">
            <h3 class="contact-item__label">${esc(item.label)}</h3>
            <p class="contact-item__value">${item.value}</p>
          </div>
        </li>`
              )
              .join('')}
      </ul>`
          : ''
      }
      ${
        wa
          ? `<div class="contact__cta" data-reveal ${delay(channels.length + 3)}><a class="btn btn--wine" href="${whatsappUrl(wa, contact.whatsapp.message)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>Conversar no WhatsApp</span><span class="sr-only"> (abre em nova aba)</span></a></div>`
          : ''
      }
    </div>
    ${hasForm ? contactForm(content) : ''}
  </div>
</section>`;
};
