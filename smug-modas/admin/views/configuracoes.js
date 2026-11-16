import { esc, ico, field, textarea, select, toggle, toast, formValues, bindCounters, bindErrorClear, lines, whatsappNumber, isValidWhatsapp, formatPhone, isUrl, isEmail, waLink } from '../ui.js';
import { pageHead, showErrors, busy } from './shared.js';
import { api } from '../api.js';
import { showLogin } from '../app.js';

const TABS = [
  ['loja', 'Dados da loja'],
  ['textos', 'Textos do site'],
  ['conta', 'Conta'],
];

const paragraphs = (text) =>
  String(text)
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);

const group = (title, body, open = false) => `
  <details class="panel group"${open ? ' open' : ''}>
    <summary><h3 class="group__title">${title}</h3>${ico('down')}</summary>
    <div class="fields">${body}</div>
  </details>`;

const pairFields = (prefix, items, label = 'Item') =>
  items
    .map(
      (b, i) => `
      ${field({ label: `${label} ${i + 1} — título`, name: `${prefix}Title-${i}`, value: b.title })}
      ${field({ label: `${label} ${i + 1} — texto`, name: `${prefix}Text-${i}`, value: b.text })}`
    )
    .join('');

const saveBar = (label) => `
  <div class="form-bar">
    <span class="form-bar__spacer"></span>
    <button class="btn btn--wine" type="submit" data-submit>${ico('check')}<span>${label}</span></button>
  </div>`;

/* ---------- Dados da loja ---------- */
function lojaTab(app, box) {
  const { contact, form, heroBenefits } = app.content;
  box.innerHTML = `
  <form class="stack" novalidate data-form>
    <p class="note">${ico('alert')}<span>Use só informações confirmadas. Campo vazio não aparece no site — nenhum link é criado sem o dado real.</span></p>
    <section class="panel">
      <h2 class="panel__title">${ico('whatsapp')}WhatsApp</h2>
      <div class="fields">
        ${field({ label: 'Número', name: 'waNumber', value: contact.whatsapp.number ? formatPhone(contact.whatsapp.number) : '', type: 'tel', extra: { inputmode: 'tel', autocomplete: 'off' }, placeholder: '(11) 91234-5678', hint: 'Com DDD. O código do Brasil (55) é adicionado sozinho.' })}
        ${field({ label: 'Como o número aparece no site', name: 'waDisplay', value: contact.whatsapp.display, placeholder: '(11) 91234-5678', hint: 'Em branco, usamos o número formatado.' })}
        ${field({ label: 'Frase abaixo do número', name: 'waNote', value: contact.whatsapp.note, wide: true })}
      </div>
      <p class="inline-actions"><button class="btn btn--line btn--sm" type="button" data-test-wa>${ico('external')}<span>Testar o link</span></button></p>
    </section>

    <section class="panel">
      <h2 class="panel__title">Contato e endereço</h2>
      <div class="fields">
        ${field({ label: 'E-mail', name: 'email', value: contact.email.address, type: 'email', placeholder: 'contato@…' })}
        ${field({ label: 'Frase abaixo do e-mail', name: 'emailNote', value: contact.email.note })}
        ${textarea({ label: 'Endereço', name: 'address', value: contact.address.lines.join('\n'), rows: 2, placeholder: 'Rua …, 123 - Bairro\nCidade - UF', hint: 'Uma linha por quebra.' })}
        ${field({ label: 'Link do mapa', name: 'mapsUrl', value: contact.address.mapsUrl, type: 'url', placeholder: 'https://maps.app.goo.gl/…', hint: 'No Google Maps: Compartilhar → Copiar link.' })}
        ${field({ label: 'Frase abaixo do endereço', name: 'addressNote', value: contact.address.note })}
        ${textarea({ label: 'Horário de atendimento', name: 'hours', value: contact.hours.lines.join('\n'), rows: 2, placeholder: 'Segunda a sábado\n9h às 18h' })}
        ${field({ label: 'Frase abaixo do horário', name: 'hoursNote', value: contact.hours.note })}
        ${field({ label: 'Instagram', name: 'instagram', value: contact.social.instagram, type: 'url', placeholder: 'https://www.instagram.com/…', wide: true })}
      </div>
    </section>

    <section class="panel">
      <h2 class="panel__title">Formulário de contato</h2>
      <p class="muted">Sem um serviço de envio, o formulário do site encaminha a mensagem pelo WhatsApp (ou e-mail) e nunca diz que ela foi entregue sem confirmação.</p>
      <div class="fields">
        ${field({ label: 'Endereço do serviço de envio', name: 'endpoint', value: form.endpoint, type: 'url', placeholder: 'https://formspree.io/f/…', wide: true, hint: 'Ex.: Formspree ou Web3Forms. Cole só a URL pública do formulário — nunca uma chave secreta.' })}
        ${select({ label: 'Formato de envio', name: 'format', value: form.format, options: [{ value: 'json', label: 'JSON (Formspree e a maioria)' }, { value: 'form', label: 'Formulário (multipart)' }] })}
      </div>
    </section>

    <section class="panel">
      <h2 class="panel__title">Vantagens da abertura</h2>
      <p class="muted">As quatro vantagens no vidro da abertura do site. Marque como confirmada só o que a loja realmente oferece.</p>
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
    ${saveBar('Salvar e publicar')}
  </form>`;

  const formEl = box.querySelector('[data-form]');
  bindCounters(formEl);
  bindErrorClear(formEl);
  formEl.addEventListener('input', () => {
    app.formDirty = true;
  });
  formEl.querySelector('[data-test-wa]').addEventListener('click', () => {
    const number = whatsappNumber(formEl.querySelector('[name="waNumber"]').value);
    if (!isValidWhatsapp(number)) return toast('Digite o número com DDD para testar.', 'error');
    window.open(waLink(number, 'Teste do link do site da SMUG MODAS'), '_blank', 'noopener');
  });

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    const v = formValues(formEl);
    const number = v.waNumber ? whatsappNumber(v.waNumber) : '';
    const errors = [];
    if (number && !isValidWhatsapp(number)) errors.push(['waNumber', 'Número inválido. Use DDD + número, ex.: (11) 91234-5678.']);
    if (v.email && !isEmail(v.email)) errors.push(['email', 'E-mail inválido.']);
    for (const name of ['mapsUrl', 'instagram', 'endpoint']) if (v[name] && !isUrl(v[name])) errors.push([name, 'O link precisa começar com https://']);
    heroBenefits.forEach((_, i) => {
      if (!v[`bTitle-${i}`]) errors.push([`bTitle-${i}`, 'Informe o título.']);
    });
    if (showErrors(formEl, errors)) return;

    const button = formEl.querySelector('[data-submit]');
    busy(button, true);
    const ok = await app.publish(
      (c) => {
        c.contact.whatsapp = { ...c.contact.whatsapp, number, display: number ? v.waDisplay || formatPhone(number) : '', note: v.waNote };
        c.contact.email = { ...c.contact.email, address: v.email, note: v.emailNote };
        c.contact.address = { ...c.contact.address, lines: lines(v.address), mapsUrl: v.mapsUrl, note: v.addressNote };
        c.contact.hours = { ...c.contact.hours, lines: lines(v.hours), note: v.hoursNote };
        c.contact.social = { ...c.contact.social, instagram: v.instagram };
        c.form = { ...c.form, endpoint: v.endpoint, format: v.format };
        c.heroBenefits = c.heroBenefits.map((b, i) => ({ ...b, title: v[`bTitle-${i}`], text: v[`bText-${i}`], confirmed: v[`bConfirmed-${i}`] }));
      },
      { success: 'Dados da loja publicados no site.' }
    );
    busy(button, false);
    if (ok) {
      lojaTab(app, box);
      box.focus({ preventScroll: true });
    }
  });
}

/* ---------- Textos do site ---------- */
function textosTab(app, box) {
  const { hero, marquee, products, posts, store, about, contactSection, footer } = app.content;
  box.innerHTML = `
  <form class="stack" novalidate data-form>
    <p class="muted">Tudo o que está escrito nas seções do site, na ordem em que aparecem. Abra uma seção para editar.</p>
    ${group(
      'Abertura',
      `${textarea({ label: 'Frase ao lado do SMUG', name: 'tagline', value: hero.tagline.join('\n'), rows: 3, hint: 'Uma linha por quebra (até 3 linhas).' })}
       ${field({ label: 'Descrição da foto da Fabielly', name: 'heroAlt', value: hero.photo.alt, wide: true })}`,
      true
    )}
    ${group('Faixa em movimento', textarea({ label: 'Frases', name: 'marquee', value: marquee.join('\n'), rows: 4, hint: 'Uma frase por linha.' }))}
    ${group(
      'Vitrine de produtos',
      `${field({ label: 'Sobretítulo', name: 'pEyebrow', value: products.eyebrow, hint: 'Também é o nome do item no menu.' })}
       ${field({ label: 'Título', name: 'pPlain', value: products.title.plain })}
       ${field({ label: 'Título (itálico)', name: 'pItalic', value: products.title.italic })}
       ${textarea({ label: 'Texto', name: 'pText', value: products.text, rows: 2, counter: 200 })}
       ${textarea({ label: 'Mensagem do WhatsApp (peça disponível)', name: 'pMsg', value: products.whatsappMessage, rows: 2, hint: '{produto} vira o nome da peça.' })}
       ${textarea({ label: 'Mensagem do WhatsApp (peça esgotada)', name: 'pSoldMsg', value: products.soldOutMessage, rows: 2, hint: '{produto} vira o nome da peça.' })}`
    )}
    ${group(
      'Mural de postagens',
      `${field({ label: 'Sobretítulo', name: 'mEyebrow', value: posts.eyebrow })}
       ${field({ label: 'Nome no menu', name: 'mNav', value: posts.navLabel })}
       ${field({ label: 'Título', name: 'mPlain', value: posts.title.plain })}
       ${field({ label: 'Título (itálico)', name: 'mItalic', value: posts.title.italic })}
       ${textarea({ label: 'Texto', name: 'mText', value: posts.text, rows: 2, counter: 200 })}`
    )}
    ${group(
      'Nossa loja',
      `${field({ label: 'Sobretítulo', name: 'sEyebrow', value: store.eyebrow })}
       ${field({ label: 'Texto do botão', name: 'sCta', value: store.cta })}
       ${field({ label: 'Título', name: 'sPlain', value: store.title.plain })}
       ${field({ label: 'Título (itálico)', name: 'sItalic', value: store.title.italic })}
       ${textarea({ label: 'Parágrafos', name: 'sParagraphs', value: store.paragraphs.join('\n\n'), rows: 6, hint: 'Separe os parágrafos com uma linha em branco.' })}
       ${pairFields('sb', store.benefits)}`
    )}
    ${group(
      'Sobre a Fabielly',
      `${field({ label: 'Sobretítulo', name: 'aEyebrow', value: about.eyebrow })}
       ${field({ label: 'Título', name: 'aTitle', value: about.title })}
       ${textarea({ label: 'Citação', name: 'aQuote', value: about.quote.join('\n'), rows: 2, hint: 'Uma linha por quebra.' })}
       ${textarea({ label: 'Parágrafos', name: 'aParagraphs', value: about.paragraphs.join('\n\n'), rows: 7, hint: 'Separe os parágrafos com uma linha em branco.' })}
       ${field({ label: 'Assinatura', name: 'aSignature', value: about.signature })}
       ${field({ label: 'Cargo', name: 'aRole', value: about.role })}
       ${pairFields('av', about.values, 'Valor')}`
    )}
    ${group(
      'Contato',
      `${field({ label: 'Sobretítulo', name: 'cEyebrow', value: contactSection.eyebrow })}
       ${field({ label: 'Título', name: 'cPlain', value: contactSection.title.plain })}
       ${field({ label: 'Título (itálico)', name: 'cItalic', value: contactSection.title.italic })}
       ${textarea({ label: 'Texto', name: 'cText', value: contactSection.text, rows: 3 })}
       ${field({ label: 'Título do formulário', name: 'cFormTitle', value: contactSection.formTitle })}
       ${field({ label: 'Texto do formulário', name: 'cFormText', value: contactSection.formText, wide: true })}`
    )}
    ${group('Rodapé', field({ label: 'Frase em letra cursiva', name: 'fTagline', value: footer.tagline, wide: true }))}
    ${saveBar('Salvar e publicar')}
  </form>`;

  const form = box.querySelector('[data-form]');
  bindCounters(form);
  bindErrorClear(form);
  form.addEventListener('input', () => {
    app.formDirty = true;
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const v = formValues(form);
    const tagline = lines(v.tagline);
    const errors = [];
    if (!tagline.length || tagline.length > 3) errors.push(['tagline', 'A frase da abertura precisa ter de 1 a 3 linhas.']);
    if (!lines(v.marquee).length) errors.push(['marquee', 'Escreva pelo menos uma frase.']);
    for (const name of ['pPlain', 'mPlain', 'mNav', 'sPlain', 'aTitle', 'cPlain']) if (!v[name]) errors.push([name, 'Este campo não pode ficar vazio.']);
    if (errors.length) {
      // abre a seção do primeiro erro para ele ficar visível
      for (const [name] of errors) form.querySelector(`[name="${name}"]`)?.closest('details')?.setAttribute('open', '');
    }
    if (showErrors(form, errors)) return;

    const button = form.querySelector('[data-submit]');
    busy(button, true);
    const ok = await app.publish(
      (c) => {
        c.hero.tagline = tagline;
        c.hero.photo.alt = v.heroAlt;
        c.marquee = lines(v.marquee);
        Object.assign(c.products, {
          eyebrow: v.pEyebrow,
          title: { plain: v.pPlain, italic: v.pItalic },
          text: v.pText,
          whatsappMessage: v.pMsg,
          soldOutMessage: v.pSoldMsg,
        });
        Object.assign(c.posts, { eyebrow: v.mEyebrow, navLabel: v.mNav, title: { plain: v.mPlain, italic: v.mItalic }, text: v.mText });
        Object.assign(c.store, {
          eyebrow: v.sEyebrow,
          cta: v.sCta,
          title: { plain: v.sPlain, italic: v.sItalic },
          paragraphs: paragraphs(v.sParagraphs),
          benefits: c.store.benefits.map((b, i) => ({ ...b, title: v[`sbTitle-${i}`], text: v[`sbText-${i}`] })),
        });
        Object.assign(c.about, {
          eyebrow: v.aEyebrow,
          title: v.aTitle,
          quote: lines(v.aQuote),
          paragraphs: paragraphs(v.aParagraphs),
          signature: v.aSignature,
          role: v.aRole,
          values: c.about.values.map((b, i) => ({ ...b, title: v[`avTitle-${i}`], text: v[`avText-${i}`] })),
        });
        Object.assign(c.contactSection, {
          eyebrow: v.cEyebrow,
          title: { plain: v.cPlain, italic: v.cItalic },
          text: v.cText,
          formTitle: v.cFormTitle,
          formText: v.cFormText,
        });
        c.footer.tagline = v.fTagline;
      },
      { success: 'Textos publicados no site.' }
    );
    busy(button, false);
    if (ok) app.formDirty = false;
  });
}

/* ---------- Conta ---------- */
function contaTab(app, box) {
  box.innerHTML = `
  <div class="stack">
    <section class="panel account">
      <span class="account__avatar" aria-hidden="true">${esc((app.email[0] || 'S').toUpperCase())}</span>
      <div>
        <p class="account__label">Conectada como</p>
        <p class="account__email">${esc(app.email)}</p>
      </div>
      <button class="btn btn--line btn--sm account__out" type="button" data-out>${ico('lock')}<span>Sair do painel</span></button>
    </section>

    <form class="panel" novalidate data-form>
      <h2 class="panel__title">Trocar e-mail ou senha</h2>
      <p class="muted">Ao salvar, o painel é desconectado em todos os outros aparelhos.</p>
      <div class="fields">
        ${field({ label: 'E-mail de acesso', name: 'email', value: app.email, type: 'email', extra: { autocomplete: 'username', spellcheck: 'false' }, wide: true })}
        ${field({ label: 'Senha atual', name: 'current', type: 'password', required: true, extra: { autocomplete: 'current-password' } })}
        ${field({ label: 'Nova senha (mínimo 8 caracteres)', name: 'password', type: 'password', extra: { autocomplete: 'new-password' }, hint: 'Em branco, a senha continua a mesma.' })}
        ${field({ label: 'Confirmar a nova senha', name: 'confirm', type: 'password', extra: { autocomplete: 'new-password' } })}
      </div>
      <div class="form-bar form-bar--plain">
        <span class="form-bar__spacer"></span>
        <button class="btn btn--wine" type="submit" data-submit>${ico('check')}<span>Salvar acesso</span></button>
      </div>
    </form>

    <section class="panel">
      <h2 class="panel__title">Como funciona</h2>
      <ul class="howto">
        <li><strong>Publicação direta.</strong> Cada “Salvar e publicar” atualiza o site na hora — sem precisar de outro programa.</li>
        <li><strong>Fotos.</strong> São reduzidas e otimizadas no próprio aparelho antes do envio.</li>
        <li><strong>Dois aparelhos ao mesmo tempo.</strong> Se o site mudar em outro aparelho, o painel avisa e carrega a versão mais nova antes de salvar, para nada se perder.</li>
        <li><strong>Esqueceu a senha?</strong> Quem cuida da hospedagem do site pode liberar um novo acesso.</li>
      </ul>
    </section>
  </div>`;

  box.querySelector('[data-out]').addEventListener('click', () => document.querySelector('[data-logout]').click());

  const form = box.querySelector('[data-form]');
  bindErrorClear(form);
  form.addEventListener('input', () => {
    app.formDirty = true;
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const v = formValues(form);
    const errors = [];
    if (!isEmail(v.email)) errors.push(['email', 'Digite um e-mail válido.']);
    if (!form.elements.current.value) errors.push(['current', 'Digite a senha atual.']);
    if (form.elements.password.value && form.elements.password.value.length < 8) errors.push(['password', 'A nova senha precisa ter pelo menos 8 caracteres.']);
    if (form.elements.password.value !== form.elements.confirm.value) errors.push(['confirm', 'As senhas não conferem.']);
    if (!form.elements.password.value && v.email.toLowerCase() === app.email) errors.push(['email', 'Nada mudou: altere o e-mail ou digite uma nova senha.']);
    if (showErrors(form, errors)) return;

    const button = form.querySelector('[data-submit]');
    busy(button, true, 'Salvando…');
    try {
      const result = await api.changePassword(form.elements.current.value, v.email, form.elements.password.value);
      app.email = result.email || v.email.toLowerCase();
      app.formDirty = false;
      toast('Acesso atualizado. Use os novos dados no próximo login.', 'success', 6000);
      contaTab(app, box);
      box.focus({ preventScroll: true });
    } catch (error) {
      busy(button, false);
      if (error.status === 401) {
        toast('Sua sessão expirou. Entre de novo para continuar.', 'error', 7000);
        showLogin({ setupRequired: false });
        return;
      }
      form.elements.current.value = '';
      showErrors(form, [['current', error.message]]);
    }
  });
}

const VIEWS = { loja: lojaTab, textos: textosTab, conta: contaTab };

export async function configuracoesView(app, root) {
  const query = new URLSearchParams(location.hash.split('?')[1] || '');
  let current = VIEWS[query.get('aba')] ? query.get('aba') : 'loja';

  root.innerHTML = `
  ${pageHead({
    eyebrow: 'Painel da SMUG MODAS',
    plain: 'Suas',
    italic: 'configurações',
    text: 'Dados de contato, textos das seções e o seu acesso ao painel.',
  })}
  <div class="container page-body">
    <div class="segtabs" role="tablist" aria-label="Configurações">
      ${TABS.map(([id, label]) => `<button class="segtabs__tab" type="button" role="tab" id="tab-${id}" aria-controls="aba" data-tab="${id}">${label}</button>`).join('')}
    </div>
    <div id="aba" role="tabpanel" tabindex="-1" data-panel></div>
  </div>`;

  const panel = root.querySelector('[data-panel]');
  const show = (id) => {
    current = id;
    root.querySelectorAll('[data-tab]').forEach((tab) => {
      const on = tab.dataset.tab === id;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    VIEWS[id](app, panel);
  };
  const tablist = root.querySelector('[role="tablist"]');
  tablist.addEventListener('click', async (event) => {
    const tab = event.target.closest('[data-tab]');
    if (!tab || tab.dataset.tab === current) return;
    if (app.formDirty) {
      const { confirmDialog } = await import('../ui.js');
      const leave = await confirmDialog({ title: 'Trocar de aba sem salvar?', text: 'As alterações desta aba ainda não foram publicadas.', confirm: 'Trocar sem salvar', cancel: 'Continuar editando', danger: true });
      if (!leave) return;
      app.formDirty = false;
    }
    show(tab.dataset.tab);
  });
  tablist.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...tablist.querySelectorAll('[data-tab]')];
    const i = tabs.findIndex((t) => t.dataset.tab === current);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus();
    tabs[next].click();
  });
  show(current);
}
