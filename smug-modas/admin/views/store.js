import { esc, ico, field, textarea, select, toggle, toast, formValues, bindCounters, bindErrorClear, lines, whatsappNumber, isValidWhatsapp, formatPhone, isUrl, isEmail, waLink } from '../ui.js';

// Dados da loja: contato, formulário, condições comerciais e informações do site (SEO).
export async function storeView(app, root) {
  const { contact, form, heroBenefits, site } = app.content;

  root.innerHTML = `
  <section class="page-head">
    <div><p class="eyebrow">Site</p><h2 class="page-title">Dados da loja</h2>
    <p class="muted">Use apenas informações confirmadas. Campos vazios não aparecem no site como link.</p></div>
  </section>
  <form class="stack" novalidate data-form>
    <section class="card">
      <h3 class="card__title">${ico('whatsapp')}WhatsApp</h3>
      <div class="fields">
        ${field({ label: 'Número', name: 'waNumber', value: contact.whatsapp.number ? formatPhone(contact.whatsapp.number) : '', type: 'tel', extra: { inputmode: 'tel', autocomplete: 'off' }, placeholder: '(11) 91234-5678', hint: 'Com DDD. O código do Brasil (55) é adicionado automaticamente.' })}
        ${field({ label: 'Como o número aparece no site', name: 'waDisplay', value: contact.whatsapp.display, placeholder: '(11) 91234-5678', hint: 'Em branco, usamos o número formatado.' })}
        ${field({ label: 'Frase abaixo do número', name: 'waNote', value: contact.whatsapp.note, wide: true })}
      </div>
      <p class="inline-actions"><button class="btn btn--ghost btn--sm" type="button" data-test-wa>${ico('external')}Testar link do WhatsApp</button></p>
    </section>

    <section class="card">
      <h3 class="card__title">Contato e endereço</h3>
      <div class="fields">
        ${field({ label: 'E-mail', name: 'email', value: contact.email.address, type: 'email', placeholder: 'contato@…' })}
        ${field({ label: 'Frase abaixo do e-mail', name: 'emailNote', value: contact.email.note })}
        ${textarea({ label: 'Endereço', name: 'address', value: contact.address.lines.join('\n'), rows: 2, placeholder: 'Rua …, 123 - Bairro\nCidade - UF', hint: 'Uma linha por quebra.' })}
        ${field({ label: 'Link do mapa', name: 'mapsUrl', value: contact.address.mapsUrl, type: 'url', placeholder: 'https://maps.app.goo.gl/…', hint: 'No Google Maps: Compartilhar → Copiar link. Ativa o botão “Venha nos visitar”.' })}
        ${field({ label: 'Frase abaixo do endereço', name: 'addressNote', value: contact.address.note })}
        ${textarea({ label: 'Horário de atendimento', name: 'hours', value: contact.hours.lines.join('\n'), rows: 2, placeholder: 'Segunda a sábado\n9h às 18h' })}
        ${field({ label: 'Frase abaixo do horário', name: 'hoursNote', value: contact.hours.note })}
        ${field({ label: 'Instagram', name: 'instagram', value: contact.social.instagram, type: 'url', placeholder: 'https://www.instagram.com/…', wide: true })}
      </div>
    </section>

    <section class="card">
      <h3 class="card__title">Formulário de contato</h3>
      <p class="muted">Sem serviço de envio, o formulário usa o WhatsApp (ou o e-mail) e nunca finge que a mensagem foi entregue.</p>
      <div class="fields">
        ${field({ label: 'Endereço do serviço de envio', name: 'endpoint', value: form.endpoint, type: 'url', placeholder: 'https://formspree.io/f/…', wide: true, hint: 'Ex.: Formspree, Web3Forms, Getform. Cole só a URL pública do formulário — nunca uma chave secreta.' })}
        ${select({ label: 'Formato de envio', name: 'format', value: form.format, options: [{ value: 'json', label: 'JSON (Formspree e a maioria)' }, { value: 'form', label: 'Formulário (multipart)' }] })}
      </div>
    </section>

    <section class="card">
      <h3 class="card__title">Condições comerciais (topo do site)</h3>
      <p class="muted">Marque “confirmada” só se a loja realmente oferece a condição. As não confirmadas continuam aparecendo, mas o painel as lista como pendência.</p>
      <div class="benefit-rows">
        ${heroBenefits
          .map(
            (b, i) => `
          <div class="benefit-row">
            ${field({ label: `Título ${i + 1}`, name: `bTitle-${i}`, value: b.title })}
            ${field({ label: 'Texto', name: `bText-${i}`, value: b.text })}
            ${toggle({ label: 'Confirmada pela loja', name: `bConfirmed-${i}`, checked: b.confirmed })}
          </div>`
          )
          .join('')}
      </div>
    </section>

    <section class="card">
      <h3 class="card__title">Site e Google</h3>
      <div class="fields">
        ${field({ label: 'Endereço do site', name: 'siteUrl', value: site.url, type: 'url', placeholder: 'https://www.smugmodas.com.br', wide: true, hint: 'Sem barra no final. Usado no Google e no compartilhamento.' })}
        ${field({ label: 'Título da página', name: 'title', value: site.title, wide: true, counter: 70, hint: 'Aparece na aba do navegador e no Google.' })}
        ${textarea({ label: 'Descrição para o Google', name: 'description', value: site.description, rows: 3, counter: 170 })}
      </div>
    </section>

    <div class="form-bar">
      <span class="form-bar__spacer"></span>
      <button class="btn btn--primary" type="submit">${ico('check')}Salvar dados</button>
    </div>
  </form>`;

  const formEl = root.querySelector('[data-form]');
  bindCounters(formEl);
  bindErrorClear(formEl);
  formEl.addEventListener('input', () => {
    app.formDirty = true;
  });

  formEl.querySelector('[data-test-wa]').addEventListener('click', () => {
    const number = whatsappNumber(formEl.querySelector('[name="waNumber"]').value);
    if (!isValidWhatsapp(number)) {
      toast('Digite o número com DDD para testar.', 'error');
      return;
    }
    window.open(waLink(number, 'Teste do link do site da SMUG MODAS'), '_blank', 'noopener');
  });

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    const v = formValues(formEl);
    const number = v.waNumber ? whatsappNumber(v.waNumber) : '';
    const errors = [];
    if (number && !isValidWhatsapp(number)) errors.push(['waNumber', 'Número inválido. Use DDD + número, ex.: (11) 91234-5678.']);
    if (v.email && !isEmail(v.email)) errors.push(['email', 'E-mail inválido.']);
    for (const name of ['mapsUrl', 'instagram', 'endpoint', 'siteUrl']) if (v[name] && !isUrl(v[name])) errors.push([name, 'O link precisa começar com https://']);
    if (v.siteUrl.endsWith('/')) errors.push(['siteUrl', 'Remova a barra “/” do final.']);

    formEl.querySelectorAll('.field-error').forEach((e) => e.remove());
    formEl.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
    if (errors.length) {
      for (const [name, message] of errors) {
        const input = formEl.querySelector(`[name="${name}"]`);
        input.setAttribute('aria-invalid', 'true');
        input.closest('.field').insertAdjacentHTML('beforeend', `<p class="field-error" role="alert">${esc(message)}</p>`);
      }
      formEl.querySelector('[aria-invalid="true"]').focus();
      toast('Revise os campos destacados.', 'error');
      return;
    }

    app.update((c) => {
      c.contact.whatsapp = { ...c.contact.whatsapp, number, display: number ? v.waDisplay || formatPhone(number) : '', note: v.waNote };
      c.contact.email = { ...c.contact.email, address: v.email, note: v.emailNote };
      c.contact.address = { ...c.contact.address, lines: lines(v.address), mapsUrl: v.mapsUrl, note: v.addressNote };
      c.contact.hours = { ...c.contact.hours, lines: lines(v.hours), note: v.hoursNote };
      c.contact.social = { ...c.contact.social, instagram: v.instagram };
      c.form = { ...c.form, endpoint: v.endpoint, format: v.format };
      c.heroBenefits = c.heroBenefits.map((b, i) => ({ ...b, title: v[`bTitle-${i}`], text: v[`bText-${i}`], confirmed: v[`bConfirmed-${i}`] }));
      c.site = { ...c.site, url: v.siteUrl, title: v.title, description: v.description };
    });
    app.formDirty = false;
    toast('Dados salvos. Publique para aplicar no site.', 'success');
  });
}
