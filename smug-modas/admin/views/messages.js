import { esc, ico, uid, toast, confirmDialog, modal } from '../ui.js';
import { formMode } from '../../src/components/contact.mjs';

// Respostas prontas padrão (genéricas; edite à vontade). Variáveis: {nome}, {pedido}, {total}, {itens}
const DEFAULT_TEMPLATES = [
  { title: 'Pedido confirmado', text: 'Olá, {nome}! Seu pedido {pedido} na SMUG MODAS foi confirmado: {itens}. Total: {total}. Obrigada pela preferência! 💕' },
  { title: 'Pronto para retirada', text: 'Olá, {nome}! Seu pedido {pedido} já está separado e pronto para retirada na SMUG MODAS. Te esperamos!' },
  { title: 'Pedido enviado', text: 'Olá, {nome}! Seu pedido {pedido} foi enviado. Qualquer dúvida, é só chamar por aqui.' },
  { title: 'Novidades', text: 'Olá, {nome}! Chegaram novidades na SMUG MODAS que combinam com você. Quer que eu te mostre?' },
  { title: 'Agradecimento', text: 'Olá, {nome}! Obrigada por escolher a SMUG MODAS. Esperamos que você ame suas peças!' },
];

export async function getTemplates(app) {
  let list = await app.db.templates.all();
  if (!list.length && !(await app.db.kv.get('templatesSeeded'))) {
    list = DEFAULT_TEMPLATES.map((t, i) => ({ ...t, id: uid('t'), order: i }));
    for (const t of list) await app.db.templates.put(t);
    await app.db.kv.set('templatesSeeded', true);
  }
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// Preenche as variáveis; variável sem valor some junto com o espaço/vírgula antes dela
// ("Olá, {nome}!" sem nome vira "Olá!").
export const fillTemplate = (text, vars) =>
  text.replace(/,?\s*\{(\w+)\}/g, (match, key) => (vars[key] ? match.replace(`{${key}}`, vars[key]) : ''));

const FORM_INFO = {
  endpoint: (c, app) => ({
    title: 'As mensagens do formulário chegam pelo serviço de envio',
    text: `O formulário do site envia para <code>${esc(c.form.endpoint)}</code>. As mensagens ficam na caixa de entrada desse serviço (e no e-mail cadastrado nele).`,
    action: app.settings.inboxUrl
      ? `<a class="btn btn--primary" href="${esc(app.settings.inboxUrl)}" target="_blank" rel="noopener">${ico('external')}Abrir caixa de entrada</a>`
      : `<a class="btn btn--ghost" href="#/config">Cadastrar o link da caixa de entrada</a>`,
  }),
  whatsapp: (c) => ({
    title: 'As mensagens do formulário chegam no WhatsApp',
    text: `Sem serviço de envio configurado, o formulário abre uma conversa com o WhatsApp da loja (${esc(c.contact.whatsapp.display || c.contact.whatsapp.number)}) com a mensagem pronta. A pessoa conclui o envio por lá.`,
    action: '<a class="btn btn--ghost" href="#/loja">Configurar serviço de envio</a>',
  }),
  email: (c) => ({
    title: 'As mensagens do formulário chegam por e-mail',
    text: `O formulário abre o aplicativo de e-mail de quem escreve, já endereçado para ${esc(c.contact.email.address)}.`,
    action: '<a class="btn btn--ghost" href="#/loja">Configurar serviço de envio</a>',
  }),
  unavailable: () => ({
    title: 'O formulário ainda não envia mensagens',
    text: 'Não há serviço de envio, WhatsApp nem e-mail configurados. O site avisa que o envio on-line ainda não está disponível (nunca finge que a mensagem foi entregue).',
    action: '<a class="btn btn--primary" href="#/loja">Configurar agora</a>',
    warning: true,
  }),
};

export async function messagesView(app, root) {
  const info = FORM_INFO[formMode(app.content)](app.content, app);

  const paint = async () => {
    const templates = await getTemplates(app);
    root.innerHTML = `
    <section class="page-head">
      <div><p class="eyebrow">Atendimento</p><h2 class="page-title">Mensagens</h2></div>
      <div class="page-actions"><button class="btn btn--primary" type="button" data-compose>${ico('whatsapp')}Nova mensagem</button></div>
    </section>

    <section class="card${info.warning ? ' card--warning' : ''}">
      <h3 class="card__title">${esc(info.title)}</h3>
      <p>${info.text}</p>
      <p class="inline-actions">${info.action}</p>
    </section>

    <section class="card">
      <header class="card__head">
        <h3 class="card__title">Respostas prontas</h3>
        <button class="btn btn--ghost btn--sm" type="button" data-new>${ico('plus')}Nova resposta</button>
      </header>
      <p class="muted small">Use em pedidos e clientes (botão “Mensagem”). Variáveis: <code>{nome}</code>, <code>{pedido}</code>, <code>{total}</code>, <code>{itens}</code>.</p>
      <ul class="templates">
        ${
          templates.length
            ? templates
                .map(
                  (t) => `
          <li class="template" data-id="${esc(t.id)}">
            <div><strong>${esc(t.title)}</strong><p class="muted small">${esc(t.text)}</p></div>
            <div class="template__actions">
              <button class="icon-btn" type="button" data-copy aria-label="Copiar ${esc(t.title)}">${ico('copy')}</button>
              <button class="icon-btn" type="button" data-edit aria-label="Editar ${esc(t.title)}">${ico('edit')}</button>
              <button class="icon-btn icon-btn--danger" type="button" data-del aria-label="Excluir ${esc(t.title)}">${ico('trash')}</button>
            </div>
          </li>`
                )
                .join('')
            : '<li class="muted">Nenhuma resposta pronta.</li>'
        }
      </ul>
    </section>`;

    root.querySelector('[data-compose]').addEventListener('click', async () => {
      const { openWhatsappComposer } = await import('./orders.js');
      openWhatsappComposer(app, null, { name: '', phone: '' });
    });
    root.querySelector('[data-new]').addEventListener('click', () => editTemplate(app, null).then(paint));
    root.querySelector('.templates').addEventListener('click', async (e) => {
      const item = e.target.closest('[data-id]');
      if (!item) return;
      const template = templates.find((t) => t.id === item.dataset.id);
      if (e.target.closest('[data-copy]')) {
        try {
          await navigator.clipboard.writeText(template.text);
          toast('Resposta copiada.');
        } catch {
          toast('Não foi possível copiar automaticamente.', 'error');
        }
      }
      if (e.target.closest('[data-edit]')) editTemplate(app, template).then(paint);
      if (e.target.closest('[data-del]')) {
        if (!(await confirmDialog({ title: `Excluir “${template.title}”?`, confirm: 'Excluir', danger: true }))) return;
        await app.db.templates.del(template.id);
        await app.db.kv.set('templatesSeeded', true);
        paint();
      }
    });
  };
  await paint();
}

function editTemplate(app, template) {
  return modal(
    `
    <form class="modal__body" data-tpl novalidate>
      <h2 class="modal__title">${template ? 'Editar resposta' : 'Nova resposta pronta'}</h2>
      <div class="fields">
        <div class="field field--wide"><label for="tpl-title">Título</label><input id="tpl-title" name="title" required maxlength="40" value="${esc(template?.title || '')}"></div>
        <div class="field field--wide"><label for="tpl-text">Mensagem</label><textarea id="tpl-text" name="text" rows="5" required maxlength="800">${esc(template?.text || '')}</textarea>
        <p class="hint">Variáveis: {nome}, {pedido}, {total}, {itens}</p></div>
      </div>
      <div class="modal__actions">
        <button class="btn btn--ghost" type="button" data-close="">Cancelar</button>
        <button class="btn btn--primary" type="submit">Salvar</button>
      </div>
    </form>`,
    {
      onMount(dialog, close) {
        const form = dialog.querySelector('[data-tpl]');
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const title = form.elements.title.value.trim();
          const text = form.elements.text.value.trim();
          if (!title || !text) {
            toast('Preencha título e mensagem.', 'error');
            return;
          }
          await app.db.templates.put({ ...(template || { id: uid('t'), order: Date.now() }), title, text });
          await app.db.kv.set('templatesSeeded', true);
          toast('Resposta salva.', 'success');
          close('saved');
        });
      },
    }
  );
}
