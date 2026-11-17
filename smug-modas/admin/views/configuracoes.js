// Configurações (uma página, como no painel do Marcos) e Minha conta (aberta pelo topo).
import { esc, ico, field, textarea, select, toast, formValues, bindCounters, bindErrorClear, lines, whatsappNumber, isValidWhatsapp, formatPhone, isUrl, isEmail, waLink } from '../ui.js';
import { pageHead, showErrors, busy } from './shared.js';
import { api } from '../api.js';
import { showLogin } from '../app.js';

const paragraphs = (text) =>
  String(text)
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);

const group = (title, body, open = false) => `
  <details class="group"${open ? ' open' : ''}>
    <summary>${title}${ico('down')}</summary>
    <div class="grid">${body}</div>
  </details>`;

const pairFields = (prefix, items, label = 'Item') =>
  items
    .map(
      (b, i) => `
      ${field({ label: `${label} ${i + 1} — título`, name: `${prefix}Title-${i}`, value: b.title })}
      ${field({ label: `${label} ${i + 1} — texto`, name: `${prefix}Text-${i}`, value: b.text })}`
    )
    .join('');

const GA_ID = /^G-[A-Z0-9]{4,14}$/;
const CNPJ = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;

export async function configuracoesView(app, root) {
  const c = app.content;
  const { contact, form, heroBenefits, hero, marquee, products, posts, store, about, contactSection, footer, site } = c;
  const analytics = c.analytics || { gaId: '' };

  root.innerHTML = `
    ${pageHead('Configurações', 'Dados de contato e textos que aparecem no site. Use só informações confirmadas: campo vazio não aparece no site.')}
    <form class="form form--single" novalidate data-form>
      <div class="form-main">
        <section class="panel">
          <h2 class="panel-title">Contato</h2>
          <div class="grid">
            ${field({ label: 'WhatsApp', name: 'waNumber', value: contact.whatsapp.number ? formatPhone(contact.whatsapp.number) : '', type: 'tel', extra: { inputmode: 'tel', autocomplete: 'off' }, placeholder: '(11) 91234-5678', hint: 'Com DDD. Recebe as mensagens dos botões do site.' })}
            ${field({ label: 'Como o número aparece no site', name: 'waDisplay', value: contact.whatsapp.display, placeholder: '(11) 91234-5678', hint: 'Em branco, usamos o número formatado.' })}
            ${field({ label: 'Frase abaixo do WhatsApp', name: 'waNote', value: contact.whatsapp.note, wide: true })}
            ${field({ label: 'E-mail', name: 'email', value: contact.email.address, type: 'email', placeholder: 'contato@…' })}
            ${field({ label: 'Frase abaixo do e-mail', name: 'emailNote', value: contact.email.note })}
            ${field({ label: 'Instagram', name: 'instagram', value: contact.social.instagram, type: 'url', placeholder: 'https://www.instagram.com/…', wide: true })}
          </div>
          <p style="margin-top:14px"><button class="btn btn-sm" type="button" data-test-wa>${ico('whatsapp')}<span>Testar o link do WhatsApp</span></button></p>
        </section>

        <section class="panel">
          <h2 class="panel-title">Endereço e horário</h2>
          <div class="grid">
            ${textarea({ label: 'Endereço', name: 'address', value: contact.address.lines.join('\n'), rows: 2, placeholder: 'Rua …, 123 - Bairro\nCidade - UF', hint: 'Uma linha por quebra.', wide: false })}
            ${textarea({ label: 'Horário de atendimento', name: 'hours', value: contact.hours.lines.join('\n'), rows: 2, placeholder: 'Segunda a sábado\n9h às 18h', wide: false })}
            ${field({ label: 'Link do mapa', name: 'mapsUrl', value: contact.address.mapsUrl, type: 'url', placeholder: 'https://maps.app.goo.gl/…', hint: 'No Google Maps: Compartilhar → Copiar link.' })}
            ${field({ label: 'Frase abaixo do endereço', name: 'addressNote', value: contact.address.note })}
            ${field({ label: 'Frase abaixo do horário', name: 'hoursNote', value: contact.hours.note, wide: true })}
          </div>
        </section>

        <section class="panel">
          <h2 class="panel-title">Dados da empresa no rodapé</h2>
          <p class="hint">Opcional. Aparecem no fim do site, ao lado dos direitos reservados.</p>
          <div class="grid">
            ${field({ label: 'Razão social', name: 'legalName', value: site.legalName || '', placeholder: 'Como está no CNPJ' })}
            ${field({ label: 'CNPJ', name: 'cnpj', value: site.cnpj || '', extra: { inputmode: 'numeric' }, placeholder: '00.000.000/0000-00' })}
          </div>
        </section>

        <section class="panel">
          <h2 class="panel-title">Formulário de contato</h2>
          <p class="hint">Sem um serviço de envio, o formulário encaminha a mensagem pelo WhatsApp (ou e-mail) e nunca diz que ela foi entregue sem confirmação.</p>
          <div class="grid">
            ${field({ label: 'Endereço do serviço de envio', name: 'endpoint', value: form.endpoint, type: 'url', placeholder: 'https://formspree.io/f/…', wide: true, hint: 'Ex.: Formspree ou Web3Forms. Cole só a URL pública do formulário — nunca uma chave secreta.' })}
            ${select({ label: 'Formato de envio', name: 'format', value: form.format, options: [{ value: 'json', label: 'JSON (Formspree e a maioria)' }, { value: 'form', label: 'Formulário (multipart)' }] })}
          </div>
        </section>

        <section class="panel">
          <h2 class="panel-title">Google Analytics</h2>
          <p class="hint">Opcional. Com o ID preenchido, o site mostra o aviso de cookies e só conta as visitas de quem clicar em “Aceitar”.</p>
          <div class="grid">
            ${field({ label: 'ID de medição', name: 'gaId', value: analytics.gaId || '', placeholder: 'G-XXXXXXXXXX', hint: 'No Google Analytics: Administrador → Fluxos de dados → ID da métrica.' })}
          </div>
        </section>

        <section class="panel">
          <h2 class="panel-title">Vantagens da abertura</h2>
          <p class="hint">As quatro vantagens no vidro da abertura do site. Marque como confirmada só o que a loja realmente oferece.</p>
          ${heroBenefits
            .map(
              (b, i) => `
            <div class="benefit-row">
              ${field({ label: `Título ${i + 1}`, name: `bTitle-${i}`, value: b.title })}
              ${field({ label: 'Texto', name: `bText-${i}`, value: b.text })}
              <label class="switch" style="padding-bottom:10px"><input type="checkbox" role="switch" name="bConfirmed-${i}"${b.confirmed ? ' checked' : ''}><span class="switch-ui" aria-hidden="true"></span><span>Confirmada</span></label>
            </div>`
            )
            .join('')}
        </section>

        <section class="panel">
          <h2 class="panel-title">Textos do site</h2>
          <p class="hint">Tudo o que está escrito nas seções, na ordem em que aparecem. Abra uma seção para editar.</p>
          ${group(
            'Abertura',
            `${textarea({ label: 'Frase ao lado do SMUG', name: 'tagline', value: hero.tagline.join('\n'), rows: 3, hint: 'Uma linha por quebra (até 3 linhas).' })}
             ${field({ label: 'Descrição da foto da Fabielly', name: 'heroAlt', value: hero.photo.alt, wide: true })}`
          )}
          ${group('Faixa em movimento', textarea({ label: 'Frases', name: 'marquee', value: marquee.join('\n'), rows: 4, hint: 'Uma frase por linha.' }))}
          ${group(
            'Vitrine de produtos',
            `${field({ label: 'Sobretítulo', name: 'pEyebrow', value: products.eyebrow, hint: 'Também é o nome no menu do site.' })}
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
             ${field({ label: 'Título do formulário', name: 'cFormTitle', value: contactSection.formTitle })}
             ${textarea({ label: 'Texto', name: 'cText', value: contactSection.text, rows: 3 })}
             ${field({ label: 'Texto do formulário', name: 'cFormText', value: contactSection.formText, wide: true })}`
          )}
          ${group('Rodapé', field({ label: 'Frase em letra cursiva', name: 'fTagline', value: footer.tagline, wide: true }))}
        </section>

        <div class="form-bar form-bar--sticky">
          <button class="btn btn-primary" type="submit" data-submit>${ico('check')}<span>Salvar e publicar</span></button>
        </div>
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
    if (!isValidWhatsapp(number)) return toast('Digite o número com DDD para testar.', 'error');
    window.open(waLink(number, 'Teste do link do site da SMUG MODAS'), '_blank', 'noopener');
  });

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    const v = formValues(formEl);
    const number = v.waNumber ? whatsappNumber(v.waNumber) : '';
    const gaId = v.gaId.toUpperCase();
    const tagline = lines(v.tagline);
    const errors = [];
    if (number && !isValidWhatsapp(number)) errors.push(['waNumber', 'Número inválido. Use DDD + número, ex.: (11) 91234-5678.']);
    if (v.email && !isEmail(v.email)) errors.push(['email', 'E-mail inválido.']);
    for (const name of ['mapsUrl', 'instagram', 'endpoint']) if (v[name] && !isUrl(v[name])) errors.push([name, 'O link precisa começar com https://']);
    if (v.cnpj && !CNPJ.test(v.cnpj)) errors.push(['cnpj', 'CNPJ inválido. Use 00.000.000/0000-00.']);
    if (gaId && !GA_ID.test(gaId)) errors.push(['gaId', 'O ID começa com G-, ex.: G-AB12CD34EF.']);
    heroBenefits.forEach((_, i) => {
      if (!v[`bTitle-${i}`]) errors.push([`bTitle-${i}`, 'Informe o título.']);
    });
    if (!tagline.length || tagline.length > 3) errors.push(['tagline', 'A frase da abertura precisa ter de 1 a 3 linhas.']);
    if (!lines(v.marquee).length) errors.push(['marquee', 'Escreva pelo menos uma frase.']);
    for (const name of ['pPlain', 'mPlain', 'mNav', 'sPlain', 'aTitle', 'cPlain']) if (!v[name]) errors.push([name, 'Este campo não pode ficar vazio.']);
    if (showErrors(formEl, errors)) return;

    const button = formEl.querySelector('[data-submit]');
    busy(button, true);
    await app.publish(
      (d) => {
        d.contact.whatsapp = { ...d.contact.whatsapp, number, display: number ? v.waDisplay || formatPhone(number) : '', note: v.waNote };
        d.contact.email = { ...d.contact.email, address: v.email, note: v.emailNote };
        d.contact.address = { ...d.contact.address, lines: lines(v.address), mapsUrl: v.mapsUrl, note: v.addressNote };
        d.contact.hours = { ...d.contact.hours, lines: lines(v.hours), note: v.hoursNote };
        d.contact.social = { ...d.contact.social, instagram: v.instagram };
        d.site = { ...d.site, legalName: v.legalName, cnpj: v.cnpj };
        d.form = { ...d.form, endpoint: v.endpoint, format: v.format };
        d.analytics = { ...(d.analytics || {}), gaId };
        d.heroBenefits = d.heroBenefits.map((b, i) => ({ ...b, title: v[`bTitle-${i}`], text: v[`bText-${i}`], confirmed: v[`bConfirmed-${i}`] }));
        d.hero.tagline = tagline;
        d.hero.photo.alt = v.heroAlt;
        d.marquee = lines(v.marquee);
        Object.assign(d.products, { eyebrow: v.pEyebrow, title: { plain: v.pPlain, italic: v.pItalic }, text: v.pText, whatsappMessage: v.pMsg, soldOutMessage: v.pSoldMsg });
        Object.assign(d.posts, { eyebrow: v.mEyebrow, navLabel: v.mNav, title: { plain: v.mPlain, italic: v.mItalic }, text: v.mText });
        Object.assign(d.store, {
          eyebrow: v.sEyebrow,
          cta: v.sCta,
          title: { plain: v.sPlain, italic: v.sItalic },
          paragraphs: paragraphs(v.sParagraphs),
          benefits: d.store.benefits.map((b, i) => ({ ...b, title: v[`sbTitle-${i}`], text: v[`sbText-${i}`] })),
        });
        Object.assign(d.about, {
          eyebrow: v.aEyebrow,
          title: v.aTitle,
          quote: lines(v.aQuote),
          paragraphs: paragraphs(v.aParagraphs),
          signature: v.aSignature,
          role: v.aRole,
          values: d.about.values.map((b, i) => ({ ...b, title: v[`avTitle-${i}`], text: v[`avText-${i}`] })),
        });
        Object.assign(d.contactSection, { eyebrow: v.cEyebrow, title: { plain: v.cPlain, italic: v.cItalic }, text: v.cText, formTitle: v.cFormTitle, formText: v.cFormText });
        d.footer.tagline = v.fTagline;
      },
      { success: 'Configurações publicadas no site.' }
    );
    busy(button, false);
  });
}

/* ---------- Minha conta ---------- */
export async function contaView(app, root) {
  root.innerHTML = `
    ${pageHead('Minha conta', 'Seu acesso ao painel.')}
    <div class="form form--single">
      <div class="form-main">
        <section class="panel acc">
          <span class="avatar avatar--lg" aria-hidden="true">${esc((app.email[0] || 'S').toUpperCase())}</span>
          <div><b>Administrador</b><small>${esc(app.email)}</small></div>
          <button class="btn" type="button" data-out>${ico('out')}<span>Sair do painel</span></button>
        </section>

        <form class="panel" novalidate data-form>
          <h2 class="panel-title">Trocar e-mail ou senha</h2>
          <p class="hint">Ao salvar, o painel é desconectado nos outros aparelhos.</p>
          <div class="grid">
            ${field({ label: 'E-mail de acesso', name: 'email', value: app.email, type: 'email', extra: { autocomplete: 'username', spellcheck: 'false' }, wide: true })}
            ${field({ label: 'Senha atual', name: 'current', type: 'password', required: true, extra: { autocomplete: 'current-password' }, wide: true })}
            ${field({ label: 'Nova senha (mínimo 8 caracteres)', name: 'password', type: 'password', extra: { autocomplete: 'new-password' }, hint: 'Em branco, a senha continua a mesma.' })}
            ${field({ label: 'Confirmar a nova senha', name: 'confirm', type: 'password', extra: { autocomplete: 'new-password' } })}
          </div>
          <div class="form-bar"><button class="btn btn-primary" type="submit" data-submit>${ico('check')}<span>Salvar acesso</span></button></div>
        </form>

        <section class="panel">
          <h2 class="panel-title">Como funciona</h2>
          <ul class="howto">
            <li><b>Publicação direta.</b> Cada “Salvar” atualiza o site na hora, sem precisar de outro programa.</li>
            <li><b>Fotos.</b> São reduzidas e otimizadas no próprio aparelho antes do envio.</li>
            <li><b>Dois aparelhos ao mesmo tempo.</b> Se o site mudar em outro aparelho, o painel avisa e carrega a versão mais nova antes de salvar.</li>
            <li><b>Esqueceu a senha?</b> Quem cuida da hospedagem do site (Vercel) libera um novo acesso.</li>
          </ul>
        </section>
      </div>
    </div>`;

  root.querySelector('[data-out]').addEventListener('click', () => document.querySelector('[data-logout]').click());
  const form = root.querySelector('[data-form]');
  bindErrorClear(form);
  form.addEventListener('input', () => {
    app.formDirty = true;
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const v = formValues(form);
    const pass = form.elements.password.value;
    const errors = [];
    if (!isEmail(v.email)) errors.push(['email', 'Digite um e-mail válido.']);
    if (!form.elements.current.value) errors.push(['current', 'Digite a senha atual.']);
    if (pass && pass.length < 8) errors.push(['password', 'A nova senha precisa ter pelo menos 8 caracteres.']);
    if (pass !== form.elements.confirm.value) errors.push(['confirm', 'As senhas não conferem.']);
    if (!pass && v.email.toLowerCase() === app.email) errors.push(['email', 'Nada mudou: altere o e-mail ou digite uma nova senha.']);
    if (showErrors(form, errors)) return;

    const button = form.querySelector('[data-submit]');
    busy(button, true, 'Salvando…');
    try {
      const result = await api.changePassword(form.elements.current.value, v.email, pass);
      app.email = result.email || v.email.toLowerCase();
      app.formDirty = false;
      app.paintIdentity?.();
      toast('Acesso atualizado. Use os novos dados no próximo login.', 'success', 6000);
      contaView(app, root);
    } catch (error) {
      busy(button, false);
      if (error.status === 401) {
        toast('Sua sessão terminou. Entre de novo para continuar.', 'error', 7000);
        showLogin({ setupRequired: false });
        return;
      }
      form.elements.current.value = '';
      showErrors(form, [['current', error.message]]);
    }
  });
}
