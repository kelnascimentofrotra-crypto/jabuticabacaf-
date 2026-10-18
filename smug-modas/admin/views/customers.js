import { esc, ico, money, formatDate, uid, toast, confirmDialog, download, toCsv, today, formatPhone, whatsappNumber, isValidWhatsapp, digits } from '../ui.js';
import { orderTotal, PAID_STATUSES, STATUS_LABELS, openWhatsappComposer } from './orders.js';

const stats = (customer, orders) => {
  const mine = orders.filter((o) => o.customerId === customer.id || (customer.phone && o.customerPhone === customer.phone));
  const paid = mine.filter((o) => PAID_STATUSES.includes(o.status));
  return {
    orders: mine,
    count: mine.length,
    total: paid.reduce((s, o) => s + orderTotal(o), 0),
    last: mine.map((o) => o.date).sort().at(-1),
  };
};

/* ---------- Lista ---------- */
export async function customersView(app, root) {
  const [customers, orders] = await Promise.all([app.db.customers.all(), app.db.orders.all()]);
  customers.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  let q = '';

  const paint = () => {
    const term = q.toLowerCase();
    const termDigits = digits(q);
    const rows = customers.filter((c) => !q || c.name.toLowerCase().includes(term) || (termDigits && (c.phone || '').includes(termDigits)) || (c.instagram || '').toLowerCase().includes(term));
    root.querySelector('[data-rows]').innerHTML = rows.length
      ? rows
          .map((c) => {
            const s = stats(c, orders);
            return `
          <li class="customer-row">
            <a class="customer-row__main" href="#/clientes/${esc(c.id)}">
              <span class="avatar" aria-hidden="true">${esc((c.name || '?').trim().charAt(0).toUpperCase())}</span>
              <span><strong>${esc(c.name)}</strong><span class="muted small">${[c.phone && formatPhone(c.phone), c.size && `Tam. ${c.size}`, c.birthday && `Aniv. ${c.birthday}`].filter(Boolean).map(esc).join(' · ') || 'Sem contato'}</span></span>
            </a>
            <span class="customer-row__stats muted small">${s.count} pedido(s) · ${money(s.total)}</span>
            <span class="customer-row__actions">
              <button class="icon-btn" type="button" data-wa="${esc(c.id)}" aria-label="Mensagem para ${esc(c.name)}"${c.phone ? '' : ' disabled'}>${ico('whatsapp')}</button>
              <a class="icon-btn" href="#/pedidos/novo?cliente=${esc(c.id)}" aria-label="Novo pedido para ${esc(c.name)}">${ico('plus')}</a>
            </span>
          </li>`;
          })
          .join('')
      : `<li class="empty empty--inline">${customers.length ? 'Nenhum cliente encontrado.' : '<h3>Nenhum cliente cadastrado</h3><p>Os clientes são salvos automaticamente ao registrar pedidos, ou você pode cadastrar aqui.</p>'}</li>`;
  };

  root.innerHTML = `
  <section class="page-head">
    <div><p class="eyebrow">Vendas</p><h2 class="page-title">Clientes</h2><p class="muted">${customers.length} cliente(s) neste aparelho</p></div>
    <div class="page-actions">
      <button class="btn btn--ghost" type="button" data-export${customers.length ? '' : ' disabled'}>${ico('download')}Exportar planilha</button>
      <a class="btn btn--primary" href="#/clientes/novo">${ico('plus')}Novo cliente</a>
    </div>
  </section>
  <div class="toolbar"><label class="search">${ico('search')}<span class="sr-only">Buscar cliente</span><input type="search" placeholder="Nome, telefone ou Instagram" data-q></label></div>
  <ul class="customer-list" data-rows aria-label="Clientes"></ul>`;

  root.querySelector('[data-q]').addEventListener('input', (e) => {
    q = e.target.value;
    paint();
  });
  root.querySelector('[data-rows]').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-wa]');
    if (btn) openWhatsappComposer(app, null, customers.find((c) => c.id === btn.dataset.wa));
  });
  root.querySelector('[data-export]').addEventListener('click', () => {
    const rows = [['Nome', 'WhatsApp', 'Instagram', 'Aniversário', 'Tamanho', 'Pedidos', 'Total comprado', 'Última compra', 'Observações']];
    for (const c of customers) {
      const s = stats(c, orders);
      rows.push([c.name, formatPhone(c.phone || ''), c.instagram, c.birthday, c.size, s.count, s.total.toFixed(2).replace('.', ','), formatDate(s.last), c.notes]);
    }
    download(`clientes-smug-${today()}.csv`, toCsv(rows), 'text/csv;charset=utf-8');
  });
  paint();
}

/* ---------- Cadastro ---------- */
export async function customerFormView(app, root, id) {
  const isNew = id === 'novo';
  const customer = isNew ? { name: '' } : await app.db.customers.get(id);
  if (!customer) {
    root.innerHTML = `<div class="empty"><h2>Cliente não encontrado</h2><a class="btn btn--primary" href="#/clientes">Voltar</a></div>`;
    return;
  }
  app.setTitle(isNew ? 'Novo cliente' : customer.name);
  const orders = isNew ? [] : stats(customer, await app.db.orders.all()).orders.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  root.innerHTML = `
  <a class="back" href="#/clientes">${ico('back')}Clientes</a>
  <form class="stack" novalidate data-form>
    <section class="card">
      <header class="card__head">
        <h2 class="card__title">${isNew ? 'Cadastrar cliente' : esc(customer.name)}</h2>
        ${!isNew ? `<div class="inline-actions"><button class="btn btn--ghost btn--sm" type="button" data-wa${customer.phone ? '' : ' disabled'}>${ico('whatsapp')}Mensagem</button><a class="btn btn--ghost btn--sm" href="#/pedidos/novo?cliente=${esc(customer.id)}">${ico('plus')}Novo pedido</a></div>` : ''}
      </header>
      <div class="fields">
        <div class="field"><label for="c-name">Nome <span class="req" aria-hidden="true">*</span></label><input id="c-name" name="name" required value="${esc(customer.name)}" autocomplete="off"></div>
        <div class="field"><label for="c-phone">WhatsApp</label><input id="c-phone" name="phone" type="tel" inputmode="tel" value="${esc(formatPhone(customer.phone || ''))}" placeholder="(11) 91234-5678"></div>
        <div class="field"><label for="c-insta">Instagram</label><input id="c-insta" name="instagram" value="${esc(customer.instagram || '')}" placeholder="@usuario"></div>
        <div class="field"><label for="c-birthday">Aniversário</label><input id="c-birthday" name="birthday" value="${esc(customer.birthday || '')}" placeholder="dd/mm" inputmode="numeric" maxlength="5"></div>
        <div class="field"><label for="c-size">Tamanho preferido</label><input id="c-size" name="size" value="${esc(customer.size || '')}" placeholder="Ex.: M / 38"></div>
        <div class="field field--wide"><label for="c-notes">Observações</label><textarea id="c-notes" name="notes" rows="3" placeholder="Preferências de cor, estilo, ocasiões…">${esc(customer.notes || '')}</textarea></div>
      </div>
    </section>
    ${
      !isNew
        ? `<section class="card"><h3 class="card__title">Histórico de pedidos</h3>${
            orders.length
              ? `<ul class="rows">${orders.map((o) => `<li><a class="row" href="#/pedidos/${esc(o.id)}"><span>#${String(o.number).padStart(4, '0')} · ${formatDate(o.date)}</span><span class="row__meta"><span class="status status--${o.status}">${STATUS_LABELS[o.status]}</span>${money(orderTotal(o))}</span></a></li>`).join('')}</ul>`
              : '<p class="muted">Nenhum pedido registrado para este cliente.</p>'
          }</section>`
        : ''
    }
    <div class="form-bar">
      ${!isNew ? `<button class="btn btn--ghost btn--danger-text" type="button" data-delete>${ico('trash')}Excluir</button>` : ''}
      <span class="form-bar__spacer"></span>
      <a class="btn btn--ghost" href="#/clientes">Cancelar</a>
      <button class="btn btn--primary" type="submit">${ico('check')}Salvar cliente</button>
    </div>
  </form>`;

  const form = root.querySelector('[data-form]');
  form.addEventListener('input', () => {
    app.formDirty = true;
  });
  form.querySelector('[data-wa]')?.addEventListener('click', () => openWhatsappComposer(app, null, customer));
  form.querySelector('[data-delete]')?.addEventListener('click', async () => {
    if (!(await confirmDialog({ title: `Excluir ${customer.name}?`, text: 'Os pedidos registrados continuam salvos.', confirm: 'Excluir', danger: true }))) return;
    await app.db.customers.del(customer.id);
    app.formDirty = false;
    toast('Cliente excluído.');
    app.go('#/clientes');
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const f = form.elements;
    const name = f.name.value.trim();
    const phone = digits(f.phone.value) ? whatsappNumber(f.phone.value) : '';
    const birthday = f.birthday.value.trim();
    if (!name) {
      toast('Informe o nome.', 'error');
      f.name.focus();
      return;
    }
    if (phone && !isValidWhatsapp(phone)) {
      toast('WhatsApp inválido. Use DDD + número.', 'error');
      f.phone.focus();
      return;
    }
    if (birthday && !/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])$/.test(birthday)) {
      toast('Aniversário no formato dd/mm (ex.: 07/03).', 'error');
      f.birthday.focus();
      return;
    }
    const now = new Date().toISOString();
    const saved = {
      ...customer,
      id: customer.id || uid('c'),
      name,
      phone,
      instagram: f.instagram.value.trim(),
      birthday,
      size: f.size.value.trim(),
      notes: f.notes.value.trim(),
      createdAt: customer.createdAt || now,
      updatedAt: now,
    };
    await app.db.customers.put(saved);
    app.formDirty = false;
    toast('Cliente salvo.', 'success');
    app.go('#/clientes');
  });
}
