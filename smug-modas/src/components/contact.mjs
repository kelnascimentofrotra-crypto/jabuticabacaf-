import { esc, icon, delay, whatsappUrl } from '../lib.mjs';

// Define como o formulário envia, de acordo com o que está configurado.
export const formMode = ({ form, contact }) => {
  if (form.endpoint) return 'endpoint';
  if (contact.whatsapp.number) return 'whatsapp';
  if (contact.email.address) return 'email';
  return 'unavailable';
};

const PENDING = '<span class="contact-item__pending">Informação a confirmar</span>';

const contactItems = (contact) => {
  const { whatsapp, email, address, hours } = contact;
  return [
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      value: whatsapp.number
        ? `<a href="${whatsappUrl(whatsapp.number)}" target="_blank" rel="noopener">${esc(whatsapp.display || whatsapp.number)}<span class="sr-only"> (abre o WhatsApp)</span></a>`
        : '',
      note: whatsapp.note,
    },
    {
      icon: 'mail',
      label: 'E-mail',
      value: email.address ? `<a href="mailto:${esc(email.address)}">${esc(email.address)}</a>` : '',
      note: email.note,
    },
    {
      icon: 'pin',
      label: 'Endereço',
      value: address.lines.length
        ? address.mapsUrl
          ? `<a href="${esc(address.mapsUrl)}" target="_blank" rel="noopener">${address.lines.map(esc).join('<br>')}<span class="sr-only"> (abre o mapa)</span></a>`
          : address.lines.map(esc).join('<br>')
        : '',
      note: address.note,
    },
    {
      icon: 'clock',
      label: 'Horário de atendimento',
      value: hours.lines.length ? hours.lines.map(esc).join('<br>') : '',
      note: hours.note,
    },
  ];
};

const field = ({ id, name, label, type = 'text', iconName, attrs = '', textarea = false }) => `
  <div class="field${textarea ? ' field--area' : ''}">
    <div class="field__control">
      ${icon(iconName, 'icon field__icon')}
      ${
        textarea
          ? `<textarea class="field__input" id="${id}" name="${name}" rows="4" placeholder=" " aria-describedby="${id}-error" ${attrs}></textarea>`
          : `<input class="field__input" id="${id}" name="${name}" type="${type}" placeholder=" " aria-describedby="${id}-error" ${attrs}>`
      }
      <label class="field__label" for="${id}">${label}</label>
    </div>
    <p class="field__error" id="${id}-error" data-error-for="${id}"></p>
  </div>`;

const HINTS = {
  endpoint: 'Usamos seus dados apenas para responder ao seu contato.',
  whatsapp: 'Ao enviar, abriremos o WhatsApp com a sua mensagem pronta. É só confirmar o envio por lá.',
  email: 'Ao enviar, abriremos o seu aplicativo de e-mail com a mensagem pronta para você confirmar.',
  unavailable: 'O envio on-line ainda está em configuração.',
};

const LABELS = {
  endpoint: 'Enviar mensagem',
  whatsapp: 'Enviar pelo WhatsApp',
  email: 'Enviar por e-mail',
  unavailable: 'Enviar mensagem',
};

export const contactSection = ({ contactSection: s, contact, form }) => {
  const mode = formMode({ form, contact });
  const formAttrs = [
    'class="contact-form"',
    'data-contact-form',
    `data-mode="${mode}"`,
    'novalidate',
    mode === 'endpoint' && `action="${esc(form.endpoint)}" method="post" data-format="${esc(form.format)}"`,
    mode === 'whatsapp' && `data-whatsapp="${esc(contact.whatsapp.number)}"`,
    mode === 'email' && `data-email="${esc(contact.email.address)}"`,
  ].filter(Boolean);

  return `
<section class="contact" id="contato" data-tone="dark" aria-labelledby="contact-title">
  <div class="contact__bg" aria-hidden="true">
    <img src="${esc(s.photo.src)}" width="${s.photo.width}" height="${s.photo.height}" alt="" loading="lazy" decoding="async">
    <span class="contact__monogram">S</span>
  </div>

  <div class="contact__grid container">
    <div class="contact__info">
      <p class="eyebrow eyebrow--line eyebrow--light" data-reveal>${esc(s.eyebrow)}</p>
      <h2 class="section-title section-title--light" id="contact-title" data-reveal ${delay(1)}>
        <span>${esc(s.title.plain)}</span> <em class="text-gold">${esc(s.title.italic)}</em>
      </h2>
      <p class="contact__text" data-reveal ${delay(2)}>${esc(s.text)}</p>

      <ul class="contact-list">
        ${contactItems(contact)
          .map(
            (item, i) => `
        <li class="contact-item" data-reveal ${delay(i)}${item.value ? '' : ' data-pending'}>
          <span class="contact-item__icon">${icon(item.icon)}</span>
          <div class="contact-item__body">
            <h3 class="contact-item__label">${esc(item.label)}</h3>
            <p class="contact-item__value">${item.value || PENDING}</p>
            ${item.value && item.note ? `<p class="contact-item__note">${esc(item.note)}</p>` : ''}
          </div>
        </li>`
          )
          .join('')}
      </ul>
    </div>

    <div class="form-card" data-reveal>
      <h3 class="form-card__title">${esc(s.formTitle)}</h3>
      <p class="form-card__text">${esc(s.formText)}</p>

      <form ${formAttrs.join(' ')}>
        ${field({ id: 'cf-nome', name: 'nome', label: 'Seu nome', iconName: 'user', attrs: 'autocomplete="name" required minlength="2" maxlength="80"' })}
        ${field({ id: 'cf-email', name: 'email', label: 'Seu e-mail', type: 'email', iconName: 'mail', attrs: 'autocomplete="email" inputmode="email" required maxlength="120" spellcheck="false"' })}
        ${field({ id: 'cf-telefone', name: 'telefone', label: 'Seu telefone <span class="field__optional">(opcional)</span>', type: 'tel', iconName: 'whatsapp', attrs: 'autocomplete="tel" inputmode="tel" maxlength="20"' })}
        ${field({ id: 'cf-mensagem', name: 'mensagem', label: 'Sua mensagem…', iconName: 'chat', textarea: true, attrs: 'required minlength="10" maxlength="2000"' })}

        <input type="hidden" name="interesse" value="" data-interest-field>
        <div class="hp" aria-hidden="true">
          <label for="cf-empresa">Não preencha este campo</label>
          <input id="cf-empresa" name="_gotcha" type="text" tabindex="-1" autocomplete="off">
        </div>

        <button class="btn btn--gold btn--block" type="submit" data-submit>
          <span data-submit-label>${esc(LABELS[mode])}</span>
          ${icon('arrow', 'icon btn__arrow')}
        </button>
        <p class="form-hint">${esc(HINTS[mode])}</p>
        ${mode === 'endpoint' ? '' : '<noscript><p class="form-hint">Ative o JavaScript do navegador para enviar pelo formulário.</p></noscript>'}
        <p class="form-status" role="status" aria-live="polite" data-form-status></p>
      </form>
    </div>
  </div>
</section>`;
};
